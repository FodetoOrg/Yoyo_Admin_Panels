import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, DollarSign, TrendingUp } from "lucide-react";
import { columns, datePickers, filterFields } from "./columns";

interface WalletUsage {
  id: string;
  userId: string;
  source: string;
  amountUsed: number;
  refrenceType: string;
  refrenceId: string;
  createdAt: string;
  userName: string | null;
  userEmail: string;
  userPhone: string;
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
  const totalTransactions = walletUsages.length;

  // Filter by source type
  const paymentTransactions = walletUsages.filter(usage => usage.source === 'payment');
  const refundTransactions = walletUsages.filter(usage => usage.source === 'refund');

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
           
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmountUsed.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total wallet amount used
              </p>
            </CardContent>
          </Card>

          <Card>
            
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                Users who used wallet
              </p>
            </CardContent>
          </Card>

          <Card>
           
            <CardContent>
              <div className="text-2xl font-bold">₹{avgUsageAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Average per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {paymentTransactions.length} payments, {refundTransactions.length} refunds
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
              searchKey="userPhone"
              loading={loading}
              filterFields={filterFields}
              datePickers={datePickers}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Screen;