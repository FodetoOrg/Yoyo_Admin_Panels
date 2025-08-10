"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PageContainer from "@/components/PageContainer"
import { Heading } from "@/components/Heading"
import { DataTable } from "@/components/DataTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Wallet,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RotateCcw,
  Eye,
  Building,
  MapPin,
  Bed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"

interface Customer {
  id: string
  name: string | null
  phone: string
  joinedDate: string
  walletBalance: number
  totalWalletEarned: number
  totalWalletSpent: number
}

interface Stats {
  totalBookings: number
  totalSpent: number
  totalRefunds: number
  totalWalletUsages: number
  totalAmountPaid: number
  totalRefundAmount: number
  totalWalletUsed: number
  currentWalletBalance: number
}

interface BookingRow {
  id: string
  userId: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  bookingType: string
  totalHours: number
  guestCount: number
  totalAmount: number
  paymentMode: string
  status: string
  paymentStatus: string
  guestName: string
  guestEmail: string
  guestPhone: string
  bookingDate: string
  createdAt: string
  hotel: {
    id: string
    name: string
    city: string
  }
  room: {
    id: string
    name: string
    roomNumber: string
  }
}

interface PaymentRow {
  id: string
  bookingId: string
  amount: number
  currency: string
  paymentType: string
  paymentMethod: string
  paymentMode: string
  status: string
  transactionDate: string
  walletAmountUsed: number
  createdAt: string
  booking: { id: string }
}

interface RefundRow {
  id: string
  bookingId: string
  originalPaymentId: string
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
  booking: { id: string }
}

