import { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  /** Cell renderer. Without it the raw `item[key]` is printed. */
  render?: (item: T, index: number) => ReactNode;
  /** Tailwind width/visibility classes for this column. */
  className?: string;
  /**
   * Marks the column that becomes the heading of the stacked mobile card. Defaults to the
   * first column when no column claims it.
   */
  primary?: boolean;
  /** Drop this column from the mobile card — for filler columns that only make sense in a
   *  wide grid. It still renders in the table. */
  hideOnMobile?: boolean;
  /**
   * Render this column across the full width of the mobile card, with no label, below the
   * label/value pairs. What an action column needs: a row of buttons squeezed into the
   * right half of a 375px card is unusable.
   */
  mobileFullWidth?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  /** Shown in place of the body when `rows` is empty. */
  empty?: ReactNode;
  className?: string;
  /**
   * Keep the real table at every width instead of switching to cards. Only for grids that
   * are genuinely comparative — a column of numbers read against each other.
   */
  keepTableOnMobile?: boolean;
}

const ALIGN = { left: "text-left", center: "text-center", right: "text-right" } as const;

/**
 * The table the mockups draw: a lavender header row with rounded ends, hairline dividers,
 * no outer border and no zebra striping.
 *
 * **On phones it is not a table at all.** The grid needs ~720px to stay legible, so below
 * `md` each row renders as a stacked card of label/value pairs. Horizontally scrolling a
 * 720px table inside a 375px viewport hid the columns that carry the answer — status,
 * amount, the action button — behind a swipe most people never make, and on a touch
 * device that inner scroll fights the page scroll. Pass `keepTableOnMobile` to opt out.
 *
 * Deliberately not built on `react-table` — every table in these mockups is a plain list
 * with custom cells.
 *
 * Bulk-select checkboxes are omitted on purpose — the mockups draw them but there are no
 * bulk-action endpoints. See REDESIGN.md §5.
 */
export function Table<T extends Record<string, any>>({ columns, rows, rowKey, onRowClick, empty, className = "", keepTableOnMobile = false }: TableProps<T>) {
  const cell = (column: TableColumn<T>, item: T, index: number) => (column.render ? column.render(item, index) : (item[column.key] ?? "—"));

  const primaryColumn = columns.find(column => column.primary) ?? columns[0];
  const mobileColumns = columns.filter(column => column !== primaryColumn && !column.hideOnMobile);
  const detailColumns = mobileColumns.filter(column => !column.mobileFullWidth);
  const footerColumns = mobileColumns.filter(column => column.mobileFullWidth);

  return (
    <div className={`w-full ${className}`}>
      {/* Phones: one card per row. */}
      {!keepTableOnMobile && (
        <div className="md:hidden flex flex-col gap-3">
          {rows.map((item, index) => (
            <div
              key={rowKey ? rowKey(item, index) : index}
              onClick={onRowClick ? () => onRowClick(item, index) : undefined}
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? event => (event.key === "Enter" || event.key === " ") && onRowClick(item, index) : undefined}
              className={`surface p-4 ${onRowClick ? "cursor-pointer active:bg-org-tint/40 transition-colors" : ""}`}
            >
              {primaryColumn && <div className="text-[15px] font-medium text-ink break-words mb-3">{cell(primaryColumn, item, index)}</div>}

              <dl className="flex flex-col gap-2.5">
                {detailColumns.map(column => (
                  <div key={column.key} className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-muted flex-shrink-0 pt-0.5">{column.label}</dt>
                    <dd className="text-sm text-ink text-right min-w-0 break-words">{cell(column, item, index)}</dd>
                  </div>
                ))}
              </dl>

              {footerColumns.length > 0 && (
                <div className="mt-4 pt-3 border-t border-hairline flex flex-col gap-2 [&_button]:flex-1 [&_button]:justify-center">
                  {footerColumns.map(column => (
                    <div key={column.key}>{cell(column, item, index)}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tablet and up: the grid as drawn. */}
      <div className={`w-full overflow-x-auto ${keepTableOnMobile ? "" : "hidden md:block"}`}>
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-org-tint">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-5 py-4 text-[15px] font-medium text-ink whitespace-nowrap ${ALIGN[column.align ?? "left"]} ${index === 0 ? "rounded-l-xl" : ""} ${index === columns.length - 1 ? "rounded-r-xl" : ""} ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((item, index) => (
              <tr
                key={rowKey ? rowKey(item, index) : index}
                onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                className={`border-b border-hairline last:border-0 ${onRowClick ? "cursor-pointer hover:bg-org-tint/40 transition-colors" : ""}`}
              >
                {columns.map(column => (
                  <td key={column.key} className={`px-5 py-4 text-sm text-ink align-middle ${ALIGN[column.align ?? "left"]} ${column.className ?? ""}`}>
                    {cell(column, item, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && <div className="py-6">{empty}</div>}
    </div>
  );
}

export default Table;
