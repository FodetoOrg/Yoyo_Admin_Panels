
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

interface WalletUsage {
  id: string;
  userId: string;
  bookingId: string;
  paymentId: string;
  amountUsed: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingReference: string;
  hotelName: string;
  paymentAmount: number;
  paymentMethod: string;
}

export const columns = (): ColumnDef<WalletUsage>[] => [
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{usage.userName}</div>
          <div className="text-sm text-muted-foreground">{usage.userPhone}</div>
          <div className="text-xs text-muted-foreground">{usage.userEmail}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingReference",
    header: "Booking",
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{usage.bookingReference}</div>
          <div className="text-sm text-muted-foreground">{usage.hotelName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "amountUsed",
    header: "Amount Used",
    cell: ({ row }) => (
      <div className="flex items-center font-medium text-red-600">
        <DollarSign className="mr-1 h-4 w-4" />
        ₹{row.getValue("amountUsed")}
      </div>
    ),
  },
  {
    accessorKey: "balanceBefore",
    header: "Balance Before",
    cell: ({ row }) => (
      <div className="font-medium">₹{row.getValue("balanceBefore")}</div>
    ),
  },
  {
    accessorKey: "balanceAfter",
    header: "Balance After",
    cell: ({ row }) => (
      <div className="font-medium">₹{row.getValue("balanceAfter")}</div>
    ),
  },
  {
    accessorKey: "paymentAmount",
    header: "Payment Total",
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">₹{usage.paymentAmount}</div>
          <Badge variant="outline" className="text-xs w-fit">
            {usage.paymentMethod}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const usage = row.original;

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
              onClick={() => window.location.href = `/admin/users/customers/${usage.userId}`}
            >
              <User className="mr-2 h-4 w-4" />
              View Customer
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => window.location.href = `/admin/payments/${usage.paymentId}`}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export const filterFields = [];

export const datePickers = [];