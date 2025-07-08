import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HotelSpecificDashboardProps {
  hotelId?: string;
  hotelName?: string;
  isViewingAs?: boolean;
}

const HotelSpecificDashboard = ({ hotelId, hotelName, isViewingAs = false }: HotelSpecificDashboardProps) => {
  // Mock data specific to the hotel
  const hotelData = [
    { date: "Jan", bookings: 45, revenue: 12000, occupancy: 78 },
    { date: "Feb", bookings: 52, revenue: 14500, occupancy: 82 },
    { date: "Mar", bookings: 48, revenue: 13200, occupancy: 75 },
    { date: "Apr", bookings: 61, revenue: 16800, occupancy: 85 },
    { date: "May", bookings: 55, revenue: 15200, occupancy: 80 },
    { date: "Jun", bookings: 67, revenue: 18500, occupancy: 88 },
  ];

  const roomTypeData = [
    { name: "Standard", value: 45 },
    { name: "Deluxe", value: 30 },
    { name: "Suite", value: 20 },
    { name: "Presidential", value: 5 },
  ];

  const revenueData = [
    { date: "Jan", rooms: 8500, food: 2800, services: 700 },
    { date: "Feb", date: "Feb", rooms: 9200, food: 3100, services: 800 },
    { date: "Mar", rooms: 8800, food: 2900, services: 750 },
    { date: "Apr", rooms: 10500, food: 3500, services: 900 },
    { date: "May", rooms: 9800, food: 3200, services: 850 },
    { date: "Jun", rooms: 11200, food: 3800, services: 950 },
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
              <p className="text-muted-foreground">Real-time analytics and performance metrics</p>
            </div>
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Rooms" value="120" />
        <StatsCard title="Current Occupancy" value="88%" />
        <StatsCard title="Monthly Revenue" value="$45,200" />
        <StatsCard title="Average Rating" value="4.8" />
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