"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye, User } from "lucide-react";
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
    header: "Transaction Details",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(row.original.transactionDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer & Booking
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.user.phone}</div>
        <div className="text-xs text-muted-foreground font-mono">
          Booking: {row.original.bookingId}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Payment Info",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: currency,
            }).format(amount)}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.paymentMode}
          </div>
        </div>
      );
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
    id: "quickActions",
    header: "Quick Actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex space-x-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/bookings/${payment.bookingId}`)}
          >
            Booking
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/users/customers/${payment.user.id}`)}
          >
            Customer
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
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
            <a href={`/admin/payments/${payment.id}`}>
              <DropdownMenuItem>View Payment Details</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Download Receipt</DropdownMenuItem>
            {payment.status === "successful" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Process Refund
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "paymentMethod"];
export const datePickers = ["transactionDate"];