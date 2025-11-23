import CarsOwned from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/CarsOwned';
import OwnedProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/OwnedProgress';
import GoldMaxed from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/GoldMaxed';
import GoldMaxedProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/GoldMaxedProgress';
import TotalKeys from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/Labels/TotalKeys';
import OwnedKeyProgress from '@/components/Tracking/Cars/ProgressCircles/OwnedProgressCircles/UI/OwnedKeyProgress';
import type { KeyCarSummary } from '@/hooks/Tracking/useCarTrackerData';

interface Props {
  ownedCount: number;
  goldMaxedCount: number;
  totalCars: number;
  keySummary: KeyCarSummary;
}

export default function CollectionProgress({
  ownedCount,
  goldMaxedCount,
  totalCars,
  keySummary,
}: Props) {
  return (
    <>
      <hr className="sectionRule" />
      <h2 className="carCollectionTitle">Car Collection Progress</h2>
      <hr className="sectionRule" />

      <div className="summaryProgressRow">
        <div className="progressGroup">
          <OwnedProgress ownedCount={ownedCount} totalCars={totalCars} />
          <CarsOwned ownedCount={ownedCount} totalCars={totalCars} />
        </div>

        <div className="progressGroup">
          <GoldMaxedProgress
            goldMaxedCount={goldMaxedCount}
            totalCars={totalCars}
          />
          <GoldMaxed
            goldMaxedCount={goldMaxedCount}
            totalCars={totalCars}
          />
        </div>

        <div className="progressGroup">
          <OwnedKeyProgress
            obtained={keySummary.obtained}
            total={keySummary.total}
          />
          <TotalKeys
            obtained={keySummary.obtained}
            owned={keySummary.owned}
            total={keySummary.total}
          />
        </div>
      </div>
    </>
  );
}