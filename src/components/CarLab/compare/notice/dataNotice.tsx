interface Props {
  carCount: number;
}

export default function DataNotice({ carCount }: Props) {
  return (
    <aside className="carLabPanel carLabNotice">
      <h3 className="carLabNoticeTitle">About this data</h3>
      <p className="carLabNoticeText">
        Car Lab is a one-person project and the data is still being added. Of the {carCount} cars
        listed, many only have some values logged, such as stock, max star or gold max.
      </p>
      <p className="carLabNoticeText">
        Stage and import data comes from my own in-game testing. Only points that both cars have are
        compared, and anything missing is marked as not added yet instead of shown as zero.
      </p>
    </aside>
  );
}