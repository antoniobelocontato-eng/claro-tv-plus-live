import Image from "next/image";

export type TitleInfo = {
  title: string;
  overview: string;
  posterUrl: string | null;
  youtube: string | null;
  genres?: string[];
};

export function TitleCard({ rank, item }: { rank: number; item: TitleInfo }) {
  return (
    <div className="item">
      <div className="itemHead">
        <div className="itemTitle">
          <span className="badge">#{rank}</span>{" "}
          {item.title}
        </div>
        {item.youtube ? (
          <a className="link" href={item.youtube} target="_blank" rel="noreferrer">Trailer</a>
        ) : (
          <span style={{ color: "#888", fontWeight: 800, fontSize: 12 }}>Sem trailer</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {item.posterUrl ? (
          <Image
            src={item.posterUrl}
            alt={item.title}
            width={72}
            height={108}
            style={{ borderRadius: 10, objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: 72, height: 108, borderRadius: 10, background: "#eee", border: "1px solid rgba(0,0,0,.06)" }} />
        )}

        <div style={{ flex: 1 }}>
          {item.genres?.length ? (
            <div style={{ color: "#666", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
              {item.genres.slice(0, 3).join(" • ")}
            </div>
          ) : null}
          <p className="syn">{item.overview || "Sem sinopse disponível."}</p>
        </div>
      </div>
    </div>
  );
}
