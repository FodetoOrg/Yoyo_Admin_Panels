import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

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

    const submitHandler = async (values: any, isUpdate: boolean) => {
      try {
        console.log('Hotel addon form values:', values);

        if (isUpdate) {
          return await apiService.put(ROUTES.UPDATE_ADDON_ROUTE(hotelId, values.id), values);
        } else {
          return await apiService.post(ROUTES.CREATE_HOTEL_ADDON_ROUTE(hotelId), values);
        }
      } catch (error) {
        console.error("Error saving addon:", error);
        return {
          success: false,
          message: "An error occurred while saving the addon. Please try again."
        };
      }
    }

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
      const defaultValues = {
        id: addonData.id,
        hotelId: addonData.hotelId,
        name: addonData.name,
        description: addonData.description,
        price: addonData.price,
        status: addonData.status,
        image: addonData.image ? [addonData.image] : [],
      }

      return {
        ...formConfig,
        title: addonData ? `Edit Addon - ${hotelName}` : `Add Addon - ${hotelName}`,
        fields,
        defaultValues,
        onsuccess: `/admin/hotels/${hotelId}/addons`,
        onSubmit: (values: any, isUpdate: boolean)=>submitHandler(values, isUpdate)
      };
    }
    return {
      ...formConfig,
      title: addonData ? `Edit Addon - ${hotelName}` : `Add Addon - ${hotelName}`,
      fields,

      onsuccess: `/admin/hotels/${hotelId}/addons`,
      onSubmit: submitHandler
    };


  };



  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default HotelAddonForm;