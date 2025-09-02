import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";

interface Props {
  hotels: any[];
  writeAccess: boolean;
  cityId?: string | null;
}

const HotelsScreen = ({
  hotels = [],
  writeAccess = false,
  cityId,
}: Props) => {
  console.log("hotel data  ", hotels);
  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Hotels"}
            description="these are the hotels that you can manage"
          ></Heading>
          <div className="flex items-center gap-2">
            {cityId && (
              <a href="/admin/hotels">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear City Filter
                </Button>
              </a>
            )}
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
        </div>

        {cityId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Currently viewing hotels filtered by city ID: <strong>{cityId}</strong>
            </p>
          </div>
        )}

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
