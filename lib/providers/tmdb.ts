type MediaType = "movie" | "tv";
const TMDB_BASE = "https://api.themoviedb.org/3";

function headers() {
  const token = process.env.TMDB_TOKEN;
  if (!token) throw new Error("TMDB_TOKEN não configurado");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function tmdbFetch<T>(url: string) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`TMDB falhou: ${res.status}`);
  return (await res.json()) as T;
}

export async function tmdbSearchFirst(title: string, type: MediaType) {
  const url = `${TMDB_BASE}/search/${type}?query=${encodeURIComponent(title)}&language=pt-BR`;
  const data = await tmdbFetch<any>(url);
  return data?.results?.[0] ?? null;
}

export async function tmdbDetails(id: number, type: MediaType) {
  const url = `${TMDB_BASE}/${type}/${id}?language=pt-BR`;
  return await tmdbFetch<any>(url);
}

export async function tmdbTrailer(id: number, type: MediaType) {
  const url = `${TMDB_BASE}/${type}/${id}/videos?language=pt-BR`;
  const data = await tmdbFetch<any>(url);
  const results: any[] = data?.results ?? [];
  const yt =
    results.find((v) => v.site === "YouTube" && String(v.type).toLowerCase().includes("trailer") && v.official) ||
    results.find((v) => v.site === "YouTube" && String(v.type).toLowerCase().includes("trailer")) ||
    results.find((v) => v.site === "YouTube");
  return yt?.key ? `https://www.youtube.com/watch?v=${yt.key}` : null;
}

export function posterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
}
