import React, { useEffect, useState } from "react";

// Mock components for demonstration
const AreaGraph = ({ data, xAxisKey, colors }) => (
  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
    <span className="text-gray-500">Area Graph: {data.length} data points</span>
  </div>
);

const BarGraph = ({ data, xAxisKey, colors }) => (
  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
    <span className="text-gray-500">Bar Graph: {data.length} data points</span>
  </div>
);

const PieGraph = ({ data, className, labelText }) => (
  <div className={`bg-gray-100 rounded flex items-center justify-center ${className}`}>
    <span className="text-gray-500">Pie Chart: {labelText}</span>
  </div>
);

const StatsCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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

const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

// Mock API service
const apiService = {
  get: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return the provided sample data
    return {
      success: true,
      data: {
        overview: {
          hotelName: "Charand Plaza",
          city: "Pallikarnai",
          totalRooms: 1,
          availableRooms: 1,
          occupiedRooms: 0,
          occupancyRate: 0,
          totalPaidRevenue: 0,
          needToPayRevenue: 2350,
          totalRevenue: 2350,
          currentMonthRevenue: 0,
          lastMonthRevenue: 0,
          totalPaidCommission: 0,
          pendingCommission: 235,
          totalCommission: 235,
          totalBookings: 3,
          revenueGrowth: 0
        },
        bookingDistribution: {
          confirmed: 1,
          cancelled: 2,
          pending: 0
        },
        timeSeriesData: [
          { month: "Feb", year: 2025, bookings: 0, revenue: 0, occupancy: 89 },
          { month: "Mar", year: 2025, bookings: 0, revenue: 0, occupancy: 73 },
          { month: "Apr", year: 2025, bookings: 0, revenue: 0, occupancy: 86 },
          { month: "May", year: 2025, bookings: 0, revenue: 0, occupancy: 82 },
          { month: "Jun", year: 2025, bookings: 0, revenue: 0, occupancy: 84 },
          { month: "Jul", year: 2025, bookings: 3, revenue: 7150, occupancy: 87 }
        ],
        roomTypeDistribution: [
          { name: "Room 1", count: 3, revenue: 7150 }
        ],
        topRooms: [],
        recentBookings: [
          {
            id: "1a99c501-fad5-4b7d-b570-be298662c263",
            checkInDate: "2025-07-22T05:54:38.000Z",
            checkOutDate: "2025-07-24T05:54:38.000Z",
            totalAmount: 2350,
            status: "confirmed",
            paymentStatus: "pending",
            room: { name: "Room 1", number: "101" },
            user: { name: null, phone: "+919150299458" }
          },
          {
            id: "6b2da74f-3a19-4bc3-b8d6-22e63b4caa83",
            checkInDate: "2025-07-21T11:05:55.000Z",
            checkOutDate: "2025-07-23T11:05:55.000Z",
            totalAmount: 2400,
            status: "cancelled",
            paymentStatus: "pending",
            room: { name: "Room 1", number: "101" },
            user: { name: null, phone: "+919182611781" }
          },
          {
            id: "eca48cf0-9a7f-44e6-853a-2be568f56d6d",
            checkInDate: "2025-07-21T11:10:17.000Z",
            checkOutDate: "2025-07-23T11:10:17.000Z",
            totalAmount: 2400,
            status: "cancelled",
            paymentStatus: "pending",
            room: { name: "Room 1", number: "101" },
            user: { name: null, phone: "+919010351681" }
          }
        ]
      }
    };
  }
};

const ROUTES = {
  GET_DASHBOARD_ANALYTICS_ROUTE: (type, id) => `/api/dashboard/${type}/${id}`
};

