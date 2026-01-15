// lib/store/cache.ts
import { promises as fs } from "fs";
import path from "path";

type PlatformKey =
  | "globoplay"
  | "hbo_max"
  | "disney_plus"
  | "prime_video"
  | "apple_tv_plus"
  | "netflix";

export type CachedItem = {
  title: string;
  type: "movie" | "series";
  position: number;
  period: "week" | "month";
  synopsis?: string;
  youtubeUrl?: string;
  poster?: string;
  sourceUrl?: string;
};

export type CachedBlock = {
  platform: PlatformKey;
  updatedAt: string;
  week: { movies: CachedItem[]; series: CachedItem[] };
  month: { movies: CachedItem[]; series: CachedItem[] };
};

const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

// Cache simples em arquivo (local)
const CACHE_FILE = path.join(process.cwd(), ".cache", "live.json");

async function readAll(): Promise<Record<string, CachedBlock>> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeAll(obj: Record<string, CachedBlock>) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(obj, null, 2), "utf8");
}

export async function getCachedBlock(platform: PlatformKey): Promise<CachedBlock | null> {
  // Em produção, esse projeto deve usar KV (quando você hospedar).
  // Localmente, usamos arquivo pra não precisar do KV.
  const all = await readAll();
  return all[`live:${platform}`] ?? null;
}

export async function setCachedBlock(platform: PlatformKey, block: CachedBlock) {
  const all = await readAll();
  all[`live:${platform}`] = block;
  await writeAll(all);
}