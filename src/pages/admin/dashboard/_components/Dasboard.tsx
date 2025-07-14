import { DateRangePicker } from "@/components/DateRangePicker";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import { Heading } from "@/components/Heading";
import PageContainer from "@/components/PageContainer";
import StatsCard from "@/components/StatsCard";
import TabGroup from "@/components/TabGroup";
import React from "react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

const Dasboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const data = [
  { date: "Jan", sales: 100, revenue: 1000, profit: 500 },
  { date: "Feb", sales: 150, revenue: 1500, profit: 750 },
  // ...
];

const dataBar = [
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-02-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-03-03",
    sales: 200,
    revenue: 2000,
    profit: 1000,
  },
  {
    date: "2024-04-04",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-05-05",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-06-06",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-07-07",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-08-08",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-09-09",
    sales: 150,
    revenue: 1500,
    profit: 750,
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.get(
          ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('super')
        );
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

const chartConfig = {
  sales: { label: "Total Sales" },
  revenue: { label: "Revenue" },
  profit: { label: "Profit" },
};

  // Prepare data for charts
  const revenueData = dashboardData?.overview?.monthlyData || [];
  const bookingData = dashboardData?.bookings?.monthlyData || [];
  
  // Prepare pie chart data
  const bookingStatusData = [
    { name: "Confirmed", value: dashboardData?.bookings?.confirmedBookings || 0 },
    { name: "Pending", value: dashboardData?.bookings?.pendingBookings || 0 },
    { name: "Cancelled", value: dashboardData?.bookings?.cancelledBookings || 0 },
  ];
  
  const revenueStatusData = [
    { name: "Received", value: dashboardData?.revenue?.totalRevenue - dashboardData?.revenue?.pendingRevenue || 0 },
    { name: "Pending", value: dashboardData?.revenue?.pendingRevenue || 0 },
    { name: "Refunded", value: dashboardData?.revenue?.refundedAmount || 0 },
  ];
  
  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">Loading dashboard data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Hotels" 
          value={loading ? "..." : (dashboardData?.overview?.totalHotels || "0").toString()} 
        />
        <StatsCard 
          title="Total Users" 
          value={loading ? "..." : (dashboardData?.overview?.totalUsers || "0").toString()} 
        />
        <StatsCard 
          title="Total Bookings" 
          value={loading ? "..." : (dashboardData?.overview?.totalBookings || "0").toString()} 
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={loading ? "..." : `$${(dashboardData?.overview?.monthlyRevenue || 0).toLocaleString()}`} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AreaGraph
          data={revenueData}
          xAxisKey="date"
          colors={["#ff0000", "#00ff00", "#0000ff"]} // Optional custom colors
        />
        <AreaGraph
          data={bookingData}
          xAxisKey="date"
          colors={["#ff0000", "#00ff00", "#0000ff"]} // Optional custom colors
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarGraph
          data={revenueData}
          chartConfig={chartConfig}
          xAxisKey="date"
          dateFormat="full"
          showGrid={true}
        />
        <BarGraph
          data={bookingData}
          chartConfig={chartConfig}
          xAxisKey="date"
          dateFormat="full"
          showGrid={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieGraph
          data={bookingStatusData}
          className="mx-auto aspect-square max-h-[360px]"
          labelText="Bookings"
          fillKey="fill"
        />
        <PieGraph
          data={revenueStatusData}
          className="mx-auto aspect-square max-h-[360px]"
          labelText="Revenue"
          fillKey="fill"
        />
      </div>
    </div>
  );
};

export default Dasboard;
