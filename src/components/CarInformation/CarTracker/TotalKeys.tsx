interface TotalKeysProps {
    obtained: number;
    owned: number;
    total: number;
  }
  
  export default function TotalKeys({ obtained, owned, total }: TotalKeysProps) {
    return (
      <p className="keysOwnedText">
        You’ve obtained <strong>{obtained}</strong> keys and own{" "}
        <strong>{owned}</strong> of <strong>{total}</strong> total Key Cars.
      </p>
    );
  }
  