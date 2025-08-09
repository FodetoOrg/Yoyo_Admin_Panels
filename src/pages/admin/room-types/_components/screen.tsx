import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields, type RoomType } from "./columns";

interface Props {
  roomTypes: RoomType[];
}

const RoomTypesScreen = ({ roomTypes = [] }: Props) => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Room Types"
            description="Manage different types of rooms and their configurations"
          />
          <Button>
            <a
              href="/admin/room-types/new"
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Add Room Type
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={roomTypes}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default RoomTypesScreen;