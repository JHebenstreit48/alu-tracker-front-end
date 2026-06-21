import Field from '@/components/CarDataForm/Stats/shared/Field';
import { STAR_KEYS, STAR_LABELS, type StarKey } from '@/types/CarDataSubmission/tabs/shared';
import type { CarSeedFields } from '@/hooks/CarDataSubmission/useCarSeedFields/useCarSeedFields';

const STAR_KEY_MAP: Record<string, StarKey> = {
  oneStar: 'oneStar',
  twoStar: 'twoStar',
  threeStar: 'threeStar',
  fourStar: 'fourStar',
  fiveStar: 'fiveStar',
  sixStar: 'sixStar',
};

type Props = {
  activeKey: string;
  activeStars: number;
  getBps: CarSeedFields['getBps'];
  updateBp: CarSeedFields['updateBp'];
  seedBlueprints: CarSeedFields['seedBlueprints'];
  isKeyCar: boolean;
  correcting: boolean;
};

export default function Blueprints({
  activeKey,
  activeStars,
  getBps,
  updateBp,
  seedBlueprints,
  isKeyCar,
  correcting,
}: Props): JSX.Element {
  return (
    <section className="StatsBlock">
      <h3 className="StatsBlockTitle">Blueprints</h3>
      <div className="StatsGrid">
        {getBps(activeKey)
          .slice(0, activeStars)
          .map((v, i) => {
            const starKey = STAR_KEY_MAP[STAR_KEYS[i]];
            const seedVal = seedBlueprints?.[starKey];
            // For key cars, 1★ blueprints = 0 is intentional — treat as real data
            const hasReal = seedVal !== undefined && (seedVal !== 0 || (isKeyCar && i === 0));
            return (
              <Field
                key={STAR_KEYS[i]}
                label={STAR_LABELS[i]}
                v={v}
                s={(val) => updateBp(i, val)}
                readOnly={!correcting && hasReal}
                placeholder={hasReal ? String(seedVal) : '—'}
              />
            );
          })}
      </div>
    </section>
  );
}