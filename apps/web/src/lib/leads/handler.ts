import {
  API_VERSION,
  isRecord,
  publicConfig,
} from "../../../../../shared/content.ts";
import { validateLead } from "../../../../../shared/leads.ts";
import type { Campaign } from "../cms/models.ts";
import type { ContentResult } from "../cms/reader.ts";

const bodyLimit = 8192;
const failure = (status: number, message: string) =>
  Response.json({ ok: false, errors: { form: message } }, { status });

export function createLeadHandler(
  config: {
    projectId?: string;
    dataset?: string;
    contentDataset?: string;
    token?: string;
  },
  campaign: () => Promise<ContentResult<Campaign>>,
  write: typeof fetch = fetch,
) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST")
      return new Response(null, { status: 405, headers: { Allow: "POST" } });
    if (request.headers.get("origin") !== new URL(request.url).origin)
      return failure(403, "Kirim formulir dari halaman Kodeva ini.");
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    )
      return failure(415, "Format formulir tidak didukung.");
    const reader = request.body?.getReader();
    if (!reader) return failure(400, "Data formulir tidak valid.");
    let input: unknown;
    try {
      let size = 0;
      const chunks: Uint8Array[] = [];
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > bodyLimit) {
          await reader.cancel();
          return failure(413, "Data formulir terlalu panjang.");
        }
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      input = JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      );
    } catch {
      return failure(400, "Data formulir tidak valid.");
    } finally {
      reader.releaseLock();
    }
    const validation = validateLead(input);
    if (!validation.ok) return Response.json(validation, { status: 400 });
    try {
      const checked = publicConfig(config.projectId, config.dataset);
      if (!config.token || checked.dataset === config.contentDataset)
        return failure(
          503,
          "Formulir belum dapat disimpan. Data Anda tetap ada; coba lagi nanti.",
        );
      const current = await campaign();
      if (current.status !== "ok")
        return failure(503, "Kampanye belum dapat diperiksa. Coba lagi nanti.");
      if (current.data.campaignKey !== validation.data.campaignKey)
        return failure(
          400,
          "Kampanye berubah. Muat ulang halaman sebelum mengirim.",
        );
      const response = await write(
        `https://${checked.projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${checked.dataset}?returnIds=true&visibility=sync`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mutations: [
              {
                create: {
                  _type: "lead",
                  ...validation.data,
                  submittedAt: new Date().toISOString(),
                },
              },
            ],
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok) throw new Error("Write rejected");
      const result: unknown = await response.json();
      if (
        !isRecord(result) ||
        !Array.isArray(result.results) ||
        result.results.length !== 1 ||
        !isRecord(result.results[0]) ||
        result.results[0].operation !== "create" ||
        typeof result.results[0].id !== "string" ||
        !result.results[0].id
      )
        throw new Error("Write not confirmed");
      return Response.json({ ok: true }, { status: 201 });
    } catch {
      // A timed-out write may have committed; this demo never retries automatically.
      return failure(
        503,
        "Penyimpanan belum dapat dipastikan. Data Anda tetap ada. Periksa dengan tim sebelum mencoba lagi.",
      );
    }
  };
}
