import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { getCurrentUser, getEffectiveHotelId, isSuperAdmin } from "@/lib/utils/auth";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";

interface RoomData {
  id?: string;
  hotelId: string;
  roomNumber: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  bedType: string;
  size: number;
  pricePerNight: number;
  pricePerHour?: number;
  isHourlyBooking: boolean;
  isDailyBooking: boolean;
  amenities: string[];
  images: string[];
  status: string;
  floor: number;
}

interface Props {
  roomData?: RoomData | null;
  hotels: Array<{ id: string; name: string }>;
  isSuperAdmin: boolean,
  effectiveHotelId: string

}

const RoomForm = ({ roomData, hotels, isSuperAdmin, effectiveHotelId,roomTypes }: Props) => {




  const getFormConfig = () => {
    // Hotel selection field (only for super admin when not viewing as hotel admin)
    const hotelField = {
      name: "hotelId",
      type: "select" as const,
      validation: z.string().min(1, {
        message: "Hotel is required.",
      }),
      label: "Hotel",
      options: hotels.map((hotel) => ({
        label: hotel.name,
        value: hotel.id,
      })),
      space: 1,
      isSearchable: true,
      order: 0,
      editable: !roomData, // Only editable when creating new room
    };

    // Status field (only for editing existing rooms)
    const statusField = {
      name: "status",
      type: "select" as const,
      validation: z.string(),
      label: "Room Status",
      options: [
        { label: "Available", value: "available" },
        { label: "Occupied", value: "occupied" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Out of Order", value: "out_of_order" },
      ],
      space: 1,
      order: 15,
    };

    let fields = [...formConfig.fields];

    // Add hotel field if super admin and no effective hotel
    if (isSuperAdmin) {
      fields = [hotelField, ...fields];
    }

    // Add status field if editing existing room
    if (!roomData) {
      fields = [...fields, statusField];
      return {
        ...formConfig,
        title: roomData ? "Edit Room" : "Add Room",
        fields,
      };
    }

    if (roomData) {
      fields = [...fields, statusField];

      // Add ID field for editing
      const idField = {
        name: "id",
        type: "input" as const,
        validation: z.string(),
        label: "Room ID",
        placeholder: "Room ID",
        space: 1,
        editable: false,
        order: -1,
      };
      fields = [idField, ...fields];
    }

    const defaultValues = roomData ? {
      id: roomData.id,
      hotelId: roomData.hotelId,
      roomNumber: roomData.roomNumber,
      name: roomData.name,
      type: roomData.type,
      description: roomData.description,
      capacity: roomData.capacity,
      bedType: roomData.bedType,
      size: roomData.size,
      floor: roomData.floor,
      pricePerNight: roomData.pricePerNight,
      pricePerHour: roomData.pricePerHour,
      isHourlyBooking: roomData.isHourlyBooking,
      isDailyBooking: roomData.isDailyBooking,
      amenities: roomData.amenities || [],
      images: roomData.images || [],
      status: roomData.status,
    } : (effectiveHotelId ? { hotelId: effectiveHotelId } : {});

    return {
      ...formConfig,
      title: roomData ? "Edit Room" : "Add Room",
      fields,
      defaultValues,
    };
  };

  // Update the onSubmit function in the form config to use the actual API
  const updatedFormConfig = {
    ...getFormConfig(),

  };

  return (
    <PageContainer>
      <DynamicForm config={updatedFormConfig} />
    </PageContainer>
  );
};

export default RoomForm;