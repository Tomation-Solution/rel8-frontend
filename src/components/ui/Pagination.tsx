import { FiChevronsRight } from "react-icons/fi";

interface PaginationProps {
  /** 1-based. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * Numbered pages with an ellipsis and a trailing "Next »", exactly as the mockups draw it.
 * Renders nothing for a single page.
 */
const Pagination = ({ page, totalPages, onChange, className = "" }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-2 flex-wrap py-8 ${className}`}>
      {pages.map((entry, index) =>
        entry === "…" ? (
          <span key={`gap-${index}`} className="w-8 h-8 grid place-items-center text-muted text-sm">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={`w-8 h-8 rounded-md text-sm transition-colors ${entry === page ? "bg-org-primary text-white font-medium" : "border border-hairline text-ink hover:border-org-primary hover:text-org-primary"}`}
          >
            {entry}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-org-primary text-org-primary text-sm hover:bg-org-tint disabled:opacity-40 disabled:hover:bg-white"
      >
        Next <FiChevronsRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

/** 1 2 3 4 5 6 … 15 — always the first six, an ellipsis and the last. */
function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 8) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(1, Math.min(page - 2, total - 7));
  const window: (number | "…")[] = Array.from({ length: 6 }, (_, i) => start + i);

  if (start > 1) {
    window.unshift("…");
    window.unshift(1);
  }
  if ((window[window.length - 1] as number) < total - 1) window.push("…");
  if ((window[window.length - 1] as number) !== total) window.push(total);

  return window;
}

export default Pagination;
