import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import { apiService } from "@/lib/utils/api";
import React, { useCallback, useEffect, useState, useMemo } from "react";


const StatsCard = ({ title, value, trend, isLoading = false, icon }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {isLoading ? (
            <span className="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
          ) : (
            value
          )}
        </p>
        {trend && (
          <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </p>
        )}
      </div>
      {icon && (
        <div className="text-2xl text-gray-400">{icon}</div>
      )}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">
    {children}
  </div>
);

const CardTitle = ({ children, action }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
    {action && <div>{action}</div>}
  </div>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

const LoadingSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const ROUTES = {
  GET_DASHBOARD_ANALYTICS_ROUTE: (type, id) => `/api/v1/analytics/dashboard?type=hotel&hotelId=${id}`
};

interface HotelDashboardProps {
  hotelId: string; // Make this required since it's for single hotel
  refreshInterval?: number; // Optional auto-refresh
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface HotelAnalytics {
  overview: {
    hotelName: string;
    city: string;
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    totalPaidRevenue: number;
    needToPayRevenue: number;
    totalRevenue: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    totalPaidCommission: number;
    pendingCommission: number;
    totalCommission: number;
    totalBookings: number;
    revenueGrowth: number;
    occupancyTrend?: number;
    bookingsTrend?: number;
  };
  bookingDistribution: {
    confirmed: number;
    cancelled: number;
    pending: number;
  };
  timeSeriesData: Array<{
    month: string;
    year: number;
    bookings: number;
    revenue: number;
    occupancy: number;
  }>;
  roomTypeDistribution: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  topRooms: Array<{
    id: string;
    name: string;
    roomNumber: string;
    bookings: number;
    revenue: number;
  }>;
  recentBookings: Array<{
    id: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    room: {
      name: string;
      number: string;
    };
    user: {
      name: string | null;
      phone: string;
    };
  }>;
}

const HotelDashboard: React.FC<HotelDashboardProps> = ({
  hotelId,
  refreshInterval = 300000, // 5 minutes default
  dateRange
}) => {
  const [hotelAnalytics, setHotelAnalytics] = useState<HotelAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHotelAnalytics = useCallback(async (showLoader = true) => {
    if (!hotelId) return;

    if (showLoader) setLoading(true);
    setError(null);

    try {
      let url = ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('hotel', hotelId);

      // Add date range if provided
      if (dateRange) {
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        });
        url += `&${params.toString()}`;
      }

      const response = await apiService.get(url);
      console.log('Hotel Analytics Response:', JSON.stringify(response, null, 2));

      if (response.success) {
        setHotelAnalytics(response.data);
        setLastUpdated(new Date());
      } else {
        setError(response.message || "Failed to load hotel analytics");
      }
    } catch (err) {
      console.error("Error fetching hotel analytics:", err);
      setError("An error occurred while fetching hotel analytics");
    } finally {
      setLoading(false);
    }
  }, [hotelId, dateRange]);

  // Initial load
  useEffect(() => {
    fetchHotelAnalytics();
  }, [fetchHotelAnalytics]);

  // Auto-refresh setup
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchHotelAnalytics(false); // Don't show loader for auto-refresh
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchHotelAnalytics, refreshInterval]);

  // Memoized computed values
  const computedMetrics = useMemo(() => {
    if (!hotelAnalytics) return null;

    const { overview } = hotelAnalytics;
    return {
      occupancyTrend: overview.occupancyTrend || 0,
      revenueGrowthFormatted: `${overview.revenueGrowth?.toFixed(1) || 0}%`,
      totalRoomsUtilization: overview.totalRooms > 0
        ? ((overview.occupiedRooms / overview.totalRooms) * 100).toFixed(1)
        : '0',
      avgRevenuePerRoom: overview.totalRooms > 0
        ? (overview.totalRevenue / overview.totalRooms).toLocaleString()
        : '0'
    };
  }, [hotelAnalytics]);

  // Transform API data for charts
  const chartData = useMemo(() => {
    const timeSeriesData = hotelAnalytics?.timeSeriesData?.map(item => ({
      month: item.month,
      bookings: item.bookings,
      revenue: item.revenue / 100, // Convert to reasonable scale for demo
      occupancy: item.occupancy
    })) || [{ month: "No Data", bookings: 0, revenue: 0, occupancy: 0 }];

    const roomTypeData = hotelAnalytics?.roomTypeDistribution?.map(item => ({
      name: item.name,
      value: item.count,
      revenue: item.revenue
    })) || [{ name: "No Data", value: 100, revenue: 0 }];

    const bookingDistribution = hotelAnalytics?.bookingDistribution ? [
      { name: "Confirmed", value: hotelAnalytics.bookingDistribution.confirmed },
      { name: "Cancelled", value: hotelAnalytics.bookingDistribution.cancelled },
      { name: "Pending", value: hotelAnalytics.bookingDistribution.pending }
    ] : [{ name: "No Data", value: 100 }];

    return { timeSeriesData, roomTypeData, bookingDistribution };
  }, [hotelAnalytics]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const refreshData = () => {
    fetchHotelAnalytics(true);
  };

  if (!hotelId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">Hotel ID is required to view analytics</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with refresh functionality */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hotelAnalytics?.overview?.hotelName || 'Hotel Dashboard'}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>↻</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={refreshData}
            className="text-red-800 hover:text-red-900 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hotel Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hotelAnalytics?.overview?.hotelName || 'Loading...'} - {hotelAnalytics?.overview?.city || ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Rooms"
              value={hotelAnalytics?.overview?.totalRooms?.toString() || "0"}
              isLoading={loading}
              icon="🏨"
            />
            <StatsCard
              title="Current Occupancy"
              value={`${hotelAnalytics?.overview?.occupancyRate || 0}%`}
              trend={computedMetrics?.occupancyTrend}
              isLoading={loading}
              icon="🛏️"
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(hotelAnalytics?.overview?.totalRevenue || 0)}
              trend={hotelAnalytics?.overview?.revenueGrowth}
              isLoading={loading}
              icon="💰"
            />
            <StatsCard
              title="Total Bookings"
              value={hotelAnalytics?.overview?.totalBookings?.toString() || "0"}
              isLoading={loading}
              icon="📅"
            />

            <StatsCard
              title="Available Rooms"
              value={hotelAnalytics?.overview?.availableRooms?.toString() || "0"}
              isLoading={loading}
              icon="✅"
            />
            <StatsCard
              title="Occupied Rooms"
              value={hotelAnalytics?.overview?.occupiedRooms?.toString() || "0"}
              isLoading={loading}
              icon="🔴"
            />
            <StatsCard
              title="Paid Revenue"
              value={formatCurrency(hotelAnalytics?.overview?.totalPaidRevenue || 0)}
              isLoading={loading}
              icon="✅"
            />
            <StatsCard
              title="Pending Revenue"
              value={formatCurrency(hotelAnalytics?.overview?.needToPayRevenue || 0)}
              isLoading={loading}
              icon="⏱️"
            />

            <StatsCard
              title="Total Commission"
              value={formatCurrency(hotelAnalytics?.overview?.totalCommission || 0)}
              isLoading={loading}
              icon="🏦"
            />
            <StatsCard
              title="Pending Commission"
              value={formatCurrency(hotelAnalytics?.overview?.pendingCommission || 0)}
              isLoading={loading}
              icon="⏳"
            />
            <StatsCard
              title="Revenue Growth"
              value={computedMetrics?.revenueGrowthFormatted || "0%"}
              trend={hotelAnalytics?.overview?.revenueGrowth}
              isLoading={loading}
              icon="📈"
            />
            <StatsCard
              title="Avg Revenue/Room"
              value={formatCurrency(Number(computedMetrics?.avgRevenuePerRoom || 0))}
              isLoading={loading}
              icon="🎯"
            />
          </div>
        </CardContent>
      </Card>

      {
        // JSON.stringify(chartData.timeSeriesData)
      }
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64" />
            ) : (
              <>
                <AreaGraph
                  data={chartData.timeSeriesData}
                  xAxisKey="month"
                  colors={["#3b82f6", "#10b981", "#f59e0b"]}
                />
                <div className="mt-2 text-sm text-gray-600">
                  Showing bookings, revenue, and occupancy trends
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64" />
            ) : (
              <>
                <PieGraph
                  data={chartData.roomTypeData}
                  className="mx-auto aspect-square max-h-[300px]"
                  labelText="Rooms"
                />
                <div className="mt-4">
                  {chartData.roomTypeData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{formatCurrency(item.revenue || 0)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Bookings & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64" />
            ) : (
              <>
                <BarGraph
                  data={chartData.timeSeriesData}
                  xAxisKey="month"
                  colors={["#8b5cf6", "#f59e0b"]}
                />
                <div className="mt-2 text-sm text-gray-600">
                  Purple: Bookings, Orange: Revenue (scaled)
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64" />
            ) : (
              <>
                <PieGraph
                  data={chartData.bookingDistribution}
                  className="mx-auto aspect-square max-h-[300px]"
                  labelText="Bookings"
                />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {hotelAnalytics?.bookingDistribution?.confirmed || 0}
                    </div>
                    <div className="text-xs text-gray-500">Confirmed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {hotelAnalytics?.bookingDistribution?.cancelled || 0}
                    </div>
                    <div className="text-xs text-gray-500">Cancelled</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600">
                      {hotelAnalytics?.bookingDistribution?.pending || 0}
                    </div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      {hotelAnalytics?.recentBookings && hotelAnalytics.recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings ({hotelAnalytics.recentBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">Guest</th>
                    <th className="text-left p-3 font-medium text-gray-700">Room</th>
                    <th className="text-left p-3 font-medium text-gray-700">Check-in</th>
                    <th className="text-left p-3 font-medium text-gray-700">Check-out</th>
                    <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {hotelAnalytics.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{booking.user.name || 'Guest'}</p>
                          <p className="text-sm text-gray-500">{booking.user.phone}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{booking.room.name}</p>
                          <p className="text-sm text-gray-500">Room {booking.room.number}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                          }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performing Rooms */}
      <Card className="hidden">
        <CardHeader>
          <CardTitle>Top Performing Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-y-3">
              {[1, 2, 3].map(i => (
                <LoadingSkeleton key={i} className="h-16" />
              ))}
            </div>
          ) : hotelAnalytics?.topRooms && hotelAnalytics.topRooms.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {hotelAnalytics.topRooms.map((room, index) => (
                <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{room.name}</p>
                      <p className="text-sm text-gray-500">Room {room.roomNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(room.revenue)}</p>
                    <p className="text-sm text-gray-500">{room.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No top performing rooms data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelDashboard;