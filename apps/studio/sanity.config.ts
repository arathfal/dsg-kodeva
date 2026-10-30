import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { studioEnv } from "./env";

export default defineConfig({
  name: "kodeva",
  title: "Kodeva Studio",
  ...studioEnv,
  plugins: [structureTool()],
  schema: { types: [] },
});
