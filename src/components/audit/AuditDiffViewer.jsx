const AuditDiffViewer = ({ oldVal, newVal }) => {
  const renderDiff = (obj1, obj2) => {
    return Object.entries(obj1).map(([key, val]) => (
      <div key={key} className="mb-2">
        <div className="font-medium">{key}:</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded">
            <div className="text-xs text-red-500 dark:text-red-300">Old:</div>
            <pre className="text-sm">{JSON.stringify(val, null, 2)}</pre>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded">
            <div className="text-xs text-green-500 dark:text-green-300">
              New:
            </div>
            <pre className="text-sm">{JSON.stringify(obj2[key], null, 2)}</pre>
          </div>
        </div>
      </div>
    ));
  };

  return <div className="mt-4">{renderDiff(oldVal, newVal)}</div>;
};

export default AuditDiffViewer;
