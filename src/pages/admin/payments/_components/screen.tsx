import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
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
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Payments"
            description="Track all payment transactions and refunds"
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={payments}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default PaymentsScreen;