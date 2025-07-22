"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Clock, Calendar } from "lucide-react";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface Room {
  id: string;
  hotelId: string;
  roomNumber?: string;
  name: string;
  type?: string;
  description?: string;
  capacity: number;
  maxGuests?: number;
  bedType?: string;
  size?: number;
  pricePerNight: number;
  pricePerHour?: number;
  isHourlyBooking?: boolean;
  isDailyBooking?: boolean;
  amenities?: string[];
  images?: Array<{ id: string; url: string; isPrimary: boolean }>;
  status?: "available" | "occupied" | "maintenance" | "out_of_order";
  floor?: number;
  roomTypeId?: string;
  roomType?: { id: string; name: string; description?: string };
  hotel?: { id: string; name: string; city: string; address: string };
  createdAt?: Date | string;
  updatedAt?: Date | string;
  hotelName?: string;
  roomTypeName?: string;
}

export const getColumns = (
  onStatusChange?: (roomId: string, status: string) => void,
  onBookingAvailabilityChange?: (roomId: string, type: 'hourly' | 'daily', value: boolean) => void,
  onDeleteRoom?: (roomId: string) => void,
  isSuperAdmin?: boolean
): ColumnDef<Room>[] => [
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
  ...(isSuperAdmin ? [{
    accessorKey: "hotelName",
    accessorFn: (row: Room) => row.hotel?.name || row.hotelName || "Unknown",
    header: "Hotel",
    cell: ({ row }: { row: any }) => (
      <div className="font-medium">{row.getValue("hotelName")}</div>
    ),
  }] : []),
  {
    accessorKey: "roomTypeName",
    accessorFn: (row) => row.roomType?.name || row.roomTypeName || row.type || "N/A",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("roomTypeName") as string;
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
    accessorKey: "pricePerNight",
    header: "Price/Night",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("pricePerNight"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
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
        currency: "INR",
      }).format(price);
    },
  },
  {
    accessorKey: "status",
    accessorFn: (row) => row.status || "available",
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
    accessorKey: "bookingOptions",
    header: "Booking Options",
    cell: ({ row }) => {
      const room = row.original;
      return (
        <div className="flex gap-1">
          {room.isHourlyBooking && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Hourly
            </Badge>
          )}
          {room.isDailyBooking && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              Daily
            </Badge>
          )}
          {!room.isHourlyBooking && !room.isDailyBooking && (
            <span className="text-muted-foreground text-xs">None</span>
          )}
        </div>
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
          <DropdownMenuContent align="end" className="w-56">
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
            
            <a href={`/admin/rooms/${room.id}/addons`}>
              <DropdownMenuItem>
                <Tag className="mr-2 h-4 w-4" />
                Map Addons
              </DropdownMenuItem>
            </a>
                Edit Room
              </DropdownMenuItem>
            </a>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  onClick={() => onStatusChange && onStatusChange(room.id, "available")}
                  className="text-green-600"
                >
                  Mark Available
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange && onStatusChange(room.id, "occupied")}
                  className="text-blue-600"
                >
                  Mark Occupied
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange && onStatusChange(room.id, "maintenance")}
                  className="text-yellow-600"
                >
                  Mark Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange && onStatusChange(room.id, "out_of_order")}
                  className="text-red-600"
                >
                  Mark Out of Order
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clock className="mr-2 h-4 w-4" />
                Booking Options
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  onClick={() => onBookingAvailabilityChange && onBookingAvailabilityChange(room.id, 'hourly', !room.isHourlyBooking)}
                >
                  {room.isHourlyBooking ? (
                    <>
                      <ToggleRight className="mr-2 h-4 w-4 text-green-500" />
                      Disable Hourly
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="mr-2 h-4 w-4 text-gray-400" />
                      Enable Hourly
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onBookingAvailabilityChange && onBookingAvailabilityChange(room.id, 'daily', !room.isDailyBooking)}
                >
                  {room.isDailyBooking ? (
                    <>
                      <ToggleRight className="mr-2 h-4 w-4 text-green-500" />
                      Disable Daily
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="mr-2 h-4 w-4 text-gray-400" />
                      Enable Daily
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => onDeleteRoom && onDeleteRoom(room.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "roomTypeName", "floor", "hotelName"];
export const datePickers = ["createdAt"];