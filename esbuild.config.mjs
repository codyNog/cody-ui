import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["cli/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    platform: "node",
    format: "esm",
    external: [
      "@octokit/rest",
      "adm-zip",
      "dotenv",
      "@material/material-color-utilities",
    ],
    banner: {
      js: "#!/usr/bin/env node",
    },
    logLevel: "info",
    // minify: true,
    // sourcemap: true,
  })
  .catch(() => process.exit(1));
