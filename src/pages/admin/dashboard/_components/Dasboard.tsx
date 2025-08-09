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

interface DashboardData {
  overview: {
    totalCities: number;
    totalHotels: number;
    totalUsers: number;
    totalBookings: number;
    totalPaidRevenue: number;
    needToPayRevenue: number;
    totalRevenue: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    totalPaidCommission: number;
    pendingCommission: number;
    totalCommission: number;
    currentMonthCommission: number;
    revenueGrowth: number;
  };
  bookingDistribution: {
    confirmed: number;
    cancelled: number;
    pending: number;
    completed: number;
  };
  userDistribution: {
    customers: number;
    admins: number;
    hotelOwners: number;
  };
  last6MonthsData: Array<{
    month: string;
    year: number;
    newUsers: number;
    newHotels: number;
    newRooms: number;
    bookings: number;
    revenue: number;
  }>;
  topCities: Array<{
    name: string;
    hotelCount: number;
    paidRevenue: number;
    pendingRevenue: number;
    totalRevenue: number;
    paidCommission: number;
    pendingCommission: number;
    totalCommission: number;
    bookings: number;
  }>;
  topHotels: Array<{
    id: string;
    name: string;
    city: string;
    paidRevenue: number;
    pendingRevenue: number;
    totalRevenue: number;
    paidCommission: number;
    pendingCommission: number;
    totalCommission: number;
    bookings: number;
  }>;
  recentBookings: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    hotel: {
      name: string;
      city: string;
    };
    user: {
      name: string | null;
      phone: string;
    };
  }>;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.get(
          ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('super')
        );

        console.log('response analytics is', JSON.stringify(response));
        
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

  // Chart configurations
  const monthlyChartConfig = {
    revenue: { label: "Revenue", color: "#8884d8" },
    bookings: { label: "Bookings", color: "#82ca9d" },
    newUsers: { label: "New Users", color: "#ffc658" },
    newHotels: { label: "New Hotels", color: "#ff7c7c" },
  };

  // Prepare data for charts based on actual API response
  const monthlyData = dashboardData?.last6MonthsData?.map(item => ({
    date: `${item.month} ${item.year}`,
    revenue: item.revenue,
    bookings: item.bookings,
    newUsers: item.newUsers,
    newHotels: item.newHotels,
    newRooms: item.newRooms,
  })) || [];

  // Prepare pie chart data for booking distribution
  const bookingDistributionData = dashboardData ? [
    { name: "Confirmed", value: dashboardData.bookingDistribution.confirmed, fill: "#10b981" },
    { name: "Completed", value: dashboardData.bookingDistribution.completed, fill: "#3b82f6" },
    { name: "Pending", value: dashboardData.bookingDistribution.pending, fill: "#f59e0b" },
    { name: "Cancelled", value: dashboardData.bookingDistribution.cancelled, fill: "#ef4444" },
  ] : [];

  // Prepare pie chart data for user distribution
  const userDistributionData = dashboardData ? [
    { name: "Customers", value: dashboardData.userDistribution.customers, fill: "#8b5cf6" },
    { name: "Hotel Owners", value: dashboardData.userDistribution.hotelOwners, fill: "#06b6d4" },
    { name: "Admins", value: dashboardData.userDistribution.admins, fill: "#f97316" },
  ] : [];

  // Calculate revenue growth indicator
  const revenueGrowthColor = (dashboardData?.overview?.revenueGrowth || 0) >= 0 ? "text-green-600" : "text-red-600";
  const revenueGrowthIcon = (dashboardData?.overview?.revenueGrowth || 0) >= 0 ? "↗" : "↘";

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-6">
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
      
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Cities" 
          value={loading ? "..." : (dashboardData?.overview?.totalCities || "0").toString()} 
        />
        <StatsCard 
          title="Total Hotels" 
          value={loading ? "..." : (dashboardData?.overview?.totalHotels || "0").toString()} 
        />
        <StatsCard 
          title="Total Users" 
          value={loading ? "..." : (dashboardData?.overview?.totalUsers || "0").toLocaleString()} 
        />
        <StatsCard 
          title="Total Bookings" 
          value={loading ? "..." : (dashboardData?.overview?.totalBookings || "0").toLocaleString()} 
        />
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.totalRevenue || 0).toLocaleString()}`} 
        />
        <StatsCard 
          title="Paid Revenue" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.totalPaidRevenue || 0).toLocaleString()}`} 
        />
        <StatsCard 
          title="Pending Revenue" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.needToPayRevenue || 0).toLocaleString()}`} 
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue Growth</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {loading ? "..." : `${(dashboardData?.overview?.revenueGrowth || 0).toFixed(1)}%`}
            </span>
            <span className={`text-lg ${revenueGrowthColor}`}>{revenueGrowthIcon}</span>
          </div>
        </div>
      </div>

      {/* Commission Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Commission" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.totalCommission || 0).toLocaleString()}`} 
        />
        <StatsCard 
          title="Paid Commission" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.totalPaidCommission || 0).toLocaleString()}`} 
        />
        <StatsCard 
          title="Pending Commission" 
          value={loading ? "..." : `₹${(dashboardData?.overview?.pendingCommission || 0).toLocaleString()}`} 
        />
      </div>

      {/* Charts Row 1: Monthly Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Revenue & Bookings Trend</h3>
          <AreaGraph
            data={monthlyData}
            xAxisKey="date"
            colors={["#8884d8", "#82ca9d"]}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Growth Metrics</h3>
          <BarGraph
            data={monthlyData}
            chartConfig={monthlyChartConfig}
            xAxisKey="date"
            dateFormat="full"
            showGrid={true}
          />
        </div>
      </div>

      {/* Charts Row 2: Distribution Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Booking Distribution</h3>
          <PieGraph
            data={bookingDistributionData}
            className="mx-auto aspect-square max-h-[300px]"
            labelText="Bookings"
            fillKey="fill"
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <PieGraph
            data={userDistributionData}
            className="mx-auto aspect-square max-h-[300px]"
            labelText="Users"
            fillKey="fill"
          />
        </div>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Cities by Revenue</h3>
          <div className="flex flex-col gap-y-3">
            {dashboardData?.topCities?.length ? (
              dashboardData.topCities.map((city, index) => (
                <div key={city.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.hotelCount} hotels • {city.bookings} bookings</p>
                    <div className="text-xs text-gray-400 mt-1">
                      Paid: ₹{city.paidRevenue.toLocaleString()} | Pending: ₹{city.pendingRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{city.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">₹{city.totalCommission.toLocaleString()} commission</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No city data available</p>
            )}
          </div>
        </div>

        {/* Top Hotels */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Hotels by Revenue</h3>
          <div className="flex flex-col gap-y-3">
            {dashboardData?.topHotels?.length ? (
              dashboardData.topHotels.map((hotel, index) => (
                <div key={hotel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.city} • {hotel.bookings} bookings</p>
                    <div className="text-xs text-gray-400 mt-1">
                      Paid: ₹{hotel.paidRevenue.toLocaleString()} | Pending: ₹{hotel.pendingRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{hotel.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">₹{hotel.totalCommission.toLocaleString()} commission</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hotel data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <div className="flex flex-col gap-y-3">
          {dashboardData?.recentBookings?.length ? (
            dashboardData.recentBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{booking.hotel.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{booking.hotel.city}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: {booking.user.name || 'N/A'} • {booking.user.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">₹{booking.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">#{booking.id.slice(0, 8)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;