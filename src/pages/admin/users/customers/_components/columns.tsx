"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

// Define Category type based on your categories table structure
export type Category = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

// Status Update Component
const StatusUpdateDialog = ({ 
  customer, 
  currentStatus, 
  onStatusUpdate 
}: { 
  customer: Category; 
  currentStatus: string; 
  onStatusUpdate: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  const isActivating = newStatus === "active";

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const response: any = await apiService.patch(
        `/api/v1/auth/users/${customer.id}/status`,
        { status: newStatus }
      );

      if (response.success) {
        // Show success message
        alert(`Customer ${isActivating ? 'activated' : 'deactivated'} successfully`);
        setIsOpen(false);
        onStatusUpdate();
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      alert('An error occurred while updating status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {isActivating ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate Customer
            </>
          ) : (
            <>
              <UserX className="mr-2 h-4 w-4" />
              Deactivate Customer
            </>
          )}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isActivating ? 'Activate' : 'Deactivate'} Customer
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {isActivating ? 'activate' : 'deactivate'} the customer{" "}
            <strong>{customer.name}</strong>? This action will change their status to{" "}
            <strong>{newStatus}</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            disabled={isLoading}
            className={isActivating ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {isLoading ? "Updating..." : `${isActivating ? 'Activate' : 'Deactivate'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Category>[] = [
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
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name") || 'NA'}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone") || "NA",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.getValue("status") === "active" ? "outline" : "destructive"
          }
          className={
            row.getValue("status") === "active"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }
        >
          {row.getValue("status") === "active" ? "Active" : "Inactive"}
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
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length !== 2) return true;
      const [start, end] = filterValue;
      const rowDate = new Date(row.getValue(id));
      return rowDate >= start && rowDate <= end;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const [refreshTrigger, setRefreshTrigger] = useState(0);

      console.log(category);

      const handleStatusUpdate = () => {
        // Trigger a refresh of the table data
        setRefreshTrigger(prev => prev + 1);
        // You might want to add a callback to refresh the parent component data
        window.location.reload();
      };

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
              onClick={() => navigator.clipboard.writeText(category.name)}
            >
              Copy Customer Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
           
            <a href={`/admin/users/customers/${category.id}`}>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </a>
            
            <DropdownMenuSeparator />
            
            <StatusUpdateDialog 
              customer={category}
              currentStatus={category.status === "active" ? "active" : "inactive"}
              onStatusUpdate={handleStatusUpdate}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Specify which fields to allow filtering
export const filterFields = ["name", "active"];

export const datePickers = ["createdAt"];
