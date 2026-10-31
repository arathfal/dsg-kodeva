import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { studioEnv, leadsEnv } from "./env";
import {
  article,
  campaign,
  category,
  contentImage,
  lead,
  seo,
} from "./schema/content";
import { stampFirstPublication, resetDuplicatePublication } from "./publish";

export default defineConfig([
  {
    name: "content",
    title: "Konten Kodeva",
    basePath: "/content",
    ...studioEnv,
    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title("Konten pemasaran")
            .items([
              S.listItem()
                .id("campaign")
                .title("Kampanye")
                .child(
                  S.document().schemaType("campaign").documentId("campaign"),
                ),
              S.documentTypeListItem("article").title("Artikel"),
              S.documentTypeListItem("category").title("Kategori"),
            ]),
      }),
    ],
    schema: {
      types: [campaign, article, category, contentImage, seo],
      templates: (templates) =>
        templates.filter((t) => t.schemaType !== "campaign"),
    },
    document: {
      newDocumentOptions: (options) =>
        options.filter((option) => option.templateId !== "campaign"),
      actions: (actions, context) => {
        if (context.schemaType === "campaign")
          return actions.filter(
            (a) => !["delete", "duplicate"].includes(a.action ?? ""),
          );
        return context.schemaType === "article"
          ? actions.map((a) =>
              a.action === "publish"
                ? stampFirstPublication(a)
                : a.action === "duplicate"
                  ? resetDuplicatePublication(a)
                  : a,
            )
          : actions;
      },
    },
  },
  {
    name: "leads",
    title: "Lead Kodeva",
    basePath: "/leads",
    ...leadsEnv,
    plugins: [
      structureTool({
        structure: (S) =>
          S.documentTypeList("lead")
            .title("Lead masuk")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
      }),
    ],
    schema: { types: [lead], templates: [] },
    document: { actions: () => [], newDocumentOptions: () => [] },
  },
]);
