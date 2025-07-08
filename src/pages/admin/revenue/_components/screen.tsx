import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns, datePickers, filterFields, type RevenueRecord } from "./columns";

interface Props {
  revenueRecords: RevenueRecord[];
}

const RevenueScreen = ({ revenueRecords = [] }: Props) => {
  const pendingRecords = revenueRecords.filter(record => record.status === "pending" || record.status === "overdue");
  const paidRecords = revenueRecords.filter(record => record.status === "paid");

  return (
    <PageContainer>
      <div className="space-y-4">
        <Heading
          title="Revenue Management"
          description="Manage hotel commission payments and revenue tracking"
        />
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Need to Pay ({pendingRecords.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Already Paid ({paidRecords.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            <DataTable
              columns={columns}
              filterFields={filterFields}
              data={pendingRecords}
              datePickers={datePickers}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="paid" className="space-y-4">
            <DataTable
              columns={columns}
              filterFields={filterFields}
              data={paidRecords}
              datePickers={datePickers}
              hiddenColumns={[]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default RevenueScreen;