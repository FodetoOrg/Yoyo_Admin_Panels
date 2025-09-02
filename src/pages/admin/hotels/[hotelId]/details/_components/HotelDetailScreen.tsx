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
  DollarSign,
  Percent,
  CreditCard,
  Activity,
  Home,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface for Hotel Details props based on API response
interface Props {
  hotelData: {
    hotel: {
      id: string;
      name: string;
      description: string;
      address: string;
      city: string;
      zipCode: string;
      starRating: string;
      amenities: string[];
      ownerId: string;
      commissionRate: number;
      mapCoordinates: string;
      paymentMode: string;
      onlinePaymentEnabled: boolean;
      offlinePaymentEnabled: boolean;
      status: string;
      checkInTime: string;
      checkOutTime: string;
      cancellationFeePercentage: number;
      cancellationTimeHours: number;
      createdAt: string;
      updatedAt: string;
      images: any[];
    };
    rooms: Array<{
      id: string;
      hotelId: string;
      roomNumber: string;
      name: string;
      description: string;
      roomTypeId: string;
      type?: string;
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
      images: any[];
    }>;
    statistics: {
      bookings: {
        totalBookings: number;
        confirmedBookings: number;
        cancelledBookings: number;
        completedBookings: number;
      };
      payments: {
        totalPayments: number;
        totalRevenue: number;
        successfulPayments: number;
        failedPayments: number;
      };
      refunds: {
        totalRefunds: number;
        totalRefunded: number;
        processedRefunds: number;
        pendingRefunds: number;
      };
      totalRooms: number;
      availableRooms: number;
    };
    addons: Array<{
      id: string;
      hotelId: string;
      name: string;
      description: string;
      image: string;
      price: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
    recentActivity: {
      bookings: Array<{
        id: string;
        userId: string;
        hotelId: string;
        roomId: string;
        checkInDate: string;
        checkOutDate: string;
        bookingType: string;
        totalHours: number;
        guestCount: number;
        totalAmount: number;
        paymentMode: string;
        requiresOnlinePayment: boolean;
        status: string;
        paymentStatus: string;
        cancellationReason?: string;
        cancelledBy?: string;
        cancelledAt?: string;
        bookingDate: string;
        specialRequests?: string;
        paymentDueDate: string;
        advanceAmount: number;
        remainingAmount: number;
        guestName: string;
        guestEmail: string;
        guestPhone: string;
        createdAt: string;
        updatedAt: string;
        user: {
          id: string;
          name: string | null;
        };
        room: {
          id: string;
          name: string;
          roomNumber: string;
        };
      }>;
    };
  };
}

const HotelDetailScreen = ({ hotelData }: Props) => {
  const { hotel, rooms, statistics, addons, recentActivity } = hotelData;

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
      case 'free_wifi':
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
      case 'restaurant':
        return <Coffee className="h-4 w-4" />;
      case 'business_center':
        return <Building className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  // Room columns for data table
  const roomColumns = [
    {
      accessorKey: "roomNumber",
      header: "Room #",
      cell: ({ row }) => (
        <div className="font-mono font-semibold">
          {row.getValue("roomNumber")}
        </div>
      )
    },
    { accessorKey: "name", header: "Room Name" },
    {
      accessorKey: "bedType",
      header: "Bed Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("bedType")}
        </Badge>
      )
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {row.getValue("capacity")} guests
        </div>
      )
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => `${row.getValue("size")} sq ft`
    },
    {
      accessorKey: "pricePerNight",
      header: "Price/Night",
      cell: ({ row }) => `₹${row.getValue("pricePerNight")}`
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
        <a href={`/rooms/${row.getValue("id") || row.original.id}`}>
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

  // Recent bookings columns
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
      accessorKey: "room",
      header: "Room",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.room.name}</div>
          <div className="text-xs text-muted-foreground">#{row.original.room.roomNumber}</div>
        </div>
      )
    },
    {
      accessorKey: "checkInDate",
      header: "Check In",
      cell: ({ row }) => formatDate(row.getValue("checkInDate"))
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => `₹${row.getValue("totalAmount")}`
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

  // Addons columns
  const addonColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `₹${row.getValue("price")}`
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("createdAt"))
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a href={`/addons/${row.getValue("id") || row.original.id}`}>
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
                title={hotel.name}
                description={hotel.description}
              />
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {hotel.address}, {hotel.city} - {hotel.zipCode}
                </span>
                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {hotel.starRating}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(hotel.status)} className=" px-3 py-1 text-base">
              {hotel.status}
            </Badge>
            <a href={`/admin/hotels/${hotel.id}`}>
              <Badge variant="outline" className="text-base px-3 py-1">
                <Pencil className="h-3 w-3" />
                Edit Hotel
              </Badge>
            </a>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{statistics.payments.totalRevenue}</div>
              <div className="text-xs text-muted-foreground">
                from {statistics.payments.totalPayments} payments
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.bookings.totalBookings}</div>
              <div className="text-xs text-muted-foreground">
                {statistics.bookings.confirmedBookings} confirmed, {statistics.bookings.cancelledBookings} cancelled
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rooms</CardTitle>
              <Home className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statistics.totalRooms}</div>
              <div className="text-xs text-muted-foreground">
                {statistics.availableRooms} available
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Percent className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{hotel.commissionRate}%</div>
              <div className="text-xs text-muted-foreground">platform commission</div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Check-in/out Times</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Check-in: {hotel.checkInTime}</div>
                <div className="text-sm">Check-out: {hotel.checkOutTime}</div>
                <div className="text-xs text-muted-foreground">
                  {hotel.cancellationTimeHours}h cancellation window
                </div>
                <div className="text-xs text-muted-foreground">
                  {hotel.cancellationFeePercentage}% cancellation fee
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payment Options</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Badge variant={hotel.onlinePaymentEnabled ? "default" : "secondary"}>
                  Online: {hotel.onlinePaymentEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge variant={hotel.offlinePaymentEnabled ? "default" : "secondary"}>
                  Offline: {hotel.offlinePaymentEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  Default: {hotel.paymentMode}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm">{hotel.city}</div>
                <div className="text-xs text-muted-foreground">{hotel.address}</div>
                <div className="text-xs text-muted-foreground">PIN: {hotel.zipCode}</div>
                {hotel.mapCoordinates && (
                  <div className="text-xs text-muted-foreground font-mono">
                    {hotel.mapCoordinates}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hotel Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {getAmenityIcon(amenity)}
                  {amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rooms" className="flex items-center gap-1">
              Rooms ({rooms.length})
            </TabsTrigger>
            <TabsTrigger value="recent-activity" className="flex items-center gap-1">
              Recent Activity ({recentActivity.bookings.length})
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex items-center gap-1">
              Addons ({addons.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="flex flex-col gap-y-4">
            <DataTable
              columns={roomColumns}
              data={rooms}
              filterFields={["status", "bedType"]}
              datePickers={["createdAt", "updatedAt"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="recent-activity" className="flex flex-col gap-y-4">
            <DataTable
              columns={bookingColumns}
              data={recentActivity.bookings}
              filterFields={["status", "bookingType", "paymentStatus"]}
              datePickers={["checkInDate", "checkOutDate", "bookingDate"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="addons" className="flex flex-col gap-y-4">
            {addons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No addons found for this hotel.
              </div>
            ) : (
              <DataTable
                columns={addonColumns}
                data={addons}
                filterFields={["status"]}
                datePickers={["createdAt", "updatedAt"]}
                hiddenColumns={[]}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Booking Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Booking Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Bookings</span>
                      <span className="font-semibold">{statistics.bookings.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Confirmed</span>
                      <span className="font-semibold text-green-600">{statistics.bookings.confirmedBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold text-blue-600">{statistics.bookings.completedBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cancelled</span>
                      <span className="font-semibold text-red-600">{statistics.bookings.cancelledBookings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="font-semibold">₹{statistics.payments.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Successful Payments</span>
                      <span className="font-semibold text-green-600">{statistics.payments.successfulPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Failed Payments</span>
                      <span className="font-semibold text-red-600">{statistics.payments.failedPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Refunded</span>
                      <span className="font-semibold text-orange-600">₹{statistics.refunds.totalRefunded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default HotelDetailScreen;