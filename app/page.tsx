import Link from "next/link";
import { PLATFORMS } from "@/data/platforms";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <div className="brandbar" />
        <div className="headerinner">
          <h1 className="h1">📺 Claro TV+ Live</h1>
          <p className="sub">
            Clique em um streaming para ver: <b>Top 3 Filmes/Séries da Semana</b> e{" "}
            <b>Top 3 Filmes/Séries do Mês</b> (dados FlixPatrol + sinopse/trailer via TMDB).
          </p>
        </div>
      </header>

      <section className="grid6">
        {PLATFORMS.map((p) => (
          <Link key={p.key} href={`/streaming/${p.key}`} style={{ textDecoration: "none" }}>
            <div className="card logoCard" aria-label={p.label}>
              <div className="logoText">{p.label}</div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
