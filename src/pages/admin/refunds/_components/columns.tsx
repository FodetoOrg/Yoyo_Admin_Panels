
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

export interface Refund {
  id: string;
  refund_amount: number;
  refund_reason: string;
  refund_type: string;
  status: "pending" | "processed" | "rejected";
  customer_name: string;
  customer_phone: string;
  booking_id: string;
  created_at: string;
  processed_at?: string;
  hotel_name?: string;
}

export const columns: ColumnDef<Refund>[] = [
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
    header: "Refund ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "customer_name",
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
      <div>
        <div className="font-medium">{row.getValue("customer_name")}</div>
        <div className="text-sm text-muted-foreground">{row.original.customer_phone}</div>
      </div>
    ),
  },
  {
    accessorKey: "booking_id",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("booking_id")}</div>
    ),
  },
  {
    accessorKey: "refund_amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("refund_amount"));
      return <div className="text-right font-medium">₹{amount}</div>;
    },
  },
  {
    accessorKey: "refund_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("refund_type")}
      </Badge>
    ),
  },
  {
    accessorKey: "refund_reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("refund_reason")}>
        {row.getValue("refund_reason")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "processed"
              ? "default"
              : status === "rejected"
              ? "destructive"
              : "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "hotel_name",
    header: "Hotel",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("hotel_name")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const refund = row.original;
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
              onClick={() => navigator.clipboard.writeText(refund.id)}
            >
              Copy refund ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(`/admin/refunds/${refund.id}`, '_blank')}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/admin/users/customers/${refund.customer_name}`, '_blank')}
            >
              View customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Processed", value: "processed" },
      { label: "Rejected", value: "rejected" },
    ],
  },
  {
    id: "refund_type",
    title: "Type",
    options: [
      { label: "Cancellation", value: "cancellation" },
      { label: "Service Issue", value: "service_issue" },
      { label: "Technical Issue", value: "technical_issue" },
    ],
  },
];

export const datePickers = [
  {
    id: "created_at",
    title: "Created Date",
  },
];
