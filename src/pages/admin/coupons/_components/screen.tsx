import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId } from "@/lib/utils/auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields, type Coupon } from "./columns";

interface Props {
  coupons: Coupon[];
}

const CouponsScreen = ({ coupons = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  
  // Filter coupons based on user role
  const filteredCoupons = effectiveHotelId 
    ? coupons.filter(coupon => 
        coupon.applicableTo.hotels.includes(effectiveHotelId) || 
        coupon.applicableTo.hotels.length === 0
      )
    : coupons;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Coupons Management"
            description={effectiveHotelId 
              ? "Manage discount coupons for your hotel" 
              : "Manage discount coupons and promotional offers"
            }
          />
          <Button>
            <a
              href="/admin/coupons/new"
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Create Coupon
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={filteredCoupons}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default CouponsScreen;