import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { HiMiniMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { globalSearch, type SearchGroup, type SearchResult } from "../../api/search/search-api";
import { SEARCHABLE_TYPES, searchResultPath } from "../../utils/searchDestinations";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

/**
 * The topbar search.
 *
 * It was `<input disabled>` with a comment saying there was no search endpoint. There is
 * one now — `GET /api/search` — and it covers everything a member is allowed to see in
 * their association: events, news, publications, gallery, meetings, elections, dues,
 * projects, services, the member directory, their own support tickets and the FAQs.
 *
 * A result with a detail page opens it. Dues, projects and support have no per-record
 * route in this portal, so those open their list page.
 */
const GlobalSearch = () => {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  const isSearchable = debounced.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useQuery(["global-search", debounced], ({ signal }) => globalSearch({ q: debounced, types: SEARCHABLE_TYPES, limit: 5 }, signal), {
    enabled: isSearchable,
    keepPreviousData: true,
    staleTime: 15 * 1000,
  });

  // Memoised on `data` rather than derived inline: the `?? []` fallback is a fresh array
  // every render, which would rebuild `flatResults` — and with it the keyboard selection —
  // on each keystroke.
  const groups: SearchGroup[] = useMemo(() => data?.groups ?? [], [data]);

  /** Flattened for the arrow keys — the panel is grouped, keyboard movement is not. */
  const flatResults = useMemo(() => groups.flatMap(group => group.items), [groups]);

  useEffect(() => setActiveIndex(0), [debounced]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The Ctrl+K hint next to the field was decoration; it now does what it says.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const openResult = (result: SearchResult) => {
    const path = searchResultPath(result);
    if (!path) return;
    setTerm("");
    setDebounced("");
    setIsOpen(false);
    inputRef.current?.blur();
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (flatResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(index => (index + 1) % flatResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(index => (index - 1 + flatResults.length) % flatResults.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const result = flatResults[activeIndex];
      if (result) openResult(result);
    }
  };

  const showPanel = isOpen && (isSearchable || isFetching);

  return (
    <div ref={containerRef} className="relative hidden md:block w-full max-w-md">
      <div className="flex items-center gap-2 h-11 px-4 rounded-lg border border-org-tint-strong bg-white">
        <HiMiniMagnifyingGlass className="w-5 h-5 text-org-primary/50 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={event => {
            setTerm(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search events, news, dues…"
          aria-label="Search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-muted"
        />

        {term ? (
          <button type="button" aria-label="Clear search" onClick={() => { setTerm(""); setIsOpen(false); inputRef.current?.focus(); }} className="flex-shrink-0 text-muted hover:text-ink">
            <HiXMark className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden lg:inline text-[11px] text-muted bg-hairline/70 rounded px-2 py-1 flex-shrink-0">Ctrl + K</kbd>
        )}
      </div>

      {showPanel && (
        <div id="global-search-results" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-hairline bg-white shadow-xl">
          {isFetching && flatResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Searching…</p>
          ) : flatResults.length === 0 ? (
            <div className="py-10 px-6 text-center">
              <p className="text-sm font-medium text-ink">No matches for “{debounced}”</p>
              <p className="mt-1 text-xs text-muted">Search covers events, news, publications, gallery, meetings, elections, dues, projects, services and members.</p>
            </div>
          ) : (
            <div className="py-1">
              {groups.map(group => (
                <div key={group.type}>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{group.label}</p>
                    {group.hasMore && <span className="text-[11px] text-muted">more matches</span>}
                  </div>

                  {group.items.map(item => {
                    const index = flatResults.indexOf(item);
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(index)}
                        // `onMouseDown`, not `onClick`: the input's blur fires first on a
                        // click and would close the panel before the click landed.
                        onMouseDown={event => {
                          event.preventDefault();
                          openResult(item);
                        }}
                        className={`block w-full px-4 py-2.5 text-left ${isActive ? "bg-org-tint" : "hover:bg-app"}`}
                      >
                        <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                        {(item.subtitle || item.description) && <p className="truncate text-xs text-muted">{[item.subtitle, item.description].filter(Boolean).join(" · ")}</p>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
