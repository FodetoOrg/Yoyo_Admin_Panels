import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface HotelSelectorProps {
  hotels: Array<{
    id: string;
    name: string;
    city: {
      name: string;
      id: string;
      state: string;
    };
    rating?: number;
    status: string;
  }>;
  selectedHotel: string;
}

const HotelSelector = ({ hotels, selectedHotel }: HotelSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Select Hotel:</span>
      <Select value={selectedHotel} onValueChange={(value)=>{
        window.location.href = `/admin/dashboard/hotels?hotelId=${value}`;
      }}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Choose a hotel..." />
        </SelectTrigger>
        <SelectContent>
          {hotels.map((hotel) => (
            <SelectItem key={hotel.id} value={hotel.id}>
              <div className="flex items-center justify-between w-full">
                <span>{hotel.name} - {hotel.city?.name || 'Unknown City'}</span>
                <Badge 
                  variant={hotel.status === "active" ? "default" : "secondary"}
                  className="ml-2"
                >
                  {hotel.rating || 'N/A'}★
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HotelSelector;