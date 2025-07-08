import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId } from "@/lib/utils/auth";
import { columns, datePickers, filterFields } from "./columns";
import type { Booking } from "@/lib/types";

interface Props {
  bookings: Booking[];
}

const BookingsScreen = ({ bookings = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  
  // Filter bookings based on user role
  const filteredBookings = effectiveHotelId 
    ? bookings.filter(booking => booking.hotelId === effectiveHotelId)
    : bookings;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Bookings"
            description={effectiveHotelId 
              ? "Manage your hotel bookings and reservations" 
              : "Manage all hotel bookings and reservations"
            }
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={filteredBookings}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default BookingsScreen;