import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { ROOM_AMENITIES_OPTIONS } from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Room Type",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Room type name is required.",
      }),
      label: "Room Type Name",
      placeholder: "e.g., Standard Room, Deluxe Suite",
      space: 1,
      order: 1,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Describe the room type features and amenities",
      space: 2,
      order: 2,
    },
    {
      name: "basePrice",
      type: "input",
      validation: z.number().min(1, {
        message: "Base price is required.",
      }),
      label: "Base Price ($)",
      placeholder: "Base price per night",
      space: 1,
      inputType: "number",
      order: 3,
    },
    {
      name: "maxOccupancy",
      type: "input",
      validation: z.number().min(1, {
        message: "Maximum occupancy is required.",
      }),
      label: "Maximum Occupancy",
      placeholder: "Maximum number of guests",
      space: 1,
      inputType: "number",
      order: 4,
    },
    {
      name: "amenities",
      type: "multiselect",
      validation: z.array(z.string()),
      label: "Standard Amenities",
      options: ROOM_AMENITIES_OPTIONS,
      space: 2,
      order: 5,
    },
    {
      name: "status",
      type: "select",
      validation: z.string(),
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      space: 1,
      order: 6,
    },
  ],
  columns: 2,
  onsuccess: "/admin/room-types",
  onSubmit: async (values, isUpdate) => {
    console.log("Room type form values:", values);
    
    if (isUpdate) {
      // return await apiService.put(`/api/room-types/${values.id}`, values);
      return { success: true, message: "Room type updated successfully" };
    } else {
      // return await apiService.post("/api/room-types", values);
      return { success: true, message: "Room type created successfully" };
    }
  },
};

export default formConfig;