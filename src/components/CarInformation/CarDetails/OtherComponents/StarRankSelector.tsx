interface StarRankSelectorProps {
    maxStars: number;
    selected: number;
    onSelect?: (value: number) => void;
    readOnly?: boolean;
  }
  
  const StarRankSelector: React.FC<StarRankSelectorProps> = ({
    maxStars,
    selected,
    onSelect,
    readOnly = false,
  }) => {
    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= maxStars; i++) {
        const isSelected = i <= selected;
        stars.push(
          <span
            key={i}
            onClick={() => !readOnly && onSelect?.(i)}
            style={{
              cursor: readOnly ? "default" : "pointer",
              fontSize: "2rem",
              color: isSelected ? "gold" : "gray",
              opacity: isSelected ? 1 : 0.4,
              marginRight: "4px",
            }}
          >
            ★
          </span>
        );
      }
      return stars;
    };
  
    return <div style={{ display: "flex", justifyContent: "center" }}>{renderStars()}</div>;
  };
  
  export default StarRankSelector;
  