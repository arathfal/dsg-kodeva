export default {
  // shortcut: Tailwind 0.8.1 needs the pnpm Astro v1 patch; remove after a verified upstream release.
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./apps/web/src/styles/global.css",
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
