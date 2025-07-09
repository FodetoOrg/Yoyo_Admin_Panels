import PageContainer from "@/components/PageContainer";
import CouponMappingForm from "../../_components/CouponMappingForm";

interface Props {
  couponId: string;
  couponCode: string;
  cities: Array<{ id: string; name: string }>;
  hotels: Array<{ id: string; name: string; cityId: string }>;
  roomTypes: Array<{ id: string; name: string }>;
  existingMappings?: {
    cities: string[];
    hotels: string[];
    roomTypes: string[];
  };
}

const MappingScreen = ({ 
  couponId, 
  couponCode, 
  cities, 
  hotels, 
  roomTypes, 
  existingMappings 
}: Props) => {
  return (
    <PageContainer>
      <CouponMappingForm
        couponId={couponId}
        couponCode={couponCode}
        cities={cities}
        hotels={hotels}
        roomTypes={roomTypes}
        existingMappings={existingMappings}
      />
    </PageContainer>
  );
};

export default MappingScreen;