"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Calendar, User, Hotel, ExternalLink, X } from "lucide-react";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface GuestDetails {
  name: string;
  email: string;
  phone: string;
}

interface RecentBooking {
  bookingId: string;
  guestDetails: GuestDetails;
  customerId: string;
  hotelId?: string;
  hotelName?: string;
  checkIn: string;
  checkOut: string;
  bookingType: string;
  guestCount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  bookingDate: string;
  createdAt: string;
}

interface RecentBookingsResponse {
  bookings: RecentBooking[];
  total: number;
  page: number;
  limit: number;
}

interface RecentBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const RecentBookingsModal: React.FC<RecentBookingsModalProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRecentBookings();
    }
  }, [isOpen]);

  const fetchRecentBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: any = await apiService.get(ROUTES.GET_RECENT_BOOKINGS_ROUTE);
      
      if (response.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.message || 'Failed to fetch recent bookings');
      }
    } catch (err) {
      console.error('Error fetching recent bookings:', err);
      setError('An error occurred while fetching recent bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleViewBooking = (bookingId: string) => {
    window.location.href = `/admin/bookings/${bookingId}`;
  };

  const handleViewCustomer = (customerId: string) => {
    window.location.href = `/admin/users/customers/${customerId}`;
  };

  const handleViewHotel = (hotelId: string) => {
    window.location.href = `/admin/hotels/${hotelId}/details`;
  };

  const handleViewAllBookings = () => {
    window.location.href = '/admin/bookings';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden p-4 sm:p-6">
        <DialogHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <DialogTitle className="text-lg">Recent Bookings</DialogTitle>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 h-full">
          {/* Bookings List */}
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">Loading recent bookings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No recent bookings found</p>
              </div>
            ) : (
              <ScrollArea className="h-[60vh] md:h-[70vh] lg:h-[75vh]">
                <div className="flex flex-col gap-2 md:gap-3">
                  {bookings.map((booking) => (
                    <div key={booking.bookingId} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      {/* Line 1: Guest, Hotel (if admin), Amount, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-sm">{booking.guestDetails.name}</span>
                            <span className="text-xs text-muted-foreground">({booking.guestDetails.phone})</span>
                          </div>
                          {userRole === 'superAdmin' && booking.hotelName && (
                            <div className="flex items-center gap-1.5">
                              <Hotel className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{booking.hotelName}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-base">{formatCurrency(booking.totalAmount)}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </Badge>
                            <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Line 2: Dates, Guest Count, Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                          </div>
                          <span>• {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}</span>
                          <span>• #{booking.bookingId.slice(-8)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewBooking(booking.bookingId)}
                            className="text-xs h-6 px-2"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Booking</span>
                            <span className="sm:hidden">B</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCustomer(booking.customerId)}
                            className="text-xs h-6 px-2"
                          >
                            <User className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Customer</span>
                            <span className="sm:hidden">C</span>
                          </Button>
                          {userRole === 'superAdmin' && booking.hotelId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewHotel(booking.hotelId!)}
                              className="text-xs h-6 px-2"
                            >
                              <Hotel className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Hotel</span>
                              <span className="sm:hidden">H</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {bookings.length} recent bookings
            </p>
            <Button onClick={handleViewAllBookings} variant="outline" size="sm" className="text-xs h-8">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              View All Bookings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
