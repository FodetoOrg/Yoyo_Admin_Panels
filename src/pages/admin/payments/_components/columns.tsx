"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: "successful" | "failed" | "pending" | "refunded";
  paymentMethod: string;
  transactionDate: Date;
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("user.name")}</div>
    ),
  },
  {
    accessorKey: "bookingId",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("bookingId")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Payment Method",
    cell: ({ row }) => row.getValue("paymentMode"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "successful"
              ? "default"
              : status === "pending"
              ? "secondary"
              : status === "failed"
              ? "destructive"
              : "outline"
          }
          className={
            status === "successful"
              ? "bg-green-500 text-white"
              : status === "pending"
              ? "bg-yellow-500 text-white"
              : status === "failed"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: "Transaction Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("transactionDate"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length !== 2) return true;
      const [start, end] = filterValue;
      const rowDate = new Date(row.getValue(id));
      return rowDate >= start && rowDate <= end;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {payment.status === "successful" && (
              <DropdownMenuItem>Process Refund</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "paymentMethod"];
export const datePickers = ["transactionDate"];