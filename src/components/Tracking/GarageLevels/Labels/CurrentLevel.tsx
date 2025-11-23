interface CurrentLevelLabelProps {
    level: number;
    maxLevel: number;
  }
  
  export default function CurrentLevelLabel({
    level,
    maxLevel,
  }: CurrentLevelLabelProps) {
    return (
      <p className="glText glTextCurrentLevel">
        Garage Level <strong>{level}</strong> of <strong>{maxLevel}</strong>.
      </p>
    );
  }  