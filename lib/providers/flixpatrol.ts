import { FLIX_COMPANY_ID, FLIX_COUNTRY_BR } from "@/data/flixIds";
import { PlatformKey } from "@/data/platforms";

const FLIX_BASE = "https://api.flixpatrol.com/v2";

function authHeader() {
  const key = process.env.FLIXPATROL_API_KEY;
  if (!key) throw new Error("FLIXPATROL_API_KEY não configurado");
  const basic = Buffer.from(`${key}:`).toString("base64");
  return { Authorization: `Basic ${basic}` };
}

async function flixFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error(`FlixPatrol falhou: ${res.status}`);
  return (await res.json()) as T;
}

async function discoverCompanyIdByName(name: string): Promise<string | null> {
  try {
    const params = new URLSearchParams();
    params.set("name[like]", name);
    params.set("sort", "name");
    const url = `${FLIX_BASE}/companies?${params.toString()}`;
    const list = await flixFetch<any[]>(url);
    return list?.[0]?.data?.id || list?.[0]?.id || null;
  } catch {
    return null;
  }
}

async function getCompanyId(platform: PlatformKey): Promise<string | null> {
  const hard = FLIX_COMPANY_ID[platform];
  if (hard) return hard;

  const name: Record<PlatformKey, string> = {
    netflix: "Netflix",
    prime: "Amazon Prime",
    appletv: "Apple TV",
    disney: "Disney",
    max: "HBO Max",
    globoplay: "Globoplay",
  };

  return await discoverCompanyIdByName(name[platform]);
}

export async function flixDailyTop10(platform: PlatformKey, kind: "movie" | "tv", dateISO: string) {
  const company = await getCompanyId(platform);
  if (!company) return [];

  const type = kind === "movie" ? 2 : 3;
  const params = new URLSearchParams();
  params.set("company[eq]", company);
  params.set("country[eq]", FLIX_COUNTRY_BR);
  params.set("type[eq]", String(type));
  params.set("date[type][eq]", "1"); // day
  params.set("date[from][eq]", dateISO);
  params.set("date[to][eq]", dateISO);
  params.set("sort", "ranking");

  const url = `${FLIX_BASE}/top10s?${params.toString()}`;
  const rows = await flixFetch<any[]>(url);

  return (rows || []).map((r) => {
    const rank = Number(r?.ranking ?? 99);
    const points = rank >= 1 && rank <= 10 ? 11 - rank : 0;
    return { titleId: r?.movie, rank, points };
  });
}

export async function flixTitleName(titleId: string): Promise<string> {
  const url = `${FLIX_BASE}/titles/${encodeURIComponent(titleId)}`;
  const obj = await flixFetch<any>(url);
  return obj?.data?.title || obj?.title || "Título";
}

export async function flixRollingTop3(platform: PlatformKey, kind: "movie" | "tv", endDateISO: string, days: number) {
  const end = new Date(endDateISO + "T00:00:00Z");
  const map = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);

    const dayTop = await flixDailyTop10(platform, kind, iso);
    for (const it of dayTop) {
      if (!it.titleId) continue;
      map.set(it.titleId, (map.get(it.titleId) || 0) + it.points);
    }
  }

  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  const titles: string[] = [];
  for (const [id] of sorted) {
    titles.push(await flixTitleName(id));
  }
  return titles;
}
