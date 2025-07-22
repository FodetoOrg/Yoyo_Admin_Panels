import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface RoomAddonMappingProps {
  roomId: string;
  roomName: string;
  hotelId: string;
  hotelName: string;
  availableAddons: Array<{
    id: string;
    name: string;
    description?: string;
    image?: string;
    price: number;
    status: string;
  }>;
  currentAddons: Array<{
    id: string;
    addonId: string;
    addon: {
      id: string;
      name: string;
      description?: string;
      image?: string;
      price: number;
      status: string;
    };
  }>;
}

const RoomAddonMapping = ({ 
  roomId, 
  roomName, 
  hotelId,
  hotelName,
  availableAddons, 
  currentAddons 
}: RoomAddonMappingProps) => {
  // Combine all addons (available + currently mapped)
  const allAddons = React.useMemo(() => {
    // Create a map to avoid duplicates
    const addonMap = new Map();
    
    // Add available addons
    availableAddons.forEach(addon => {
      addonMap.set(addon.id, addon);
    });
    
    // Add currently mapped addons (in case some aren't in availableAddons)
    currentAddons.forEach(mapping => {
      if (!addonMap.has(mapping.addon.id)) {
        addonMap.set(mapping.addon.id, mapping.addon);
      }
    });
    
    return Array.from(addonMap.values());
  }, [availableAddons, currentAddons]);

  // Extract currently mapped addon IDs
  const currentAddonIds = currentAddons.map(mapping => mapping.addon.id);
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>(currentAddonIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons([...selectedAddons, addonId]);
    } else {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await apiService.put(ROUTES.UPDATE_ROOM_ADDONS_ROUTE(hotelId, roomId), {
        addonIds: selectedAddons
      });
      
      if (response.success) {
        setSuccess("Room addons updated successfully");
        setTimeout(() => {
          window.location.href = "/admin/rooms";
        }, 1500);
      } else {
        setError(response.message || "Failed to update room addons");
      }
    } catch (error) {
      console.error("Error updating room addons:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAddonPrice = (addonId: string) => {
    const addon = allAddons.find(a => a.id === addonId);
    return addon?.price || 0;
  };

  const totalPrice = selectedAddons.reduce((total, addonId) => {
    return total + getAddonPrice(addonId);
  }, 0);

  const isCurrentlyMapped = (addonId: string) => {
    return currentAddonIds.includes(addonId);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Map Addons to Room: {roomName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Hotel: {hotelName}
          </p>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* All Addons Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Addons ({allAddons.length})</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select/deselect addons to map to this room. Currently mapped addons are pre-selected.
            </p>
          </CardHeader>
          <CardContent>
            {allAddons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allAddons.map((addon) => (
                  <div 
                    key={addon.id} 
                    className={`p-4  border rounded-lg transition-all duration-200 ${
                      selectedAddons.includes(addon.id) 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={selectedAddons.includes(addon.id)}
                        onCheckedChange={(checked) => handleAddonChange(addon.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Label 
                            htmlFor={`addon-${addon.id}`} 
                            className="font-medium cursor-pointer text-sm leading-tight"
                          >
                            {addon.name}
                          </Label>
                          {isCurrentlyMapped(addon.id) && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              Currently Mapped
                            </Badge>
                          )}
                        </div>
                        
                        {addon.image && (
                          <div className="mb-2">
                            <img 
                              src={addon.image} 
                              alt={addon.name}
                              className="w-full h-40 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {addon.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {addon.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600 text-sm">
                            ₹{addon.price.toLocaleString()}
                          </span>
                          <Badge 
                            variant={addon.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {addon.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No addons available for this hotel</p>
                <Button variant="outline" className="mt-4">
                  <a href={`/admin/hotels/${hotelId}/addons/new`}>
                    Create First Addon
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Addons Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="font-medium mb-2">
                  Selected Addons ({selectedAddons.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAddons.length > 0 ? (
                    selectedAddons.map(addonId => {
                      const addon = allAddons.find(a => a.id === addonId);
                      return addon ? (
                        <Badge key={addonId} variant="outline" className="flex items-center gap-1">
                          {addon.name}
                          <span className="text-green-600 font-medium">
                            ₹{addon.price.toLocaleString()}
                          </span>
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">No addons selected</span>
                  )}
                </div>
              </div>

              {selectedAddons.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Additional Cost:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
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
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Room Addons"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoomAddonMapping;