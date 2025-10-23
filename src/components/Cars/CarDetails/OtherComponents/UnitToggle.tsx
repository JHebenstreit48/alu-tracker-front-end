import usePreferredUnit, { UnitPref } from "@/components/Cars/CarDetails/hooks/usePreferredUnit";
import "@/scss/Cars/CarDetails/UnitToggle.scss";

interface Props {
  value?: UnitPref;                      // allow controlled or self-contained
  onChange?: (next: UnitPref) => void;
}

export default function UnitToggle({ value, onChange }: Props) {
  const local = usePreferredUnit();
  const current = value ?? local.unit;
  const set = onChange ?? local.setUnit;

  const isMetric = current === "metric";

  return (
    <div className="UnitToggle" role="group" aria-label="Speed Units">
      <button
        type="button"
        className={`UnitToggle__btn ${isMetric ? "is-active" : ""}`}
        aria-pressed={isMetric}
        onClick={() => set("metric")}
      >KPH</button>
      <span className="UnitToggle__divider">/</span>
      <button
        type="button"
        className={`UnitToggle__btn ${!isMetric ? "is-active" : ""}`}
        aria-pressed={!isMetric}
        onClick={() => set("imperial")}
      >MPH</button>
    </div>
  );
}