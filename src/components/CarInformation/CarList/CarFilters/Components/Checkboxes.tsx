interface CheckboxesProps {
    showOwned: boolean;
    showKeyCars: boolean;
    onToggleOwned: () => void;
    onToggleKeyCars: () => void;
  }
  
  export default function Checkboxes({
    showOwned,
    showKeyCars,
    onToggleOwned,
    onToggleKeyCars,
  }: CheckboxesProps) {
    return (
      <>
        <label className="CheckboxLabel ownedFilter">
          <input type="checkbox" checked={showOwned} onChange={onToggleOwned} />
          Owned
        </label>
  
        <label className="CheckboxLabel keyCarFilter">
          <input
            type="checkbox"
            checked={showKeyCars}
            onChange={onToggleKeyCars}
          />
          Key Car
        </label>
      </>
    );
  }
  