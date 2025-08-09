import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId } from "@/lib/utils/auth";
import { columns, datePickers, filterFields } from "./columns";

interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: "successful" | "failed" | "pending" | "refunded";
  paymentMethod: string;
  transactionDate: Date;
}

interface Props {
  payments: Payment[];
}

const PaymentsScreen = ({ payments = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  
  // Filter payments based on user role (assuming payments have hotelId through booking)
  const filteredPayments = effectiveHotelId 
    ? payments.filter(payment => {
        // In a real app, you'd join with bookings to get hotelId
        // For now, we'll assume all payments are visible to hotel admins
        return true;
      })
    : payments;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Payments"
            description={effectiveHotelId 
              ? "Track your hotel payment transactions and refunds" 
              : "Track all payment transactions and refunds"
            }
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={filteredPayments}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default PaymentsScreen;