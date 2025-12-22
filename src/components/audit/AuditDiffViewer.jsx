/**
 * AuditDiffViewer Component
 *
 * A visual diff viewer component that displays side-by-side comparison
 * of old and new values for audit trail purposes.
 *
 * Features:
 * - Side-by-side comparison view (old vs new)
 * - Color-coded display (red for old, green for new)
 * - JSON formatting for complex objects
 * - Dark mode support
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.oldVal - The original/previous value object
 * @param {Object} props.newVal - The updated/new value object
 *
 * @example
 * // Usage in an audit log component
 * const oldData = { name: "John", age: 25 };
 * const newData = { name: "John Doe", age: 26 };
 *
 * <AuditDiffViewer oldVal={oldData} newVal={newData} />
 */
const AuditDiffViewer = ({ oldVal, newVal }) => {
  // ============================================
  // DIFF RENDERING FUNCTION
  // ============================================

  /**
   * Renders a visual diff between two objects
   *
   * Process:
   * 1. Iterates through all keys in the old object (obj1)
   * 2. For each key, displays the old and new values side-by-side
   * 3. Old values shown in red background, new values in green
   *
   * Note: This function only iterates over keys present in obj1.
   * Keys that exist only in obj2 (newly added fields) won't be shown.
   * Consider extending this if you need to handle added/removed fields.
   *
   * @param {Object} obj1 - The old/original object
   * @param {Object} obj2 - The new/updated object
   * @returns {JSX.Element[]} Array of diff view elements for each key
   */
  const renderDiff = (obj1, obj2) => {
    return Object.entries(obj1).map(([key, val]) => (
      // Container for each field's diff view
      <div key={key} className="mb-2">
        {/* Field name/key label */}
        <div className="font-medium">{key}:</div>

        {/* Side-by-side comparison grid (2 columns) */}
        <div className="grid grid-cols-2 gap-4">
          {/* ----------------------------------------
              OLD VALUE COLUMN
              Displayed with red background to indicate removal/change
          ---------------------------------------- */}
          <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded">
            {/* Label for old value */}
            <div className="text-xs text-red-500 dark:text-red-300">Old:</div>
            {/* 
              Formatted JSON output of old value
              - JSON.stringify with null, 2 for pretty printing
              - <pre> tag preserves whitespace and formatting
            */}
            <pre className="text-sm">{JSON.stringify(val, null, 2)}</pre>
          </div>

          {/* ----------------------------------------
              NEW VALUE COLUMN
              Displayed with green background to indicate addition/change
          ---------------------------------------- */}
          <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded">
            {/* Label for new value */}
            <div className="text-xs text-green-500 dark:text-green-300">
              New:
            </div>
            {/* 
              Formatted JSON output of new value
              - Access new value using same key from obj2
              - Handles undefined gracefully (shows "undefined" string)
            */}
            <pre className="text-sm">{JSON.stringify(obj2[key], null, 2)}</pre>
          </div>
        </div>
      </div>
    ));
  };

  // ============================================
  // COMPONENT RENDER
  // ============================================

  /**
   * Main render output
   * - Calls renderDiff to generate comparison view
   */
  return <div className="mt-4">{renderDiff(oldVal, newVal)}</div>;
};

export default AuditDiffViewer;
