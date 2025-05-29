import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add Hotel Admin",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Hotel name is required.",
      }),
      label: "Hotel Admin Name",
      placeholder: "Enter hotel admin name",
      space: 1,
    },
    {
      name: "phone",
      type: "input",
      validation: z.string().min(1, {
        message: "Phone number is required.",
      }).min(10, {
        message: "Phone number must be at least 10 digits.",
      }),
      label: "Phone Number",
      placeholder: "Enter phone number",
      space: 1,
    },
    {
      name: "email",
      type: "input",
      validation: z.string().email({
        message: "Invalid email address.",
      }),
      label: "Email",
      placeholder: "Enter email",
      space: 1,
    },
   

    
  ],
  columns: 2,
  onSubmit: async (values, isUpdate) => {
    if (isUpdate) {
      // return await actions.updateHotel({
      //   ...values,
      // });
    } else {
      return await apiService.post(ROUTES.CREATE_HOTEL_ADMIN_ROUTE, values);
     
    }
  },
};

export default formConfig;
