import { FiDownload } from 'react-icons/fi';
import { utils, writeFile } from 'xlsx';
import { unparse } from 'papaparse';

const ExportButton = ({ data, fileName, fileType = 'csv' }) => {
  const exportData = () => {
    if (fileType === 'csv') {
      const csv = unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
    } else if (fileType === 'excel') {
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Sheet1");
      writeFile(wb, `${fileName}.xlsx`);
    }
  };

  return (
    <button
      onClick={exportData}
      className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
    >
      <FiDownload /> Export as {fileType.toUpperCase()}
    </button>
  );
};

export default ExportButton;