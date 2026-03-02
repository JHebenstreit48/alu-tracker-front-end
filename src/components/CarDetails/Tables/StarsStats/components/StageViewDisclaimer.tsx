type Props = {
  carSlug?: string;
};

export default function StageViewDisclaimer({ carSlug }: Props) {
  const href = carSlug ? `/cars/${carSlug}/lab` : "/cars/lab";

  return (
    <div className="stageViewDisclaimer" role="note" aria-label="Stage view notice">
      <div className="stageViewDisclaimer__title">Stage View Notice</div>

      <ul className="stageViewDisclaimer__list">
        <li>
          Stages shown for <strong>2★ and higher</strong> assume the previous star tier has been fully
          completed (including required imports).
        </li>
        <li>
          Stages for the <strong>current star tier</strong> are shown <strong>without imports</strong>{" "}
          applied for that tier.
        </li>
        <li>
          The <strong>Max Star</strong> view shows star-tier maximums, and <strong>Gold Max</strong>{" "}
          reflects all imports applied.
        </li>
        <li className="stageViewDisclaimer__future">
          An <a className="stageViewDisclaimer__link" href={href}>Upgrade Simulator</a> and a{" "}
          <span className="stageViewDisclaimer__nowrap">Car Comparison Tool</span> are planned for a
          future update.
        </li>
      </ul>
    </div>
  );
}