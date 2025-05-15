interface CarsOwnedProps {
    ownedCount: number;
    totalCars: number;
  }
  
  export default function CarsOwned({ ownedCount, totalCars }: CarsOwnedProps) {
    return (
      <p className="carsOwnedText">
        You currently own <strong>{ownedCount}</strong> of{" "}
        <strong>{totalCars}</strong> total car{totalCars !== 1 ? "s" : ""}.
      </p>
    );
  }
  