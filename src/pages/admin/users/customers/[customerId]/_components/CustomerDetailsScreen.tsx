
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Phone, Mail, Wallet, Calendar, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  customerData: {
    customer: {
      id: string;
      name: string;
      phone: string;
      email: string;
      joined_date: string;
      wallet_balance: number;
      total_wallet_earned: number;
      total_wallet_spent: number;
    };
    statistics: {
      total_bookings: number;
      total_spent: number;
      total_refunds: number;
      wallet_balance: number;
    };
    bookings: any[];
    payments: any[];
    refunds: any[];
    wallet_transactions: any[];
  };
}

const CustomerDetailsScreen = ({ customerData }: Props) => {
  const { customer, statistics, bookings, payments, refunds, wallet_transactions } = customerData;

  const bookingColumns = [
    { accessorKey: "id", header: "Booking ID" },
    { accessorKey: "hotel_name", header: "Hotel" },
    { accessorKey: "hotel_city", header: "City" },
    { accessorKey: "room_name", header: "Room" },
    { accessorKey: "check_in_date", header: "Check In" },
    { accessorKey: "check_out_date", header: "Check Out" },
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

  const refundColumns = [
    { accessorKey: "id", header: "Refund ID" },
    { accessorKey: "refund_amount", header: "Amount" },
    { accessorKey: "refund_reason", header: "Reason" },
    { accessorKey: "refund_type", header: "Type" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "processed" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      )
    },
  ];

  const walletColumns = [
    { accessorKey: "id", header: "Transaction ID" },
    { 
      accessorKey: "type", 
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.getValue("type") === "credit" ? "default" : "destructive"}>
          {row.getValue("type")}
        </Badge>
      )
    },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "balance_after", header: "Balance After" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "created_at", header: "Date" },
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
              title={customer.name}
              description="Customer details and transaction history"
            />
          </div>
        </div>

        {/* Customer Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {customer.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {customer.email}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{customer.wallet_balance}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Earned: ₹{customer.total_wallet_earned} | Spent: ₹{customer.total_wallet_spent}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_bookings}</div>
              <div className="text-xs text-muted-foreground">
                Member since {new Date(customer.joined_date).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{statistics.total_spent}</div>
              <div className="text-xs text-muted-foreground">
                Refunds: ₹{statistics.total_refunds}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList>
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="refunds">Refunds ({refunds.length})</TabsTrigger>
            <TabsTrigger value="wallet">Wallet History ({wallet_transactions.length})</TabsTrigger>
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
          
          <TabsContent value="refunds" className="space-y-4">
            <DataTable
              columns={refundColumns}
              data={refunds}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4">
            <DataTable
              columns={walletColumns}
              data={wallet_transactions}
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

export default CustomerDetailsScreen;
