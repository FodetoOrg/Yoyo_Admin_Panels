import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId, UserRole } from "@/lib/utils/auth";
import { columns, datePickers, filterFields } from "./columns";
import type { Booking } from "@/lib/types";

interface Props {
  bookings: Booking[];
  user: any;
}

const BookingsScreen = ({ bookings = [], user }: Props) => {

  console.log('user ', user)
  console.log('bookings ',bookings)
  // Filter bookings based on user role
  // const filteredBookings = user?.hotelId
  //   ? bookings.filter(booking => booking.hotelId === user?.hotelId)
  //   : bookings;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Bookings"
            description={user?.hotelId
              ? "Manage your hotel bookings and reservations"
              : "Manage all hotel bookings and reservations"
            }
          />
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={bookings}
          datePickers={datePickers}
          hiddenColumns={user?.role === UserRole.HOTEL_ADMIN ? ['hotelName'] : []}
        />
      </div>
    </PageContainer>
  );
};

export default BookingsScreen;