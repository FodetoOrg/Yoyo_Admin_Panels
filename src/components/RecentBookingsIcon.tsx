"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, Hotel, ExternalLink, Clock, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

interface RecentBookingsIconProps {
  userRole?: string;
  className?: string;
}

export const RecentBookingsIcon: React.FC<RecentBookingsIconProps> = ({ 
  userRole, 
  className = "" 
}) => {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchRecentBookings = async () => {
      setLoading(true);
      try {
        const response: any = await apiService.get(ROUTES.GET_RECENT_BOOKINGS_ROUTE);
        
        if (response.success) {
          const recentBookings = response.data.bookings || [];
          setBookings(recentBookings.slice(0, 10)); // Show only 10 most recent
          setBookingCount(recentBookings.length);
        }
      } catch (error) {
        console.error('Failed to fetch recent bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
    
    // Poll for new bookings every 60 seconds
    const interval = setInterval(fetchRecentBookings, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Don't render on server
  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          disabled
        >
          <BookOpen className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label={`Recent Bookings ${bookingCount > 0 ? `(${bookingCount} new)` : ''}`}
          >
            <BookOpen className="h-5 w-5" />
            {bookingCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-blue-600"
              >
                {bookingCount > 99 ? '99+' : bookingCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Recent Bookings</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              Last 24 hours
            </Badge>
          </div>
          
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No recent bookings</p>
                <p className="text-xs text-muted-foreground mt-1">New bookings will appear here</p>
              </div>
            ) : (
              <div className="divide-y">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      window.location.href = `/admin/bookings?id=${booking.bookingId}`;
                      setIsOpen(false);
                    }}
                  >
                    <div className="space-y-2">
                      {/* Header with Booking ID and Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            #{booking.bookingId.slice(-8).toUpperCase()}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>

                      {/* Guest Info */}
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{booking.guestDetails.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'})
                        </span>
                      </div>

                      {/* Hotel and Dates */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {booking.hotelName && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Hotel className="h-3 w-3" />
                            <span className="truncate">{booking.hotelName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Amount and Payment Status */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-semibold">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                        <Badge className={`text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {bookings.length > 0 && (
            <div className="p-3 border-t">
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => {
                  window.location.href = '/admin/bookings';
                  setIsOpen(false);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Bookings
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecentBookingsIcon;
