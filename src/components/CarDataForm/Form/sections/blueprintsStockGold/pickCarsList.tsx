import type { Car } from '@/types/shared/car';

type Props = {
  cars: Car[];
  selectedKeys: Set<string>;
  onToggleKey: (key: string) => void;
  carKey: (c: Car) => string;
};

export default function PickCarsList({
  cars,
  selectedKeys,
  onToggleKey,
  carKey,
}: Props): JSX.Element {
  return (
    <>
      <div
        className="CarPickerList"
        role="list"
      >
        {cars.map((c) => {
          const k = carKey(c);
          const checked = selectedKeys.has(k);
          return (
            <label
              key={k}
              className="CarPickerItem"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleKey(k)}
              />
              <div className="CarPickerText">
                <div className="CarPickerMain">
                  {c.brand} {c.model}
                </div>
                <div className="CarPickerMeta">
                  {c.class} • {c.rarity} • {c.stars}★
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <p className="CarDataFormHint">Showing {cars.length} (capped at 250)</p>
    </>
  );
}