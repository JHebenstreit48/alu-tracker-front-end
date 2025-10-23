interface GoldMaxedProps {
    goldMaxedCount: number;
    totalCars: number;
  }
  
  export default function GoldMaxed({ goldMaxedCount, totalCars }: GoldMaxedProps) {
    return (
      <p className="goldMaxedText">
        You currently have {goldMaxedCount} of {totalCars} car
         {totalCars !== 1 ? "s" : ""} <strong>Gold Maxed</strong>.
      </p>
    );
  }