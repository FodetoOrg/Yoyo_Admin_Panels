import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Phone,
  Mail,
  Wallet,
  Calendar,
  IndianRupee,
  User,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RotateCcw,
  Eye,
  Building,
  MapPin,
  Clock,
  Users,
  Bed
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  customerData: {
    customer: {
      id: string;
      name: string | null;
      phone: string;
      joinedDate: string;
      walletBalance: number;
      totalWalletEarned: number;
      totalWalletSpent: number;
    };
    wallet: number;
    walletUsages: any[];
    statistics: {
      totalBookings: number;
      totalSpent: number;
      totalRefunds: number;
      totalWalletUsages: number;
      totalAmountPaid: number;
      totalRefundAmount: number;
      totalWalletUsed: number;
      currentWalletBalance: number;
    };
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
      status: string;
      paymentStatus: string;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      bookingDate: string;
      createdAt: string;
      hotel: {
        id: string;
        name: string;
        city: string;
      };
      room: {
        id: string;
        name: string;
        roomNumber: string;
      };
    }>;
    payments: Array<{
      id: string;
      bookingId: string;
      amount: number;
      currency: string;
      paymentType: string;
      paymentMethod: string;
      paymentMode: string;
      status: string;
      transactionDate: string;
      walletAmountUsed: number;
      createdAt: string;
      booking: {
        id: string;
      };
    }>;
    refunds: Array<{
      id: string;
      bookingId: string;
      originalPaymentId: string;
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
      booking: {
        id: string;
      };
    }>;
    walletTransactions: any[];
  };
}

const CustomerDetailsScreen = ({ customerData }: Props) => {

  const { customer, statistics, bookings, payments, refunds, walletTransactions } = customerData;

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'processed':
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
      case 'failed':
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Table columns
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
    {
      accessorKey: "hotel",
      header: "Hotel",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-0">
          <div className="font-medium text-sm truncate">{row.original.hotel.name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.original.hotel.city}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "room",
      header: "Room",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm truncate">{row.original.room.name}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bed className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">#{row.original.room.roomNumber}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "checkInDate",
      header: "Check In",
      cell: ({ row }) => (
        <div className="text-xs sm:text-sm">
          {formatDate(row.getValue("checkInDate"))}
        </div>
      )
    },
    {
      accessorKey: "checkOutDate",
      header: "Check Out",
      cell: ({ row }) => (
        <div className="text-xs sm:text-sm">
          {formatDate(row.getValue("checkOutDate"))}
        </div>
      )
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
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("totalAmount"))
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
        <a href={`/bookings/${row.getValue("id")}`}> <Button
          variant="outline"
          size="sm"

          className="flex items-center gap-1 h-7 px-2 text-xs"
        >
          <Eye className="h-3 w-3" />
          <span className="hidden sm:inline">View</span>
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
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{formatCurrency(row.getValue("amount"))}</div>
          {row.original.walletAmountUsed > 0 && (
            <div className="text-xs text-orange-600">
              Wallet: {formatCurrency(row.original.walletAmountUsed)}
            </div>
          )}
        </div>
      )
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

            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
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
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-green-600">
            {formatCurrency(row.getValue("refundAmount"))}
          </div>
          <div className="text-xs text-muted-foreground">
            Original: {formatCurrency(row.original.originalAmount)}
          </div>
        </div>
      )
    },
    {
      accessorKey: "cancellationFeeAmount",
      header: "Fee",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="text-red-600">
            {formatCurrency(row.getValue("cancellationFeeAmount"))}
          </div>
          <div className="text-xs text-muted-foreground">
            ({row.original.cancellationFeePercentage}%)
          </div>
        </div>
      )
    },
    { accessorKey: "refundReason", header: "Reason" },
    {
      accessorKey: "refundType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("refundType")}
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
      accessorKey: "expectedProcessingDays",
      header: "Processing",
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

            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </a>

      )
    }
  ];

  const walletColumns = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {row.getValue("id")?.toString().slice(-8)}
        </div>
      )
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.getValue("type") === "credit" ? "default" : "destructive"}>
          {row.getValue("type")}
        </Badge>
      )
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className={row.original.type === "credit" ? "text-green-600" : "text-red-600"}>
          {row.original.type === "credit" ? "+" : "-"}{formatCurrency(row.getValue("amount"))}
        </div>
      )
    },
    {
      accessorKey: "balanceAfter",
      header: "Balance After",
      cell: ({ row }) => formatCurrency(row.getValue("balanceAfter"))
    },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("createdAt"))
    }
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col gap-1">
              <Heading
                title={customer.name || "Customer"}
                description="Customer details and transaction history"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                ID: {customer.id.slice(-12)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Member since {formatDate(customer.joinedDate)}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{statistics.totalBookings}</div>
              <div className="text-xs text-muted-foreground mt-1">lifetime bookings</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Paid</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {formatCurrency(statistics.totalAmountPaid)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                all bookings
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Refunds</CardTitle>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {formatCurrency(statistics.totalRefundAmount)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {refunds.length} requests
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {formatCurrency(statistics.currentWalletBalance)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Used: {formatCurrency(statistics.totalWalletUsed)}
              </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="text-sm mt-1">{customer.name || 'Not provided'}</div>
                </div>
                <div className="lg:hidden">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                  <div className="text-xs font-mono mt-1 break-all">{customer.id}</div>
                </div>
              </div>
              <div className="hidden lg:flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(customer.joinedDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="lg:hidden">
                  <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(customer.joinedDate)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet Summary</label>
                  <div className="flex flex-col gap-1 mt-1">
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

        {/* Tabs for different sections */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 px-1 sm:px-3">
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-xs sm:text-sm font-medium sm:hidden">Book</span>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Bookings</span>
                <span className="text-xs">({bookings.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 px-1 sm:px-3">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-xs sm:text-sm font-medium sm:hidden">Pay</span>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Payments</span>
                <span className="text-xs">({payments.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 px-1 sm:px-3">
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-xs sm:text-sm font-medium sm:hidden">Ref</span>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Refunds</span>
                <span className="text-xs">({refunds.length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 px-1 sm:px-3">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
              <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1">
                <span className="text-xs sm:text-sm font-medium sm:hidden">Wall</span>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Wallet</span>
                <span className="text-xs">({walletTransactions.length})</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="flex flex-col gap-4">
            <DataTable
              columns={bookingColumns}
              data={bookings}
              filterFields={["status", "bookingType"]}
              datePickers={["checkInDate", "checkOutDate"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="payments" className="flex flex-col gap-4">
            <DataTable
              columns={paymentColumns}
              data={payments}
              filterFields={["status", "paymentMethod", "paymentType"]}
              datePickers={["transactionDate"]}
              hiddenColumns={[]}
            />
          </TabsContent>

          <TabsContent value="refunds" className="flex flex-col gap-4">
            {refunds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <div className="text-lg font-medium">No refunds found</div>
                <div className="text-sm">This customer hasn't requested any refunds yet.</div>
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

          <TabsContent value="wallet" className="flex flex-col gap-4">
            {walletTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <div className="text-lg font-medium">No wallet transactions</div>
                <div className="text-sm">This customer hasn't used wallet features yet.</div>
              </div>
            ) : (
              <DataTable
                columns={walletColumns}
                data={walletTransactions}
                filterFields={["type"]}
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

export default CustomerDetailsScreen;