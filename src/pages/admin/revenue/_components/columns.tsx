"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, DollarSign, Check } from "lucide-react";
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

export interface RevenueRecord {
  id: string;
  hotelId: string;
  period: string;
  totalRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  payableAmount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: Date | string;
  paidDate?: Date | string;
  createdAt: Date | string;
  hotel: {
    id: string;
    name: string;
    city: string;
    commissionRate: number;
  };
}

export const columns = (onMarkAsPaid?: (id: string) => void): ColumnDef<RevenueRecord>[] => [
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
    accessorKey: "hotelName",
    accessorFn: (row) => row.hotel?.name || "Unknown",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Hotel Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("hotelName")}</div>
    ),
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => row.getValue("period"),
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalRevenue"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "commissionRate",
    header: "Commission Rate",
    cell: ({ row }) => `${row.getValue("commissionRate")}%`,
  },
  {
    accessorKey: "commissionAmount",
    header: "Commission Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("commissionAmount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "payableAmount",
    header: "Payable Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("payableAmount"));
      return (
        <div className="font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)}
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
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;

      const handleMarkAsPaid = () => {
        console.log(`Marking ${record.id} as paid`);
        // API call to mark as paid
      };
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
              onClick={() => navigator.clipboard.writeText(record.id)}
            >
              Copy Record ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {record.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => window.open(`/admin/revenue/${record.id}/pay`, '_blank')}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Initiate Payment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMarkAsPaid && onMarkAsPaid(record.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Paid
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "hotelName"];
export const datePickers = ["dueDate", "createdAt"];