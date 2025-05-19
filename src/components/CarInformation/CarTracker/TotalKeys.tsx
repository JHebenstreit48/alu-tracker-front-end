interface TotalKeysProps {
    obtained: number;
    owned: number;
    total: number;
  }
  
  export default function TotalKeys({ obtained, total }: TotalKeysProps) {
    return (
      <p className="keysOwnedText">
        You currently own <strong>{obtained}</strong> keys cars of a total of  <strong>{total}</strong>.
      </p>
    );
  }
  