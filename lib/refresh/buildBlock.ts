import type { TitleInfo } from "@/components/TitleCard";
import { PlatformKey } from "@/data/platforms";
import { flixRollingTop3 } from "@/lib/providers/flixpatrol";
import { posterUrl, tmdbDetails, tmdbSearchFirst, tmdbTrailer } from "@/lib/providers/tmdb";

async function enrich(title: string, type: "movie" | "tv"): Promise<TitleInfo> {
  const found = await tmdbSearchFirst(title, type);
  if (!found) {
    return {
      title,
      overview: "Sinopse não encontrada.",
      posterUrl: null,
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`,
      genres: [],
    };
  }

  const det = await tmdbDetails(found.id, type);
  const youtube =
    (await tmdbTrailer(found.id, type)) ||
    `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " trailer")}`;

  return {
    title: det?.title || det?.name || title,
    overview: det?.overview || "Sem sinopse disponível.",
    posterUrl: posterUrl(det?.poster_path || null),
    youtube,
    genres: Array.isArray(det?.genres) ? det.genres.map((g: any) => g.name) : [],
  };
}

export async function buildPlatformBlock(platform: PlatformKey, endDateISO: string) {
  const weekMovieTitles = await flixRollingTop3(platform, "movie", endDateISO, 7);
  const weekSeriesTitles = await flixRollingTop3(platform, "tv", endDateISO, 7);

  const monthMovieTitles = await flixRollingTop3(platform, "movie", endDateISO, 30);
  const monthSeriesTitles = await flixRollingTop3(platform, "tv", endDateISO, 30);

  const weekMovies = await Promise.all(weekMovieTitles.map((t) => enrich(t, "movie")));
  const weekSeries = await Promise.all(weekSeriesTitles.map((t) => enrich(t, "tv")));

  const monthMovies = await Promise.all(monthMovieTitles.map((t) => enrich(t, "movie")));
  const monthSeries = await Promise.all(monthSeriesTitles.map((t) => enrich(t, "tv")));

  return {
    platform,
    updatedAt: endDateISO,
    weekSource: "FlixPatrol API (Top10 diário agregado 7 dias)",
    monthSource: "FlixPatrol API (Top10 diário agregado 30 dias)",
    week: { movies: weekMovies, series: weekSeries },
    month: { movies: monthMovies, series: monthSeries },
  };
}
