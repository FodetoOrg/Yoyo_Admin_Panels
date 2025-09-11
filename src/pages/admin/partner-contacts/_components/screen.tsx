import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, Phone, Mail, Hotel, MapPin, Hash } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

interface PartnerContact {
  id: string;
  hotelName: string;
  numberOfRooms: number;
  hotelDescription?: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  city: string;
  status?: string;
  createdAt?: string;
  submittedAt?: string;
}

interface Props {
  partnerContacts: PartnerContact[];
  user: any;
  error?: string | null;
}

// Define columns for the data table
const columns: ColumnDef<PartnerContact>[] = [
  {
    accessorKey: "hotelName",
    header: "Hotel Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hotel className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue("hotelName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("city")}</span>
      </div>
    ),
  },
  {
    accessorKey: "numberOfRooms",
    header: "Rooms",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("numberOfRooms")}</span>
      </div>
    ),
  },
  {
    accessorKey: "ownerFullName",
    header: "Owner Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("ownerFullName")}</span>
    ),
  },
  {
    accessorKey: "ownerEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <a 
          href={`mailto:${row.getValue("ownerEmail")}`}
          className="text-blue-600 hover:underline text-sm"
        >
          {row.getValue("ownerEmail")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "ownerPhone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-3 w-3 text-muted-foreground" />
        <a 
          href={`tel:${row.getValue("ownerPhone")}`}
          className="text-blue-600 hover:underline text-sm"
        >
          {row.getValue("ownerPhone")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string || "pending";
      const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        contacted: "bg-blue-100 text-blue-800 border-blue-300",
        approved: "bg-green-100 text-green-800 border-green-300",
        rejected: "bg-red-100 text-red-800 border-red-300",
      };
      
      return (
        <Badge 
          variant="outline" 
          className={statusColors[status.toLowerCase()] || statusColors.pending}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") || row.original.submittedAt;
      if (!date) return <span className="text-muted-foreground">-</span>;
      
      return (
        <span className="text-sm">
          {new Date(date as string).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const contact = row.original;
      
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.href = `/admin/partner-contacts/${contact.id}`;
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      );
    },
  },
];

// Filter fields for the data table
const filterFields = ["hotelName", "city", "ownerFullName", "status"];

const PartnerContactsScreen = ({ partnerContacts = [], user, error }: Props) => {
  console.log('Partner contacts:', partnerContacts);

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Partner Contact Requests"
            description="Manage partner hotel registration requests and inquiries"
          />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total: {partnerContacts.length}
            </Badge>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && partnerContacts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No partner contact requests found</p>
            <p className="text-sm text-gray-400 mt-1">
              New partner registration requests will appear here
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={partnerContacts}
            filterFields={filterFields}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default PartnerContactsScreen;
