import fs from "node:fs";
import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["cli/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    platform: "node",
    format: "cjs",
    external: [
      "@octokit/rest",
      "adm-zip",
      "dotenv",
      "@material/material-color-utilities",
      "commander", // commander を external に追加
      "https://deno.land/std/flags/mod.ts", // Denoの標準ライブラリをexternalに追加
    ],
    banner: {
      js: "#!/usr/bin/env node",
    },
    logLevel: "info",
    // minify: true,
    // sourcemap: true,
  })
  .then(() => {
    // ビルドが成功したら、dist/package.json を作成
    // ディレクトリが存在しない場合があるので作成する
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist");
    }
    fs.writeFileSync("dist/package.json", '{ "type": "commonjs" }');
    console.log("✅ Successfully created dist/package.json");
  })
  .catch(() => process.exit(1));
