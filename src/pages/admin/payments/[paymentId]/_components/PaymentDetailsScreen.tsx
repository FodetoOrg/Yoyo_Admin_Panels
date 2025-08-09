
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, User, Hotel, Bed, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  paymentData: {
    payment: {
      id: string;
      amount: number;
      payment_method: string;
      payment_mode: string;
      status: string;
      transaction_date: string;
    };
    booking: {
      id: string;
      check_in: string;
      check_out: string;
      total_amount: number;
      status: string;
      addons: Array<{
        addon_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
      }>;
    };
    user: {
      id: string;
      name: string;
      phone: string;
      email: string;
    };
    room: {
      id: string;
      name: string;
      room_number: string;
      capacity: number;
      bed_type: string;
    };
    hotel: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
    wallet_transaction?: {
      id: string;
      amount: number;
      type: string;
      description: string;
    };
  };
}

const PaymentDetailsScreen = ({ paymentData }: Props) => {
  const { payment, booking, user, room, hotel, wallet_transaction } = paymentData;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Heading
              title={`Payment ${payment.id}`}
              description="Payment transaction details"
            />
          </div>
          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
            {payment.status}
          </Badge>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{payment.amount}</div>
              <div className="text-xs text-muted-foreground">
                {payment.payment_method} • {payment.payment_mode}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Date</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {new Date(payment.transaction_date).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {wallet_transaction && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Used</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-orange-600">₹{wallet_transaction.amount}</div>
                <div className="text-xs text-muted-foreground">{wallet_transaction.description}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <div className="text-sm">{user.name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <div className="text-sm">{user.phone}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="text-sm">{user.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel & Room Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hotel className="h-4 w-4 mr-2" />
                Hotel & Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hotel</label>
                <div className="text-sm">{hotel.name}</div>
                <div className="text-xs text-muted-foreground">{hotel.address}, {hotel.city}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Room</label>
                <div className="text-sm">{room.name} - Room {room.room_number}</div>
                <div className="text-xs text-muted-foreground">{room.bed_type} • Capacity: {room.capacity}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed className="h-4 w-4 mr-2" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Booking ID</label>
                <div className="text-sm font-mono">{booking.id}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check In</label>
                <div className="text-sm">{booking.check_in}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check Out</label>
                <div className="text-sm">{booking.check_out}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                  {booking.status}
                </Badge>
              </div>
            </div>

            {/* Addons */}
            {booking.addons && booking.addons.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Addons</label>
                <div className="mt-2 space-y-2">
                  {booking.addons.map((addon, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{addon.addon_name} (x{addon.quantity})</span>
                      <span className="text-sm font-medium">₹{addon.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹{booking.total_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PaymentDetailsScreen;
