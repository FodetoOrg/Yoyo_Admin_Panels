"use client"
import { Badge } from "@/components/ui/badge"
import PageContainer from "@/components/PageContainer"
import { Heading } from "@/components/Heading"
import { DataTable } from "@/components/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { BookingCalendar } from "@/components/BookingCalendar"

interface RoomDetails {
  id: string
  hotelId: string
  roomNumber: string
  name: string
  description: string
  roomTypeId: string
  maxGuests: number
  capacity: number
  bedType: string
  size: number
  floor: number
  pricePerNight: number
  pricePerHour: number
  isHourlyBooking: boolean
  isDailyBooking: boolean
  amenities: string[]
  status: string
  createdAt: string
  updatedAt: string
  hotel: {
    id: string
    name: string
    description: string
    address: string
    city: string
    zipCode: string
    starRating: string
    amenities: string
    checkInTime: string
    checkOutTime: string
    cancellationFeePercentage: number
    cancellationTimeHours: number
    mapCoordinates: string
    paymentMode: string
    onlinePaymentEnabled: boolean
    offlinePaymentEnabled: boolean
    status: string
  }
  roomAddons: any[]
  images: any[]
}

interface Booking {
  id: string
  userId: string
  checkInDate: string
  checkOutDate: string
  bookingType: string
  totalHours: number
  guestCount: number
  totalAmount: number
  paymentMode: string
  status: string
  paymentStatus: string
  cancellationReason?: string
  cancelledBy?: string
  cancelledAt?: string
  bookingDate: string
  guestName: string
  guestEmail: string
  guestPhone: string
  user: { id: string; name: string | null; phone: string }
}

interface Payment {
  id: string
  bookingId: string
  userId: string
  amount: number
  currency: string
  paymentType: string
  paymentMethod: string
  paymentMode: string
  status: string
  transactionDate: string
  createdAt: string
  user: { id: string; name: string | null }
}

interface Refund {
  id: string
  bookingId: string
  originalPaymentId: string
  userId: string
  refundType: string
  originalAmount: number
  cancellationFeeAmount: number
  refundAmount: number
  cancellationFeePercentage: number
  refundReason: string
  status: string
  refundMethod: string
  expectedProcessingDays: number
  createdAt: string
  user: { id: string; name: string | null }
}

interface Stats {
  totalBookings: number
  totalRevenue: number
  totalRefunds: number
  netRevenue: number
}

interface Props {
  roomData?: {
    room: RoomDetails
    bookings: Booking[]
    payments: Payment[]
    refunds: Refund[]
    addons: any[]
    statistics: Stats
  }
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" {
  const s = (status ?? "").toLowerCase()
  switch (s) {
    case "confirmed":
    case "completed":
    case "processed":
    case "active":
    case "available":
    case "occupied":
      return "default"
    case "cancelled":
    case "rejected":
      return "destructive"
    case "pending":
    default:
      return "secondary"
  }
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateString
  }
}

function getAmenityIcon(amenity: string) {
  switch ((amenity ?? "").toLowerCase()) {
    case "wifi":
      return <Wifi className="h-4 w-4" />
    case "parking":
    case "car":
      return <Car className="h-4 w-4" />
    case "swimming_pool":
      return <Waves className="h-4 w-4" />
    case "fitness_center":
    case "gym":
      return <Dumbbell className="h-4 w-4" />
    case "spa":
      return <Sparkles className="h-4 w-4" />
    case "ac_heating":
      return <Wind className="h-4 w-4" />
    case "room_service":
      return <Coffee className="h-4 w-4" />
    case "business_center":
      return <Building className="h-4 w-4" />
    default:
      return <Star className="h-4 w-4" />
  }
}

