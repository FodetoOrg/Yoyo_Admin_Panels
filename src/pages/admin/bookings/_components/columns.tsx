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
import type { Booking } from "@/lib/types";

export const columns: ColumnDef<Booking>[] = [
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
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Guest Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "hotelName",
    header: "Hotel",
    cell: ({ row }) => row.getValue("hotelName"),
  },
  {
    accessorKey: "roomName",
    header: "Room",
    cell: ({ row }) => row.getValue("roomName"),
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkIn"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkOut"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "guests",
    header: "Guests",
    cell: ({ row }) => row.getValue("guests"),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "confirmed"
              ? "default"
              : status === "pending"
              ? "secondary"
              : status === "cancelled"
              ? "destructive"
              : "outline"
          }
          className={
            status === "confirmed"
              ? "bg-green-500 text-white"
              : status === "pending"
              ? "bg-yellow-500 text-white"
              : status === "cancelled"
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
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          variant={
            status === "paid"
              ? "default"
              : status === "pending"
              ? "secondary"
              : "destructive"
          }
          className={
            status === "paid"
              ? "bg-green-500 text-white"
              : status === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-white"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
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
      const booking = row.original;

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
              onClick={() => navigator.clipboard.writeText(booking.id)}
            >
              Copy Booking ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <a href={`/admin/bookings/${booking.id}`}>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "paymentStatus", "hotelName"];
export const datePickers = ["checkIn", "checkOut", "createdAt"];