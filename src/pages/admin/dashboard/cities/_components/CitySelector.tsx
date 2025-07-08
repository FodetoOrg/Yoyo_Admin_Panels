import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectorProps {
  cities: Array<{
    id: string;
    name: string;
    state: string;
  }>;
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

const CitySelector = ({ cities, selectedCity, onCityChange }: CitySelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Select City:</span>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Choose a city..." />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}, {city.state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;