export default function RoomDetailsScreen({ roomData }: Props) {
  const data = useMemo(() => roomData ?? makeMockRoomData(), [roomData])
  const { room, bookings, payments, refunds, statistics, addons } = data

  // Mobile top-level tabs state
  const [mobileTab, setMobileTab] = useState<"info" | "tables">("info")

  const bookingColumns = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }: any) => <div className="font-mono text-xs">{String(row.getValue("id") ?? "").slice(-8)}</div>,
    },
    { accessorKey: "guestName", header: "Guest Name" },
    {
      accessorKey: "guestPhone",
      header: "Contact",
      cell: ({ row }: any) => (
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
      ),
    },
    {
      accessorKey: "checkInDate",
      header: "Check In",
      cell: ({ row }: any) => formatDate(row.getValue("checkInDate")),
    },
    {
      accessorKey: "checkOutDate",
      header: "Check Out",
      cell: ({ row }: any) => formatDate(row.getValue("checkOutDate")),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }: any) => `₹${row.getValue("totalAmount")}`,
    },
    {
      accessorKey: "bookingType",
      header: "Type",
      cell: ({ row }: any) => <Badge variant="outline">{row.getValue("bookingType")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={getStatusColor(String(row.getValue("status")))}>{row.getValue("status")}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <a href={`/bookings/${row.getValue("id")}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>
      ),
    },
  ]

  const paymentColumns = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }: any) => <div className="font-mono text-xs">{String(row.getValue("id") ?? "").slice(-8)}</div>,
    },
    {
      accessorKey: "bookingId",
      header: "Booking",
      cell: ({ row }: any) => (
        <div className="font-mono text-xs">{String(row.getValue("bookingId") ?? "").slice(-8)}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => `₹${row.getValue("amount")} ${row.original.currency}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }: any) => <Badge variant="outline">{row.getValue("paymentMethod")}</Badge>,
    },
    {
      accessorKey: "paymentType",
      header: "Type",
      cell: ({ row }: any) => <Badge variant="secondary">{row.getValue("paymentType")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={getStatusColor(String(row.getValue("status")))}>{row.getValue("status")}</Badge>
      ),
    },
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }: any) => formatDate(row.getValue("transactionDate")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <a href={`/payments/${row.getValue("id")}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>
      ),
    },
  ]

  const refundColumns = [
    {
      accessorKey: "id",
      header: "Refund ID",
      cell: ({ row }: any) => <div className="font-mono text-xs">{String(row.getValue("id") ?? "").slice(-8)}</div>,
    },
    {
      accessorKey: "bookingId",
      header: "Booking",
      cell: ({ row }: any) => (
        <div className="font-mono text-xs">{String(row.getValue("bookingId") ?? "").slice(-8)}</div>
      ),
    },
    {
      accessorKey: "refundAmount",
      header: "Refund Amount",
      cell: ({ row }: any) => `₹${row.getValue("refundAmount")}`,
    },
    {
      accessorKey: "originalAmount",
      header: "Original Amount",
      cell: ({ row }: any) => `₹${row.getValue("originalAmount")}`,
    },
    {
      accessorKey: "cancellationFeeAmount",
      header: "Fee",
      cell: ({ row }: any) => `₹${row.getValue("cancellationFeeAmount")}`,
    },
    { accessorKey: "refundReason", header: "Reason" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={getStatusColor(String(row.getValue("status")))}>{row.getValue("status")}</Badge>
      ),
    },
    {
      accessorKey: "expectedProcessingDays",
      header: "Processing Days",
      cell: ({ row }: any) => `${row.getValue("expectedProcessingDays")} days`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <a href={`/refunds/${row.getValue("id")}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Eye className="h-3 w-3" />
            View
          </Button>
        </a>
      ),
    },
  ]

  const InfoSection = (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" onClick={() => window.history.back()} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Heading
              title={`${room.name} - Room ${room.roomNumber}`}
              description={`${room.hotel.name} • Floor ${room.floor} • ${room.bedType} bed`}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {room.hotel.address}, {room.hotel.city} - {room.hotel.zipCode}
                </span>
              </span>
              <Badge variant="outline" className="ml-0">
                {room.hotel.starRating}
              </Badge>
            </div>
          </div>
        </div>
        <div className="self-start sm:self-auto">
          <Badge variant={getStatusColor(room.status)} className="px-3 py-1 text-base">
            {room.status}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-1 text-sm text-muted-foreground">{room.size} sq ft</div>
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

      <BookingCalendar
        bookings={bookings.map((b: any) => ({
          id: b.id,
          guestName: b.guestName,
          guestEmail: b.guestEmail,
          guestPhone: b.guestPhone,
          status: b.status,
          paymentStatus: b.paymentStatus,
          paymentMode: b.paymentMode,
          totalAmount: b.totalAmount,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
        }))}
        className=""
        title="Availability Calendar"
      />

      {/* Room Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Room Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity, i) => (
              <Badge key={i} variant="outline" className="inline-flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <span>{amenity.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">Payment Options</h4>
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
              <h4 className="mb-2 font-semibold">Booking Options</h4>
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
        </CardContent>
      </Card>
    </>
  )

  const TablesSection = (
    <>
      <Tabs defaultValue="bookings" className="w-full">
        {/* Make inner tabs horizontally scrollable on small screens */}
        <div className="-mx-4 overflow-x-auto px-4">
          <TabsList className="inline-flex w-max whitespace-nowrap">
            <TabsTrigger value="bookings" className="flex-shrink-0">
              Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-shrink-0">
              Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="addons" className="flex-shrink-0">
              Addons ({addons.length})
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex-shrink-0">
              Refunds ({refunds.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bookings" className="flex flex-col gap-y-4">
          <DataTable columns={bookingColumns as any} data={bookings} />
        </TabsContent>

        <TabsContent value="payments" className="flex flex-col gap-y-4">
          <DataTable columns={paymentColumns as any} data={payments} />
        </TabsContent>

        <TabsContent value="addons" className="flex flex-col gap-y-4">
          {addons.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No addons found for this room.</div>
          ) : (
            <DataTable
              // placeholder columns for demo
              columns={
                [
                  { header: "Name", accessorKey: "name" },
                  { header: "Price", accessorKey: "price" },
                ] as any
              }
              data={addons}
            />
          )}
        </TabsContent>

        <TabsContent value="refunds" className="flex flex-col gap-y-4">
          {refunds.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No refunds found for this room.</div>
          ) : (
            <DataTable columns={refundColumns as any} data={refunds} />
          )}
        </TabsContent>
      </Tabs>
    </>
  )

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Mobile: top-level tabs (Info, Tables) */}
        <div className="md:hidden">
          <Tabs value={mobileTab} onValueChange={(v: string) => setMobileTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-6 space-y-6">
              {InfoSection}
            </TabsContent>
            <TabsContent value="tables" className="mt-6 space-y-6">
              {TablesSection}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop and up: show all content without the top mobile tabs */}
        <div className="hidden flex-col gap-y-6 md:flex">
          {InfoSection}
          {TablesSection}
        </div>
      </div>
    </PageContainer>
  )
}

