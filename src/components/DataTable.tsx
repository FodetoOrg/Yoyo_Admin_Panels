"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Column<T> = {
  accessorKey?: keyof T | string
  header: string
  // cell receives the row-like API we emulate lightly
  cell?: (ctx: { row: { original: T; getValue: (key: string) => any } }) => React.ReactNode
  id?: string
}

export function DataTable<T>({
  columns,
  data,
}: {
  columns: Column<T>[]
  data: T[]
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={col.id ?? String(i)} className="whitespace-nowrap">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((row, ri) => (
              <TableRow key={ri}>
                {columns.map((col, ci) => {
                  const getValue = (key: string) => (row as any)?.[key]
                  return (
                    <TableCell key={col.id ?? String(ci)} className="align-top">
                      {col.cell
                        ? col.cell({ row: { original: row, getValue } })
                        : typeof col.accessorKey === "string"
                          ? String(getValue(col.accessorKey) ?? "")
                          : ""}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
