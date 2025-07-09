import React, { useState } from "react";
import { getCurrentUser, isSuperAdmin } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, X } from "lucide-react";

interface ViewAsAdminProps {
  hotels: Array<{
    id: string;
    name: string;
    ownerId: string;
  }>;
  currentUser: {
    role: string;
  };
}

const ViewAsAdmin = ({ hotels, currentUser }: ViewAsAdminProps) => {
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [isViewingAs, setIsViewingAs] = useState(false);
  const [selectedHotelName, setSelectedHotelName] = useState<string>("");

  const handleViewAsHotel = () => {
    if (selectedHotel) {
      setIsViewingAs(true);
      // Store in localStorage for persistence across pages
      localStorage.setItem("viewAsHotel", selectedHotel);
      const hotel = hotels.find(h => h.id === selectedHotel);
      if (hotel) {
        localStorage.setItem("viewAsHotelName", hotel.name);
      }
      // Reload to apply the view
      window.location.reload();
    }
  };

  const handleExitView = () => {
    setIsViewingAs(false);
    localStorage.removeItem("viewAsHotel");
    localStorage.removeItem("viewAsHotelName");
    window.location.reload();
  };

  // Check if currently viewing as a hotel admin
  React.useEffect(() => {
    const viewAsHotel = localStorage.getItem("viewAsHotel");
    const viewAsHotelName = localStorage.getItem("viewAsHotelName");
    if (viewAsHotel) {
      setIsViewingAs(true);
      setSelectedHotel(viewAsHotel);
      setSelectedHotelName(viewAsHotelName || "");
    }
  }, []);

  // Only show for super admin
  if (!isSuperAdmin(currentUser)) {
    return null;
  }

  if (isViewingAs) {
    return (
      <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Viewing as Hotel Admin: {selectedHotelName || hotels.find(h => h.id === selectedHotel)?.name}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExitView}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Exit View
          </Button>
        </div>
      </div>
    );
  }
};

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedHotel} onValueChange={setSelectedHotel}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select hotel to view as..." />
        </SelectTrigger>
        <SelectContent>
          {hotels.map((hotel) => (
            <SelectItem key={hotel.id} value={hotel.id}>
              {hotel.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewAsHotel}
        disabled={!selectedHotel}
      >
        <Eye className="h-4 w-4 mr-1" />
        View As
      </Button>
    </div>
  );
export default ViewAsAdmin;