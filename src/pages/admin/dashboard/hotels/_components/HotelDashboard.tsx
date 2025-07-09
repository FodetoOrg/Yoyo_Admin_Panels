import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Mock data for hotel-specific analytics
  const hotelData = [
    { month: "Jan", bookings: 28, revenue: 8500, occupancy: 65 },
    { month: "Feb", bookings: 32, revenue: 9200, occupancy: 72 },
    { month: "Mar", bookings: 29, revenue: 8800, occupancy: 68 },
    { month: "Apr", bookings: 35, revenue: 10500, occupancy: 78 },
    { month: "May", bookings: 31, revenue: 9800, occupancy: 74 },
    { month: "Jun", bookings: 38, revenue: 11200, occupancy: 82 },
  ];

  const roomTypeDistribution = [
    { name: "Standard Rooms", value: 45 },
    { name: "Deluxe Rooms", value: 30 },
    { name: "Suites", value: 15 },
    { name: "Presidential", value: 5 },
  ];

  const selectedHotelData = hotels.find(hotel => hotel.id === selectedHotel);
  
  console.log('selectedHotel:', selectedHotel);
  console.log('selectedHotelData:', selectedHotelData);

  return (
    <div className="flex flex-col gap-6">
      {selectedHotelData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedHotelData.name} - {selectedHotelData.city || 'Unknown City'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard title="Total Rooms" value="95" />
              <StatsCard title="Current Occupancy" value="82%" />
              <StatsCard title="Monthly Revenue" value="$28,400" />
              <StatsCard title="Rating" value={selectedHotelData.rating?.toString() || "N/A"} />
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