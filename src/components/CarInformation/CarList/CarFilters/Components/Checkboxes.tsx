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
      <div className="filterRow">
        <label className="CheckboxLabel">
          <input type="checkbox" checked={showOwned} onChange={onToggleOwned} />
          Owned
        </label>
  
        <label className="CheckboxLabel">
          <input
            type="checkbox"
            checked={showKeyCars}
            onChange={onToggleKeyCars}
          />
          Key Car
        </label>
      </div>
    );
  }
  