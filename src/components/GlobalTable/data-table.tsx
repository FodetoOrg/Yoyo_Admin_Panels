
import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Check,
  PlusCircle,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { addDays, format, subDays, subMonths } from "date-fns";
import { DataTableViewOptions } from './DataTableViewOptions';

// Updated DataTable Component
export function DataTable({ columns, data, filterFields, datePickers = [], hiddenColumns = [], isLoading = false, onMarkAsPaid }) {
  const [sorting, setSorting] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Initialize column visibility state
  const initialVisibility = {};
  hiddenColumns.forEach(col => {
    initialVisibility[col] = false;
  });
  const [columnVisibility, setColumnVisibility] = React.useState(initialVisibility);

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Process columns
  const processedColumns = React.useMemo(() => {
    if (typeof columns === 'function' && onMarkAsPaid) {
      return columns(onMarkAsPaid);
    }
    return columns;
  }, [columns, onMarkAsPaid]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <MobileToolbar 
        table={table} 
        filterFields={filterFields} 
        datePickers={datePickers}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isMobile={isMobile}
      />
      
      <div className="rounded-md border">
        {isLoading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        )}
        
        {/* Mobile: Horizontal scroll wrapper */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={processedColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <MobilePagination table={table} isMobile={isMobile} />
    </div>
  );
}

// Mobile-friendly Toolbar Component
function MobileToolbar({ table, filterFields, datePickers, globalFilter, setGlobalFilter, isMobile }) {
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const activeFiltersCount = table.getState().columnFilters.length;
  const isFiltered = activeFiltersCount > 0;

  const generateOptions = (columnId) => {
    const allRowsData = table.getCoreRowModel().flatRows;
    const values = Array.from(
      new Set(
        allRowsData.map((row) => row.getValue(columnId))
      )
    ).filter(Boolean);

    return values.map((value) => ({
      label: String(value),
      value: String(value),
    }));
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        
        {/* Filter Button */}
        <div className="flex items-center gap-2">
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1 py-0 text-xs min-w-[1.25rem] h-5"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-4">
                {/* Column Filters */}
                {filterFields.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <Label className="text-sm font-medium">Column Filters</Label>
                    {filterFields.map((field) => (
                      <MobileFilterDropdown
                        key={field}
                        column={table.getColumn(field)}
                        title={field}
                        options={generateOptions(field)}
                      />
                    ))}
                  </div>
                )}
                
                {/* Date Filters */}
                {datePickers.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <Label className="text-sm font-medium">Date Filters</Label>
                    {datePickers.map((field) => (
                      <MobileDateRangePicker
                        key={field}
                        field={field}
                        onDateRangeChange={(range) => {
                          if (range?.from && range?.to) {
                            table.getColumn(field)?.setFilterValue([range.from, range.to]);
                          } else {
                            table.getColumn(field)?.setFilterValue(undefined);
                          }
                        }}
                        currentFilter={table.getColumn(field)?.getFilterValue()}
                      />
                    ))}
                  </div>
                )}
                
                {/* Reset Button */}
                {isFiltered && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      table.resetColumnFilters();
                      setFilterSheetOpen(false);
                    }}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <MobileViewOptions table={table} />
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex items-center justify-between gap-2 overflow-auto p-1">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search here..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-8 w-40 lg:w-64"
        />

        {filterFields.length > 0 &&
          filterFields.map((field) => (
            <FilterDropDown
              key={field}
              column={table.getColumn(field)}
              title={field}
              options={generateOptions(field)}
            />
          ))}
        
        {datePickers.map((field) => (
          <DateRangePicker
            key={field}
            field={field}
            onDateRangeChange={(range) => {
              if (range?.from && range?.to) {
                table.getColumn(field)?.setFilterValue([range.from, range.to]);
              } else {
                table.getColumn(field)?.setFilterValue(undefined);
              }
            }}
            currentFilter={table.getColumn(field)?.getFilterValue()}
          />
        ))}
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <DataTableViewOptions table={table} />
    </div>
  );
}

// Mobile Filter Dropdown Component
function MobileFilterDropdown({ column, title, options }) {
  const selectedValues = new Set(column?.getFilterValue() || []);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm capitalize">{title}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">
              {selectedValues.size === 0
                ? `Select ${title}...`
                : selectedValues.size === 1
                ? Array.from(selectedValues)[0]
                : `${selectedValues.size} selected`}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${title}...`} />
            <CommandList className="max-h-[200px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        const newValues = new Set(selectedValues);
                        if (isSelected) {
                          newValues.delete(option.value);
                        } else {
                          newValues.add(option.value);
                        }
                        const filterValues = Array.from(newValues);
                        column?.setFilterValue(filterValues.length ? filterValues : undefined);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                        }`}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Mobile Date Range Picker Component
