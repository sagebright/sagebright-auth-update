
import React from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface UserTableFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const UserTableFilters: React.FC<UserTableFiltersProps> = ({ onFilterChange }) => {
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [searchTerm, setSearchTerm] = React.useState('');

  // Mock departments for the demo
  const availableDepartments = [
    'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Operations'
  ];

  const availableStatuses = [
    'All', 'Completed', 'In Progress', 'Not Started', 'Overdue'
  ];

  const handleDepartmentChange = (value: string) => {
    if (value === 'all') {
      setDepartments([]);
    } else if (!departments.includes(value)) {
      setDepartments([...departments, value]);
    }
    updateFilters();
  };

  const handleRemoveDepartment = (dept: string) => {
    setDepartments(departments.filter(d => d !== dept));
    updateFilters();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === 'All' ? null : value);
    updateFilters();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateFilters();
  };

  const updateFilters = () => {
    onFilterChange({
      departments,
      status,
      dateRange,
      searchTerm
    });
  };

  const handleDateRangeSelect = (range: any) => {
    setDateRange(range);
    updateFilters();
  };

  const clearFilters = () => {
    setDepartments([]);
    setStatus(null);
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm('');
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {availableDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {availableStatuses.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {(departments.length > 0 || status || dateRange.from || searchTerm) && (
            <Button variant="ghost" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {departments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <Badge key={dept} variant="outline" className="flex items-center gap-1">
              {dept}
              <button onClick={() => handleRemoveDepartment(dept)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
