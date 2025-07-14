import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

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

const HotelDashboard = ({ selectedHotel, hotels }: HotelDashboardProps) => {
  const [hotelAnalytics, setHotelAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelAnalytics = async () => {
      if (!selectedHotel) return;
      
      setLoading(true);
      try {
        const response = await apiService.get(
          ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('hotel', selectedHotel)
        );
        
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

  const selectedHotelData = hotels.find(hotel => hotel.id === selectedHotel);

  // Fallback data for charts if API data is not available
  const hotelData = hotelAnalytics?.timeSeriesData || [
    { month: "Jan", bookings: 0, revenue: 0, occupancy: 0 },
    { month: "Feb", bookings: 0, revenue: 0, occupancy: 0 },
    { month: "Mar", bookings: 0, revenue: 0, occupancy: 0 }
  ];
  
  const roomTypeDistribution = hotelAnalytics?.roomTypeDistribution || [
    { name: "No Data", value: 100 }
  ];

  return (
    <div className="flex flex-col gap-6">
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
      
      {selectedHotelData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedHotelData.name} - {selectedHotelData.city || 'Unknown City'}
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
                title="Monthly Revenue" 
                value={loading ? "..." : `$${(hotelAnalytics?.overview?.monthlyRevenue || 0).toLocaleString()}`} 
              />
              <StatsCard 
                title="Rating" 
                value={selectedHotelData.rating?.toString() || "N/A"} 
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaGraph
              data={hotelData}
              xAxisKey="month"
              colors={["#3b82f6", "#10b981", "#f59e0b"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieGraph
              data={roomTypeDistribution}
              className="mx-auto aspect-square max-h-[300px]"
              labelText="Rooms"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Bookings & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <BarGraph
            data={hotelData}
            xAxisKey="month"
            colors={["#8b5cf6", "#f59e0b"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelDashboard;