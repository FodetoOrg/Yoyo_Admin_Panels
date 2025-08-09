import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Clock,
  DoorOpen,
  XCircle,
  Undo2,
  User,
  Calendar,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  ImageOff
} from "lucide-react";
import { apiService, type ApiResponse } from "@/lib/utils/api";
import { UserRole } from "@/lib/utils/auth";







// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <p className="text-gray-500">Loading booking details...</p>
  </div>
);

// Error component
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px]  gap-4 text-center">
    <AlertTriangle className="h-12 w-12 text-red-500" />
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-900">Unable to load booking data</h3>
      <p className="text-gray-500 max-w-md">
        We couldn't retrieve the booking information. Please check your connection and try again.
      </p>
    </div>
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => window.history.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go Back
      </Button>
      <Button onClick={onRetry}>
        Try Again
      </Button>
    </div>
  </div>
);

const formatINR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

const getStatusColor = (status) => {
  const colors = {
    confirmed: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    checked_in: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };
  return colors[status] || colors.pending;
};

const getPaymentColor = (status) => {
  const colors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  return colors[status] || colors.pending;
};

const pretty = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(+d)) return "-";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const canShowRefund = (userRole, booking) => {
  const paid = booking.paymentStaus === "paid";
  // const statusOk = ["cancelled", "completed"].includes(booking.status);
  // const notAlready = !booking.refundInfo || booking.refundInfo.status !== "processed";
  return [UserRole.SUPER_ADMIN].includes(userRole) && !paid && booking.refundInfo 
};

export default function BookingDetailsScreen({
  booking,
  user,
  loading = false,
  error = false,
  onRetry = () => window.location.reload()
}) {
  console.log('booking ', booking)
  console.log('role ', user)
  const [working, setWorking] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState(booking?.totalAmount || 0);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorState onRetry={onRetry} />
      </div>
    );
  }

  const paymentStatus = booking.paymentStaus;

  const derivedStatus = useMemo(() => {
    if (booking.status === "cancelled") return "cancelled";
    const now = new Date();
    const checkout = new Date(booking.checkOut);
    if (!isNaN(+checkout) && now >= checkout) return "completed";
    return booking.status;
  }, [booking.status, booking.checkOut]);

  const canCheckIn = ["confirmed", "pending"].includes(booking.status) &&
    derivedStatus !== "completed" && booking.status !== "cancelled";

  const canCancel = booking.status !== "cancelled" && derivedStatus !== "completed";

  const onConfirmCheckIn = async (markPaymentCollected) => {
    try {
      setWorking(true);
      if (paymentStatus !== "paid" && markPaymentCollected) {
        const pay = await api.post(`/bookings/${booking.id}/mark-paid`);
        if (!pay?.success) {
          alert("Failed to mark payment as collected.");
          return;
        }
      }
      const res: ApiResponse<any> = await apiService.patch(`/bookings/${booking.id}/status`, { status: "checked_in" });
      if (!res?.success) alert("Failed to check in.");
      else alert("Guest checked in successfully!");
    } finally {
      setWorking(false);
      setConfirmOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason?.trim() || cancelReason.trim().length < 10) {
      alert("Please enter a reason (at least 10 characters).");
      return;
    }
    try {
      setWorking(true);
      const res:ApiResponse<any> = await apiService.put(`/api/v1/bookings/${booking.id}/cancel`, { reason: cancelReason.trim() });
      if (!res?.success) alert("Failed to cancel booking.");
      else alert("Booking cancelled successfully!");
    } finally {
      setWorking(false);
      setCancelOpen(false);
      setCancelReason("");
    }
  };

  const handleRefund = async () => {
    if (!refundAmount || refundAmount <= 0) {
      alert("Enter a valid refund amount.");
      return;
    }
    if (!refundReason?.trim() || refundReason.trim().length < 5) {
      alert("Please enter a reason for refund.");
      return;
    }
    try {
      setWorking(true);
      const res = await api.post(`/bookings/${booking.id}/refund-wallet`, {
        amount: Math.min(refundAmount, booking.totalAmount),
        reason: refundReason.trim(),
        method: "wallet",
      });
      if (!res?.success) alert("Failed to issue refund.");
      else alert("Refund processed successfully!");
    } finally {
      setWorking(false);
      setRefundOpen(false);
    }
  };

  return (
    <div className=" mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{booking.hotelName}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(derivedStatus)}>
                {derivedStatus.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge className={getPaymentColor(paymentStatus)}>
                {paymentStatus.toUpperCase()}
              </Badge>
              <Badge variant="outline">#{booking.bookingReference}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canCheckIn && (
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                  <Button disabled={working}>
                    <DoorOpen className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Check-In</DialogTitle>
                    <DialogDescription>
                      {paymentStatus === "paid"
                        ? "Ready to check in the guest."
                        : "Mark payment as collected and check in?"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 py-4">
                    <div className="flex justify-between">
                      <span>Guest:</span>
                      <span className="font-medium">{booking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatINR(booking.totalAmount)}</span>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => onConfirmCheckIn(paymentStatus !== "paid")}
                      disabled={working}
                    >
                      {working ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Check In
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {canCancel && (
              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={working}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Booking</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for cancellation.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Cancellation reason (minimum 10 characters)..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                  />
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setCancelOpen(false)}>
                      Close
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={working}>
                      {working ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Cancel Booking
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {canShowRefund(user.role, booking) && (
              <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={working}>
                    <Undo2 className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Refund</DialogTitle>
                    <DialogDescription>
                      Issue refund to customer's wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input
                        type="number"
                        min={0}
                        max={booking.totalAmount}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max: {formatINR(booking.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reason</label>
                      <Textarea
                        placeholder="Refund reason..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setRefundOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleRefund} disabled={working}>
                      {working ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Process Refund
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>



      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}

        {/* Booking Info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{booking.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{pretty(booking.checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{pretty(booking.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{booking.bookingType}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3  text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <a href={`tel:${booking.guestPhone}`} className="font-medium text-blue-600 hover:underline">
                {booking.guestPhone}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <a href={`mailto:${booking.guestEmail}`} className="font-medium text-blue-600 hover:underline">
                {booking.guestEmail}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Rate:</span>
              <span>{formatINR(booking.priceBreakdown.roomRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes:</span>
              <span>{formatINR(booking.priceBreakdown.taxes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee:</span>
              <span>{formatINR(booking.priceBreakdown.serviceFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-lg">{formatINR(booking.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>



        {/* Hotel Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Hotel Contact</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${booking.hotelPhone}`} className="text-blue-600 hover:underline">
                {booking.hotelPhone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href={`mailto:${booking.hotelEmail}`} className="text-blue-600 hover:underline">
                {booking.hotelEmail}
              </a>
            </div>
            <div className="flex items-start gap-2 pt-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-700">{booking.address}</p>
                {booking.latitude && booking.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${booking.latitude},${booking.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                  >
                    View on Maps →
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        {booking.amenities?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {booking.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Policy */}
        {booking.cancellationPolicy && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{booking.cancellationPolicy}</p>
            </CardContent>
          </Card>
        )}

        {/* Refund Info */}
        {booking.refundInfo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Refund Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline">{booking.refundInfo.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span>{formatINR(booking.refundInfo.refundAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span>{booking.refundInfo.refundMethod}</span>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}