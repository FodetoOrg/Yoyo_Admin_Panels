import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { ROOM_AMENITIES_OPTIONS, ROOM_TYPES, ROUTES } from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Room",
  fields: [
    {
      name: "roomNumber",
      type: "input",
      validation: z.string().min(1, {
        message: "Room number is required.",
      }),
      label: "Room Number",
      placeholder: "e.g., 101, A-205",
      space: 1,
      order: 1,
    },
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Room name is required.",
      }),
      label: "Room Name",
      placeholder: "e.g., Deluxe King Room",
      space: 1,
      order: 2,
    },
    {
      name: "type",
      type: "select",
      validation: z.string().min(1, {
        message: "Room type is required.",
      }),
      label: "Room Type",
      options: ROOM_TYPES,
      space: 1,
      isSearchable: true,
      order: 3,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Describe the room features and amenities",
      space: 2,
      order: 4,
    },
    {
      name: "capacity",
      type: "input",
      validation: z.number().min(1, {
        message: "Capacity must be at least 1.",
      }),
      label: "Guest Capacity",
      placeholder: "Maximum number of guests",
      space: 1,
      inputType: "number",
      order: 5,
    },
    {
      name: "bedType",
      type: "input",
      validation: z.string().min(1, {
        message: "Bed type is required.",
      }),
      label: "Bed Type",
      placeholder: "e.g., King, Queen, Twin",
      space: 1,
      order: 6,
    },
    {
      name: "size",
      type: "input",
      validation: z.number().min(1, {
        message: "Room size is required.",
      }),
      label: "Room Size (sq ft)",
      placeholder: "Room size in square feet",
      space: 1,
      inputType: "number",
      order: 7,
    },
    {
      name: "floor",
      type: "input",
      validation: z.number().min(1, {
        message: "Floor number is required.",
      }),
      label: "Floor Number",
      placeholder: "Which floor is this room on",
      space: 1,
      inputType: "number",
      order: 8,
    },
    {
      name: "pricePerNight",
      type: "input",
      validation: z.number().min(1, {
        message: "Price per night is required.",
      }),
      label: "Price per Night ($)",
      placeholder: "Nightly rate",
      space: 1,
      inputType: "number",
      order: 9,
    },
    {
      name: "pricePerHour",
      type: "input",
      validation: z.number().optional(),
      label: "Price per Hour ($)",
      placeholder: "Hourly rate (optional)",
      space: 1,
      inputType: "number",
      order: 10,
    },
    {
      name: "isHourlyBooking",
      type: "select",
      validation: z.boolean(),
      label: "Allow Hourly Booking",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      space: 1,
      order: 11,
    },
    {
      name: "isDailyBooking",
      type: "select",
      validation: z.boolean(),
      label: "Allow Daily Booking",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      space: 1,
      order: 12,
    },
    {
      name: "amenities",
      type: "multiselect",
      validation: z.array(z.string()),
      label: "Room Amenities",
      options: ROOM_AMENITIES_OPTIONS,
      space: 2,
      order: 13,
    },
    {
      name: "images",
      type: "file",
      validation: z.any(),
      label: "Room Images",
      maxFiles: 6,
      maxFileSize: 4 * 1024 * 1024,
      space: 2,
      order: 14,
    },
  ],
  columns: 2,
  onsuccess: "/admin/rooms",
  onSubmit: async (values, isUpdate) => {
    console.log("Room form values:", values);
    
    if (isUpdate) {
      // return await apiService.put(ROUTES.UPDATE_ROOM_ROUTE(values.hotelId, values.id), values);
      return { success: true, message: "Room updated successfully" };
    } else {
      // return await apiService.post(ROUTES.CREATE_ROOM_ROUTE(values.hotelId), values);
      return { success: true, message: "Room created successfully" };
    }
  },
};

export default formConfig;