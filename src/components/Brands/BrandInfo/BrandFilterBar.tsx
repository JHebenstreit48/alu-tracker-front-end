interface BrandFilterBarProps {
  country: string;
  letter: string;
  search: string;
  availableCountries: string[];
  availableLetters: string[];
  onCountryChange: (value: string) => void;
  onLetterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function BrandFilterBar({
  country,
  letter,
  search,
  availableCountries,
  availableLetters,
  onCountryChange,
  onLetterChange,
  onSearchChange,
}: BrandFilterBarProps) {
  return (
    <div className="brand-quick-list-filters">
      <select
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        aria-label="Filter by country"
      >
        <option>All countries</option>
        {availableCountries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={letter}
        onChange={(e) => onLetterChange(e.target.value)}
        aria-label="Filter by letter"
      >
        <option value="">Jump to letter</option>
        {availableLetters.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search brand"
        aria-label="Search brand"
      />
    </div>
  );
}