import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CityDashboardProps {
  selectedCity?: string;
  cities: Array<{
    id: string;
    name: string;
    state: string;
    numberOfHotels: number;
  }>;
}

const CityDashboard = ({ selectedCity, cities }: CityDashboardProps) => {
  // Mock data for city-specific analytics
  const cityData = [
    { month: "Jan", bookings: 45, revenue: 12000 },
    { month: "Feb", bookings: 52, revenue: 14500 },
    { month: "Mar", bookings: 48, revenue: 13200 },
    { month: "Apr", bookings: 61, revenue: 16800 },
    { month: "May", bookings: 55, revenue: 15200 },
    { month: "Jun", bookings: 67, revenue: 18500 },
  ];

  const hotelDistribution = [
    { name: "Luxury Hotels", value: 15 },
    { name: "Business Hotels", value: 25 },
    { name: "Budget Hotels", value: 35 },
    { name: "Boutique Hotels", value: 10 },
  ];

  const selectedCityData = cities.find(city => city.id === selectedCity);

  return (
    <div className="space-y-6">
      {selectedCityData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCityData.name}, {selectedCityData.state}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard title="Total Hotels" value={selectedCityData.numberOfHotels.toString()} />
              <StatsCard title="Active Bookings" value="156" />
              <StatsCard title="Monthly Revenue" value="$45,200" />
              <StatsCard title="Occupancy Rate" value="78%" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaGraph
              data={cityData}
              xAxisKey="month"
              colors={["#3b82f6", "#10b981"]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hotel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieGraph
              data={hotelDistribution}
              className="mx-auto aspect-square max-h-[300px]"
              labelText="Hotels"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <BarGraph
            data={cityData}
            xAxisKey="month"
            colors={["#8b5cf6", "#f59e0b"]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CityDashboard;