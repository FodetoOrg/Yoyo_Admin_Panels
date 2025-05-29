import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { ROUTES, STATES_OPTIONS } from "@/lib/utils/constants";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Add City",
  fields: [
    {
      name: "name",
      type: "input",
      validation: z.string().min(1, {
        message: "Hotel name is required.",
      }),
      label: "City Name",
      placeholder: "Enter city name",
      space: 1,
    },
    {
      name: "state",
      type: "select",
      validation: z.string().min(1, {
        message: "please select a stats",
      }),
      label: "state",
      placeholder: "Please Seekect a state",
      space: 1,
      isSearchable: true,
      options: STATES_OPTIONS,
    },
  ],
  columns: 2,
  onsuccess: "/admin/cities",
  onSubmit: async (values, isUpdate) => {
    if (isUpdate) {
      // return await actions.updateHotel({
      //   ...values,
      // });
      return await apiService.put(ROUTES.UPDATED_CITY_ROUTE(values.id), values);
    } else {
      //   return await apiService.post(ROUTES.CREATE_HOTEL_ROUTE, values);
      return await apiService.post(ROUTES.CREATE_CITY_ROUTE, values);
    }
  },
};

export default formConfig;
