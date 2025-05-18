import "@/SCSS/Cars/CarsPage/CarFilters.scss";

interface CarFiltersProps {
  onSearch: (term: string) => void;
  onFilter: (stars: number | null) => void;
  onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
  selectedClass: string;
  unitPreference: "metric" | "imperial";
  showOwned: boolean;
  showKeyCars: boolean;
  onToggleOwned: () => void;
  onToggleKeyCars: () => void;
  searchTerm: string; // ✅ ADD THIS
}

export default function CarFilters({
  onSearch,
  onFilter,
  onClassChange,
  onUnitChange,
  onReset,
  selectedClass,
  unitPreference,
  showOwned,
  showKeyCars,
  onToggleOwned,
  onToggleKeyCars,
  searchTerm, // ✅ ADD THIS
}: CarFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    onSearch(term); // ✅ Still triggers handler in parent
  };

  const handleStarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const stars = value === "All" ? null : parseInt(value);
    onFilter(stars);
  };

  return (
    <div className="carFilters">
      <div className="filterHeading">Car Filters</div>

      <label className="DropdownLabel">
        Star Rank:
        <select className="starRanks" onChange={handleStarChange}>
          <option value="All">All Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
          <option value="6">6 Stars</option>
        </select>
      </label>

      <label className="DropdownLabel">
        Car Class:
        <select className="classSelect" value={selectedClass} onChange={onClassChange}>
          <option value="All Classes">All Classes</option>
          <option value="D">D</option>
          <option value="C">C</option>
          <option value="B">B</option>
          <option value="A">A</option>
          <option value="S">S</option>
        </select>
      </label>

      <label className="DropdownLabel">
        Units:
        <select className="unitSelect" value={unitPreference} onChange={onUnitChange}>
          <option value="metric">Metric</option>
          <option value="imperial">Imperial</option>
        </select>
      </label>

      <label className="DropdownLabel">
        Search:
        <input
          id="searchInput"
          type="text"
          placeholder="Search by Brand or Model"
          value={searchTerm} // ✅ Controlled value
          onChange={handleSearchChange}
        />
      </label>

      <label className="CheckboxLabel">
        <input type="checkbox" checked={showOwned} onChange={onToggleOwned} />
        Owned
      </label>

      <label className="CheckboxLabel">
        <input type="checkbox" checked={showKeyCars} onChange={onToggleKeyCars} />
        Key Car
      </label>

      <button className="resetButton" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}
