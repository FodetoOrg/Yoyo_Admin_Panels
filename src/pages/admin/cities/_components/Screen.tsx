import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";

interface Props {
  cities: any[];
}

const CitiesScreen = ({ cities = [] }: Props) => {
  console.log("citiesData ", cities);
  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Cities"}
            description="these are the cities that we r currently offering our services"
          ></Heading>

          <Button>
            <a
              href="/admin/cities/new"
              className="text-xs md:text-sm flex items-center  "
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Add New
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={cities}
          datePickers={datePickers}
          hiddenColumns={[]}
        />
      </div>
    </PageContainer>
  );
};

export default CitiesScreen;
