
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
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight, Clock, DollarSign } from "lucide-react";

interface HourlyStay {
  id: string;
  roomId: string;
  hours: number;
  price: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ColumnsProps {
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  roomId: string;
}

export const columns = ({ onDelete, onToggleActive, roomId }: ColumnsProps): ColumnDef<HourlyStay>[] => [
  {
    accessorKey: "name",
    header: "Package Name",
    cell: ({ row }) => {
      const stay = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{stay.name}</div>
          {stay.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {stay.description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "hours",
    header: "Duration",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
        {row.getValue("hours")} hours
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center font-medium">
        <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
        ₹{row.getValue("price")}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
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
      const stay = row.original;

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
              onClick={() => window.location.href = `/admin/rooms/${roomId}/hourly-stays/${stay.id}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleActive(stay.id, stay.isActive)}
            >
              {stay.isActive ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(stay.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
