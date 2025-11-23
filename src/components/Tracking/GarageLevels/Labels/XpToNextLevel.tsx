interface XpToNextLevelLabelProps {
    xpToNext: number;
    nextLevel: number | null;
  }
  
  export default function XpToNextLevelLabel({
    xpToNext,
    nextLevel,
  }: XpToNextLevelLabelProps) {
    if (!nextLevel || xpToNext <= 0) {
      return (
        <p className="glText glTextXp">
          You&apos;re at the highest tracked level for now.
        </p>
      );
    }
  
    return (
      <p className="glText glTextXp">
        <strong>{xpToNext.toLocaleString('en-US')}</strong> XP to reach level{' '}
        <strong>{nextLevel}</strong>.
      </p>
    );
  }
  