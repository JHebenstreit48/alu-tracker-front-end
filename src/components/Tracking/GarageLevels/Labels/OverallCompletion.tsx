interface OverallCompletionLabelProps {
    overallPercent: number;
  }
  
  export default function OverallCompletionLabel({
    overallPercent,
  }: OverallCompletionLabelProps) {
    const rounded = Math.round(
      Number.isFinite(overallPercent) ? overallPercent : 0,
    );
  
    return (
      <p className="glText glTextOverall">
        Overall Garage Level progress:{' '}
        <strong>{rounded}%</strong> toward max.
      </p>
    );
  }  