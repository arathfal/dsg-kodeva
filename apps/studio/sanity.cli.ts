import { defineCliConfig } from "sanity/cli";
import { studioEnv } from "./env";

export default defineCliConfig({ api: studioEnv });
