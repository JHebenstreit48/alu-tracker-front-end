import { getImageUrl } from "@/utils/shared/imageUrl";

type Props = {
  stage: number;
};

const STAR_ICON_REL_PATH = "/images/icons/star.png";

export default function StageHeader({ stage }: Props) {
  const starIconUrl = getImageUrl(STAR_ICON_REL_PATH);

  return (
    <div className="stageHeader">
      <img src={starIconUrl} alt="Star" className="starIcon stageHeaderStarIcon" />
      <span className="stageLabel">Stage {String(stage).padStart(2, "0")}</span>
    </div>
  );
}