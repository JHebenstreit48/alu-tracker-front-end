import { useEffect, useMemo, useState } from 'react';
import { sourcesCatalog } from '@/data/sources/sourcesCatalog';
import { dedupeAndCount } from '@/utils/sources/normalizeSources';
import { carsAdapter } from '@/lib/Firebase/carsAdapter';
import type { Car } from '@/types/shared/car';

import '@/scss/MiscellaneousStyle/Sources.scss';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function Sources() {
  const [state, setState] = useState<LoadState>('idle');
  const [derived, setDerived] = useState<Array<{ label: string; count: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  const methodology = useMemo(
    () => [
      {
        title: 'How sources are used',
        body: [
          'This project compiles information from multiple channels so players can find consistent, structured data in one place.',
          'Community resources are valuable, but they are treated as a starting point—not an automatic source of truth. When possible, values are verified against in-game observation and cross-checked for consistency.',
        ],
      },
      {
        title: 'Privacy-friendly credits',
        body: [
          'To respect privacy, individual usernames (Reddit, Discord, gamer tags) are not displayed unless someone explicitly requests credit.',
          'If you want to be credited publicly, you can request it through the Feedback page.',
        ],
      },
      {
        title: 'Contributions (planned)',
        body: [
          'A contributor submission system is planned to let players suggest additions or corrections over time.',
          'All submissions will be reviewed before approval to keep the dataset consistent and reliable.',
        ],
      },
    ],
    []
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setState('loading');
        setError(null);

        // Pull list of cars (from Firestore via adapter)
        const cars: Car[] = await carsAdapter.list(2000);

        // Extract ALL sources[] fields if present on docs (since you store extras during migration)
        const allLabels: string[] = [];
        for (const c of cars as Array<Car & Record<string, unknown>>) {
          const v = c['sources'];
          if (Array.isArray(v)) {
            for (const s of v) if (typeof s === 'string') allLabels.push(s);
          }
        }

        const deduped = dedupeAndCount(allLabels).map((x) => ({
          label: x.label,
          count: x.count,
        }));

        if (!alive) return;
        setDerived(deduped);
        setState('ready');
      } catch (e) {
        if (!alive) return;
        setState('error');
        setError((e as Error).message || 'Failed to load sources from dataset.');
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="SourcesPage">
      <header className="SourcesPage__header">
        <h1 className="SourcesPage__title">Sources & Methodology</h1>
        <p className="SourcesPage__subtitle">
          Where the tracker’s information comes from, how it’s reviewed, and why values can vary.
        </p>
      </header>

      <section className="SourcesPage__section">
        <div className="SourcesPage__cards">
          {methodology.map((m) => (
            <article
              key={m.title}
              className="SourcesPage__card"
            >
              <h2 className="SourcesPage__cardTitle">{m.title}</h2>
              {m.body.map((p) => (
                <p
                  key={p}
                  className="SourcesPage__cardText"
                >
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="SourcesPage__section">
        <h2 className="SourcesPage__sectionTitle">Main sources</h2>
        <ul className="SourcesPage__list">
          {sourcesCatalog.map((s) => (
            <li
              key={s.key}
              className="SourcesPage__listItem"
            >
              <div className="SourcesPage__listHeading">
                {s.url ? (
                  <a
                    className="SourcesPage__link"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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

      <section className="SourcesPage__section">
        <h2 className="SourcesPage__sectionTitle">Detected in dataset</h2>

        {state === 'loading' ? (
          <div
            className="SourcesPage__notice"
            role="status"
          >
            Scanning dataset sources…
          </div>
        ) : null}

        {state === 'error' ? (
          <div
            className="SourcesPage__notice"
            role="status"
          >
            Couldn’t load dataset sources right now. {error ? `(${error})` : null}
          </div>
        ) : null}

        {state === 'ready' && derived.length === 0 ? (
          <div
            className="SourcesPage__notice"
            role="status"
          >
            No per-car sources have been recorded yet.
          </div>
        ) : null}

        {state === 'ready' && derived.length > 0 ? (
          <ul className="SourcesPage__pillList">
            {derived.map((d) => (
              <li
                key={d.label}
                className="SourcesPage__pill"
              >
                <span className="SourcesPage__pillLabel">{d.label}</span>
                <span
                  className="SourcesPage__pillCount"
                  aria-label={`Used ${d.count} times`}
                >
                  {d.count}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}