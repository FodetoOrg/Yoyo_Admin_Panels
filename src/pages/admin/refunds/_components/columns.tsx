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
  userId?: string;
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
    header: "Customer & Booking",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{refund.userName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{refund.userPhone || 'N/A'}</div>
          <div className="text-xs text-muted-foreground">{refund.userEmail || 'N/A'}</div>
          <div className="text-xs font-mono text-muted-foreground">
            Booking: {refund.bookingReference || refund.bookingId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Financial Details",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center font-medium text-red-600">
            <DollarSign className="mr-1 h-4 w-4" />
            ₹{refund.amount?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-muted-foreground">
            Original: ₹{refund.originalPaymentAmount?.toLocaleString() || '0'}
          </div>
          
          <Badge variant="outline" className="text-xs w-fit">
            {refund.originalPaymentMethod || 'online'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "hotelName",
    header: "Hotel & Method",
    cell: ({ row }) => {
      const refund = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium text-sm">{refund.hotelName || 'N/A'}</div>
          <Badge variant="outline" className="text-xs w-fit">
            {refund.refundMethod || 'N/A'}
          </Badge>
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
          className={
            status === "completed"
              ? "bg-green-500 text-white"
              : status === "pending"
                ? "bg-yellow-500 text-white"
                : status === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-gray-500 text-white"
          }
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Timeline",
    cell: ({ row }) => {
      const refund = row.original;
      const createdAt = new Date(refund.createdAt);
      const processedAt = refund.processedAt ? new Date(refund.processedAt) : null;
      
      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
            <div className="text-xs">
              {createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          {processedAt ? (
            <div className="text-xs text-green-600">
              Processed: {processedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          ) : refund.status === "pending" ? (
            <div className="text-xs text-yellow-600">
              Expected: {refund.expectedProcessingDays || 7} days
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    id: "quickActions",
    header: "Quick Actions",
    cell: ({ row }) => {
      const refund = row.original;

      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/bookings/${refund.bookingId}`, '_blank')}
            disabled={!refund.bookingId}
          >
            View Booking
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/users/customers/${refund.userId}`, '_blank')}
            disabled={!refund.userId}
          >
            View Customer
          </Button>
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

export const filterFields = ["status", "refundMethod", "userName", "userPhone", "userEmail", "hotelName", "reason"];

export const datePickers = [];