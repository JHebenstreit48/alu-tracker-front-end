import { useEffect, useMemo, useState, useCallback } from "react";
import { sourcesCatalog } from "@/data/sources/sourcesCatalog";
import { dedupeAndCount } from "@/utils/sources/normalizeSources";
import { carsAdapter } from "@/lib/Firebase/carsAdapter";
import type { Car } from "@/types/shared/car";

import BackButton from "@/components/Sources/BackButton";
import SourcePill from "@/components/Sources/SourcePill";
import "@/scss/MiscellaneousStyle/Sources.scss";

type LoadState = "idle" | "loading" | "ready" | "error";

export default function Sources() {
  const [state, setState] = useState<LoadState>("idle");
  const [cars, setCars] = useState<Array<Car & Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [anyPillOpen, setAnyPillOpen] = useState(false);

  const derived = useMemo(() => {
    const allLabels: string[] = [];
    for (const c of cars) {
      const v = c["sources"];
      if (Array.isArray(v)) {
        for (const s of v) if (typeof s === "string") allLabels.push(s);
      }
    }
    return dedupeAndCount(allLabels);
  }, [cars]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState("loading");
        setError(null);
        const fetched = await carsAdapter.list(2000) as Array<Car & Record<string, unknown>>;
        if (!alive) return;
        setCars(fetched);
        setState("ready");
      } catch (e) {
        if (!alive) return;
        setState("error");
        setError((e as Error).message || "Failed to load sources from dataset.");
      }
    })();
    return () => { alive = false; };
  }, []);

  const handlePillOpenChange = useCallback((open: boolean) => {
    setAnyPillOpen(open);
  }, []);

  const methodology = useMemo(() => [
    {
      title: "How sources are used",
      body: [
        "This project compiles information from multiple channels so players can find consistent, structured data in one place.",
        "Community resources are treated as a starting point—not an automatic source of truth. Values are verified against in-game observation and cross-checked for consistency.",
      ],
    },
    {
      title: "Privacy-friendly credits",
      body: [
        "To respect privacy, individual usernames (Reddit, Discord, gamer tags) are not displayed unless someone explicitly requests credit.",
        "If you want to be credited publicly, you can request it through the Feedback page.",
      ],
    },
    {
      title: "Contributions (planned)",
      body: [
        "A contributor submission system is planned to let players suggest additions or corrections over time.",
        "All submissions will be reviewed before approval to keep the dataset consistent and reliable.",
      ],
    },
  ], []);

  return (
    <>
    <BackButton />
    <main className="SourcesPage">
      <header className="SourcesPage__header">
        
        <h1 className="SourcesPage__title">Sources & Methodology</h1>
        <p className="SourcesPage__subtitle">
          Where the tracker's information comes from, how it's reviewed, and why values can vary.
        </p>
      </header>

      <section className="SourcesPage__section">
        <div className="SourcesPage__cards">
          {methodology.map((m) => (
            <article key={m.title} className="SourcesPage__card">
              <h2 className="SourcesPage__cardTitle">{m.title}</h2>
              {m.body.map((p) => (
                <p key={p} className="SourcesPage__cardText">{p}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="SourcesPage__section">
        <h2 className="SourcesPage__sectionTitle">Main sources</h2>
        <ul className="SourcesPage__list">
          {sourcesCatalog.map((s) => (
            <li key={s.key} className="SourcesPage__listItem">
              <div className="SourcesPage__listHeading">
                {s.url ? (
                  <a className="SourcesPage__link" href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ) : (
                  <span>{s.label}</span>
                )}
              </div>
              <div className="SourcesPage__listText">{s.description}</div>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={`SourcesPage__section SourcesPage__section--dataset${anyPillOpen ? " SourcesPage__section--expanded" : ""}`}
      >
        <h2 className="SourcesPage__sectionTitle">Detected in dataset</h2>

        {state === "loading" && (
          <div className="SourcesPage__notice" role="status">Scanning dataset sources…</div>
        )}
        {state === "error" && (
          <div className="SourcesPage__notice" role="status">
            Couldn't load dataset sources right now.{error ? ` (${error})` : null}
          </div>
        )}
        {state === "ready" && derived.length === 0 && (
          <div className="SourcesPage__notice" role="status">No per-car sources have been recorded yet.</div>
        )}

        {state === "ready" && derived.length > 0 && (
          <ul className="SourcesPage__pillList">
            {derived.map((d) => (
              <SourcePill
                key={d.label}
                label={d.label}
                count={d.count}
                cars={cars}
                onOpenChange={handlePillOpenChange}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
    </>
  );
}