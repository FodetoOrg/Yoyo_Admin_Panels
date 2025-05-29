import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { columns, datePickers, filterFields } from "./columns";


interface Props {
  staff: any[];
}

const HotelsScreen = ({ staff = [] }: Props) => {
  return (
    // <PageContainer>
    <div className="space-y-4">
      

      <DataTable
        columns={columns}
        filterFields={filterFields}
        data={staff}
        datePickers={datePickers}
        hiddenColumns={[]}
      />
    </div>
    // </PageContainer>
  );
};

export default HotelsScreen;
