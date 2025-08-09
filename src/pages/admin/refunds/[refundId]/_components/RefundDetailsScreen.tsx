
import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, User, Hotel, Bed, CreditCard, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  refundData: {
    refund: {
      id: string;
      refund_amount: number;
      refund_reason: string;
      refund_type: string;
      status: string;
      processed_by_name?: string;
      rejection_reason?: string;
      bank_details?: string;
      created_at: string;
      processed_at?: string;
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
    original_payment: {
      id: string;
      amount: number;
      payment_method: string;
      status: string;
    };
  };
}

const RefundDetailsScreen = ({ refundData }: Props) => {
  const { refund, booking, user, room, hotel, original_payment } = refundData;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Heading
              title={`Refund ${refund.id}`}
              description="Refund request details and processing information"
            />
          </div>
          <Badge
            variant={
              refund.status === "processed"
                ? "default"
                : refund.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {refund.status}
          </Badge>
        </div>

        {/* Refund Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refund Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{refund.refund_amount}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {refund.refund_type} • {refund.refund_reason}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created Date</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {new Date(refund.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {refund.processed_at && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processed Date</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date(refund.processed_at).toLocaleString()}
                </div>
                {refund.processed_by_name && (
                  <div className="text-xs text-muted-foreground">
                    By: {refund.processed_by_name}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rejection Reason */}
        {refund.status === "rejected" && refund.rejection_reason && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">{refund.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-3">
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
            <CardContent className="flex flex-col gap-y-3">
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
              Original Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
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
                <label className="text-sm font-medium text-muted-foreground">Booking Status</label>
                <Badge variant={booking.status === "cancelled" ? "destructive" : "default"}>
                  {booking.status}
                </Badge>
              </div>
            </div>

            {/* Addons */}
            {booking.addons && booking.addons.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Addons</label>
                <div className="mt-2 flex flex-col gap-y-2">
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
                <span>Original Total Amount</span>
                <span>₹{booking.total_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Original Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
              <div className="text-sm font-mono">{original_payment.id}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
              <div className="text-sm font-bold">₹{original_payment.amount}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <div className="text-sm capitalize">{original_payment.payment_method}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Badge variant={original_payment.status === "completed" ? "default" : "secondary"}>
                {original_payment.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default RefundDetailsScreen;
