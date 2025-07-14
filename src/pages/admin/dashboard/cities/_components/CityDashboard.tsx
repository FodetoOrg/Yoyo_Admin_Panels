import React from "react";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

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
  const [cityAnalytics, setCityAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityAnalytics = async () => {
      if (!selectedCity) return;
      
      setLoading(true);
      try {
        const response = await apiService.get(
          ROUTES.GET_CITY_ANALYTICS_ROUTE(selectedCity)
        );
        
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
  
  // Fallback data for charts if API data is not available
  const cityData = cityAnalytics?.timeSeriesData || [
    { month: "Jan", bookings: 0, revenue: 0 },
    { month: "Feb", bookings: 0, revenue: 0 },
    { month: "Mar", bookings: 0, revenue: 0 }
  ];
  
  const hotelDistribution = cityAnalytics?.hotelDistribution || [
    { name: "No Data", value: 100 }
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading city analytics...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {selectedCityData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCityData.name}, {selectedCityData.state}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Hotels" 
                value={loading ? "..." : (cityAnalytics?.overview?.totalHotels || selectedCityData.numberOfHotels || "0").toString()} 
              />
              <StatsCard 
                title="Total Rooms" 
                value={loading ? "..." : (cityAnalytics?.overview?.totalRooms || "0").toString()} 
              />
              <StatsCard 
                title="Total Bookings" 
                value={loading ? "..." : (cityAnalytics?.overview?.totalBookings || "0").toString()} 
              />
              <StatsCard 
                title="Total Revenue" 
                value={loading ? "..." : `$${(cityAnalytics?.overview?.totalRevenue || 0).toLocaleString()}`} 
              />
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