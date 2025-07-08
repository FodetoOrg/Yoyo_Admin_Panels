import React, { useState } from "react";
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

  const handleViewAsHotel = () => {
    if (selectedHotel) {
      setIsViewingAs(true);
      // Store in localStorage for persistence across pages
      localStorage.setItem("viewAsHotel", selectedHotel);
      // Reload to apply the view
      window.location.reload();
    }
  };

  const handleExitView = () => {
    setIsViewingAs(false);
    localStorage.removeItem("viewAsHotel");
    window.location.reload();
  };

  // Check if currently viewing as a hotel admin
  React.useEffect(() => {
    const viewAsHotel = localStorage.getItem("viewAsHotel");
    if (viewAsHotel) {
      setIsViewingAs(true);
      setSelectedHotel(viewAsHotel);
    }
  }, []);

  // Only show for super admin
  if (currentUser.role !== "super_admin") {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {isViewingAs ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Viewing as: {hotels.find(h => h.id === selectedHotel)?.name}
          </Badge>
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
      ) : (
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
      )}
    </div>
  );
};

export default ViewAsAdmin;