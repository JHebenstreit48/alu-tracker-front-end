import { getImageUrl } from "@/utils/shared/imageUrl";

type StarHeaderProps = {
  star: number;
};

// Use shared image resolver so this works with Firebase Storage and local dev.
const STAR_ICON_SRC =
  getImageUrl("/images/icons/star.png") || "/images/icons/star.png";

export default function StarHeader({ star }: StarHeaderProps) {
  const label = star > 1 ? "Stars Max" : "Star Max";

  return (
    <div className="starHeaderWrapper">
      <div className="starIconWrapper">
        {Array.from({ length: star }).map((_, i) => (
          <img
            key={i}
            src={STAR_ICON_SRC}
            alt="Star"
            className="starIcon"
          />
        ))}
      </div>
      <span className="starLabel">{label}</span>
    </div>
  );
}