import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface CityAnalyticsData {
  overview: {
    cityName: string;
    totalHotels: number;
    totalRooms: number;
    totalBookings: number;
    totalPaidRevenue: number;
    needToPayRevenue: number;
    totalRevenue: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    totalPaidCommission: number;
    pendingCommission: number;
    totalCommission: number;
    revenueGrowth: number;
  };
  bookingDistribution: {
    confirmed: number;
    cancelled: number;
    pending: number;
    completed: number;
  };
  timeSeriesData: Array<{
    month: string;
    year: number;
    bookings: number;
    revenue: number;
  }>;
  hotelDistribution: Array<{
    name: string;
    value: number;
  }>;
  topHotels: Array<{
    id: string;
    name: string;
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
    };
    user: {
      name: string | null;
      phone: string;
    };
  }>;
}

interface CityDashboardProps {
  selectedCity?: string;
  cities: Array<{
    id: string;
    name: string;
    state: string;
    numberOfHotels?: number;
  }>;
}

const CityDashboard = ({ selectedCity, cities }: CityDashboardProps) => {
  const [cityAnalytics, setCityAnalytics] = useState<CityAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityAnalytics = async () => {
      if (!selectedCity) {
        setCityAnalytics(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      setCityAnalytics(null); // Clear previous data
      
      try {
        const response = await apiService.get(
          ROUTES.GET_CITY_ANALYTICS_ROUTE(selectedCity)
        );
        console.log('response ',JSON.stringify(response))
        
        if (response.success) {
          setCityAnalytics(response.data);
        } else {
          setError(response.message || "Failed to load city analytics");
        }
      } catch (err) {
        console.error("Error fetching city analytics:", err);
        setError("An error occurred while fetching city analytics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCityAnalytics();
  }, [selectedCity]);

  const selectedCityData = cities.find(city => city.id === selectedCity);

  // Prepare time series data for charts
  const timeSeriesChartData = cityAnalytics?.timeSeriesData?.map(item => ({
    date: `${item.month} ${item.year}`,
    bookings: item.bookings,
    revenue: item.revenue,
  })) || [];

  // Prepare hotel distribution data with colors
  const hotelDistributionData = cityAnalytics?.hotelDistribution?.map((item, index) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    return {
      ...item,
      fill: colors[index % colors.length]
    };
  }) || [];

  // Prepare booking distribution data for pie chart
  const bookingDistributionData = cityAnalytics ? [
    { name: "Confirmed", value: cityAnalytics.bookingDistribution?.confirmed || 0, fill: "#10b981" },
    { name: "Completed", value: cityAnalytics.bookingDistribution?.completed || 0, fill: "#3b82f6" },
    { name: "Pending", value: cityAnalytics.bookingDistribution?.pending || 0, fill: "#f59e0b" },
    { name: "Cancelled", value: cityAnalytics.bookingDistribution?.cancelled || 0, fill: "#ef4444" },
  ] : [];

  // Calculate revenue growth indicator
  const revenueGrowthColor = (cityAnalytics?.overview?.revenueGrowth || 0) >= 0 ? "text-green-600" : "text-red-600";
  const revenueGrowthIcon = (cityAnalytics?.overview?.revenueGrowth || 0) >= 0 ? "↗" : "↘";

  // Chart configurations
  const chartConfig = {
    bookings: { label: "Bookings", color: "#3b82f6" },
    revenue: { label: "Revenue", color: "#10b981" },
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!selectedCity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2">No city selected</p>
          <p className="text-sm text-gray-400">Please select a city to view analytics</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Loading Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Error loading city analytics</span>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (!cityAnalytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2">No data available</p>
          <p className="text-sm text-gray-400">Unable to load analytics for the selected city</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* City Overview Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {cityAnalytics.overview.cityName}
              {selectedCityData?.state && `, ${selectedCityData.state}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Growth:</span>
              <span className={`font-semibold ${revenueGrowthColor}`}>
                {cityAnalytics.overview.revenueGrowth.toFixed(1)}% {revenueGrowthIcon}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Hotels" 
              value={cityAnalytics.overview.totalHotels.toString()} 
            />
            <StatsCard 
              title="Total Rooms" 
              value={cityAnalytics.overview.totalRooms.toLocaleString()} 
            />
            <StatsCard 
              title="Total Bookings" 
              value={cityAnalytics.overview.totalBookings.toLocaleString()} 
            />
            <StatsCard 
              title="Total Revenue" 
              value={`₹${cityAnalytics.overview.totalRevenue.toLocaleString()}`} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Revenue and Commission Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Paid Revenue" 
          value={`₹${cityAnalytics.overview.totalPaidRevenue.toLocaleString()}`} 
        />
        <StatsCard 
          title="Pending Revenue" 
          value={`₹${cityAnalytics.overview.needToPayRevenue.toLocaleString()}`} 
        />
        <StatsCard 
          title="Total Commission" 
          value={`₹${cityAnalytics.overview.totalCommission.toLocaleString()}`} 
        />
        <StatsCard 
          title="Pending Commission" 
          value={`₹${cityAnalytics.overview.pendingCommission.toLocaleString()}`} 
        />
      </div>

      {/* Monthly Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard 
          title="Current Month Revenue" 
          value={`₹${cityAnalytics.overview.currentMonthRevenue.toLocaleString()}`} 
        />
        <StatsCard 
          title="Last Month Revenue" 
          value={`₹${cityAnalytics.overview.lastMonthRevenue.toLocaleString()}`} 
        />
      </div>

      {/* Charts Row 1: Time Series */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSeriesChartData.length > 0 ? (
              <AreaGraph
                data={timeSeriesChartData}
                xAxisKey="date"
                colors={["#3b82f6", "#10b981"]}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No time series data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSeriesChartData.length > 0 ? (
              <BarGraph
                data={timeSeriesChartData}
                chartConfig={chartConfig}
                xAxisKey="date"
                dateFormat="full"
                showGrid={true}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Distribution Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hotel Distribution by Star Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {hotelDistributionData.length > 0 ? (
              <PieGraph
                data={hotelDistributionData}
                className="mx-auto aspect-square max-h-[300px]"
                labelText="Hotels"
                fillKey="fill"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No hotel distribution data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingDistributionData.length > 0 && bookingDistributionData.some(item => item.value > 0) ? (
              <PieGraph
                data={bookingDistributionData.filter(item => item.value > 0)}
                className="mx-auto aspect-square max-h-[300px]"
                labelText="Bookings"
                fillKey="fill"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No booking distribution data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Hotels Section */}
      {cityAnalytics.topHotels && cityAnalytics.topHotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Hotels by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-3">
              {cityAnalytics.topHotels.map((hotel, index) => (
                <div key={hotel.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.bookings.toLocaleString()} bookings</p>
                      <div className="text-xs text-gray-400 mt-1">
                        Paid: ₹{hotel.paidRevenue.toLocaleString()} | Pending: ₹{hotel.pendingRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{hotel.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">₹{hotel.totalCommission.toLocaleString()} commission</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings Section */}
      {cityAnalytics.recentBookings && cityAnalytics.recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-3">
              {cityAnalytics.recentBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
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
                    <p className="text-sm text-gray-500">
                      {booking.user.name || 'N/A'} • {booking.user.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{booking.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">#{booking.id.slice(0, 8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CityDashboard;