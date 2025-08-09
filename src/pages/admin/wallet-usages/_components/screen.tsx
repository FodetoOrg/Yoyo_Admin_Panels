
import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, DollarSign, TrendingUp } from "lucide-react";
import { columns } from "./columns";

interface WalletUsage {
  id: string;
  userId: string;
  bookingId: string;
  paymentId: string;
  amountUsed: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingReference: string;
  hotelName: string;
  paymentAmount: number;
  paymentMethod: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Props {
  walletUsages: WalletUsage[];
  pagination: Pagination;
  currentUser: any;
}

const Screen: React.FC<Props> = ({ walletUsages, pagination, currentUser }) => {
  const [loading, setLoading] = useState(false);

  const totalAmountUsed = walletUsages.reduce((sum, usage) => sum + usage.amountUsed, 0);
  const uniqueUsers = new Set(walletUsages.map(usage => usage.userId)).size;
  const avgUsageAmount = walletUsages.length > 0 ? totalAmountUsed / walletUsages.length : 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet Usages</h1>
            <p className="text-muted-foreground">
              Track wallet transactions and usage patterns
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmountUsed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total wallet amount used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                Users who used wallet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(avgUsageAmount)}</div>
              <p className="text-xs text-muted-foreground">
                Average per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex flex-col gap-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-muted-foreground">
                Wallet transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Usage History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns()}
              data={walletUsages}
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
