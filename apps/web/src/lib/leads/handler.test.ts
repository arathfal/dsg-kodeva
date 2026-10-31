import assert from "node:assert/strict";
import { test } from "node:test";
import { createLeadHandler } from "./handler.ts";
import type { Campaign } from "../cms/models.ts";

const config = {
  projectId: "example1",
  contentDataset: "production",
  dataset: "leads",
  token: "dummy-test-token",
};
const payload = {
  name: "Usaha Demo",
  email: "demo@example.test",
  campaignKey: "promo",
  website: "",
  utm: { source: " instagram " },
};
const current = async () => ({
  status: "ok" as const,
  data: { campaignKey: "promo" } as Campaign,
});
const confirmed = { results: [{ operation: "create", id: "generated-id" }] };
function request(
  body: unknown = payload,
  headers: Record<string, string> = {},
) {
  return new Request("https://kodeva.test/api/leads", {
    method: "POST",
    headers: {
      origin: "https://kodeva.test",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("only confirmed persistence returns success, stores sanitized data and no PII in response", async () => {
  let calls = 0;
  const handle = createLeadHandler(config, current, async (url, init) => {
    calls++;
    assert.match(
      String(url),
      /\/data\/mutate\/leads\?returnIds=true&visibility=sync$/,
    );
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer dummy-test-token",
    );
    const body = JSON.parse(String(init?.body));
    const record = body.mutations[0].create;
    assert.deepEqual(
      Object.keys(record).sort(),
      ["_type", "campaignKey", "email", "name", "submittedAt", "utm"].sort(),
    );
    assert.equal(record._type, "lead");
    assert.equal(record.utm.source, "instagram");
    assert.ok(Number.isFinite(Date.parse(record.submittedAt)));
    assert.ok(init?.signal);
    return Response.json(confirmed);
  });
  const response = await handle(request());
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls, 1);
});

test("direct invalid requests cannot reach CMS writes", async () => {
  let writes = 0;
  const handle = createLeadHandler(config, current, async () => {
    writes++;
    return Response.json(confirmed);
  });
  for (const [req, status] of [
    [new Request("https://kodeva.test/api/leads"), 405],
    [request(payload, { origin: "https://other.test" }), 403],
    [request(payload, { origin: "null" }), 403],
    [request(payload, { "content-type": "text/plain" }), 415],
    [request({}), 400],
    [request({ ...payload, website: "spam" }), 400],
    [request({ ...payload, campaignKey: "other" }), 400],
    [request({ ...payload, email: "bad" }), 400],
    [request({ ...payload, utm: { source: "x".repeat(201) } }), 400],
    [request({ ...payload, name: "x".repeat(9000) }), 413],
    [
      new Request("https://kodeva.test/api/leads", {
        method: "POST",
        headers: {
          origin: "https://kodeva.test",
          "content-type": "application/json",
        },
        body: "{bad",
      }),
      400,
    ],
  ] as const)
    assert.equal((await handle(req)).status, status);
  assert.equal(writes, 0);
});

test("body limit counts streamed bytes rather than trusting content-length", async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      controller.enqueue(new Uint8Array(4097));
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request("https://kodeva.test/api/leads", {
    method: "POST",
    headers: {
      origin: "https://kodeva.test",
      "content-type": "application/json",
      "content-length": "1",
    },
    body: stream,
    duplex: "half",
  } as RequestInit);
  assert.equal((await createLeadHandler(config, current)(req)).status, 413);
  assert.equal(cancelled, true);
});

test("configuration, campaign failures, rejected writes and malformed confirmations never report success", async () => {
  for (const configured of [
    { ...config, token: "" },
    { ...config, dataset: "production" },
    { ...config, projectId: "bad/host" },
  ])
    assert.equal(
      (await createLeadHandler(configured, current)(request())).status,
      503,
    );
  assert.equal(
    (
      await createLeadHandler(config, async () => ({
        status: "unavailable",
        reason: "network",
      }))(request())
    ).status,
    503,
  );
  assert.equal(
    (
      await createLeadHandler(config, async () => ({ status: "not-found" }))(
        request(),
      )
    ).status,
    503,
  );
  for (const write of [
    async () => new Response("private diagnostic", { status: 403 }),
    async () => {
      throw new Error("private diagnostic");
    },
    async () => Response.json({}),
    async () => Response.json({ results: [{ operation: "update", id: "x" }] }),
    async () => Response.json({ results: [{ operation: "create" }] }),
  ]) {
    const response = await createLeadHandler(config, current, write)(request());
    assert.equal(response.status, 503);
    assert.doesNotMatch(
      await response.text(),
      /private diagnostic|dummy-test-token|demo@example/,
    );
  }
});
