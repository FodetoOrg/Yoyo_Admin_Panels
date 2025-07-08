import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";
import type { Invoice } from "@/lib/types";

interface Props {
  invoices: Invoice[];
}

const InvoicesScreen = ({ invoices = [] }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Invoices"
            description="Manage billing and payment invoices"
          />
          <Button>
            <a
              href="/admin/invoices/new"
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Create Invoice
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={invoices}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default InvoicesScreen;