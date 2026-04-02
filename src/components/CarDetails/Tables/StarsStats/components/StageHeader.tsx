import { getImageUrl } from "@/utils/shared/imageUrl";

type Props = {
  stage: number;
  starRank: number;
};

const STAR_ICON_REL_PATH = "/images/icons/star.png";

export default function StageHeader({ stage, starRank }: Props) {
  const starIconUrl = getImageUrl(STAR_ICON_REL_PATH);

  return (
    <div className="stageHeader">
      <div className="starIconWrapper">
        {Array.from({ length: starRank }).map((_, i) => (
          <img key={i} src={starIconUrl} alt="Star" className="starIcon stageHeaderStarIcon" />
        ))}
      </div>
      <span className="stageLabel">Stage {String(stage).padStart(2, "0")}</span>
    </div>
  );
}