"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
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

export interface Room {
  id: string;
  hotelId: string;
  roomNumber?: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  bedType?: string;
  size?: number;
  pricePerNight: number;
  pricePerHour?: number;
  isHourlyBooking?: boolean;
  isDailyBooking?: boolean;
  amenities?: string[];
  images?: string[];
  status?: "available" | "occupied" | "maintenance" | "out_of_order";
  floor?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  maxGuests?: number;
  roomType?: string;
  available?: boolean;
}

export const getColumns = (onStatusChange?: (roomId: string, hotelId: string, status: string) => void): ColumnDef<Room>[] => [
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
    accessorKey: "roomNumber",
    accessorFn: (row) => row.roomNumber || "N/A",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Room #
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("roomNumber")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Room Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant="outline" className="capitalize">
          {type.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "capacity",
    accessorFn: (row) => row.capacity || row.maxGuests || 0,
    header: "Capacity",
    cell: ({ row }) => `${row.getValue("capacity")} guests`,
  },
  {
    accessorKey: "bedType",
    accessorFn: (row) => row.bedType || "N/A",
    header: "Bed Type",
    cell: ({ row }) => row.getValue("bedType"),
  },
  {
    accessorKey: "size",
    accessorFn: (row) => row.size || 0,
    header: "Size",
    cell: ({ row }) => `${row.getValue("size")} sq ft`,
  },
  {
    accessorKey: "pricePerNight",
    header: "Price/Night",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("pricePerNight"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    },
  },
  {
    accessorKey: "pricePerHour",
    header: "Price/Hour",
    cell: ({ row }) => {
      const price = row.getValue("pricePerHour") as number;
      if (!price) return "—";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    },
  },
  {
    accessorKey: "status",
    accessorFn: (row) => row.status || (row.available ? "available" : "occupied"),
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "available"
              ? "default"
              : status === "occupied"
              ? "secondary"
              : status === "maintenance"
              ? "outline"
              : "destructive"
          }
          className={
            status === "available"
              ? "bg-green-500 text-white"
              : status === "occupied"
              ? "bg-blue-500 text-white"
              : status === "maintenance"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-white"
          }
        >
          {status.replace("_", " ").toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "floor",
    accessorFn: (row) => row.floor || 1,
    header: "Floor",
    cell: ({ row }) => `Floor ${row.getValue("floor")}`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original;

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
              onClick={() => navigator.clipboard.writeText(room.id)}
            >
              Copy Room ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <a href={`/admin/rooms/${room.id}`}>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </a>
            <a href={`/admin/rooms/${room.id}/edit`}>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Room
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleStatusChange("available")}>
            <DropdownMenuItem onClick={() => onStatusChange && onStatusChange(room.id, room.hotelId, "available")}>
              Mark Available
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange && onStatusChange(room.id, room.hotelId, "occupied")}>
              Mark Occupied
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange && onStatusChange(room.id, room.hotelId, "maintenance")}>
              Mark Maintenance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange && onStatusChange(room.id, room.hotelId, "out_of_order")}>
              Mark Out of Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "type", "floor"];
export const datePickers = ["createdAt"];