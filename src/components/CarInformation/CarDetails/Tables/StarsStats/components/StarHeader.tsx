export default function StarHeader({ star }: { star: number }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    const label = star > 1 ? "Stars Max" : "Star Max";
  
    return (
      <div className="starHeaderWrapper">
        <div className="starIconWrapper">
          {Array.from({ length: star }).map((_, i) => (
            <img key={i} src={`${baseUrl}/images/icons/star.png`} alt="Star" className="starIcon" />
          ))}
        </div>
        <span className="starLabel">{label}</span>
      </div>
    );
  }