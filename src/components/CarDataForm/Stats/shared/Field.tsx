type Props = {
  label: string;
  v: string;
  s: (x: string) => void;
  readOnly?: boolean;
  placeholder?: string;
};

export default function Field({ label, v, s, readOnly = false, placeholder }: Props) {
  return (
    <label className={`CarDataFormLabel${readOnly ? ' CarDataFormLabel--readOnly' : ''}`}>
      {label}
      <input
        value={v}
        onChange={(e) => !readOnly && s(e.target.value)}
        inputMode="decimal"
        readOnly={readOnly}
        placeholder={placeholder ?? '—'}
        className={readOnly ? 'CarDataFormInput--readOnly' : ''}
      />
    </label>
  );
}