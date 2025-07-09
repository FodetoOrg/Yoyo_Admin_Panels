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

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  priceIncreasePercentage?: number;
  applicableTo: {
    cities: string[];
    hotels: string[];
    roomTypes: string[];
  };
  status: "active" | "inactive" | "expired";
  createdAt: Date;
}

export const columns: ColumnDef<Coupon>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Coupon Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    accessorKey: "discountType",
    header: "Discount Type",
    cell: ({ row }) => {
      const type = row.getValue("discountType") as string;
      const value = row.original.discountValue;
      return (
        <div>
          {type === "percentage" ? `${value}%` : `$${value}`}
        </div>
      );
    },
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
    cell: ({ row }) => {
      const date = new Date(row.getValue("validFrom"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
    cell: ({ row }) => {
      const date = new Date(row.getValue("validTo"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "usedCount",
    header: "Usage",
    cell: ({ row }) => {
      const used = row.getValue("usedCount") as number;
      const limit = row.original.usageLimit;
      return limit ? `${used}/${limit}` : used.toString();
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
            status === "active"
              ? "default"
              : status === "expired"
              ? "destructive"
              : "secondary"
          }
          className={
            status === "active"
              ? "bg-green-500 text-white"
              : status === "expired"
              ? "bg-red-500 text-white"
              : "bg-gray-500 text-white"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const coupon = row.original;

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
              onClick={() => navigator.clipboard.writeText(coupon.code)}
            >
              Copy Coupon Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <a href={`/admin/coupons/${coupon.id}`}>
              <DropdownMenuItem>Edit Coupon</DropdownMenuItem>
            </a>
            <a href={`/admin/coupons/${coupon.id}/mapping`}>
              <DropdownMenuItem>Manage Mapping</DropdownMenuItem>
            </a>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const filterFields = ["status", "discountType"];
export const datePickers = ["validFrom", "validTo", "createdAt"];