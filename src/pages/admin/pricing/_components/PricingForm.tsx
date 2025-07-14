import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface PricingFormProps {
  cities: Array<{ id: string; name: string }>;
  hotels: Array<{ id: string; name: string; cityId: string }>;
  roomTypes: Array<{ id: string; name: string }>;
}

const PricingForm = ({ cities, hotels, roomTypes }: PricingFormProps) => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [priceAdjustment, setPriceAdjustment] = useState({
    type: "percentage", // percentage or fixed
    value: 0,
    reason: ""
  });
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredHotels = selectedCities.length > 0 
    ? hotels.filter(hotel => selectedCities.includes(hotel.cityId))
    : hotels;

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
    }
  };

  const handleRoomTypeChange = (roomTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoomTypes([...selectedRoomTypes, roomTypeId]);
    } else {
      setSelectedRoomTypes(selectedRoomTypes.filter(id => id !== roomTypeId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    const pricingData = {
      cities: selectedCities,
      hotels: selectedHotels,
      roomTypes: selectedRoomTypes,
      adjustmentType: priceAdjustment.type,
      adjustmentValue: priceAdjustment.value,
      reason: priceAdjustment.reason,
      effectiveDate: new Date(effectiveDate).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
    };

    try {
      const response = await apiService.post(ROUTES.CREATE_PRICE_ADJUSTMENT_ROUTE, pricingData);
      
      if (response.success) {
        setSuccess("Price adjustment created successfully");
        // Reset form
        setSelectedCities([]);
        setSelectedHotels([]);
        setSelectedRoomTypes([]);
        setPriceAdjustment({ type: "percentage", value: 0, reason: "" });
        setEffectiveDate("");
        setExpiryDate("");
      } else {
        setError(response.message || "Failed to create price adjustment");
      }
    } catch (error) {
      console.error("Error creating price adjustment:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cities Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Cities</CardTitle>
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
              <CardTitle>Select Hotels</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`hotel-${hotel.id}`}
                    checked={selectedHotels.includes(hotel.id)}
                    onCheckedChange={(checked) => handleHotelChange(hotel.id, !!checked)}
                  />
                  <Label htmlFor={`hotel-${hotel.id}`}>{hotel.name}</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Room Types Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Room Types</CardTitle>
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

        {/* Price Adjustment */}
        <Card>
          <CardHeader>
            <CardTitle>Price Adjustment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adjustment-type">Adjustment Type</Label>
                <Select
                  value={priceAdjustment.type}
                  onValueChange={(value) => 
                    setPriceAdjustment({ ...priceAdjustment, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adjustment-value">
                  {priceAdjustment.type === "percentage" ? "Percentage" : "Amount"}
                </Label>
                <Input
                  id="adjustment-value"
                  type="number"
                  value={priceAdjustment.value}
                  onChange={(e) => 
                    setPriceAdjustment({ 
                      ...priceAdjustment, 
                      value: parseFloat(e.target.value) || 0 
                    })
                  }
                  placeholder={priceAdjustment.type === "percentage" ? "10" : "50"}
                />
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={priceAdjustment.reason}
                  onChange={(e) => 
                    setPriceAdjustment({ ...priceAdjustment, reason: e.target.value })
                  }
                  placeholder="e.g., Peak season, Holiday pricing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="effective-date">Effective Date</Label>
                <Input
                  id="effective-date"
                  type="datetime-local"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                <Input
                  id="expiry-date"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Cities:</span>
                {selectedCities.length > 0 ? (
                  selectedCities.map(cityId => {
                    const city = cities.find(c => c.id === cityId);
                    return (
                      <Badge key={cityId} variant="outline">
                        {city?.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">All cities</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Hotels:</span>
                {selectedHotels.length > 0 ? (
                  selectedHotels.slice(0, 3).map(hotelId => {
                    const hotel = hotels.find(h => h.id === hotelId);
                    return (
                      <Badge key={hotelId} variant="outline">
                        {hotel?.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">All hotels</span>
                )}
                {selectedHotels.length > 3 && (
                  <Badge variant="outline">+{selectedHotels.length - 3} more</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Room Types:</span>
                {selectedRoomTypes.length > 0 ? (
                  selectedRoomTypes.map(roomTypeId => {
                    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
                    return (
                      <Badge key={roomTypeId} variant="outline">
                        {roomType?.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">All room types</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Price Adjustment:</span>
                <Badge variant="secondary">
                  {priceAdjustment.type === "percentage" 
                    ? `+${priceAdjustment.value}%` 
                    : `+$${priceAdjustment.value}`
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Preview Changes
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Applying Changes..." : "Apply Pricing Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PricingForm;