function MobileDateRangePicker({ field, onDateRangeChange, currentFilter }) {
  const [date, setDate] = React.useState();
  const [month, setMonth] = React.useState(new Date());

  // Sync with current filter
  React.useEffect(() => {
    if (currentFilter && Array.isArray(currentFilter)) {
      setDate({ from: new Date(currentFilter[0]), to: new Date(currentFilter[1]) });
    } else if (!currentFilter) {
      setDate(undefined);
    }
  }, [currentFilter]);

  const handleDateRangeChange = (newRange) => {
    setDate(newRange);
    onDateRangeChange(newRange);
  };

  const quickSelections = [
    { label: "Today", fn: () => ({ from: new Date(), to: new Date() }) },
    { label: "Yesterday", fn: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
    { label: "Last 7 days", fn: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 days", fn: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "This Month", fn: () => ({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() }) },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm capitalize">{field}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM d, yyyy")
                )
              ) : (
                `Select ${field}...`
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-3 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {quickSelections.map((selection, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateRangeChange(selection.fn())}
                  className="text-xs"
                >
                  {selection.label}
                </Button>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => handleDateRangeChange(undefined)}
                className="w-full"
              >
                Clear Date Filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Mobile View Options Component
function MobileViewOptions({ table }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Toggle Columns</Label>
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={(e) => column.toggleVisibility(e.target.checked)}
                  className="rounded border border-primary"
                />
                <Label className="text-sm capitalize truncate">{column.id}</Label>
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Mobile-friendly Pagination Component
function MobilePagination({ table, isMobile }) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
        </div>
      </div>
    );
  }

  // Desktop pagination (original)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Desktop Filter Dropdown (Fixed filtering issue)
function FilterDropDown({ column, title, options }) {
  const selectedValues = new Set(column?.getFilterValue() || []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newValues = new Set(selectedValues);
                      if (isSelected) {
                        newValues.delete(option.value);
                      } else {
                        newValues.add(option.value);
                      }
                      const filterValues = Array.from(newValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
                  >
                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                    }`}>
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Desktop Date Range Picker (Fixed reset issue)
function DateRangePicker({ field, onDateRangeChange, currentFilter }) {
  const [date, setDate] = React.useState();
  const [month, setMonth] = React.useState(new Date());

  // Sync with current filter
  React.useEffect(() => {
    if (currentFilter && Array.isArray(currentFilter)) {
      setDate({ from: new Date(currentFilter[0]), to: new Date(currentFilter[1]) });
    } else if (!currentFilter) {
      setDate(undefined);
    }
  }, [currentFilter]);

  const handleDateRangeChange = (newRange) => {
    setDate(newRange);
    onDateRangeChange(newRange);
  };

  const quickSelections = [
    { label: "Today", fn: () => ({ from: new Date(), to: new Date() }) },
    {
      label: "Yesterday",
      fn: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
    },
    {
      label: "Last 7 days",
      fn: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: "Last 14 days",
      fn: () => ({ from: subDays(new Date(), 14), to: new Date() }),
    },
    {
      label: "Last 30 days",
      fn: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
    {
      label: "This Week",
      fn: () => ({
        from: subDays(new Date(), new Date().getDay()),
        to: new Date(),
      }),
    },
    {
      label: "Last Week",
      fn: () => {
        const start = subDays(new Date(), new Date().getDay() + 7);
        return { from: start, to: addDays(start, 6) };
      },
    },
    {
      label: "This Month",
      fn: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      }),
    },
    {
      label: "Last Month",
      fn: () => {
        const start = subMonths(new Date(), 1);
        return {
          from: new Date(start.getFullYear(), start.getMonth(), 1),
          to: new Date(start.getFullYear(), start.getMonth() + 1, 0),
        };
      },
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className="max-w-[250px] justify-start text-left font-normal h-8"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM d, yyyy")} -{" "}
                {format(date.to, "MMM d, yyyy")}
              </>
            ) : (
              format(date.from, "MMM d, yyyy")
            )
          ) : (
            <span>Filter {field.charAt(0).toUpperCase() + field.slice(1)}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <div className="flex">
          <div className="p-3 border-r flex-1">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setMonth((prevMonth) => subMonths(prevMonth, 1))
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{format(month, "MMMM yyyy")}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setMonth((prevMonth) => addDays(prevMonth, 31))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              month={month}
              onMonthChange={setMonth}
              className="flex"
              showOutsideDays={false}
              fixedWeeks
            />
          </div>
          <div className="w-fit p-3">
            <div className="flex flex-col">
              {quickSelections.map((selection, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-fit justify-start font-normal"
                  onClick={() => handleDateRangeChange(selection.fn())}
                >
                  {selection.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 w-full border-t p-4">
          <Button
            variant="outline"
            onClick={() => {
              setDate(undefined);
              onDateRangeChange(undefined);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (date) onDateRangeChange(date);
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
