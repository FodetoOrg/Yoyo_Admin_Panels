import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns, datePickers, filterFields, type RevenueRecord } from "./columns";
import { apiService } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";

interface Props {
  revenueRecords: RevenueRecord[];
}

const RevenueScreen = ({ revenueRecords = [] }: Props) => {  
  const pendingRecords = revenueRecords.filter(record => record.status === "pending" || record.status === "overdue");
  const paidRecords = revenueRecords.filter(record => record.status === "paid");

  // Function to handle marking a record as paid
  const handleMarkAsPaid = async (recordId: string) => {
    try {
      const response = await apiService.post(ROUTES.PAY_REVENUE_ROUTE(recordId), {
        paidDate: new Date().toISOString()
      });
      
      if (response.success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert(response.message || "Failed to mark record as paid");
      }
    } catch (error) {
      console.error("Error marking record as paid:", error);
      alert("An error occurred while processing the payment");
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
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
          
          <TabsContent value="pending" className="flex flex-col gap-y-4">
            <DataTable
              columns={columns}
              onMarkAsPaid={handleMarkAsPaid}
              filterFields={filterFields}
              data={pendingRecords}
              datePickers={datePickers}
              hiddenColumns={[]}
            />
          </TabsContent>
          
          <TabsContent value="paid" className="flex flex-col gap-y-4">
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