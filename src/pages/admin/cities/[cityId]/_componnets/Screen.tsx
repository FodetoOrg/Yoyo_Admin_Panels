import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
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



  console.log('cityData is ',cityData)
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

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default Screen;
