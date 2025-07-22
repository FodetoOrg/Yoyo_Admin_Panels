import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";

interface AddonData {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  status: string;
  hotelId: string;
}

interface Props {
  addonData?: AddonData | null;
  hotelId: string;
  hotelName: string;
}

const HotelAddonForm = ({ addonData, hotelId, hotelName }: Props) => {
  const getFormConfig = () => {
    let fields = [...formConfig.fields];

    if (addonData) {
      // Add ID field for editing
      const idField = {
        name: "id",
        type: "input" as const,
        validation: z.string(),
        label: "Addon ID",
        placeholder: "Addon ID",
        space: 1,
        editable: false,
        order: -1,
      };
      fields = [idField, ...fields];
    }

    const defaultValues = addonData ? {
      id: addonData.id,
      hotelId: addonData.hotelId,
      name: addonData.name,
      description: addonData.description,
      price: addonData.price,
      status: addonData.status,
      image: addonData.image ? [addonData.image] : [],
    } : {
      hotelId: hotelId,
      status: "active",
    };

    return {
      ...formConfig,
      title: addonData ? `Edit Addon - ${hotelName}` : `Add Addon - ${hotelName}`,
      fields,
      defaultValues,
      onsuccess: `/admin/hotels/${hotelId}/addons`,
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default HotelAddonForm;