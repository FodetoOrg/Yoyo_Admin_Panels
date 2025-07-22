import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import { UserRole } from "@/lib/utils/auth";
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
  hotels: Array<{ id: string; name: string }>;
  currentUser: any;
}

const AddonForm = ({ addonData, hotels, currentUser }: Props) => {
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const effectiveHotelId = currentUser.role === UserRole.HOTEL_ADMIN ? currentUser.hotelId : null;

  const getFormConfig = () => {
    // Hotel selection field (only for super admin when not viewing as hotel admin)
    const hotelField = {
      name: "hotelId",
      type: "select" as const,
      validation: z.string().min(1, {
        message: "Hotel is required.",
      }),
      label: "Hotel",
      options: hotels.map((hotel) => ({
        label: hotel.name,
        value: hotel.id,
      })),
      space: 1,
      isSearchable: true,
      order: 0,
      editable: !addonData, // Only editable when creating new addon
    };

    let fields = [...formConfig.fields];

    // Add hotel field if super admin and no effective hotel
    if (isSuperAdmin && !effectiveHotelId) {
      fields = [hotelField, ...fields];
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
    }

    const defaultValues = addonData ? {
      id: addonData.id,
      hotelId: addonData.hotelId,
      name: addonData.name,
      description: addonData.description,
      price: addonData.price,
      status: addonData.status,
      image: addonData.image ? [addonData.image] : [],
    } : (effectiveHotelId ? {
      hotelId: effectiveHotelId,
      status: "active",
    } : {
      status: "active",
    });

    return {
      ...formConfig,
      title: addonData ? "Edit Addon" : "Add Addon",
      fields,
      defaultValues: addonData ? defaultValues : (effectiveHotelId ? { hotelId: effectiveHotelId, status: "active" } : { status: "active" }),
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default AddonForm;