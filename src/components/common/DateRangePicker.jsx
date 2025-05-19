import { useState } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Calendar } from './Calendar';
import { Button } from './Button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DateRangePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: value?.startDate || new Date(),
    endDate: value?.endDate || new Date(),
  });

  const handleApply = () => {
    // Validate dates
    if (!dateRange.startDate || !dateRange.endDate) {
      console.error('Please select both start and end dates');
      return;
    }

    if (isNaN(dateRange.startDate.getTime())) {
      console.error('Invalid start date');
      return;
    }

    if (isNaN(dateRange.endDate.getTime())) {
      console.error('Invalid end date');
      return;
    }

    // Call the onChange callback with the selected range
    onChange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
    setOpen(false);
  };

  const handleQuickSelect = (days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const newRange = { startDate, endDate };

    setDateRange(newRange);
    onChange(newRange); // Immediately apply quick select changes
  };

  const handleDayNavigation = (direction) => {
    const adjustment = direction === 'prev' ? -1 : 1;
    const newRange = {
      startDate: addDays(dateRange.startDate, adjustment),
      endDate: addDays(dateRange.endDate, adjustment)
    };
    setDateRange(newRange);
  };

  const handleCalendarSelect = (range) => {
    if (range?.from && range?.to) {
      setDateRange({
        startDate: range.from,
        endDate: range.to
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.startDate ? (
                dateRange.endDate ? (
                  <>
                    {format(dateRange.startDate, 'MMM dd, yyyy')} -{' '}
                    {format(dateRange.endDate, 'MMM dd, yyyy')}
                  </>
                ) : (
                  format(dateRange.startDate, 'MMM dd, yyyy')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            {/* Date navigation */}
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDayNavigation('prev')}
              >
                <FaChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-sm font-medium">
                {format(dateRange.startDate, 'MMM yyyy')}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDayNavigation('next')}
              >
                <FaChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Calendar */}
              <div>
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.startDate,
                    to: dateRange.endDate,
                  }}
                  onSelect={handleCalendarSelect}
                  className="rounded-md border"
                />
              </div>

              {/* Quick select options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Quick Select</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSelect(7)}
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSelect(15)}
                    >
                      Last 15 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSelect(30)}
                    >
                      Last 30 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSelect(90)}
                    >
                      Last 90 days
                    </Button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CalendarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default DateRangePicker;