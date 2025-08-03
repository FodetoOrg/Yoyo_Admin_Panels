
import { z } from "zod";
import { ROUTES } from "@/lib/utils/constants";
import type { FormConfig } from "@/lib/types/dynamicForm";
import { apiService } from "@/lib/utils/api";

interface HourlyStayData {
  id: string;
  roomId: string;
  hours: number;
  price: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface RoomData {
  id: string;
  name: string;
  roomNumber: string;
  hotelId: string;
}

export const getFormConfig = (
  roomId: string,
  roomData: RoomData,
  hourlyStayData?: HourlyStayData | null
): FormConfig => {
  const isEditing = !!hourlyStayData;

  const fields = [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Package name is required.",
      }),
      label: "Package Name",
      placeholder: "e.g., 3-Hour Quick Stay, 6-Hour Business Package",
      space: 2,
      order: 1,
    },
    {
      name: "hours",
      type: "input",
      validation: z.number().min(1, {
        message: "Hours must be at least 1.",
      }).max(24, {
        message: "Hours cannot exceed 24.",
      }),
      label: "Duration (Hours)",
      placeholder: "Number of hours for this package",
      space: 1,
      inputType: "number",
      order: 2,
    },
    {
      name: "price",
      type: "input",
      validation: z.number().min(0, {
        message: "Price must be a positive number.",
      }),
      label: "Price (₹)",
      placeholder: "Price for this hourly package",
      space: 1,
      inputType: "number",
      order: 3,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string().optional(),
      label: "Description",
      placeholder: "Optional description of what's included in this package",
      space: 2,
      order: 4,
    },
    {
      name: "isActive",
      type: "select",
      validation: z.string(),
      label: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      space: 1,
      order: 5,
    },
  ];

  const formConfig: FormConfig = {
    title: isEditing ? "Edit Hourly Stay Package" : "Add Hourly Stay Package",
    description: `${isEditing ? "Update" : "Create"} hourly stay package for ${roomData.name}`,
    method: isEditing ? "PUT" : "POST",
    action: isEditing
      ? ROUTES.UPDATE_HOURLY_STAY_ROUTE(hourlyStayData!.id)
      : ROUTES.CREATE_HOURLY_STAY_ROUTE,
    fields,
    submitText: isEditing ? "Update Package" : "Create Package",
    cancelUrl: `/admin/rooms/${roomId}/hourly-stays`,
    successRedirect: `/admin/rooms/${roomId}/hourly-stays`,
  };

  const defaultValues = hourlyStayData ? {
    name: hourlyStayData.name,
    hours: hourlyStayData.hours,
    price: hourlyStayData.price,
    description: hourlyStayData.description || "",
    isActive: hourlyStayData.isActive.toString(),
  } : {
    isActive: "true",
  };

  // Add roomId to the request body for creation
  const transformData = (data: any) => {
    const transformedData = {
      ...data,
      hours: parseInt(data.hours),
      price: parseFloat(data.price),
      isActive: data.isActive === "true",
    };

    // Add roomId for creation
    if (!isEditing) {
      transformedData.roomId = roomId;
    }

    return transformedData;
  };

  return {
    ...formConfig,

    defaultValues:isEditing?defaultValues:null,
    transformData,
    onSubmit: async (values: any, isUpdate: boolean) => {
      try {
        console.log('Hotel addon form values:', values);

        if (isUpdate) {
          return await apiService.put(ROUTES.UPDATE_HOURLY_STAY_ROUTE(hourlyStayData!.id), values);
        } else {
          return await apiService.post(ROUTES.CREATE_HOURLY_STAY_ROUTE, {
            ...values,
            roomId:roomId
          });
        }
      } catch (error) {
        console.error("Error saving addon:", error);
        return {
          success: false,
          message: "An error occurred while saving the addon. Please try again."
        };
      }
    }
  };

};