/* ------------------------------ MOCK DATA ------------------------------ */
function makeMockRoomData(): Required<Props>["roomData"] {
  const now = new Date()
  const plusDays = (d: number) => new Date(now.getTime() + d * 24 * 3600 * 1000).toISOString()
  const bookings: Booking[] = [
    {
      id: "bk_0000000001",
      userId: "u_1",
      checkInDate: plusDays(-10),
      checkOutDate: plusDays(-8),
      bookingType: "Daily",
      totalHours: 0,
      guestCount: 2,
      totalAmount: 6800,
      paymentMode: "Online",
      status: "Completed",
      paymentStatus: "Paid",
      bookingDate: plusDays(-12),
      guestName: "Arjun Mehta",
      guestEmail: "arjun@example.com",
      guestPhone: "+91 90000 00001",
      user: { id: "u_1", name: "Arjun", phone: "+91 90000 00001" },
    },
    {
      id: "bk_0000000002",
      userId: "u_2",
      checkInDate: plusDays(1),
      checkOutDate: plusDays(3),
      bookingType: "Daily",
      totalHours: 0,
      guestCount: 3,
      totalAmount: 9200,
      paymentMode: "Online",
      status: "Confirmed",
      paymentStatus: "Paid",
      bookingDate: plusDays(-2),
      guestName: "Priya Sharma",
      guestEmail: "priya@example.com",
      guestPhone: "+91 90000 00002",
      user: { id: "u_2", name: "Priya", phone: "+91 90000 00002" },
    },
  ]

  const payments: Payment[] = [
    {
      id: "pay_0000000001",
      bookingId: "bk_0000000001",
      userId: "u_1",
      amount: 6800,
      currency: "INR",
      paymentType: "Room",
      paymentMethod: "UPI",
      paymentMode: "Online",
      status: "Processed",
      transactionDate: plusDays(-11),
      createdAt: plusDays(-11),
      user: { id: "u_1", name: "Arjun" },
    },
    {
      id: "pay_0000000002",
      bookingId: "bk_0000000002",
      userId: "u_2",
      amount: 9200,
      currency: "INR",
      paymentType: "Room",
      paymentMethod: "Card",
      paymentMode: "Online",
      status: "Pending",
      transactionDate: plusDays(-1),
      createdAt: plusDays(-1),
      user: { id: "u_2", name: "Priya" },
    },
  ]

  const refunds: Refund[] = [
    {
      id: "ref_0000000001",
      bookingId: "bk_0000000001",
      originalPaymentId: "pay_0000000001",
      userId: "u_1",
      refundType: "Partial",
      originalAmount: 6800,
      cancellationFeeAmount: 500,
      refundAmount: 6300,
      cancellationFeePercentage: 10,
      refundReason: "Schedule change",
      status: "Processed",
      refundMethod: "Original",
      expectedProcessingDays: 3,
      createdAt: plusDays(-9),
      user: { id: "u_1", name: "Arjun" },
    },
  ]

  const room: RoomDetails = {
    id: "room_101",
    hotelId: "hotel_1",
    roomNumber: "101",
    name: "Deluxe King",
    description: "Spacious room with a king bed, city view, complimentary breakfast, and high-speed Wi-Fi.",
    roomTypeId: "rt_king",
    maxGuests: 3,
    capacity: 3,
    bedType: "King",
    size: 320,
    floor: 1,
    pricePerNight: 3400,
    pricePerHour: 450,
    isHourlyBooking: true,
    isDailyBooking: true,
    amenities: ["wifi", "parking", "swimming_pool", "gym", "spa", "ac_heating", "room_service"],
    status: "Available",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    hotel: {
      id: "hotel_1",
      name: "Sunrise Residency",
      description: "Modern hotel in the heart of the city.",
      address: "MG Road 22",
      city: "Bengaluru",
      zipCode: "560001",
      starRating: "4★",
      amenities: "wifi,parking,spa,gym",
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      cancellationFeePercentage: 10,
      cancellationTimeHours: 24,
      mapCoordinates: "12.97,77.59",
      paymentMode: "Online",
      onlinePaymentEnabled: true,
      offlinePaymentEnabled: true,
      status: "Active",
    },
    roomAddons: [],
    images: [],
  }

  const statistics: Stats = {
    totalBookings: bookings.length,
    totalRevenue: 16000,
    totalRefunds: 6300,
    netRevenue: 9700,
  }

  const addons = [
    { name: "Breakfast", price: 350 },
    { name: "Airport Pickup", price: 800 },
  ]

  return {
    room,
    bookings,
    payments,
    refunds,
    addons,
    statistics,
  }
}
