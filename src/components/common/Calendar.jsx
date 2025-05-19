import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Calendar = ({ selected, onSelect, ...props }) => {
  const safeDate = selected instanceof Date && !isNaN(selected) ? selected : null;

  return (
    <DatePicker
      selected={safeDate}
      onChange={onSelect}
      inline
      {...props}
    />
  );
};