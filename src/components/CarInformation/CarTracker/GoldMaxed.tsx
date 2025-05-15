interface GoldMaxedProps {
    goldMaxedCount: number;
    totalCars: number;
  }
  
  export default function GoldMaxed({ goldMaxedCount, totalCars }: GoldMaxedProps) {
    return (
      <p className="goldMaxedText">
        {goldMaxedCount} of {totalCars} car
        {totalCars !== 1 ? "s" : ""} are marked as <strong>Gold Maxed</strong>.
      </p>
    );
  }
  