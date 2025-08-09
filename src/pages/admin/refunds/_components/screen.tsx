
import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId } from "@/lib/utils/auth";
import { columns, datePickers, filterFields } from "./columns";

interface Refund {
  id: string;
  refund_amount: number;
  refund_reason: string;
  refund_type: string;
  status: "pending" | "processed" | "rejected";
  customer_name: string;
  customer_phone: string;
  booking_id: string;
  created_at: string;
  processed_at?: string;
  hotel_name?: string;
}

interface Props {
  refunds: Refund[];
}

const RefundsScreen = ({ refunds = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  
  // Filter refunds based on user role
  const filteredRefunds = effectiveHotelId 
    ? refunds.filter(refund => {
        // In a real app, you'd join with bookings to get hotelId
        // For now, we'll assume all refunds are visible to hotel admins
        return true;
      })
    : refunds;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Refunds"
            description={effectiveHotelId 
              ? "Track your hotel refund requests and processing status" 
              : "Track all refund requests and processing status"
            }
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={filteredRefunds}
          datePickers={datePickers}
          hiddenColumns={effectiveHotelId ? ["hotel_name"] : []}
        />
      </div>
    </PageContainer>
  );
};

export default RefundsScreen;
