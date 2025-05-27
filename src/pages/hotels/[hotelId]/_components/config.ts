import type { FormConfig } from "@/lib/types";
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
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Enter hotel description",
      space: 1,
    },
    {
      name: "address",
      type: "textarea",
      validation: z.string(),
      label: "Address",
      placeholder: "Enter hotel address",
      space: 1,
    },
    {
      name: "city",
      type: "input",
      validation: z.string(),
      label: "City",
      placeholder: "Enter city",
      space: 1,
    },
    {
      name: "state",
      type: "input",
      validation: z.string(),
      label: "State",
      placeholder: "Enter state",
      space: 1,
    },
    {
      name: "country",
      type: "input",
      validation: z.string(),
      label: "Country",
      placeholder: "Enter country",
      space: 1,
    },
    {
      name: "zipCode",
      type: "input",
      validation: z.string(),
      label: "ZIP Code",
      placeholder: "Enter ZIP code",
      space: 1,
    },
    {
      name: "starRating",
      type: "select",
      validation: z.number().int().min(1).max(5).optional(),
      label: "Star Rating",
      options: [
        { label: "1 Star", value: "1" },
        { label: "2 Stars", value: "2" },
        { label: "3 Stars", value: "3" },
        { label: "4 Stars", value: "4" },
        { label: "5 Stars", value: "5" },
      ],
      space: 1,
    },
    {
      name: "amenities",
      type: "multiselect",
      validation: z.array(z.string()).optional(),
      label: "Amenities",
      options: [
        { label: "WiFi", value: "wifi" },
        { label: "Pool", value: "pool" },
        { label: "Gym", value: "gym" },
        { label: "Restaurant", value: "restaurant" },
        { label: "Spa", value: "spa" },
        { label: "Parking", value: "parking" },
        { label: "Room Service", value: "room_service" },
        { label: "Business Center", value: "business_center" },
      ],
      space: 2,
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
  onSubmit: async (values, isUpdate) => {
    console.log("Form values:", values);
    try {
      if (isUpdate) {
        // return await actions.updateHotel({
        //   ...values,
        // });
      } else {
        // return await actions.createHotel({
        //   ...values,
        // });
      }
    } catch (e) {
      console.log("e is ", e);
    }
  },
  onFileUpload: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('productName', 'hotel');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.urls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },
};

export default formConfig;
