interface CarsOwnedProps {
    ownedCount: number;
    totalCars: number;
  }
  
  export default function CarsOwned({ ownedCount, totalCars }: CarsOwnedProps) {
    return (
      <p style={{ fontSize: "1.2rem", marginTop: "1rem", textAlign: "center" }}>
        You currently own <strong>{ownedCount}</strong> of{" "}
        <strong>{totalCars}</strong> total car{totalCars !== 1 ? "s" : ""}.
      </p>
    );
  }
  