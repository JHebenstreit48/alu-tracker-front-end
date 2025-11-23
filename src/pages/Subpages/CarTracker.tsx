import PageTab from '@/components/Shared/Navigation/PageTab';
import CarTrackerBody from '@/components/Tracking/Cars/CarTrackerBody';

export default function CarTracker() {
  return (
    <div className="carTrackerPage">
      <PageTab title="Car Tracker">
        <CarTrackerBody />
      </PageTab>
    </div>
  );
}