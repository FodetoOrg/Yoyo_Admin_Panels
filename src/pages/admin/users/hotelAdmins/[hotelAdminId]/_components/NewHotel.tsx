import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";



interface Props {
  hotelAdminData?: any | null;
}

const NewHotelScreen = ({ hotelAdminData }: Props) => {

  const getFormConfig = () => {
    if (!hotelAdminData) return formConfig;

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Hotel ID",
      placeholder: "Hotel ID",
      space: 1,
      editable: false,
    };

    return {
      ...formConfig,
      defaultValues: {
        id: hotelAdminData.id,
       
      },
      fields: [idField, ...formConfig.fields],
    };
  };
  
  // Update the onSubmit function in the form config to use the actual API
  const updatedFormConfig = {
    ...getFormConfig(),
    onSubmit: async (values: any, isUpdate: boolean) => {
      try {
        if (isUpdate) {
          // Not implemented in API
          return { success: false, message: "Updating hotel admin is not supported" };
        } else {
          return await apiService.post(ROUTES.CREATE_HOTEL_ADMIN_ROUTE, values);
        }
      } catch (error) {
        console.error("Error saving hotel admin:", error);
        return { 
          success: false, 
          message: "An error occurred while saving the hotel admin. Please try again." 
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
