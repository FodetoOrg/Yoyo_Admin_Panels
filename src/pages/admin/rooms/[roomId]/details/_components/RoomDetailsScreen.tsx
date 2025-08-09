import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bed,
  Users,
  IndianRupee,
  Hotel,
  MapPin,
  Star,
  Clock,
  Calendar,
  Eye,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Sparkles,
  Wind,
  Coffee,
  Building,
  Phone,
  Mail,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Updated interface to match API response structure
interface Props {
  roomData: {
    room: {
      id: string;
      hotelId: string;
      roomNumber: string;
      name: string;
      description: string;
      roomTypeId: string;
      maxGuests: number;
      capacity: number;
      bedType: string;
      size: number;
      floor: number;
      pricePerNight: number;
      pricePerHour: number;
      isHourlyBooking: boolean;
      isDailyBooking: boolean;
      amenities: string[];
      status: string;
      createdAt: string;
      updatedAt: string;
      hotel: {
        id: string;
        name: string;
        description: string;
        address: string;
        city: string;
        zipCode: string;
        starRating: string;
        amenities: string;
        checkInTime: string;
        checkOutTime: string;
        cancellationFeePercentage: number;
        cancellationTimeHours: number;
        mapCoordinates: string;
        paymentMode: string;
        onlinePaymentEnabled: boolean;
        offlinePaymentEnabled: boolean;
        status: string;
      };
      roomAddons: any[];
      images: any[];
    };
    bookings: Array<{
      id: string;
      userId: string;
      checkInDate: string;
      checkOutDate: string;
      bookingType: string;
      totalHours: number;
      guestCount: number;
      totalAmount: number;
      paymentMode: string;
      status: string;
      paymentStatus: string;
      cancellationReason?: string;
      cancelledBy?: string;
      cancelledAt?: string;
      bookingDate: string;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      user: {
        id: string;
        name: string | null;
        phone: string;
      };
    }>;
    payments: Array<{
      id: string;
      bookingId: string;
      userId: string;
      amount: number;
      currency: string;
      paymentType: string;
      paymentMethod: string;
      paymentMode: string;
      status: string;
      transactionDate: string;
      createdAt: string;
      user: {
        id: string;
        name: string | null;
      };
    }>;
    refunds: Array<{
      id: string;
      bookingId: string;
      originalPaymentId: string;
      userId: string;
      refundType: string;
      originalAmount: number;
      cancellationFeeAmount: number;
      refundAmount: number;
      cancellationFeePercentage: number;
      refundReason: string;
      status: string;
      refundMethod: string;
      expectedProcessingDays: number;
      createdAt: string;
      user: {
        id: string;
        name: string | null;
      };
    }>;
    addons: any[];
    statistics: {
      totalBookings: number;
      totalRevenue: number;
      totalRefunds: number;
      netRevenue: number;
    };
  };
}

