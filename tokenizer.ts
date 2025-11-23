// @deno-types="./jieba-wasm-2.4.0/jieba_rs_wasm.d.ts"
import initWasm, { cut_for_search, InitOutput } from "./jieba-wasm-2.4.0/jieba_rs_wasm.js";

import { clientStore, space } from "@silverbulletmd/silverbullet/syscalls";

interface Cache {
    version: number;
    data: Uint8Array;
}

const LIBRARY_PATH = "Library/LelouchHe/Silversearch-Chinese-Tokenizer"
const WASM_PATH = `${LIBRARY_PATH}/silversearch-tokenizer-chinese.wasm`

const CACHE_KEY = "silversearch-chinese-tokenizer";
const CACHE_VERSION = 1;

let wasm: InitOutput | null = null;

export async function init() {
    if (wasm) {
        console.log("[Silversearch-Chinese-Tokenizer] Already initialized");
        return true;
    }

    // This cache is per-browser, so multiple tabs share the same data
    let cache: Cache | undefined = await clientStore.get(CACHE_KEY);
    if (!cache || cache.version !== CACHE_VERSION) {
        console.log(`[Silversearch-Chinese-Tokenizer] Not found in cache, loading from ${WASM_PATH}`);
        cache = {
            version: CACHE_VERSION,
            data: await space.readFile(WASM_PATH),
        };
        await clientStore.set(CACHE_KEY, cache);
        console.log(`[Silversearch-Chinese-Tokenizer] Loaded, size: ${Math.floor(cache.data.length / 1024)} KB`);
    }

    try {
        // jieba wasm instance is cached in `initWasm`, even for different data
        // it's created in the first call
        wasm = await initWasm({ module_or_path: cache.data });
        console.log("[Silversearch-Chinese-Tokenizer] Initialized");
    } catch (e) {
        console.error("[Silversearch-Chinese-Tokenizer] Failed to load: ", e);
        return false;
    }

    return wasm !== null;
}

export function isTokenizable(text: string): boolean {
  return /[\u4e00-\u9fff]/u.test(text)
}

export function tokenize(text: string): string[] {
  return cut_for_search(text, true).filter(t => !/^[\p{P}\s]+$/u.test(t));
}
