
import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, DollarSign, Edit, Save, AlertCircle } from "lucide-react";
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
  const [editingForm, setEditingForm] = useState<number | null>(null);

  // Initialize form states for 3h, 6h, 9h
  const getInitialFormData = (hours: number) => {
    const existingStay = hourlyStays.find(stay => stay.hours === hours);
    return {
      id: existingStay?.id || null,
      name: existingStay?.name || `${hours} Hour Package`,
      price: existingStay?.price || 0,
      description: existingStay?.description || "",
      isActive: existingStay?.isActive || true,
    };
  };

  const [formData3h, setFormData3h] = useState(getInitialFormData(3));
  const [formData6h, setFormData6h] = useState(getInitialFormData(6));
  const [formData9h, setFormData9h] = useState(getInitialFormData(9));

  const handleSave = async (hours: number) => {
    const formData = hours === 3 ? formData3h : hours === 6 ? formData6h : formData9h;
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        hours: hours,
        price: parseFloat(formData.price.toString()),
        description: formData.description,
        isActive: formData.isActive,
        roomId: roomId,
      };

      let response;
      if (formData.id) {
        // Update existing
        response = await apiService.put(ROUTES.UPDATE_HOURLY_STAY_ROUTE(formData.id), payload);
      } else {
        // Create new
        response = await apiService.post(ROUTES.CREATE_HOURLY_STAY_ROUTE, payload);
      }

      if (response.success) {
        window.location.reload();
      } else {
        alert(response.message || "Failed to save hourly stay package");
      }
    } catch (error) {
      console.error("Error saving hourly stay:", error);
      alert("An error occurred while saving the hourly stay package");
    } finally {
      setLoading(false);
      setEditingForm(null);
    }
  };

  const updateFormData = (hours: number, field: string, value: any) => {
    if (hours === 3) {
      setFormData3h(prev => ({ ...prev, [field]: value }));
    } else if (hours === 6) {
      setFormData6h(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData9h(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderForm = (hours: number, formData: any) => {
    const isEditing = editingForm === hours;
    const hasData = formData.id !== null;

    return (
      <Card key={hours} className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{hours} Hour Package</CardTitle>
            {hasData && (
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingForm(hours)}
                disabled={loading}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleSave(hours)}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`name-${hours}`}>Package Name</Label>
            <Input
              id={`name-${hours}`}
              value={formData.name}
              onChange={(e) => updateFormData(hours, 'name', e.target.value)}
              disabled={!isEditing}
              placeholder={`${hours} Hour Package`}
            />
          </div>
          <div>
            <Label htmlFor={`price-${hours}`}>Price (₹)</Label>
            <Input
              id={`price-${hours}`}
              type="number"
              value={formData.price}
              onChange={(e) => updateFormData(hours, 'price', e.target.value)}
              disabled={!isEditing}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor={`description-${hours}`}>Description</Label>
            <Textarea
              id={`description-${hours}`}
              value={formData.description}
              onChange={(e) => updateFormData(hours, 'description', e.target.value)}
              disabled={!isEditing}
              placeholder="Package description..."
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`active-${hours}`}>Active</Label>
            <input
              id={`active-${hours}`}
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => updateFormData(hours, 'isActive', e.target.checked)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalActivePackages = [formData3h, formData6h, formData9h].filter(f => f.id && f.isActive).length;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Hourly Stay Packages</h1>
          <p className="text-muted-foreground">
            Manage hourly stay packages for {roomData.name} (Room {roomData.roomNumber})
          </p>
          
          {totalActivePackages < 3 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Note: Hourly stays will only reflect when all 3 hourly packages (3h, 6h, 9h) are added and active.
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivePackages}/3</div>
              <p className="text-xs text-muted-foreground">
                Active packages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{[formData3h, formData6h, formData9h].reduce((sum, f) => f.id && f.isActive ? sum + parseFloat(f.price.toString() || '0') : sum, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined package value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6h</div>
              <p className="text-xs text-muted-foreground">
                Average hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forms Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {renderForm(3, formData3h)}
          {renderForm(6, formData6h)}
          {renderForm(9, formData9h)}
        </div>
      </div>
    </PageContainer>
  );
};

export default Screen;
