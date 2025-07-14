import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";

interface HotelData {
  id?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  ownerId?: string;
  zipCode: string;
  starRating?: number;
  amenities?: string[];
  cityId?: string;
  mapCoordinates?: string;
  commissionRate?: number;
  images?: Array<{
    data: string;
    fileName: string;
    contentType: string;
  }>;
}

interface Props {
  hotelData?: HotelData | null;
  hotelUsers: {
    id: string;
    phone: string;
  }[];
  cities: {
    label: string;
    value: string;
  }[];
}

const NewHotelScreen = ({ hotelData, hotelUsers, cities }: Props) => {
  const getFormConfig = () => {
    const hotelUsersField = {
      name: "ownerId",
      type: "select",
      validation: z.string().min(1, {
        message: "Hotel user is required.",
      }),
      label: "Hotel Admin",
      options: hotelUsers.map((user) => ({
        label: user.phone,
        value: user.id,
      })),
      space: 1,
      isSearchable: true,
      order: 2,
    };

    const cityField = {
      name: "cityId",
      type: "select",
      validation: z.string().min(1, {
        message: "City is required.",
      }),
      label: "City",
      options: cities,
      space: 1,
      isSearchable: true,
      order: 6,
    };

    if (!hotelData)
      return {
        ...formConfig,
        fields: [hotelUsersField, ...formConfig.fields, cityField],
        title: "Add Hotel",
      };

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Hotel ID",
      placeholder: "Hotel ID",
      space: 1,
      editable: false,
      order: 0,
    };

    return {
      ...formConfig,
      defaultValues: {
        id: hotelData.id,
        name: hotelData.name,
        description: hotelData.description,
        address: hotelData.address,
        city: hotelData.city,
        ownerId: hotelData.ownerId,
        zipCode: hotelData.zipCode,
        starRating: hotelData.starRating?.toString(),
        amenities: hotelData.amenities || [],
        images: hotelData.images || [],
        cityId: hotelData.cityId,
        latitude: Number(hotelData.mapCoordinates?.split(",")[0]),
        longitude: Number(hotelData.mapCoordinates?.split(",")[1]),
        commissionRate: hotelData.commissionRate || 15,
      },
      fields: [idField, hotelUsersField, cityField, ...formConfig.fields],
    };
  };
  
  // Update the onSubmit function in the form config to use the actual API
  const updatedFormConfig = {
    ...getFormConfig(),
    onSubmit: async (values: any, isUpdate: boolean) => {
      try {
        // Format mapCoordinates
        let mapCoordinates = values.mapCoordinates;
        if (values.latitude && values.longitude) {
          mapCoordinates = `${values.latitude},${values.longitude}`;
        }
        
        const formattedValues = {
          ...values,
          mapCoordinates
        };
        
        if (isUpdate) {
          return await apiService.put(ROUTES.GET_HOTEL_ROUTE(values.id), formattedValues);
        } else {
          return await apiService.post(ROUTES.CREATE_HOTEL_ROUTE, formattedValues);
        }
      } catch (error) {
        console.error("Error saving hotel:", error);
        return { 
          success: false, 
          message: "An error occurred while saving the hotel. Please try again." 
        };
      }
    }
  };

  return (
    <PageContainer>
      <DynamicForm config={updatedFormConfig} />
    </PageContainer>
  );
};

export default NewHotelScreen;
