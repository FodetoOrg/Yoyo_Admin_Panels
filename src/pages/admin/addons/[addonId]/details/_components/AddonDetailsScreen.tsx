
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/GlobalTable/data-table";
import { ArrowLeft, Package, TrendingUp, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarGraph } from "@/components/Graphs/BarGraph";

interface Props {
  addonData: {
    addon: {
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      status: string;
      hotel_name: string;
      hotel_id: string;
      created_at: string;
    };
    statistics: {
      total_usage_count: number;
      total_quantity_sold: number;
      total_revenue: number;
      average_quantity_per_booking: number;
    };
    usage_history: Array<{
      quantity: number;
      total_price: number;
      created_at: string;
      booking_id: string;
      check_in_date: string;
      check_out_date: string;
      booking_total: number;
      customer_name: string;
      customer_phone: string;
      room_name: string;
      room_number: string;
    }>;
    monthly_usage: Array<{
      month: string;
      usage_count: number;
      total_quantity: number;
      revenue: number;
    }>;
  };
}

const AddonDetailsScreen = ({ addonData }: Props) => {
  const { addon, statistics, usage_history, monthly_usage } = addonData;

  const usageColumns = [
    { accessorKey: "booking_id", header: "Booking ID" },
    { accessorKey: "customer_name", header: "Customer" },
    { accessorKey: "customer_phone", header: "Phone" },
    { accessorKey: "room_name", header: "Room" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "total_price", header: "Total Price" },
    { accessorKey: "check_in_date", header: "Check In" },
    { accessorKey: "check_out_date", header: "Check Out" },
  ];

  const chartData = monthly_usage.map(item => ({
    month: item.month,
    revenue: item.revenue,
    usage_count: item.usage_count,
    total_quantity: item.total_quantity,
  }));

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Heading
              title={addon.name}
              description={`${addon.description} • ${addon.hotel_name}`}
            />
          </div>
          <Badge variant={addon.status === "active" ? "default" : "secondary"}>
            {addon.status}
          </Badge>
        </div>

        {/* Addon Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Addon Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Price</label>
              <div className="text-lg font-bold text-green-600">₹{addon.price}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <div className="text-sm capitalize">{addon.category}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Hotel</label>
              <div className="text-sm">{addon.hotel_name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="text-sm">{new Date(addon.created_at).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{statistics.total_revenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage Count</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_usage_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quantity Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_quantity_sold}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Quantity per Booking</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.average_quantity_per_booking.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <BarGraph
              data={chartData}
              xAxis="month"
              yAxis="revenue"
              title="Monthly Revenue"
              description="Revenue generated by this addon over time"
            />
          </CardContent>
        </Card>

        {/* Usage History */}
        <Card>
          <CardHeader>
            <CardTitle>Usage History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={usageColumns}
              data={usage_history}
              filterFields={[]}
              datePickers={[]}
              hiddenColumns={[]}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AddonDetailsScreen;
