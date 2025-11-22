import CarDataStatusCard from "@/components/CarDetails/OtherComponents/DataStatusCard";
import type { CarStatus } from "@/types/shared/status";

type Props = {
  onBack: () => void;
  updatedAt?: string;
  status: CarStatus | null;
};

export default function DetailHeader({ onBack, updatedAt, status }: Props) {
  const effectiveUpdatedAt = status?.lastChecked ?? updatedAt;

  return (
    <div className="cdetail-top">
      <button className="backBtn" onClick={onBack}>
        Back
      </button>

      <div className="cdetail-status">
        <CarDataStatusCard
          updatedAt={effectiveUpdatedAt}
          status={status}
          inline
        />
      </div>
    </div>
  );
}