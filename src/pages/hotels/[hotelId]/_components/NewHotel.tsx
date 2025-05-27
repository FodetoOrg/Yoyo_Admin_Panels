import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";

interface Props {
  categoryData?: any[] | null;
}

const NewCategoryScreen = ({ categoryData }: Props) => {
  console.log("categoryData are ", categoryData);
  const getFormConfig = () => {
    if (!categoryData) return formConfig;

    console.log("formConfig ", formConfig);
    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Category ID",
      placeholder: "Enter category id",
      space: 1,
      editable: false,
    };

    return {
      ...formConfig,
      defaultValues: {
        id: categoryData.id,
        name: categoryData.name,
        active: categoryData.active,
        description: categoryData.description || "",
        images: categoryData.images || [],
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

export default NewCategoryScreen;
