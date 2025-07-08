import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { columns, datePickers, filterFields } from "./columns";
import type { Booking } from "@/lib/types";

interface Props {
  bookings: Booking[];
}

const BookingsScreen = ({ bookings = [] }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Bookings"
            description="Manage all hotel bookings and reservations"
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={bookings}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default BookingsScreen;