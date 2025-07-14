import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId, isSuperAdmin } from "@/lib/utils/auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColumns, datePickers, filterFields, type Room } from "./columns";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface Props {
  rooms: Room[];
  hotels: Array<{ id: string; name: string }>;
}

const RoomsScreen = ({ rooms = [], hotels = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  const isSuper = isSuperAdmin(currentUser);
  const [loading, setLoading] = useState(false);
  
  // Filter rooms based on user role
  const filteredRooms = effectiveHotelId 
    ? rooms.filter(room => room.hotelId === effectiveHotelId)
    : rooms;

  // Function to handle room status changes
  const handleStatusChange = async (roomId: string, hotelId: string, newStatus: string) => {
    if (!roomId || !hotelId) return;
    
    setLoading(true);
    try {
      const response = await apiService.put(ROUTES.UPDATE_ROOM_ROUTE(hotelId, roomId), {
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

  const getHotelName = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel?.name || "Unknown Hotel";
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Rooms Management"
            description={effectiveHotelId 
              ? `Manage rooms for ${getHotelName(effectiveHotelId)}` 
              : "Manage hotel rooms and availability"
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
        
        {/* Hotel selector for super admin */}
        {isSuper && !effectiveHotelId && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing rooms from all hotels. Use "View as Admin" feature to manage specific hotel rooms.
            </p>
          </div>
        )}

        <DataTable
          columns={getColumns(handleStatusChange)}
          filterFields={filterFields}
          data={filteredRooms}
          datePickers={datePickers}
          hiddenColumns={[]}
          isLoading={loading}
        />
      </div>
    </PageContainer>
  );
};

export default RoomsScreen;