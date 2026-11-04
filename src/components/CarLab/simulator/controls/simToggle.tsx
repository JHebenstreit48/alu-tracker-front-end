interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function SimToggle({ checked, onChange }: Props) {
  return (
    <label className="carLabSimToggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      Only steps with logged data
    </label>
  );
}