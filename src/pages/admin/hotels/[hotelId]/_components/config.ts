import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import {
  AMENITIES_OPTIONS,
  ROUTES,
  STATES_OPTIONS,
} from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Hotel",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Hotel name is required.",
      }),
      label: "Hotel Name",
      placeholder: "Enter hotel name",
      space: 1,
      order: 1,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Enter hotel description",
      space: 1,
      order: 3,
    },
    {
      name: "address",
      type: "input",
      validation: z.string(),
      label: "Address",
      placeholder: "Enter hotel address",
      space: 1,
      order: 4,
    },
    {
      name: "zipCode",
      type: "input",
      validation: z.string(),
      label: "ZIP Code",
      placeholder: "Enter ZIP code",
      space: 1,
      order: 5,
    },
    {
      name: "starRating",
      type: "select",
      isSearchable: true,
      validation: z.string().min(1, {
        message: "Star rating is required.",
      }),
      label: "Star Rating",
      options: [
        { label: "1 Star", value: "1 Star" },
        { label: "2 Stars", value: "2 Star" },
        { label: "3 Stars", value: "3 Star" },
        { label: "4 Stars", value: "4 Star" },
        { label: "5 Stars", value: "5 Star" },
      ],
      space: 1,
    },
    {
      name: "amenities",
      type: "multiselect",
      validation: z.array(z.string()),
      label: "Amenities",
      options: AMENITIES_OPTIONS,
      space: 1,
    },
    {
      name: "latitude",
      type: "input",
      validation: z.number(),
      label: "Latitude",
      placeholder: "Enter latitude",
      space: 1,
      inputType: "number",
    },
    {
      name: "longitude",
      type: "input",
      validation: z.number(),
      label: "Longitude",
      placeholder: "Enter longitude",
      space: 1,
      inputType: "number",
    },
    {
      name: "commissionRate",
      type: "input",
      validation: z.number().min(0).max(100),
      label: "Commission Rate (%)",
      placeholder: "Commission percentage (e.g., 15)",
      space: 1,
      inputType: "number",
      order: 15,
    },
    // onlinePaymentEnabled
    {
      name: "onlinePaymentEnabled",
      type: "select",
      validation: z.string().optional(),
      label: "Online Payment Enable",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      space: 1,
      isSearchable: true,
      order: 3,
    },
    {
      name: "gstPercentage",
      type: "input",
      validation: z.number().min(0).max(100),
      label: "GST percentage (%)",
      placeholder: "validation percentage (e.g., 18)",
      space: 1,
      inputType: "number",
      order: 15,
    },

    {
      name: "images",
      type: "file",
      validation: z.any(),
      label: "Hotel Images",
      maxFiles: 4,
      maxFileSize: 4 * 1024 * 1024,
      space: 2,
    },
  ],
  columns: 2,
  onsuccess: '/admin/hotels',
  onSubmit: async (values: any, isUpdate: boolean) => {
    try {
      console.log('values are ', values)
      // Format mapCoordinates
      let mapCoordinates = values.mapCoordinates;
      if (values.latitude && values.longitude) {
        mapCoordinates = `${values.latitude},${values.longitude}`;



      }
      if (typeof values.onlinePaymentEnabled === 'string') {
        values.onlinePaymentEnabled = values.onlinePaymentEnabled === 'true';
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

export default formConfig;
