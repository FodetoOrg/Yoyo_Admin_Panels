import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CouponMappingFormProps {
  couponId: string;
  couponCode: string;
  cities: Array<{ id: string; name: string }>;
  hotels: Array<{ id: string; name: string; cityId: string }>;
  roomTypes: Array<{ id: string; name: string }>;
  existingMappings?: {
    cities: string[];
    hotels: string[];
    roomTypes: string[];
  };
}

const CouponMappingForm = ({ 
  couponId, 
  couponCode, 
  cities, 
  hotels, 
  roomTypes, 
  existingMappings 
}: CouponMappingFormProps) => {
  const [selectedCities, setSelectedCities] = useState<string[]>(existingMappings?.cities || []);
  const [selectedHotels, setSelectedHotels] = useState<string[]>(existingMappings?.hotels || []);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(existingMappings?.roomTypes || []);

  // Auto-select hotels when cities are selected
  useEffect(() => {
    const cityHotels = hotels.filter(hotel => selectedCities.includes(hotel.cityId)).map(h => h.id);
    const newSelectedHotels = [...new Set([...selectedHotels, ...cityHotels])];
    setSelectedHotels(newSelectedHotels);
  }, [selectedCities]);

  const handleCityChange = (cityId: string, checked: boolean) => {
    if (checked) {
      setSelectedCities([...selectedCities, cityId]);
    } else {
      setSelectedCities(selectedCities.filter(id => id !== cityId));
      // Remove hotels from deselected cities
      const cityHotels = hotels.filter(hotel => hotel.cityId === cityId).map(h => h.id);
      setSelectedHotels(selectedHotels.filter(id => !cityHotels.includes(id)));
    }
  };

  const handleHotelChange = (hotelId: string, checked: boolean) => {
    if (checked) {
      setSelectedHotels([...selectedHotels, hotelId]);
    } else {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
      // If hotel is deselected, also deselect its city if no other hotels from that city are selected
      const hotel = hotels.find(h => h.id === hotelId);
      if (hotel) {
        const otherCityHotels = hotels.filter(h => h.cityId === hotel.cityId && h.id !== hotelId);
        const hasOtherSelectedHotels = otherCityHotels.some(h => selectedHotels.includes(h.id));
        if (!hasOtherSelectedHotels) {
          setSelectedCities(selectedCities.filter(id => id !== hotel.cityId));
        }
      }
    }
  };

  const handleRoomTypeChange = (roomTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoomTypes([...selectedRoomTypes, roomTypeId]);
    } else {
      setSelectedRoomTypes(selectedRoomTypes.filter(id => id !== roomTypeId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mappingData = {
      couponId,
      cities: selectedCities,
      hotels: selectedHotels,
      roomTypes: selectedRoomTypes,
    };

    console.log("Coupon mapping data:", mappingData);
    // API call to save coupon mappings
  };

  const getCityName = (cityId: string) => {
    return cities.find(c => c.id === cityId)?.name || "Unknown City";
  };

  const getHotelName = (hotelId: string) => {
    return hotels.find(h => h.id === hotelId)?.name || "Unknown Hotel";
  };

  const getRoomTypeName = (roomTypeId: string) => {
    return roomTypes.find(rt => rt.id === roomTypeId)?.name || "Unknown Room Type";
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Map Coupon: {couponCode}</CardTitle>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cities Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Cities</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecting a city will auto-select all hotels in that city
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <div key={city.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`city-${city.id}`}
                    checked={selectedCities.includes(city.id)}
                    onCheckedChange={(checked) => handleCityChange(city.id, !!checked)}
                  />
                  <Label htmlFor={`city-${city.id}`}>{city.name}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Hotels Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Hotels</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select specific hotels or use city selection above
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {hotels.map((hotel) => {
                const cityName = getCityName(hotel.cityId);
                return (
                  <div key={hotel.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`hotel-${hotel.id}`}
                      checked={selectedHotels.includes(hotel.id)}
                      onCheckedChange={(checked) => handleHotelChange(hotel.id, !!checked)}
                    />
                    <div className="flex flex-col">
                      <Label htmlFor={`hotel-${hotel.id}`}>{hotel.name}</Label>
                      <span className="text-xs text-muted-foreground">{cityName}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Room Types Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Room Types</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select applicable room types
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`roomtype-${roomType.id}`}
                    checked={selectedRoomTypes.includes(roomType.id)}
                    onCheckedChange={(checked) => handleRoomTypeChange(roomType.id, !!checked)}
                  />
                  <Label htmlFor={`roomtype-${roomType.id}`}>{roomType.name}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Mapping Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-medium mb-2">Selected Cities ({selectedCities.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCities.length > 0 ? (
                    selectedCities.map(cityId => (
                      <Badge key={cityId} variant="outline">
                        {getCityName(cityId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No cities selected</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Selected Hotels ({selectedHotels.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHotels.length > 0 ? (
                    selectedHotels.slice(0, 5).map(hotelId => (
                      <Badge key={hotelId} variant="outline">
                        {getHotelName(hotelId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No hotels selected</span>
                  )}
                  {selectedHotels.length > 5 && (
                    <Badge variant="outline">+{selectedHotels.length - 5} more</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Selected Room Types ({selectedRoomTypes.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoomTypes.length > 0 ? (
                    selectedRoomTypes.map(roomTypeId => (
                      <Badge key={roomTypeId} variant="outline">
                        {getRoomTypeName(roomTypeId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">All room types (no restriction)</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit">
            Save Mapping
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponMappingForm;