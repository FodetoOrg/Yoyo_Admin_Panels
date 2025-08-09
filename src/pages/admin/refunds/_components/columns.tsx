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
  processedAt: string | null;
  refundMethod: string;
  createdAt: string;
  bookingReference: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hotelName: string;
  originalPaymentAmount: number;
  originalPaymentMethod: string;
  cancellationFeeAmount?: number;
  expectedProcessingDays?: number;
  refundType?: string;
}

export const columns = (): ColumnDef<Refund>[] => [
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{refund.userName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{refund.userPhone || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{refund.userEmail || 'N/A'}</div>
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
          <div className="font-medium text-sm">{refund.bookingReference || refund.bookingId}</div>
          <div className="text-sm text-muted-foreground">{refund.hotelName || 'N/A'}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Refund Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="flex items-center font-medium text-red-600">
          <DollarSign className="mr-1 h-4 w-4" />
          ₹{amount?.toLocaleString() || '0'}
        </div>
      );
    },
  },
  {
    accessorKey: "originalPaymentAmount",
    header: "Original Amount",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">₹{refund.originalPaymentAmount?.toLocaleString() || '0'}</div>
          <Badge variant="outline" className="text-xs w-fit">
            {refund.originalPaymentMethod || 'online'}
          </Badge>
          {refund.cancellationFeeAmount && refund.cancellationFeeAmount > 0 && (
            <div className="text-xs text-muted-foreground">
              Fee: ₹{refund.cancellationFeeAmount}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <div className="max-w-[200px] truncate" title={reason || 'No reason provided'}>
          {reason || 'No reason provided'}
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
            status === "completed" ? "default" :
            status === "pending" ? "secondary" :
            status === "rejected" ? "destructive" : "outline"
          }
        >
          {status || 'unknown'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "refundMethod",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("refundMethod") as string;
      return (
        <Badge variant="outline">
          {method || 'N/A'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => {
      const dateStr = row.getValue("createdAt") as string;
      if (!dateStr) return <span className="text-muted-foreground">-</span>;
      
      const date = new Date(dateStr);
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "processedAt",
    header: "Processed",
    cell: ({ row }) => {
      const processedAt = row.getValue("processedAt") as string;
      if (!processedAt) {
        const refund = row.original;
        if (refund.status === "pending") {
          return (
            <div className="text-xs text-muted-foreground">
              Expected: {refund.expectedProcessingDays || 7} days
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      }

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
              onClick={() => {
                // Copy refund ID to clipboard
                navigator.clipboard.writeText(refund.id);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Copy Refund ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log('View refund details:', refund);
                // You can implement a modal or navigation here
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log('View customer:', refund.userName);
                // You can implement customer view here
              }}
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