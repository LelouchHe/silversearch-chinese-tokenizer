import * as esbuild from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";

const isDebug = Deno.args.includes("--debug");

await esbuild.build({
  entryPoints: ["silversearch-chinese-tokenizer.ts"],
  bundle: true,
  format: "esm",
  outfile: "silversearch-chinese-tokenizer.js",
  sourcemap: isDebug ? "inline" : false,
  minify: !isDebug,

  // bundle jsr resources (silverbullet syscalls)
  plugins: [...denoPlugins()],
});

esbuild.stop();

await Deno.copyFile("jieba-wasm-2.4.0/jieba_rs_wasm_bg.wasm", "silversearch-chinese-tokenizer.wasm");

console.log(`Build complete (${isDebug ? "debug" : "production"})`);