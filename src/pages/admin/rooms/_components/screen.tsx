import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId, isSuperAdmin, UserRole } from "@/lib/utils/auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColumns, datePickers, filterFields, type Room } from "./columns";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  rooms: Room[];
  hotels: Array<{ id: string; name: string }>;
  roomTypes: Array<{ id: string; name: string }>;
  currentUser: any;
}

const RoomsScreen = ({ rooms = [], hotels = [], roomTypes = [], currentUser }: Props) => {
  const effectiveHotelId = currentUser.role === UserRole.HOTEL_ADMIN ? currentUser.hotelId : null;
  const isSuper = currentUser.role === UserRole.SUPER_ADMIN;
  const [loading, setLoading] = useState(false);
  
  // Function to handle room status changes
  const handleStatusChange = async (roomId: string, newStatus: string) => {
    if (!roomId) return;
    
    setLoading(true);
    try {
      const response = await apiService.put(ROUTES.UPDATE_ROOM_BY_ID_ROUTE(roomId), {
        status: newStatus
      });
      
      if (response.success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(response.message || "Failed to update room status");
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      alert("An error occurred while updating room status");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle booking availability changes
  const handleBookingAvailabilityChange = async (roomId: string, type: 'hourly' | 'daily', value: boolean) => {
    if (!roomId) return;
    
    setLoading(true);
    try {
      const updateData = type === 'hourly' 
        ? { isHourlyBooking: value }
        : { isDailyBooking: value };
        
      const response = await apiService.put(ROUTES.UPDATE_ROOM_BY_ID_ROUTE(roomId), updateData);
      
      if (response.success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(response.message || "Failed to update booking availability");
      }
    } catch (error) {
      console.error("Error updating booking availability:", error);
      alert("An error occurred while updating booking availability");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle room deletion
  const handleDeleteRoom = async (roomId: string) => {
    if (!roomId) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this room? This action cannot be undone.");
    if (!confirmed) return;
    
    setLoading(true);
    try {
      const response = await apiService.delete(ROUTES.DELETE_ROOM_BY_ID_ROUTE(roomId));
      
      if (response.success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(response.message || "Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("An error occurred while deleting room");
    } finally {
      setLoading(false);
    }
  };

  const getHotelName = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel?.name || "Unknown Hotel";
  };

  const getRoomTypeName = (roomTypeId: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    return roomType?.name || "Unknown Type";
  };

  // Enhanced room data with additional info
  const enhancedRooms = rooms.map(room => ({
    ...room,
    hotelName: room.hotel?.name || getHotelName(room.hotelId),
    roomTypeName: room.roomType?.name || getRoomTypeName(room.roomTypeId || ''),
  }));

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Rooms Management"
            description={ "Manage hotel rooms and availability"
            }
          />
          <Button>
            <a
              href="/admin/rooms/new"
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Add Room
            </a>
          </Button>
        </div>
        
        {/* User context info */}
        {/* <div className="flex items-center gap-4">
          <Badge variant="outline">
            {currentUser.role === UserRole.SUPER_ADMIN ? "Super Admin" : "Hotel Admin"}
          </Badge>
          {effectiveHotelId && (
            <Badge variant="secondary">
              Managing: {getHotelName(effectiveHotelId)}
            </Badge>
          )}
          <Badge variant="outline">
            Total Rooms: {enhancedRooms.length}
          </Badge>
        </div> */}

        {/* Hotel selector for super admin */}
        {isSuper && !effectiveHotelId && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing rooms from all hotels. Use "View as Admin" feature to manage specific hotel rooms.
            </p>
          </div>
        )}

        <DataTable
          columns={getColumns(
            handleStatusChange,
            handleBookingAvailabilityChange,
            handleDeleteRoom,
            isSuper
          )}
          filterFields={filterFields}
          data={enhancedRooms}
          datePickers={datePickers}
          hiddenColumns={[]}
          isLoading={loading}
        />
      </div>
    </PageContainer>
  );
};

export default RoomsScreen;