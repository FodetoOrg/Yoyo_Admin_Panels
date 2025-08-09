import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";

interface Props {
  hotels: any[];
  writeAccess: boolean;
}

const HotelsScreen = ({
  hotels = [],
  writeAccess = false,
}: Props) => {
  console.log("categoriesData ", hotels);
  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Hotels"}
            description="these are the hotels that you can manage"
          ></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/admin/hotels/new"
                className="text-xs md:text-sm flex items-center  "
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New
              </a>
            </Button>
          )}
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={hotels}
          datePickers={datePickers}
          hiddenColumns={writeAccess?[]:['actions']}
        />
      </div>
    </PageContainer>
  );
};

export default HotelsScreen;
