import { CheckboxesProps } from '@/types/Cars/Filters/CheckboxesProps';

export default function Checkboxes({
  showOwned,
  showKeyCars,
  onToggleOwned,
  onToggleKeyCars,
}: CheckboxesProps) {
  return (
    <>
      <label className="CheckboxLabel ownedFilter" htmlFor="ownedChk">
        <input
          id="ownedChk"
          name="owned"
          type="checkbox"
          checked={showOwned}
          onChange={onToggleOwned}
        />
        <span>Owned</span>
      </label>

      <label className="CheckboxLabel keyCarFilter" htmlFor="keyChk">
        <input
          id="keyChk"
          name="keycar"
          type="checkbox"
          checked={showKeyCars}
          onChange={onToggleKeyCars}
        />
        <span>Key Car</span>
      </label>
    </>
  );
}