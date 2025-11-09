import type { LegendStoreFilters } from "@/interfaces/LegendStore";

interface Props {
  filters: LegendStoreFilters;
  onChange: (next: LegendStoreFilters) => void;
  onReset: () => void;
}

export default function Filters({ filters, onChange, onReset }: Props) {
  const update = (patch: Partial<LegendStoreFilters>) =>
    onChange({ ...filters, ...patch });

  const levels = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <div className="legendStoreControls">
      <h2 className="filterHeading">Car Search Filters</h2>

      <label className="DropdownLabel">
        Cumulative Garage Level:
        <select
          className="dropdownSelector"
          value={filters.selectedCumulativeLevel ?? ""}
          onChange={(e) =>
            update({
              selectedCumulativeLevel: e.target.value
                ? parseInt(e.target.value, 10)
                : null,
            })
          }
        >
          <option value="">All Levels</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel">
        Individual Garage Level:
        <select
          className="dropdownSelector"
          value={filters.selectedIndividualLevel ?? ""}
          onChange={(e) =>
            update({
              selectedIndividualLevel: e.target.value
                ? parseInt(e.target.value, 10)
                : null,
            })
          }
        >
          <option value="">All Levels</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel">
        Star Rank:
        <select
          className="dropdownSelector"
          value={filters.selectedStarRank ?? ""}
          onChange={(e) =>
            update({
              selectedStarRank: e.target.value
                ? parseInt(e.target.value, 10)
                : null,
            })
          }
        >
          <option value="">All Ranks</option>
          {[3, 4, 5, 6].map((rank) => (
            <option key={rank} value={rank}>
              {rank} Stars
            </option>
          ))}
        </select>
      </label>

      <label className="DropdownLabel">
        Rarity:
        <select
          className="dropdownSelector"
          value={filters.selectedCarRarity ?? ""}
          onChange={(e) =>
            update({
              selectedCarRarity: e.target.value || null,
            })
          }
        >
          <option value="">All Rarities</option>
          <option value="Uncommon" className="optionUncommon">
            Uncommon
          </option>
          <option value="Rare" className="optionRare">
            Rare
          </option>
          <option value="Epic" className="optionEpic">
            Epic
          </option>
        </select>
      </label>

      <label className="DropdownLabel" id="classSelector">
        Class:
        <select
          className="dropdownSelector"
          value={filters.selectedClass}
          onChange={(e) =>
            update({ selectedClass: e.target.value || "All Levels" })
          }
        >
          <option value="All Levels">All Levels</option>
          <option value="D">Class D</option>
          <option value="C">Class C</option>
          <option value="B">Class B</option>
          <option value="A">Class A</option>
          <option value="S">Class S</option>
        </select>
      </label>

      <label className="DropdownLabel">
        Search:
        <input
          id="searchInput"
          type="text"
          placeholder="Search by brand or model"
          value={filters.searchTerm}
          onChange={(e) =>
            update({ searchTerm: e.target.value })
          }
        />
      </label>

      <button className="resetButton" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}