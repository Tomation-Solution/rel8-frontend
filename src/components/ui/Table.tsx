import { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  /** Cell renderer. Without it the raw `item[key]` is printed. */
  render?: (item: T, index: number) => ReactNode;
  /** Tailwind width/visibility classes for this column. */
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  /** Shown in place of the body when `rows` is empty. */
  empty?: ReactNode;
  className?: string;
}

const ALIGN = { left: "text-left", center: "text-center", right: "text-right" } as const;

/**
 * The table the mockups draw: a lavender header row with rounded ends, hairline dividers,
 * no outer border and no zebra striping.
 *
 * Deliberately not built on `react-table` — every table in these mockups is a plain list
 * with custom cells, and the two existing wrappers (`components/Table/Table.jsx`,
 * `components/Table/DataTable.tsx`) disagreed about styling, sorting and empty states.
 * They are replaced screen by screen and removed in M15.
 *
 * Bulk-select checkboxes are omitted on purpose — the mockups draw them but there are no
 * bulk-action endpoints. See REDESIGN.md §5.
 */
export function Table<T extends Record<string, any>>({ columns, rows, rowKey, onRowClick, empty, className = "" }: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
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
                  {column.render ? column.render(item, index) : (item[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && <div className="py-6">{empty}</div>}
    </div>
  );
}

export default Table;
