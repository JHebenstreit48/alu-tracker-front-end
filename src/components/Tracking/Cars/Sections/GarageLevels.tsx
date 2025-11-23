import { useGarageLevelStats } from '@/hooks/GarageLevels/useGarageLevelStats';
import CurrentLevelRing from '@/components/Tracking/GarageLevels/UI/CurrentLevelRing';
import XpToNextLevelRing from '@/components/Tracking/GarageLevels/UI/XpToNextLevelRing';
import OverallCompletionRing from '@/components/Tracking/GarageLevels/UI/OverallCompletionRing';
import CurrentLevelLabel from '@/components/Tracking/GarageLevels/Labels/CurrentLevel';
import XpToNextLevelLabel from '@/components/Tracking/GarageLevels/Labels/XpToNextLevel';
import OverallCompletionLabel from '@/components/Tracking/GarageLevels/Labels/OverallCompletion';

const MAX_LEVEL = 60;

export default function GarageLevelsSection() {
  const stats = useGarageLevelStats();

  return (
    <>
      <hr className="sectionRule" />
      <h2 className="garageLevelsTitle">Garage Level Progress</h2>
      <hr className="sectionRule" />

      <div className="garageLevelsSummaryRow">
        <div className="progressGroup">
          <CurrentLevelRing
            level={stats.currentLevel}
            levelPercent={stats.levelPercent}
          />
          <CurrentLevelLabel
            level={stats.currentLevel}
            maxLevel={MAX_LEVEL}
          />
        </div>

        <div className="progressGroup">
          <XpToNextLevelRing
            percent={stats.xpWithinLevelPercent}
          />
          <XpToNextLevelLabel
            xpToNext={stats.xpToNext}
            nextLevel={stats.nextLevel}
          />
        </div>

        <div className="progressGroup">
          <OverallCompletionRing
            percent={stats.overallPercent}
          />
          <OverallCompletionLabel overallPercent={stats.overallPercent} />
        </div>
      </div>
    </>
  );
}