
import React, { useState } from "react";
import  PageContainer  from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, DollarSign, Users } from "lucide-react";
import { columns } from "./columns";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface HourlyStay {
  id: string;
  roomId: string;
  hours: number;
  price: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoomData {
  id: string;
  name: string;
  roomNumber: string;
  hotelId: string;
}

interface Props {
  roomId: string;
  roomData: RoomData;
  hourlyStays: HourlyStay[];
  currentUser: any;
}

const Screen: React.FC<Props> = ({ roomId, roomData, hourlyStays, currentUser }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hourly stay package?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.delete(ROUTES.DELETE_HOURLY_STAY_ROUTE(id));
      
      if (response.success) {
        window.location.reload();
      } else {
        alert(response.message || "Failed to delete hourly stay package");
      }
    } catch (error) {
      console.error("Error deleting hourly stay:", error);
      alert("An error occurred while deleting the hourly stay package");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const response = await apiService.put(ROUTES.UPDATE_HOURLY_STAY_ROUTE(id), {
        isActive: !currentStatus
      });
      
      if (response.success) {
        window.location.reload();
      } else {
        alert(response.message || "Failed to update hourly stay status");
      }
    } catch (error) {
      console.error("Error updating hourly stay:", error);
      alert("An error occurred while updating the hourly stay status");
    } finally {
      setLoading(false);
    }
  };

  const activeStays = hourlyStays.filter(stay => stay.isActive);
  const totalRevenue = activeStays.reduce((sum, stay) => sum + stay.price, 0);

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hourly Stay Packages</h1>
            <p className="text-muted-foreground">
              Manage hourly stay packages for {roomData.name} (Room {roomData.roomNumber})
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = `/admin/rooms/${roomId}/hourly-stays/new`}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hourly Stay
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 hidden">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hourlyStays.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeStays.length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStays.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for booking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Range</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeStays.length > 0 ? (
                  `₹${Math.min(...activeStays.map(s => s.price))} - ₹${Math.max(...activeStays.map(s => s.price))}`
                ) : (
                  "N/A"
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Per package
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeStays.length > 0 ? (
                  `${Math.round(activeStays.reduce((sum, s) => sum + s.hours, 0) / activeStays.length)}h`
                ) : (
                  "0h"
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Average hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Stay Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns({ onDelete: handleDelete, onToggleActive: handleToggleActive, roomId })}
              data={hourlyStays}
              searchKey="name"
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Screen;
