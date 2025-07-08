import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";

interface RoomTypeData {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
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
        basePrice: roomTypeData.basePrice,
        maxOccupancy: roomTypeData.maxOccupancy,
        amenities: roomTypeData.amenities || [],
        status: roomTypeData.status,
      },
      fields: [idField, ...formConfig.fields],
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default RoomTypeForm;