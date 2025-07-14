import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface HotelSpecificDashboardProps {
  hotelId?: string;
  hotelName?: string;
  isViewingAs?: boolean;
}

const HotelSpecificDashboard = ({ hotelId, hotelName, isViewingAs = false }: HotelSpecificDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!hotelId) return;
      
      try {
        const response = await apiService.get(
          ROUTES.GET_DASHBOARD_ANALYTICS_ROUTE('hotel', hotelId)
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
  }, [hotelId]);

  // Fallback data for charts if API data is not available
  const hotelData = dashboardData?.timeSeriesData || [
    { date: "Jan", bookings: 0, revenue: 0, occupancy: 0 },
    { date: "Feb", bookings: 0, revenue: 0, occupancy: 0 },
    { date: "Mar", bookings: 0, revenue: 0, occupancy: 0 }
  ];
  
  const roomTypeData = dashboardData?.roomTypeDistribution || [
    { name: "No Data", value: 100 }
  ];
  
  const revenueData = dashboardData?.revenueBreakdown || [
    { date: "Jan", rooms: 0, food: 0, services: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Hotel Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {hotelName || "Hotel Dashboard"}
                {isViewingAs && (
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Viewing as Hotel Admin
                  </span>
                )}
              </CardTitle>
              <p className="text-muted-foreground">
                {loading ? "Loading analytics..." : "Real-time analytics and performance metrics"}
              </p>
            </div>
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Rooms" 
          value={loading ? "..." : (dashboardData?.overview?.totalRooms || "0").toString()} 
        />
        <StatsCard 
          title="Current Occupancy" 
          value={loading ? "..." : `${dashboardData?.overview?.occupancyRate || 0}%`} 
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={loading ? "..." : `$${(dashboardData?.overview?.monthlyRevenue || 0).toLocaleString()}`} 
        />
        <StatsCard 
          title="Available Rooms" 
          value={loading ? "..." : (dashboardData?.overview?.availableRooms || "0").toString()} 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaGraph
              data={hotelData}
              xAxisKey="date"
              colors={["#3b82f6", "#10b981"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieGraph
              data={roomTypeData}
              className="mx-auto aspect-square max-h-[300px]"
              labelText="Rooms"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <BarGraph
              data={revenueData}
              xAxisKey="date"
              colors={["#8b5cf6", "#f59e0b", "#ef4444"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">New Booking - Room 205</p>
                <p className="text-sm text-muted-foreground">John Doe • Check-in: Tomorrow</p>
              </div>
              <Badge variant="default">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-muted-foreground">$450 • Booking #BK-2024-001</p>
              </div>
              <Badge variant="default" className="bg-green-500">Paid</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Room Maintenance</p>
                <p className="text-sm text-muted-foreground">Room 312 • AC Repair Completed</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelSpecificDashboard;