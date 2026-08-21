import { ReactNode } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** The wide centred pill. Note the mockups centre the icon+placeholder, not left-align it. */
export const SearchInput = ({ value, onChange, placeholder = "Search", className = "" }: SearchInputProps) => (
  <label className={`flex-1 min-w-0 flex items-center gap-2 h-12 px-4 rounded-full border border-org-tint-strong bg-white focus-within:border-org-primary ${className}`}>
    <span className="flex-1 flex items-center justify-center gap-2 min-w-0">
      <HiMiniMagnifyingGlass className="w-5 h-5 text-org-primary/60 flex-shrink-0" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none text-sm text-ink placeholder:text-muted" />
    </span>
  </label>
);

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

/** The rounded outline dropdown sitting to the right of the search pill. */
export const FilterSelect = ({ value, onChange, options, className = "" }: FilterSelectProps) => (
  <div className={`relative flex-shrink-0 ${className}`}>
    <select value={value} onChange={e => onChange(e.target.value)} className="appearance-none h-12 pl-5 pr-11 rounded-full border border-org-primary bg-white text-sm font-medium text-org-primary outline-none cursor-pointer">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <FiChevronDown className="w-5 h-5 text-org-primary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filter?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  /** Anything extra to the right of the filter. */
  children?: ReactNode;
  className?: string;
}

/** Search pill + optional filter dropdown. Sits between the stat row and the content. */
export const SearchFilterBar = ({ search, onSearchChange, searchPlaceholder, filter, onFilterChange, filterOptions, children, className = "" }: SearchFilterBarProps) => (
  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 ${className}`}>
    <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
    {filterOptions && onFilterChange && <FilterSelect value={filter ?? ""} onChange={onFilterChange} options={filterOptions} />}
    {children}
  </div>
);

export default SearchFilterBar;