interface HotelDashboardProps {
  selectedHotel?: string;
  hotels: Array<{
    id: string;
    name: string;
    city: string;
    rating: number;
    status: string;
  }>;
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

const HotelDashboard = ({ selectedHotel = "hotel-1", hotels = [] }: HotelDashboardProps) => {
  const [hotelAnalytics, setHotelAnalytics] = useState<HotelAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock hotels data for demo
  const mockHotels = [
    { id: "hotel-1", name: "Charand Plaza", city: "Pallikarnai", rating: 4.5, status: "active" }
  ];
  
  const actualHotels = hotels.length > 0 ? hotels : mockHotels;

  useEffect(() => {
    const fetchHotelAnalytics = async () => {
      if (!selectedHotel) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get(
          ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('hotel', selectedHotel)
        );
        console.log(JSON.stringify(response));
        if (response.success) {
          setHotelAnalytics(response.data);
        } else {
          setError(response.message || "Failed to load hotel analytics");
        }
      } catch (err) {
        console.error("Error fetching hotel analytics:", err);
        setError("An error occurred while fetching hotel analytics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelAnalytics();
  }, [selectedHotel]);

  const selectedHotelData = actualHotels.find(hotel => hotel.id === selectedHotel);

  // Transform API data for charts
  const transformedTimeSeriesData = hotelAnalytics?.timeSeriesData?.map(item => ({
    month: item.month,
    bookings: item.bookings,
    revenue: item.revenue / 100, // Convert to reasonable scale for demo
    occupancy: item.occupancy
  })) || [
    { month: "No Data", bookings: 0, revenue: 0, occupancy: 0 }
  ];

  // Transform room type distribution for pie chart
  const transformedRoomTypeData = hotelAnalytics?.roomTypeDistribution?.map(item => ({
    name: item.name,
    value: item.count,
    revenue: item.revenue
  })) || [
    { name: "No Data", value: 100, revenue: 0 }
  ];

  // Transform booking distribution for additional chart
  const bookingDistributionData = hotelAnalytics?.bookingDistribution ? [
    { name: "Confirmed", value: hotelAnalytics.bookingDistribution.confirmed },
    { name: "Cancelled", value: hotelAnalytics.bookingDistribution.cancelled },
    { name: "Pending", value: hotelAnalytics.bookingDistribution.pending }
  ] : [
    { name: "No Data", value: 100 }
  ];

  if (!selectedHotel) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">Please select a hotel to view analytics</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading hotel analytics...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Hotel Overview Card */}
      {(hotelAnalytics?.overview || selectedHotelData) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {hotelAnalytics?.overview?.hotelName || selectedHotelData?.name} - {hotelAnalytics?.overview?.city || selectedHotelData?.city || 'Unknown City'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Rooms" 
                value={loading ? "..." : (hotelAnalytics?.overview?.totalRooms || "0").toString()} 
              />
              <StatsCard 
                title="Current Occupancy" 
                value={loading ? "..." : `${hotelAnalytics?.overview?.occupancyRate || 0}%`} 
              />
              <StatsCard 
                title="Total Revenue" 
                value={loading ? "..." : `₹${(hotelAnalytics?.overview?.totalRevenue || 0).toLocaleString()}`} 
              />
              <StatsCard 
                title="Rating" 
                value={selectedHotelData?.rating?.toString() || "N/A"} 
              />
            </div>
            
            {/* Additional stats row - Updated to use actual API response fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <StatsCard 
                title="Available Rooms" 
                value={loading ? "..." : (hotelAnalytics?.overview?.availableRooms || "0").toString()} 
              />
              <StatsCard 
                title="Occupied Rooms" 
                value={loading ? "..." : (hotelAnalytics?.overview?.occupiedRooms || "0").toString()} 
              />
              <StatsCard 
                title="Total Bookings" 
                value={loading ? "..." : (hotelAnalytics?.overview?.totalBookings || "0").toString()} 
              />
              <StatsCard 
                title="Pending Revenue" 
                value={loading ? "..." : `₹${(hotelAnalytics?.overview?.needToPayRevenue || 0).toLocaleString()}`} 
              />
            </div>

            {/* Commission stats row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <StatsCard 
                title="Paid Revenue" 
                value={loading ? "..." : `₹${(hotelAnalytics?.overview?.totalPaidRevenue || 0).toLocaleString()}`} 
              />
              <StatsCard 
                title="Total Commission" 
                value={loading ? "..." : `₹${(hotelAnalytics?.overview?.totalCommission || 0).toLocaleString()}`} 
              />
              <StatsCard 
                title="Pending Commission" 
                value={loading ? "..." : `₹${(hotelAnalytics?.overview?.pendingCommission || 0).toLocaleString()}`} 
              />
              <StatsCard 
                title="Revenue Growth" 
                value={loading ? "..." : `${(hotelAnalytics?.overview?.revenueGrowth || 0).toFixed(1)}%`} 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaGraph
              data={transformedTimeSeriesData}
              xAxisKey="month"
              colors={["#3b82f6", "#10b981", "#f59e0b"]}
            />
            <div className="mt-2 text-sm text-gray-600">
              Showing bookings, revenue, and occupancy trends
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieGraph
              data={transformedRoomTypeData}
              className="mx-auto aspect-square max-h-[300px]"
              labelText="Rooms"
            />
            <div className="mt-4">
              {transformedRoomTypeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">₹{item.revenue?.toLocaleString()}</span>
                </div>
              ))}
            </div>
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
            <BarGraph
              data={transformedTimeSeriesData}
              xAxisKey="month"
              colors={["#8b5cf6", "#f59e0b"]}
            />
            <div className="mt-2 text-sm text-gray-600">
              Purple: Bookings, Orange: Revenue (scaled)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieGraph
              data={bookingDistributionData}
              className="mx-auto aspect-square max-h-[300px]"
              labelText="Bookings"
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{hotelAnalytics?.bookingDistribution?.confirmed || 0}</div>
                <div className="text-xs text-gray-500">Confirmed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{hotelAnalytics?.bookingDistribution?.cancelled || 0}</div>
                <div className="text-xs text-gray-500">Cancelled</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">{hotelAnalytics?.bookingDistribution?.pending || 0}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
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
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Guest</th>
                    <th className="text-left p-2 font-medium">Room</th>
                    <th className="text-left p-2 font-medium">Check-in</th>
                    <th className="text-left p-2 font-medium">Check-out</th>
                    <th className="text-left p-2 font-medium">Amount</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {hotelAnalytics.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{booking.user.name || 'Guest'}</p>
                          <p className="text-sm text-gray-500">{booking.user.phone}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{booking.room.name}</p>
                          <p className="text-sm text-gray-500">Room {booking.room.number}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 font-medium">
                        ₹{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'paid'
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

      {/* Top Performing Rooms - Shows message when empty */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {hotelAnalytics?.topRooms && hotelAnalytics.topRooms.length > 0 ? (
            <div className="space-y-4">
              {hotelAnalytics.topRooms.map((room, index) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-500">Room {room.roomNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{room.revenue.toLocaleString()}</p>
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