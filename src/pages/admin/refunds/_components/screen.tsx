import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, DollarSign, Users, TrendingDown } from "lucide-react";
import { columns } from "./columns";

interface RefundData {
  id: string;
  bookingId: string;
  originalPaymentId: string;
  userId: string;
  refundType: string;
  originalAmount: number;
  cancellationFeeAmount: number;
  refundAmount: number;
  cancellationFeePercentage: number;
  refundReason: string;
  status: string;
  refundMethod: string;
  razorpayRefundId: string | null;
  processedBy: string | null;
  processedAt: string | null;
  rejectionReason: string | null;
  bankDetails: any;
  expectedProcessingDays: number;
  createdAt: string;
  updatedAt: string;
  booking: {
    id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    hotel: {
      name: string;
    };
    user: {
      name: string | null;
      email: string;
      phone: string;
    };
  };
  originalPayment: {
    amount: number;
    paymentMethod: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Props {
  refunds: RefundData[] | null | undefined;
  pagination?: Pagination;
  currentUser: any;
}

const Screen: React.FC<Props> = ({ refunds, pagination, currentUser }) => {
  const [loading, setLoading] = useState(false);

  // Handle case where refunds might be null, undefined, or empty
  const refundsData = refunds || [];
  
  const totalRefundAmount = refundsData.reduce((sum, refund) => sum + (refund.refundAmount || 0), 0);
  const completedRefunds = refundsData.filter(refund => refund.status === "completed").length;
  const pendingRefunds = refundsData.filter(refund => refund.status === "pending").length;
  
  // Get unique users by combining guestName and user data
  const uniqueUsers = new Set(
    refundsData.map(refund => 
      refund.booking?.guestName || 
      refund.booking?.user?.name || 
      refund.booking?.user?.phone || 
      refund.userId
    )
  ).size;

  // Transform data for the table to match expected structure
  const transformedRefunds = refundsData.map(refund => ({
    id: refund.id,
    bookingId: refund.bookingId,
    paymentId: refund.originalPaymentId,
    amount: refund.refundAmount,
    reason: refund.refundReason,
    status: refund.status,
    processedAt: refund.processedAt,
    refundMethod: refund.refundMethod,
    createdAt: refund.createdAt,
    bookingReference: refund.bookingId,
    userName: refund.booking?.guestName || refund.booking?.user?.name || 'N/A',
    userEmail: refund.booking?.guestEmail || refund.booking?.user?.email || 'N/A',
    userPhone: refund.booking?.guestPhone || refund.booking?.user?.phone || 'N/A',
    hotelName: refund.booking?.hotel?.name || 'N/A',
    originalPaymentAmount: refund.originalAmount,
    originalPaymentMethod: refund.originalPayment?.paymentMethod || 'online',
    cancellationFeeAmount: refund.cancellationFeeAmount,
    expectedProcessingDays: refund.expectedProcessingDays,
    refundType: refund.refundType
  }));

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Refunds</h1>
            <p className="text-muted-foreground">
              Manage and track refund requests and processing
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRefundAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total refunded amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRefunds}</div>
              <p className="text-xs text-muted-foreground">
                Processed refunds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRefunds}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Refund</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{refundsData.length > 0 ? Math.round(totalRefundAmount / refundsData.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Average amount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Requests ({refundsData.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns()}
              data={transformedRefunds}
              searchKey="userName"
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Screen;