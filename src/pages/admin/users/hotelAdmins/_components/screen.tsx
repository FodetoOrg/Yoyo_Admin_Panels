import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { columns, datePickers, filterFields } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  hotelAdmins: any[];
}

const HotelsScreen = ({ hotelAdmins = [] }: Props) => {
  return (
    // <PageContainer>
    <div className="flex flex-col gap-y-4">
      
      <DataTable
        columns={columns}
        filterFields={filterFields}
        data={hotelAdmins}
        datePickers={datePickers}
        hiddenColumns={[]}
      />
    </div>
    // </PageContainer>
  );
};

export default HotelsScreen;
