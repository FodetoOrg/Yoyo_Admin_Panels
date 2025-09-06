import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { UserRole } from "@/lib/utils/auth";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";

interface RoomData {
  id?: string;
  hotelId: string;
  roomNumber: string;
  name: string;
  type?: string;
  description?: string;
  capacity: number;
  bedType?: string;
  size?: number;
  pricePerNight: number;
  pricePerHour?: number;
  isHourlyBooking?: boolean;
  isDailyBooking?: boolean;
  amenities?: string[];
  images?: Array<{ id: string; url: string; isPrimary: boolean }>;
  status?: string;
  floor?: number;
  roomTypeId?: string;
  roomType?: { id: string; name: string };
}

interface Props {
  roomData?: RoomData | null;
  hotels: Array<{ id: string; name: string }>;
  roomTypes: Array<{ id: string; name: string }>;
  currentUser: any;
}

const RoomForm = ({ roomData, hotels, roomTypes, currentUser }: Props) => {
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const effectiveHotelId = currentUser.role === UserRole.HOTEL_ADMIN ? currentUser.hotelId : null;

  console.log('roomTypes from RoomForm', roomTypes)
  console.log('hotels from RoomForm', hotels)
  console.log('roomData from RoomForm', roomData)
  console.log('currentUser from RoomForm', currentUser)
  
  // Debug the actual values being received
  if (roomData) {
    console.log('Room data fields:', {
      isHourlyBooking: roomData.isHourlyBooking,
      isDailyBooking: roomData.isDailyBooking,
      amenities: roomData.amenities,
      typeOfHourly: typeof roomData.isHourlyBooking,
      typeOfDaily: typeof roomData.isDailyBooking,
      images: roomData.images,
      imagesType: typeof roomData.images,
      firstImage: roomData.images?.[0],
      imageKeys: roomData.images?.[0] ? Object.keys(roomData.images[0]) : 'no images',
    });
  }
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

    // Update room type field with actual room types
    const roomTypeFieldIndex = fields.findIndex(f => f.name === 'roomTypeId');
    if (roomTypeFieldIndex !== -1) {
      fields[roomTypeFieldIndex] = {
        ...fields[roomTypeFieldIndex],
        options: roomTypes.map(rt => ({
          label: rt.name,
          value: rt.id,
        })),
      };
    }

    // Add hotel field if super admin and no effective hotel
    if (isSuperAdmin && !effectiveHotelId) {
      fields = [hotelField, ...fields];
    }

    // Add status field if editing existing room
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
      roomTypeId: roomData.roomTypeId,
      description: roomData.description,
      capacity: roomData.capacity,
      bedType: roomData.bedType,
      size: roomData.size,
      floor: roomData.floor,
      pricePerNight: roomData.pricePerNight,
      pricePerHour: roomData.pricePerHour,
      // Convert boolean values to strings for the select fields
      isHourlyBooking: String(roomData.isHourlyBooking),
      isDailyBooking: String(roomData.isDailyBooking),
      amenities: roomData.amenities || [],
      // Extract URLs from image objects - handle different possible structures
      images: (() => {
        const extractedUrls = roomData.images?.map((img: any) => {
          console.log('Processing image:', img);
          // If it's already a string, return it
          if (typeof img === 'string') return img;
          // If it's an object, try to get the URL from various possible properties
          if (img && typeof img === 'object') {
            const url = img.url || img.imageUrl || img.image || '';
            console.log('Extracted URL:', url);
            return url;
          }
          return '';
        }).filter(url => url) || [];
        console.log('Final extracted URLs:', extractedUrls);
        return extractedUrls;
      })(),
      status: roomData.status,
    } : (effectiveHotelId ? {
      hotelId: effectiveHotelId,
      isHourlyBooking: "true",
      isDailyBooking: "true",
    } : {
      isHourlyBooking: "true",
      isDailyBooking: "true",
    });

    // Debug the actual defaultValues being set
    console.log('Default values being set:', defaultValues);
    console.log('Images in defaultValues:', defaultValues.images);

    const finalConfig = {
      ...formConfig,
      title: roomData ? "Edit Room" : "Add Room",
      fields,
      defaultValues: roomData ? defaultValues : (effectiveHotelId ? {
        hotelId: effectiveHotelId,
        isHourlyBooking: "true",
        isDailyBooking: "true",
      } : {
        isHourlyBooking: "true",
        isDailyBooking: "true",
      })
    };
    
    console.log('Final config being returned:', finalConfig);
    console.log('Final config images:', finalConfig.defaultValues?.images);
    
    return finalConfig;
  };

  // Use a key to force re-render when roomData changes
  const formKey = roomData ? `room-${roomData.id}` : 'new-room';
  
  return (
    <PageContainer>
      <DynamicForm key={formKey} config={getFormConfig()} />
    </PageContainer>
  );
};

export default RoomForm;