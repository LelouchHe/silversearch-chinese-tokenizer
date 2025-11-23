import * as esbuild from "esbuild";

const isDebug = Deno.args.includes("--debug");

await esbuild.build({
  entryPoints: ["tokenizer.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/tokenizer.js",
  external: ["@silverbulletmd/*"],
  sourcemap: isDebug ? "inline" : false,
  minify: !isDebug,
});

esbuild.stop();

await Deno.copyFile("dist/tokenizer.js", "silversearch-chinese-tokenizer.js");
await Deno.copyFile("jieba-wasm-2.4.0/jieba_rs_wasm_bg.wasm", "silversearch-chinese-tokenizer.wasm");

console.log(`Build complete (${isDebug ? "debug" : "production"})`);