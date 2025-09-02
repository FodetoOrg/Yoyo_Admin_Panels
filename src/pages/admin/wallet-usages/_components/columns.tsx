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
import { MoreHorizontal, Eye, User, DollarSign, Calendar, ArrowUpDown } from "lucide-react";

interface WalletUsage {
  id: string;
  userId: string;
  source: string;
  amountUsed: number;
  refrenceType: string;
  refrenceId: string;
  createdAt: string;
  userName: string | null;
  userEmail: string;
  userPhone: string;
}

export const columns = (): ColumnDef<WalletUsage>[] => [
  {
    accessorKey: "userPhone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">
            {usage.userName || "Unknown User"}
          </div>
          <div className="text-sm text-muted-foreground">{usage.userPhone}</div>
          {usage.userEmail && (
            <div className="text-xs text-muted-foreground">{usage.userEmail}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      return (
        <Badge
          variant={source === "payment" ? "default" : "secondary"}
          className={source === "payment" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
        >
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "refrenceType",
    header: "Reference",
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium capitalize">{usage.refrenceType}</div>
          <div className="text-xs text-muted-foreground font-mono">
            {usage.refrenceId.slice(0, 8)}...
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amountUsed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount Used
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const usage = row.original;
      return (
        <div className={`flex items-center font-medium ${usage.source === "payment" ? "text-red-600" : "text-green-600"
          }`}>
          <DollarSign className="mr-1 h-4 w-4" />
          ₹{usage.amountUsed.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "quickActions",
    header: "Quick Actions",
    cell: ({ row }) => {
      const usage = row.original;

      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => {
              if (usage.refrenceType === "payment") {
                window.open(`/admin/payments/${usage.refrenceId}`, '_blank');
              } else if (usage.refrenceType === "booking") {
                window.open(`/admin/bookings/${usage.refrenceId}`, '_blank');
              }
            }}
            disabled={!usage.refrenceId}
          >
            View {usage.refrenceType === "payment" ? "Payment" : "Booking"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/users/customers/${usage.userId}`, '_blank')}
            disabled={!usage.userId}
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
              onClick={() => {
                if (usage.refrenceType === "payment") {
                  window.location.href = `/admin/payments/${usage.refrenceId}`;
                } else if (usage.refrenceType === "booking") {
                  window.location.href = `/admin/bookings/${usage.refrenceId}`;
                }
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View {usage.refrenceType === "payment" ? "Payment" : "Booking"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["source", "refrenceType", "userName", "userPhone", "userEmail"];

export const datePickers = [];