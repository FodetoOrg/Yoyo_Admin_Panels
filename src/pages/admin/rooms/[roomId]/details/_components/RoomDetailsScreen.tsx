
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bed, Users, IndianRupee, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  roomData: {
    room: {
      id: string;
      name: string;
      room_number: string;
      capacity: number;
      bed_type: string;
      base_price: number;
      status: string;
      hotel_name: string;
    };
    bookings: Array<{
      id: string;
      check_in: string;
      check_out: string;
      total_amount: number;
      status: string;
      customer_name: string;
      customer_phone: string;
    }>;
    payments: Array<{
      id: string;
      amount: number;
      payment_method: string;
      status: string;
      transaction_date: string;
      booking_id: string;
    }>;
    addons: Array<{
      addon_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      booking_id: string;
    }>;
    refunds: Array<{
      id: string;
      amount: number;
      reason: string;
      status: string;
      processed_at: string;
      booking_id: string;
    }>;
  };
}

const RoomDetailsScreen = ({ roomData }: Props) => {
  const { room, bookings, payments, addons, refunds } = roomData;

  const bookingColumns = [
    { accessorKey: "id", header: "Booking ID" },
    { accessorKey: "customer_name", header: "Customer" },
    { accessorKey: "customer_phone", header: "Phone" },
    { accessorKey: "check_in", header: "Check In" },
    { accessorKey: "check_out", header: "Check Out" },
    { accessorKey: "total_amount", header: "Amount" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "confirmed" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      )
    },
  ];

  const paymentColumns = [
    { accessorKey: "id", header: "Payment ID" },
    { accessorKey: "booking_id", header: "Booking ID" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "payment_method", header: "Method" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "completed" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      )
    },
    { accessorKey: "transaction_date", header: "Date" },
  ];

  const addonColumns = [
    { accessorKey: "addon_name", header: "Addon" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "unit_price", header: "Unit Price" },
    { accessorKey: "total_price", header: "Total Price" },
    { accessorKey: "booking_id", header: "Booking ID" },
  ];

  const refundColumns = [
    { accessorKey: "id", header: "Refund ID" },
    { accessorKey: "booking_id", header: "Booking ID" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "reason", header: "Reason" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "processed" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      )
    },
    { accessorKey: "processed_at", header: "Processed At" },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Heading
              title={`${room.name} - Room ${room.room_number}`}
              description={`${room.hotel_name} • ${room.bed_type} bed`}
            />
          </div>
          <Badge variant={room.status === "active" ? "default" : "secondary"}>
            {room.status}
          </Badge>
        </div>

        {/* Room Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Base Price</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{room.base_price}</div>
              <div className="text-xs text-muted-foreground">per night</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{room.capacity}</div>
              <div className="text-xs text-muted-foreground">guests</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bed Type</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{room.bed_type}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hotel</CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{room.hotel_name}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="addons">Addons ({addons.length})</TabsTrigger>
            <TabsTrigger value="refunds">Refunds ({refunds.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <DataTable
              columns={bookingColumns}
              data={bookings}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <DataTable
              columns={paymentColumns}
              data={payments}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="addons" className="space-y-4">
            <DataTable
              columns={addonColumns}
              data={addons}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="refunds" className="space-y-4">
            <DataTable
              columns={refundColumns}
              data={refunds}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default RoomDetailsScreen;
