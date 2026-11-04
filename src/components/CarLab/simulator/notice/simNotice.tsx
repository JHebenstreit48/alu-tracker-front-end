export default function SimNotice() {
  return (
    <aside className="carLabPanel carLabNotice">
      <h3 className="carLabNoticeTitle">How to read this</h3>
      <p className="carLabNoticeText">
        Move the slider to see a car's stats at a stock, stage, star or gold max step. The shaded
        area fills in up to the step you chose.
      </p>
      <p className="carLabNoticeText">
        Solid lines and dots are logged values. Dashed lines are estimates, drawn as a straight line
        between the nearest logged steps. Imports make real values differ, so treat estimates as
        rough guides. Nothing is drawn past the last logged step.
      </p>
    </aside>
  );
}