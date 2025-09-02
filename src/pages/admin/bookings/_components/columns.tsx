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
    header: "Booking Details",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(row.original.bookingDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user.phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Guest & Property
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.user?.name || row.original.user?.phone}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.hotel.name}
        </div>
        
      </div>
    ),
  },
  {
    accessorKey: "checkInDate",
    header: "Stay Period",
    cell: ({ row }) => {
      const checkIn = new Date(row.getValue("checkInDate"));
      const checkOut = new Date(row.original.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {checkIn.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} - {checkOut.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {nights} night{nights !== 1 ? 's' : ''} • {row.original.guestCount} guest{row.original.guestCount !== 1 ? 's' : ''}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Financial",
    cell: ({ row }) => {
      const totalAmount = Number(row.getValue("totalAmount"));
      const commissionAmount = Number(row.original.commissionAmount);
      
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalAmount)}
          </div>
          <div className="text-xs text-muted-foreground">
            Commission: {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(commissionAmount)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const bookingStatus = row.getValue("status") as string;
      const paymentStatus = row.original.paymentStatus as string;
      
      return (
        <div className="space-y-2 flex flex-col gap-2">
          <Badge
            variant={
              bookingStatus === "confirmed"
                ? "default"
                : bookingStatus === "pending"
                  ? "secondary"
                  : bookingStatus === "cancelled"
                    ? "destructive"
                    : "outline"
            }
            className={
              bookingStatus === "confirmed"
                ? "bg-green-500 text-white"
                : bookingStatus === "pending"
                  ? "bg-yellow-500 text-white"
                  : bookingStatus === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
            }
          >
            {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
          </Badge>
          <Badge
            variant={
              paymentStatus === "paid"
                ? "default"
                : paymentStatus === "pending"
                  ? "secondary"
                  : "destructive"
            }
            className={`text-xs ${
              paymentStatus === "paid"
                ? "bg-green-100 text-green-800 border-green-300"
                : paymentStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            Payment: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "quickActions",
    header: "Quick Actions",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/hotels/${booking.hotel.id}/details`, '_blank')}
          >
            Hotel Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-black text-white hover:bg-gray-800 border-black"
            onClick={() => window.open(`/admin/users/customers/${booking.user.id}`, '_blank')}
          >
            Customer Details
          </Button>
        </div>
      );
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
          
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "paymentStatus", "hotel.name", "user.name", "user.phone"];
export const datePickers = [];