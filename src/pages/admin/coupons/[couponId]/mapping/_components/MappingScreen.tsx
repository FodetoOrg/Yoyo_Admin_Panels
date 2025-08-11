import PageContainer from "@/components/PageContainer";
import CouponMappingForm from "../../_components/CouponMappingForm";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

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
        onSubmit={async (mappingData) => {
          try {

            console.log('mappingData ',mappingData)
            // Update coupon with new mappings
            const response = await apiService.put(ROUTES.UPDATE_COUPON_ROUTE(couponId), {
              mappings: mappingData
            });
            
            if (response.success) {
              window.location.href = "/admin/coupons";
              return { success: true };
            } else {
              return { success: false, message: response.message || "Failed to update coupon mappings" };
            }
          } catch (error) {
            console.error("Error updating coupon mappings:", error);
            return { success: false, message: "An error occurred while updating coupon mappings" };
          }
        }}
      />
    </PageContainer>
  );
};

export default MappingScreen;