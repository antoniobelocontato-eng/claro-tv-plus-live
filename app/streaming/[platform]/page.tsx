import { notFound } from "next/navigation";
import { PLATFORMS, PlatformKey } from "@/data/platforms";
import { getCachedBlock } from "@/lib/store/cache";
import { PLATFORMS } from "../../../data/platforms";

export default async function StreamingPage({ params }: { params: { platform: PlatformKey } }) {
  const p = PLATFORMS.find((x) => x.key === params.platform);
  if (!p) return notFound();

  const data = await getCachedBlock(params.platform);

  if (!data) {
    return (
      <main className="container">
        <header className="header">
          <div className="brandbar" />
          <div className="headerinner">
            <h1 className="h1">{p.label}</h1>
            <p className="sub">
              Ainda não há dados cacheados. Depois de configurar as variáveis, acione:
              <br />
              <code>/api/cron/refresh?secret=SEU_CRON_SECRET</code>
            </p>
          </div>
        </header>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <div className="brandbar" />
        <div className="headerinner">
          <h1 className="h1">{p.label}</h1>
          <p className="sub">
            Atualizado em <b>{data.updatedAt}</b> • Semana: <b>{data.weekSource}</b> • Mês:{" "}
            <b>{data.monthSource}</b>
          </p>
          <div className="pills">
            <span className="pill">Top 3 Filmes — Semana</span>
            <span className="pill">Top 3 Séries — Semana</span>
            <span className="pill">Top 3 Filmes — Mês</span>
            <span className="pill">Top 3 Séries — Mês</span>
          </div>
        </div>
      </header>

      <section className="twocol">
        <div className="card">
          <h2 className="sectionTitle">🎬 Top 3 Filmes — Semana</h2>
          <ul className="list">
            {data.week.movies.map((t, idx) => (
              <li key={idx}><TitleCard rank={idx+1} item={t} /></li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="sectionTitle">📺 Top 3 Séries — Semana</h2>
          <ul className="list">
            {data.week.series.map((t, idx) => (
              <li key={idx}><TitleCard rank={idx+1} item={t} /></li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="sectionTitle">🎬 Top 3 Filmes — Mês (30 dias)</h2>
          <ul className="list">
            {data.month.movies.map((t, idx) => (
              <li key={idx}><TitleCard rank={idx+1} item={t} /></li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="sectionTitle">📺 Top 3 Séries — Mês (30 dias)</h2>
          <ul className="list">
            {data.month.series.map((t, idx) => (
              <li key={idx}><TitleCard rank={idx+1} item={t} /></li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
