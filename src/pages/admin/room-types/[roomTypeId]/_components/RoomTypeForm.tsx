import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import * as z from "zod";

interface RoomTypeData {
  id?: string;
  name: string;
  description: string;
  status: string;
}

interface Props {
  roomTypeData?: RoomTypeData | null;
}

const RoomTypeForm = ({ roomTypeData }: Props) => {
  const getFormConfig = () => {
    if (!roomTypeData) return formConfig;

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Room Type ID",
      placeholder: "Room Type ID",
      space: 1,
      editable: false,
      order: 0,
    };

    return {
      ...formConfig,
      title: "Edit Room Type",
      defaultValues: {
        id: roomTypeData.id,
        name: roomTypeData.name,
        description: roomTypeData.description,
        status: roomTypeData.status,
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
          return await apiService.put(ROUTES.UPDATE_ROOM_TYPE_ROUTE(values.id), values);
        } else {
          return await apiService.post(ROUTES.CREATE_ROOM_TYPE_ROUTE, values);
        }
      } catch (error) {
        console.error("Error saving room type:", error);
        return { 
          success: false, 
          message: "An error occurred while saving the room type. Please try again." 
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

export default RoomTypeForm;