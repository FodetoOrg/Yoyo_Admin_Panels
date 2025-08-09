import PageContainer from "@/components/PageContainer";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Hotel, 
  Bed, 
  IndianRupee, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Receipt,
  Wallet,
  Building,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  paymentData: {
    payment: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      paymentMode: string;
      razorpayPaymentId: string | null;
      razorpayOrderId: string | null;
      createdAt: string;
      updatedAt: string;
    };
    booking: {
      id: string;
      checkInDate: string;
      checkOutDate: string;
      totalAmount: number;
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
      name: string | null;
      phone: string;
    };
    room: {
      id: string;
      name: string;
      roomNumber: string;
      capacity: number;
      bedType: string;
    };
    hotel: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
    walletTransaction?: {
      id: string;
      amount: number;
      type: string;
      description: string;
    };
  };
}

const PaymentDetailsScreen = ({ paymentData }: Props) => {
  const { payment, booking, user, room, hotel, walletTransaction } = paymentData;

  // Helper function to get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'success':
        return { variant: 'default', icon: CheckCircle, color: 'text-green-600' };
      case 'pending':
        return { variant: 'secondary', icon: AlertCircle, color: 'text-yellow-600' };
      case 'cancelled':
      case 'failed':
        return { variant: 'destructive', icon: XCircle, color: 'text-red-600' };
      default:
        return { variant: 'secondary', icon: AlertCircle, color: 'text-gray-600' };
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const paymentStatusInfo = getStatusInfo(payment.status);
  const bookingStatusInfo = getStatusInfo(booking.status);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col gap-1">
              <Heading
                title={`Payment Details`}
                description={`Transaction ID: ${payment.id.slice(-12)}`}
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Created: {formatDate(payment.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <paymentStatusInfo.icon className={`h-4 w-4 ${paymentStatusInfo.color}`} />
            <Badge variant={paymentStatusInfo.variant} className="text-sm px-3 py-1">
              {payment.status}
            </Badge>
          </div>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payment Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(payment.amount)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {payment.currency} • {payment.paymentMode}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Booking Amount</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(booking.totalAmount)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total booking cost
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transaction Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {formatDate(payment.createdAt)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Last updated: {formatDate(payment.updatedAt)}
              </div>
            </CardContent>
          </Card>

          {walletTransaction && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wallet Used</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(walletTransaction.amount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {walletTransaction.description}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Method Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Mode</label>
                  <div className="text-sm font-medium capitalize mt-1">
                    <Badge variant="outline" className="text-sm">
                      {payment.paymentMode}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Currency</label>
                  <div className="text-sm mt-1">{payment.currency}</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {payment.razorpayPaymentId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Razorpay Payment ID</label>
                    <div className="text-sm font-mono mt-1">{payment.razorpayPaymentId}</div>
                  </div>
                )}
                {payment.razorpayOrderId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Razorpay Order ID</label>
                    <div className="text-sm font-mono mt-1">{payment.razorpayOrderId}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                  <div className="text-sm font-mono mt-1">{user.id.slice(-12)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <div className="text-sm mt-1">{user.name || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel & Room Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                Hotel & Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hotel</label>
                  <div className="text-sm font-medium mt-1">{hotel.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{hotel.address}, {hotel.city}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Room</label>
                  <div className="text-sm font-medium mt-1">{room.name}</div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>Room #{room.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bed className="h-3 w-3" />
                      <span>{room.bedType} bed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>Capacity: {room.capacity} guests</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Booking ID</label>
                <div className="text-sm font-mono mt-1">{booking.id.slice(-12)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check In</label>
                <div className="text-sm mt-1">{formatDate(booking.checkInDate)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Check Out</label>
                <div className="text-sm mt-1">{formatDate(booking.checkOutDate)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Booking Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <bookingStatusInfo.icon className={`h-4 w-4 ${bookingStatusInfo.color}`} />
                  <Badge variant={bookingStatusInfo.variant}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Addons Section */}
            {booking.addons && booking.addons.length > 0 ? (
              <div className="flex flex-col gap-3">
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Add-ons</label>
                  <div className="flex flex-col gap-2 mt-2">
                    {booking.addons.map((addon, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{addon.addon_name}</span>
                          <span className="text-xs text-muted-foreground">
                            Quantity: {addon.quantity} × ₹{addon.unit_price}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(addon.total_price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Separator />
                <div className="text-center py-4 text-muted-foreground">
                  <div className="text-sm">No add-ons for this booking</div>
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Booking Amount</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
              {payment.amount !== booking.totalAmount && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="outline" onClick={() => window.print()}>
            <Receipt className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payments
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default PaymentDetailsScreen;