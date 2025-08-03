import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Addon",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Addon name is required.",
      }),
      label: "Addon Name",
      placeholder: "e.g., Extra Towels, Room Service",
      space: 1,
      order: 1,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Describe the addon service",
      space: 2,
      order: 2,
    },
    {
      name: "price",
      type: "input",
      validation: z.number().min(0, {
        message: "Price must be 0 or greater.",
      }),
      label: "Price ($)",
      placeholder: "Addon price",
      space: 1,
      inputType: "number",
      order: 3,
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
      order: 4,
    },
    {
      name: "image",
      type: "file",
      validation: z.any(),
      label: "Addon Image",
      maxFiles: 1,
      maxFileSize: 4 * 1024 * 1024,
      space: 2,
      order: 5,
    },
  ],
  columns: 2,
  onsuccess: "/admin/addons",
  
};

export default formConfig;