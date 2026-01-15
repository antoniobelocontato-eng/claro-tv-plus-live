import { NextResponse } from "next/server";
import { PLATFORMS } from "@/data/platforms";
import { buildPlatformBlock } from "@/lib/refresh/buildBlock";
import { setCachedBlock } from "@/lib/store/cache";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const got = url.searchParams.get("secret");

  if (!secret || got !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const results: any[] = [];
  for (const p of PLATFORMS) {
    const block = await buildPlatformBlock(p.key, today);
    await setCachedBlock(p.key, block);
    results.push({ platform: p.key, ok: true });
  }

  return NextResponse.json({ ok: true, updatedAt: today, results });
}