interface Props {
  customerData?: {
    customer: Customer
    wallet: number
    walletUsages: any[]
    statistics: Stats
    bookings: BookingRow[]
    payments: PaymentRow[]
    refunds: RefundRow[]
    walletTransactions: any[]
  }
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" {
  const s = (status ?? "").toLowerCase()
  switch (s) {
    case "confirmed":
    case "completed":
    case "processed":
    case "success":
      return "default"
    case "cancelled":
    case "failed":
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

function formatCurrency(amount: number) {
  try {
    return `₹${Number(amount).toLocaleString("en-IN")}`
  } catch {
    return `₹${amount}`
  }
}

export default function CustomerDetailsScreen({ customerData }: Props) {
  const data = useMemo(() => customerData ?? makeMockCustomerData(), [customerData])
  const { customer, statistics, bookings, payments, refunds, walletTransactions } = data

  // Mobile top-level tabs
  const [mobileTab, setMobileTab] = useState<"info" | "tables">("info")

  // Columns
  const bookingColumns = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }: any) => <div className="font-mono text-xs">{String(row.getValue("id") ?? "").slice(-8)}</div>,
    },
    {
      accessorKey: "hotel",
      header: "Hotel",
      cell: ({ row }: any) => (
        <div className="flex min-w-0 flex-col gap-1">
          <div className="truncate text-sm font-medium">{row.original.hotel.name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.original.hotel.city}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "room",
      header: "Room",
      cell: ({ row }: any) => (
        <div className="flex min-w-0 flex-col gap-1">
          <div className="truncate text-sm">{row.original.room.name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bed className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">#{row.original.room.roomNumber}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "checkInDate",
      header: "Check In",
      cell: ({ row }: any) => <div className="text-xs sm:text-sm">{formatDate(row.getValue("checkInDate"))}</div>,
    },
    {
      accessorKey: "checkOutDate",
      header: "Check Out",
      cell: ({ row }: any) => <div className="text-xs sm:text-sm">{formatDate(row.getValue("checkOutDate"))}</div>,
    },
    {
      accessorKey: "bookingType",
      header: "Type",
      cell: ({ row }: any) => <Badge variant="outline">{row.getValue("bookingType")}</Badge>,
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }: any) => formatCurrency(row.getValue("totalAmount")),
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
          <Button variant="outline" size="sm" className="flex h-7 items-center gap-1 px-2 text-xs bg-transparent">
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
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
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{formatCurrency(row.getValue("amount"))}</div>
          {row.original.walletAmountUsed > 0 && (
            <div className="text-xs text-orange-600">Wallet: {formatCurrency(row.original.walletAmountUsed)}</div>
          )}
        </div>
      ),
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
          <Button variant="outline" size="sm" className="flex h-7 items-center gap-1 px-2 text-xs bg-transparent">
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
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
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-green-600">{formatCurrency(row.getValue("refundAmount"))}</div>
          <div className="text-xs text-muted-foreground">
            {"Original: " + formatCurrency(row.original.originalAmount)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "cancellationFeeAmount",
      header: "Fee",
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <div className="text-red-600">{formatCurrency(row.getValue("cancellationFeeAmount"))}</div>
          <div className="text-xs text-muted-foreground">({row.original.cancellationFeePercentage}%)</div>
        </div>
      ),
    },
    { accessorKey: "refundReason", header: "Reason" },
    {
      accessorKey: "refundType",
      header: "Type",
      cell: ({ row }: any) => <Badge variant="outline">{row.getValue("refundType")}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={getStatusColor(String(row.getValue("status")))}>{row.getValue("status")}</Badge>
      ),
    },
    {
      accessorKey: "expectedProcessingDays",
      header: "Processing",
      cell: ({ row }: any) => `${row.getValue("expectedProcessingDays")} days`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <a href={`/refunds/${row.getValue("id")}`}>
          <Button variant="outline" size="sm" className="flex h-7 items-center gap-1 px-2 text-xs bg-transparent">
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </a>
      ),
    },
  ]

  const walletColumns = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }: any) => <div className="font-mono text-xs">{String(row.getValue("id") ?? "").slice(-8)}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("type") === "credit" ? "default" : "destructive"}>{row.getValue("type")}</Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => (
        <div className={row.original.type === "credit" ? "text-green-600" : "text-red-600"}>
          {row.original.type === "credit" ? "+" : "-"}
          {formatCurrency(row.getValue("amount"))}
        </div>
      ),
    },
    {
      accessorKey: "balanceAfter",
      header: "Balance After",
      cell: ({ row }: any) => formatCurrency(row.getValue("balanceAfter")),
    },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "createdAt", header: "Date", cell: ({ row }: any) => formatDate(row.getValue("createdAt")) },
  ]

  const InfoSection = (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => window.history.back()} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-1">
            <Heading title={customer.name || "Customer"} description="Customer details and transaction history" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {"ID: " + customer.id.slice(-12)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{"Member since " + formatDate(customer.joinedDate)}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Total Bookings</CardTitle>
            <Calendar className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-xl font-bold text-blue-600 sm:text-2xl">{statistics.totalBookings}</div>
            <div className="mt-1 text-xs text-muted-foreground">lifetime bookings</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Total Paid</CardTitle>
            <TrendingUp className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-lg font-bold text-green-600 sm:text-2xl">
              {formatCurrency(statistics.totalAmountPaid)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">all bookings</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Total Refunds</CardTitle>
            <TrendingDown className="h-3 w-3 text-red-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-lg font-bold text-red-600 sm:text-2xl">
              {formatCurrency(statistics.totalRefundAmount)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{refunds.length} requests</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Wallet Balance</CardTitle>
            <Wallet className="h-3 w-3 text-purple-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-lg font-bold text-purple-600 sm:text-2xl">
              {formatCurrency(statistics.currentWalletBalance)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Used: {formatCurrency(statistics.totalWalletUsed)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <div className="mt-1 text-sm">{customer.name || "Not provided"}</div>
              </div>
              <div className="lg:hidden">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                <div className="mt-1 break-all font-mono text-xs">{customer.id}</div>
              </div>
            </div>

            <div className="hidden flex-col gap-3 lg:flex">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(customer.joinedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="lg:hidden">
                <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(customer.joinedDate)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wallet Summary</label>
                <div className="mt-1 flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span>Current Balance:</span>
                    <span className="font-medium">{formatCurrency(customer.walletBalance)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Earned:</span>
                    <span>{formatCurrency(customer.totalWalletEarned)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Spent:</span>
                    <span>{formatCurrency(customer.totalWalletSpent)}</span>
                  </div>
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
        {/* Inner section tabs: horizontally scrollable on mobile */}
        <div className="-mx-4 overflow-x-auto px-4">
          <TabsList className="inline-flex w-max whitespace-nowrap">
            <TabsTrigger
              value="bookings"
              className="flex flex-col items-center gap-0.5 px-1 sm:flex-row sm:gap-1 sm:px-3"
            >
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium sm:hidden">Book</span>
                <span className="hidden text-xs font-medium sm:inline sm:text-sm">Bookings</span>
                <span className="text-xs">({bookings.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex flex-col items-center gap-0.5 px-1 sm:flex-row sm:gap-1 sm:px-3"
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium sm:hidden">Pay</span>
                <span className="hidden text-xs font-medium sm:inline sm:text-sm">Payments</span>
                <span className="text-xs">({payments.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="refunds"
              className="flex flex-col items-center gap-0.5 px-1 sm:flex-row sm:gap-1 sm:px-3"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium sm:hidden">Ref</span>
                <span className="hidden text-xs font-medium sm:inline sm:text-sm">Refunds</span>
                <span className="text-xs">({refunds.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex flex-col items-center gap-0.5 px-1 sm:flex-row sm:gap-1 sm:px-3"
            >
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium sm:hidden">Wall</span>
                <span className="hidden text-xs font-medium sm:inline sm:text-sm">Wallet</span>
                <span className="text-xs">({walletTransactions.length})</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bookings" className="flex flex-col gap-4">
          <DataTable columns={bookingColumns as any} data={bookings} />
        </TabsContent>

        <TabsContent value="payments" className="flex flex-col gap-4">
          <DataTable columns={paymentColumns as any} data={payments} />
        </TabsContent>

        <TabsContent value="refunds" className="flex flex-col gap-4">
          {refunds.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <RotateCcw className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <div className="text-lg font-medium">No refunds found</div>
              <div className="text-sm">This customer hasn't requested any refunds yet.</div>
            </div>
          ) : (
            <DataTable columns={refundColumns as any} data={refunds} />
          )}
        </TabsContent>

        <TabsContent value="wallet" className="flex flex-col gap-4">
          {walletTransactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <div className="text-lg font-medium">No wallet transactions</div>
              <div className="text-sm">This customer hasn't used wallet features yet.</div>
            </div>
          ) : (
            <DataTable columns={walletColumns as any} data={walletTransactions} />
          )}
        </TabsContent>
      </Tabs>
    </>
  )

  return (
    <PageContainer>
      {/* Mobile: top-level tabs */}
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

      {/* Desktop and up: full layout */}
      <div className="hidden flex-col gap-y-6 md:flex">
        {InfoSection}
        {TablesSection}
      </div>
    </PageContainer>
  )
}

/* ------------------------------ MOCK DATA ------------------------------ */
function makeMockCustomerData(): Required<Props>["customerData"] {
  const now = new Date()
  const iso = (d: Date) => d.toISOString()
  const daysFromNow = (n: number) => iso(new Date(now.getTime() + n * 24 * 3600 * 1000))

  const customer: Customer = {
    id: "cust_00000000ABCDEF",
    name: "Aarav Kumar",
    phone: "+91 90000 11111",
    joinedDate: daysFromNow(-120),
    walletBalance: 1250,
    totalWalletEarned: 2500,
    totalWalletSpent: 1250,
  }

  const bookings: BookingRow[] = [
    {
      id: "bk_0000000001",
      userId: "u_1",
      hotelId: "h_1",
      roomId: "r_101",
      checkInDate: daysFromNow(-10),
      checkOutDate: daysFromNow(-8),
      bookingType: "Daily",
      totalHours: 0,
      guestCount: 2,
      totalAmount: 5400,
      paymentMode: "Online",
      status: "Completed",
      paymentStatus: "Paid",
      guestName: "Aarav Kumar",
      guestEmail: "aarav@example.com",
      guestPhone: "+91 90000 11111",
      bookingDate: daysFromNow(-11),
      createdAt: daysFromNow(-11),
      hotel: { id: "h_1", name: "Sunrise Residency", city: "Bengaluru" },
      room: { id: "r_101", name: "Deluxe King", roomNumber: "101" },
    },
    {
      id: "bk_0000000002",
      userId: "u_1",
      hotelId: "h_2",
      roomId: "r_305",
      checkInDate: daysFromNow(2),
      checkOutDate: daysFromNow(4),
      bookingType: "Daily",
      totalHours: 0,
      guestCount: 3,
      totalAmount: 7600,
      paymentMode: "Online",
      status: "Confirmed",
      paymentStatus: "Paid",
      guestName: "Aarav Kumar",
      guestEmail: "aarav@example.com",
      guestPhone: "+91 90000 11111",
      bookingDate: daysFromNow(-1),
      createdAt: daysFromNow(-1),
      hotel: { id: "h_2", name: "City Heights", city: "Mumbai" },
      room: { id: "r_305", name: "Premier Twin", roomNumber: "305" },
    },
  ]

  const payments: PaymentRow[] = [
    {
      id: "pay_0000000001",
      bookingId: "bk_0000000001",
      amount: 5400,
      currency: "INR",
      paymentType: "Room",
      paymentMethod: "UPI",
      paymentMode: "Online",
      status: "Processed",
      transactionDate: daysFromNow(-11),
      walletAmountUsed: 200,
      createdAt: daysFromNow(-11),
      booking: { id: "bk_0000000001" },
    },
    {
      id: "pay_0000000002",
      bookingId: "bk_0000000002",
      amount: 7600,
      currency: "INR",
      paymentType: "Room",
      paymentMethod: "Card",
      paymentMode: "Online",
      status: "Pending",
      transactionDate: daysFromNow(-1),
      walletAmountUsed: 0,
      createdAt: daysFromNow(-1),
      booking: { id: "bk_0000000002" },
    },
  ]

  const refunds: RefundRow[] = [
    {
      id: "ref_0000000001",
      bookingId: "bk_0000000001",
      originalPaymentId: "pay_0000000001",
      refundType: "Partial",
      originalAmount: 5400,
      cancellationFeeAmount: 400,
      refundAmount: 500,
      cancellationFeePercentage: 8,
      refundReason: "Late checkout",
      status: "Processed",
      refundMethod: "Original",
      expectedProcessingDays: 5,
      createdAt: daysFromNow(-9),
      booking: { id: "bk_0000000001" },
    },
  ]

  const walletTransactions = [
    {
      id: "wt_0001",
      type: "credit",
      amount: 500,
      balanceAfter: 1500,
      description: "Referral bonus",
      createdAt: daysFromNow(-30),
    },
    {
      id: "wt_0002",
      type: "debit",
      amount: 250,
      balanceAfter: 1250,
      description: "Used on booking bk_0000000002",
      createdAt: daysFromNow(-1),
    },
  ]

  const statistics: Stats = {
    totalBookings: bookings.length,
    totalSpent: 13000,
    totalRefunds: refunds.length,
    totalWalletUsages: walletTransactions.length,
    totalAmountPaid: 11000,
    totalRefundAmount: refunds.reduce((a, r) => a + r.refundAmount, 0),
    totalWalletUsed: 250,
    currentWalletBalance: customer.walletBalance,
  }

  return {
    customer,
    wallet: customer.walletBalance,
    walletUsages: [],
    statistics,
    bookings,
    payments,
    refunds,
    walletTransactions,
  }
}
