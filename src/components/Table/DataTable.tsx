import React, { ReactNode, useState } from "react";
import { FiTrash2, FiChevronRight } from "react-icons/fi";
import { PiNotePencil } from "react-icons/pi";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  filterOptions?: { value: string; label: string }[];
  onFilterSelect?: (value: string) => void;
  onEdit?: (item: T, index: number) => void;
  onDelete?: (item: T, index: number) => void;
  onRowClick?: (item: T, index: number) => void;
  showActions?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonRows?: number;
  deleteModalTitle?: string;
  deleteModalDescription?: string;
  getItemName?: (item: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  filterOptions,
  onFilterSelect,
  onEdit,
  onDelete,
  onRowClick,
  showActions = true,
  emptyMessage = "No data available",
  isLoading = false,
  skeletonRows = 5,
  deleteModalTitle = "Confirm Delete",
  deleteModalDescription = "Are you sure you want to delete this item? This action cannot be undone.",
  getItemName,
}: DataTableProps<T>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ item: T; index: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: T, index: number) => {
    setItemToDelete({ item, index });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(itemToDelete.item, itemToDelete.index);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Generate dynamic description with item name if provided
  const dynamicDescription = itemToDelete && getItemName
    ? `Are you sure you want to delete "${getItemName(itemToDelete.item)}"? This action cannot be undone.`
    : deleteModalDescription;

  return (
    <>
      <div className="bg-white rounded-lg ">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <p className="text-lg font-bold text-gray-800">{title}</p>
          {filterOptions && onFilterSelect && (
            <select
              onChange={(e) => onFilterSelect(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 h-14">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-gray-600 font-semibold text-left px-4 py-3"
                  >
                    {column.label}
                  </th>
                ))}
                {showActions && (
                  <th className="text-gray-600 font-semibold text-left px-4 py-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: skeletonRows }).map((_, idx) => (
                  <tr key={idx}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (showActions ? 1 : 0)} className="text-center py-8 text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={onRowClick ? () => onRowClick(item, idx) : undefined}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm">
                        {column.render
                          ? column.render(item, idx)
                          : item[column.key]}
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex gap-0">
                          {onEdit && (
                            <button
                              className="text-gray-700 font-bold p-2 hover:bg-gray-100 rounded"
                              aria-label={onDelete ? "Edit item" : "View details"}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item, idx);
                              }}
                            >
                              {onDelete ? <PiNotePencil size={20} /> : <FiChevronRight size={20} />}
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="text-gray-700 font-bold p-2 hover:bg-gray-100 rounded"
                              aria-label="Delete item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item, idx);
                              }}
                            >
                              <FiTrash2 size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">{deleteModalTitle}</h3>
            <p className="text-gray-600 mb-4">{dynamicDescription}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}