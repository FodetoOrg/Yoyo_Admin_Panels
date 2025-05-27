"use client";

import * as React from "react";

import { CrossIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils/utils.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterDropDown } from "./FilterDropDown.tsx";
import { DataTableViewOptions } from "./DataTableViewOptions.tsx";
import { DateRangePicker } from "./DateRangePicker.tsx";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: any;
  datePickers?:[]
}

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ElementType;
  count?: number;
}

export function TableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  datePickers=[],
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const generateOptions = (columnId: string): FilterOption[] => {
    const values = Array.from(
      new Set(
        table
          .getCoreRowModel()
          .flatRows.map((row) => row.getValue(columnId) as string)
      )
    );

    return Array.from(values.entries()).map(([count, value]) => {
      return {
        label: value,
        value: String(value),
      };
    });
  };

  return (
    <div
      className={cn(
        "flex w-full items-center  justify-between gap-2 overflow-auto p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        <Input
          key={String("sample")}
          placeholder={"search here "}
          onChange={(event) =>
            // table
            //   .getColumn(String(column.id))
            //   ?.setFilterValue(event.target.value)
            table.setGlobalFilter(event.target.value)
          }
          className="h-8 w-40 lg:w-64"
        />

        {filterFields.length > 0 &&
          filterFields.map(
            (column) =>
              table.getColumn(column ? String(column) : "") && (
                <FilterDropDown
                  key={String(column)}
                  column={table.getColumn(column ? String(column) : "")}
                  title={column ? String(column) : ""}
                  options={generateOptions(column)}
                />
              )
          )}
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
          />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <CrossIcon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
