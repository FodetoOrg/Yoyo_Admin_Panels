import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields, type Addon } from "./columns";

interface Props {
  addons: Addon[];
  hotelId: string;
  hotelName: string;
}

const HotelAddonsScreen = ({ addons = [], hotelId, hotelName }: Props) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={`${hotelName} - Addons`}
            description="Manage addons and services for this hotel"
          />
          <Button>
            <a
              href={`/admin/hotels/${hotelId}/addons/new`}
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Add Addon
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={addons}
          datePickers={datePickers}
          hiddenColumns={["hotelName"]}
        />
      </div>
    </PageContainer>
  );
};

export default HotelAddonsScreen;