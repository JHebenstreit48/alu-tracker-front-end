import CarDataStatusCard from "@/components/CarInformation/CarDetails/OtherComponents/DataStatusCard";

type Props = {
  onBack: () => void;
  updatedAt?: string;
  status: {
    status: "complete" | "in progress" | "missing" | "unknown";
    message?: string;
    lastChecked?: string | null;
  } | null;
};

export default function DetailHeader({ onBack, updatedAt, status }: Props) {
  return (
    <div className="cdetail-top">
      <button className="backBtn" onClick={onBack}>
        Back
      </button>

      <div className="cdetail-status">
        <CarDataStatusCard updatedAt={updatedAt} status={status} inline />
      </div>
    </div>
  );
}