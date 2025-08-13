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

export interface Addon {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  status: "active" | "inactive";
  hotelId: string;
  hotel?: {
    id: string;
    name: string;
    city: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const columns: ColumnDef<Addon>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        AddOn Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "hotel.name",
    header: 'Hotel Name',
    // header: ({ column }) => (
    //   <Button
    //     variant="ghost"
    //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //   >
    //     Hotel Name
    //     <ArrowUpDown className="ml-2 h-4 w-4" />
    //   </Button>
    // ),
    cell: ({ row }) => {
      const addon = row.original;

      return <div className="font-medium">{addon.hotel?.name || 'N/A'}</div>
    },
  },
  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   cell: ({ row }) => row.getValue("description") || "—",
  // },
  {
    accessorKey: "hotelName",
    accessorFn: (row) => row.hotel?.name || "Unknown Hotel",
    header: "Hotel",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("hotelName")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={
            status === "active"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
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
      const addon = row.original;

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
              onClick={() => navigator.clipboard.writeText(addon.id)}
            >
              Copy Addon ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <a href={`/admin/addons/${addon.id}?hotelId=${addon.hotel?.id}`}>
              <DropdownMenuItem>Edit Addon</DropdownMenuItem>
            </a>
            {/* <a href={`/admin/addons/${addon.id}/details`}>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </a> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["name", "status", "hotelName"];
export const datePickers = ["createdAt"];