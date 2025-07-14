import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";

interface CityData {
  id?: string;
  name: string;
  state:string;
 
}

interface Props {
  cityData?: CityData | null;
}

const Screen = ({ cityData }: Props) => {

  const getFormConfig = () => {
    if (!cityData) return formConfig;

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "City ID",
      placeholder: "City ID",
      space: 1,
      editable: false,
    };

    return {
      ...formConfig,
      defaultValues: {
        id: cityData.id,
        name: cityData.name,
        state:cityData.state
       
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
          return await apiService.put(ROUTES.UPDATED_CITY_ROUTE(values.id), values);
        } else {
          return await apiService.post(ROUTES.CREATE_CITY_ROUTE, values);
        }
      } catch (error) {
        console.error("Error saving city:", error);
        return { 
          success: false, 
          message: "An error occurred while saving the city. Please try again." 
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

export default Screen;