const RoomDetailsScreen = ({ roomData }: Props) => {

  const { room, bookings, payments, addons, refunds, statistics } = roomData;

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'processed':
      case 'active':
      case 'available':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
      case 'rejected':
        return 'destructive';
      case 'occupied':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
      case 'car':
        return <Car className="h-4 w-4" />;
      case 'swimming_pool':
        return <Waves className="h-4 w-4" />;
      case 'fitness_center':
      case 'gym':
        return <Dumbbell className="h-4 w-4" />;
      case 'spa':
        return <Sparkles className="h-4 w-4" />;
      case 'ac_heating':
        return <Wind className="h-4 w-4" />;
      case 'room_service':
        return <Coffee className="h-4 w-4" />;
      case 'business_center':
        return <Building className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const bookingColumns = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("id")?.toString().slice(-8)}
        </div>
      )
    },
    { accessorKey: "guestName", header: "Guest Name" },
    {
      accessorKey: "guestPhone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span className="text-xs">{row.getValue("guestPhone")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span className="text-xs">{row.original.guestEmail}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "checkInDate",
      header: "Check In",
      cell: ({ row }) => formatDate(row.getValue("checkInDate"))
    },
    {
      accessorKey: "checkOutDate",
      header: "Check Out",
      cell: ({ row }) => formatDate(row.getValue("checkOutDate"))
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => `₹${row.getValue("totalAmount")}`
    },
    {
      accessorKey: "bookingType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("bookingType")}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusColor(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a href={`/bookings/${row.getValue("id")}`}>
          <Button
            variant="outline"
            size="sm"

            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>

      )
    }
  ];

  const paymentColumns = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("id")?.toString().slice(-8)}
        </div>
      )
    },
    {
      accessorKey: "bookingId",
      header: "Booking",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("bookingId")?.toString().slice(-8)}
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `₹${row.getValue("amount")} ${row.original.currency}`
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("paymentMethod")}
        </Badge>
      )
    },
    {
      accessorKey: "paymentType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("paymentType")}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusColor(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      )
    },
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("transactionDate"))
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a href={`/payments/${row.getValue("id")}`}>
          <Button
            variant="outline"
            size="sm"

            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>
      )
    }
  ];

  const refundColumns = [
    {
      accessorKey: "id",
      header: "Refund ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("id")?.toString().slice(-8)}
        </div>
      )
    },
    {
      accessorKey: "bookingId",
      header: "Booking",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("bookingId")?.toString().slice(-8)}
        </div>
      )
    },
    {
      accessorKey: "refundAmount",
      header: "Refund Amount",
      cell: ({ row }) => `₹${row.getValue("refundAmount")}`
    },
    {
      accessorKey: "originalAmount",
      header: "Original Amount",
      cell: ({ row }) => `₹${row.getValue("originalAmount")}`
    },
    {
      accessorKey: "cancellationFeeAmount",
      header: "Fee",
      cell: ({ row }) => `₹${row.getValue("cancellationFeeAmount")}`
    },
    { accessorKey: "refundReason", header: "Reason" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusColor(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      )
    },
    {
      accessorKey: "expectedProcessingDays",
      header: "Processing Days",
      cell: ({ row }) => `${row.getValue("expectedProcessingDays")} days`
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a href={`/refunds/${row.getValue("id")}`}>
          <Button
            variant="outline"
            size="sm"

            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>
      )
    }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Heading
                title={`${room.name} - Room ${room.roomNumber}`}
                description={`${room.hotel.name} • Floor ${room.floor} • ${room.bedType} bed`}
              />
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {room.hotel.address}, {room.hotel.city} - {room.hotel.zipCode}
                </span>
                <Badge variant="outline" className="ml-2">
                  {room.hotel.starRating}
                </Badge>
              </div>
            </div>
          </div>
          <Badge variant={getStatusColor(room.status)} className="text-lg px-3 py-1">
            {room.status}
          </Badge>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{statistics.totalRevenue}</div>
              <div className="text-xs text-muted-foreground">from {statistics.totalBookings} bookings</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{statistics.netRevenue}</div>
              <div className="text-xs text-muted-foreground">after refunds</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{statistics.totalRefunds}</div>
              <div className="text-xs text-muted-foreground">{refunds.length} refund requests</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statistics.totalBookings}</div>
              <div className="text-xs text-muted-foreground">total bookings</div>
            </CardContent>
          </Card>
        </div>

        {/* Room Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pricing</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-lg font-bold text-green-600">₹{room.pricePerNight}</div>
                  <div className="text-xs text-muted-foreground">per night</div>
                </div>
                {room.isHourlyBooking && (
                  <div>
                    <div className="text-sm font-semibold">₹{room.pricePerHour}</div>
                    <div className="text-xs text-muted-foreground">per hour</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{room.capacity}</div>
              <div className="text-xs text-muted-foreground">max guests</div>
              <div className="text-sm text-muted-foreground mt-1">{room.size} sq ft</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Room Details</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-lg font-medium">{room.bedType}</div>
                <div className="text-xs text-muted-foreground">Floor {room.floor}</div>
                <div className="text-xs text-muted-foreground">Room #{room.roomNumber}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Check-in/out</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Check-in: {room.hotel.checkInTime}</div>
                <div className="text-sm">Check-out: {room.hotel.checkOutTime}</div>
                <div className="text-xs text-muted-foreground">
                  {room.hotel.cancellationTimeHours}h cancellation window
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Room Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  {amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hotel Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Hotel Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Payment Options</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={room.hotel.onlinePaymentEnabled ? "default" : "secondary"}>
                      Online Payment: {room.hotel.onlinePaymentEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={room.hotel.offlinePaymentEnabled ? "default" : "secondary"}>
                      Offline Payment: {room.hotel.offlinePaymentEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Booking Options</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={room.isDailyBooking ? "default" : "secondary"}>
                      Daily Booking: {room.isDailyBooking ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={room.isHourlyBooking ? "default" : "secondary"}>
                      Hourly Booking: {room.isHourlyBooking ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            {/* {room.description && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{room.description}</p>
              </div>
            )} */}
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center gap-1">
              Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1">
              Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex items-center gap-1">
              Addons ({addons.length})
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center gap-1">
              Refunds ({refunds.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="flex flex-col gap-y-4">
            <DataTable
              columns={bookingColumns}
              data={bookings}
              filterFields={["status", "bookingType"]}
              datePickers={["checkInDate", "checkOutDate"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="payments" className="flex flex-col gap-y-4">
            <DataTable
              columns={paymentColumns}
              data={payments}
              filterFields={["status", "paymentMethod", "paymentType"]}
              datePickers={["transactionDate"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="addons" className="flex flex-col gap-y-4">
            {addons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No addons found for this room.
              </div>
            ) : (
              <DataTable
                columns={[]}
                data={addons}
                filterFields={[]}
                datePickers={[]}
                hiddenColumns={[]}
              />
            )}
          </TabsContent>

          <TabsContent value="refunds" className="flex flex-col gap-y-4">
            {refunds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No refunds found for this room.
              </div>
            ) : (
              <DataTable
                columns={refundColumns}
                data={refunds}
                filterFields={["status", "refundType"]}
                datePickers={["createdAt"]}
                hiddenColumns={[]}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default RoomDetailsScreen;