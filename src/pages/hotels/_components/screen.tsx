import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";

interface Props {
  categoriesData: any[];
  writeAccess: boolean;
}

const CategoriesScree = ({
  categoriesData = [],
  writeAccess = false,
}: Props) => {
  console.log("categoriesData ", categoriesData);
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Categories"}
            description="these are useful for adding tags to products"
          ></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/hotels/new"
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
          data={categoriesData}
          datePickers={datePickers}
          hiddenColumns={writeAccess?[]:['actions']}
        />
      </div>
    </PageContainer>
  );
};

export default CategoriesScree;
