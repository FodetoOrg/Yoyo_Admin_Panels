import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import PricingForm from "./PricingForm";

interface Props {
  cities: Array<{ id: string; name: string }>;
  hotels: Array<{ id: string; name: string; cityId: string }>;
  roomTypes: Array<{ id: string; name: string }>;
  coupons: Array<{ id: string; code: string; description: string }>;
}

const PricingScreen = ({ cities, hotels, roomTypes, coupons }: Props) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <Heading
          title="Dynamic Pricing Management"
          description="Adjust room prices dynamically based on cities, hotels, and room types"
        />
        
        <PricingForm
          cities={cities}
          hotels={hotels}
          roomTypes={roomTypes}
        />
      </div>
    </PageContainer>
  );
};

export default PricingScreen;