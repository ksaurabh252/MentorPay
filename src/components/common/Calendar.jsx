
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Calendar = ({ selected, onSelect, ...props }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onSelect}
      inline
      {...props}
    />
  );
};