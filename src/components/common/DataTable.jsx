import React from "react";

/**
 * DataTable Component
 * A reusable table component for displaying tabular data with optional actions.
 *
 * @param {Array} columns - Array of column configuration objects
 *   @param {string} columns[].header - Display text for column header
 *   @param {string} columns[].accessorKey - Key to access data from row object
 *   @param {Function} columns[].render - Optional custom render function for cell content
 *
 * @param {Array} data - Array of data objects to display in table rows
 *   Each object should have keys matching column accessorKeys
 *   Optionally include 'id' for unique row identification
 *
 * @param {Function} actions - Optional function that receives row data and returns action buttons/elements
 *
 * @example
 * const columns = [
 *   { header: "Name", accessorKey: "name" },
 *   { header: "Status", accessorKey: "status", render: (row) => <Badge>{row.status}</Badge> }
 * ];
 *
 * const data = [
 *   { id: 1, name: "John", status: "Active" },
 *   { id: 2, name: "Jane", status: "Inactive" }
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   actions={(row) => <button onClick={() => handleEdit(row)}>Edit</button>}
 * />
 */
const DataTable = ({ columns, data, actions }) => {
  // ============================================
  // EMPTY STATE HANDLING
  // ============================================
  // If data is undefined, null, or an empty array,
  // display a user-friendly empty state message
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No records found.</p>
      </div>
    );
  }

  // ============================================
  // MAIN TABLE RENDER
  // ============================================
  return (
    // Wrapper div with horizontal scroll for responsive design
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Main table element with full width and row dividers */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* ----------------------------------------
            TABLE HEADER SECTION
            Renders column headers from columns prop
        ---------------------------------------- */}
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {/* Map through columns array to create header cells */}
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}

            {/* Conditionally render Actions header if actions prop is provided */}
            {actions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* ----------------------------------------
            TABLE BODY SECTION
            Renders data rows from data prop
        ---------------------------------------- */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Iterate through each data row */}
          {data.map((row, rowIndex) => (
            <tr
              // Use row.id if available for better React reconciliation,
              // fallback to rowIndex if id is not present
              key={row.id || rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Render cells for each column in the current row */}
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                >
                  {/*
                   * Cell Content Rendering Logic:
                   * 1. If column has a custom 'render' function, use it for custom formatting
                   *    (useful for badges, formatted dates, custom components, etc.)
                   * 2. Otherwise, directly access the value using accessorKey
                   */}
                  {col.render ? col.render(row) : row[col.accessorKey]}
                </td>
              ))}

              {/* Conditionally render action buttons if actions prop is provided */}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Call actions function with current row data to render action buttons */}
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
