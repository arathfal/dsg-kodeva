# Tailwind formatter compatibility

`prettier-plugin-tailwindcss@0.8.1.patch` applies the runtime changes from the reviewed, merged [upstream PR #473](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/pull/473) to the published `dist/index.mjs` file. The package currently ships the compiled file rather than the TypeScript source modified by that PR.

The patch recognizes Astro formatter v1's `AstroRoot` AST and passes static and dynamic class attributes to the existing JavaScript sorter. It leaves the Astro 0.x handling in place. pnpm registers the patch and its hash in the workspace configuration and lockfile; regular installs apply it automatically.

The owner explicitly chose this patch over downgrading `prettier-plugin-astro` to 0.14.1 (D-010). Remove it when a published Tailwind formatter includes the fix, then rerun the Astro/TSX sorting and second-pass stability checks before updating the pin.
