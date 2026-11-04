type CarCountProps = {
  rangeStart: number;
  rangeEnd: number;
  totalFiltered: number;
};

export default function CarCount({ rangeStart, rangeEnd, totalFiltered }: CarCountProps) {
  const noun = totalFiltered === 1 ? 'car' : 'cars';

  if (!totalFiltered) {
    return <p className="carCount">Showing 0 of 0 cars</p>;
  }

  return (
    <p className="carCount">
      Showing {rangeStart}–{rangeEnd} of {totalFiltered} {noun}
    </p>
  );
}