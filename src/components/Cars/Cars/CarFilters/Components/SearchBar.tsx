interface SearchBarProps {
    searchTerm: string;
    onSearch: (term: string) => void;
  }
  
  export default function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
    return (
      <label className="DropdownLabel searchFilter">
        Search:
        <input
          id="searchInput"
          type="text"
          placeholder="Search by Model"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
    );
  }
  