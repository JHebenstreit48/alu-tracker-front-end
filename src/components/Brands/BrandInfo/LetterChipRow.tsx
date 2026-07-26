interface LetterChipRowProps {
  availableLetters: string[];
  onLetterClick: (letter: string) => void;
}

export default function LetterChipRow({ availableLetters, onLetterClick }: LetterChipRowProps) {
  return (
    <div className="brand-quick-list-chips">
      {availableLetters.map((l) => (
        <button key={l} type="button" className="letter-chip" onClick={() => onLetterClick(l)}>
          {l}
        </button>
      ))}
    </div>
  );
}