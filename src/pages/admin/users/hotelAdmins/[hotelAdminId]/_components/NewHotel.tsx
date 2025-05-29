import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";



interface Props {
  hotelAdminData?: any | null;
}

const NewHotelScreen = ({ hotelAdminData }: Props) => {

  console.log('hotelAdminData is ',hotelAdminData)
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

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default NewHotelScreen;
