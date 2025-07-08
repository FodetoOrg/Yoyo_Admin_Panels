import PageContainer from "@/components/PageContainer";
import DynamicForm from "@/components/GloabalForm/DynamicForm";
import formConfig from "./config";
import * as z from "zod";

interface CouponData {
  id?: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  priceIncreasePercentage?: number;
  status: string;
}

interface Props {
  couponData?: CouponData | null;
  cities: Array<{ id: string; name: string }>;
  hotels: Array<{ id: string; name: string }>;
  roomTypes: Array<{ id: string; name: string }>;
}

const CouponForm = ({ couponData, cities, hotels, roomTypes }: Props) => {
  const getFormConfig = () => {
    // Add mapping fields
    const cityField = {
      name: "applicableCities",
      type: "multiselect" as const,
      validation: z.array(z.string()),
      label: "Applicable Cities (Optional)",
      options: cities.map(city => ({ label: city.name, value: city.id })),
      space: 2,
      order: 12,
    };

    const hotelField = {
      name: "applicableHotels",
      type: "multiselect" as const,
      validation: z.array(z.string()),
      label: "Applicable Hotels (Optional)",
      options: hotels.map(hotel => ({ label: hotel.name, value: hotel.id })),
      space: 2,
      order: 13,
    };

    const roomTypeField = {
      name: "applicableRoomTypes",
      type: "multiselect" as const,
      validation: z.array(z.string()),
      label: "Applicable Room Types (Optional)",
      options: roomTypes.map(rt => ({ label: rt.name, value: rt.id })),
      space: 2,
      order: 14,
    };

    let fields = [...formConfig.fields, cityField, hotelField, roomTypeField];

    if (!couponData) {
      return {
        ...formConfig,
        fields,
      };
    }

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Coupon ID",
      placeholder: "Coupon ID",
      space: 1,
      editable: false,
      order: 0,
    };

    return {
      ...formConfig,
      title: "Edit Coupon",
      defaultValues: {
        id: couponData.id,
        code: couponData.code,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        maxDiscountAmount: couponData.maxDiscountAmount,
        minOrderAmount: couponData.minOrderAmount,
        validFrom: couponData.validFrom,
        validTo: couponData.validTo,
        usageLimit: couponData.usageLimit,
        priceIncreasePercentage: couponData.priceIncreasePercentage,
        status: couponData.status,
        applicableCities: [],
        applicableHotels: [],
        applicableRoomTypes: [],
      },
      fields: [idField, ...fields],
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default CouponForm;