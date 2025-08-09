"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, User, DollarSign, Calendar } from "lucide-react";

interface Refund {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
  processedAt: string;
  refundMethod: string;
  createdAt: string;
  bookingReference: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hotelName: string;
  originalPaymentAmount: number;
  originalPaymentMethod: string;
}

export const columns = (): ColumnDef<Refund>[] => [
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{refund.userName}</div>
          <div className="text-sm text-muted-foreground">{refund.userPhone}</div>
          <div className="text-xs text-muted-foreground">{refund.userEmail}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingReference",
    header: "Booking",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{refund.bookingReference}</div>
          <div className="text-sm text-muted-foreground">{refund.hotelName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Refund Amount",
    cell: ({ row }) => (
      <div className="flex items-center font-medium text-red-600">
        <DollarSign className="mr-1 h-4 w-4" />
        ₹{row.getValue("amount")}
      </div>
    ),
  },
  {
    accessorKey: "originalPaymentAmount",
    header: "Original Amount",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">₹{refund.originalPaymentAmount}</div>
          <Badge variant="outline" className="text-xs w-fit">
            {refund.originalPaymentMethod}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("reason")}>
        {row.getValue("reason")}
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
            status === "completed" ? "default" :
            status === "pending" ? "secondary" :
            status === "rejected" ? "destructive" : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "refundMethod",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("refundMethod")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "processedAt",
    header: "Processed",
    cell: ({ row }) => {
      const processedAt = row.getValue("processedAt") as string;
      if (!processedAt) return <span className="text-muted-foreground">-</span>;

      const date = new Date(processedAt);
      return (
        <div className="text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.location.href = `/admin/refunds/${refund.id}`}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.location.href = `/admin/users/customers/${refund.userName}`}
            >
              <User className="mr-2 h-4 w-4" />
              View Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];