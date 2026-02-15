type Props = {
  mode: "maxStar" | "stages";
  onChange: (next: "maxStar" | "stages") => void;
};

export default function StatsModeToggle({ mode, onChange }: Props) {
  const isStages = mode === "stages";

  return (
    <div className="statsToggleRow">
      <div className="statsModeToggle">
        <span className={`label ${!isStages ? "active" : ""}`}>Max Star</span>

        <button
          type="button"
          className={`toggle ${isStages ? "isOn" : "isOff"}`}
          onClick={() => onChange(isStages ? "maxStar" : "stages")}
          aria-pressed={isStages}
          aria-label="Toggle between max star stats and stage stats"
        >
          <span className="knob" />
        </button>

        <span className={`label ${isStages ? "active" : ""}`}>Stages</span>
      </div>
    </div>
  );
}