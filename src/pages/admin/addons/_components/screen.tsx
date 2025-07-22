import PageContainer from "@/components/PageContainer";
import { DataTable } from "@/components/GlobalTable/data-table";
import { Heading } from "@/components/Heading";
import { getCurrentUser, getEffectiveHotelId, isSuperAdmin } from "@/lib/utils/auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields, type Addon } from "./columns";

interface Props {
  addons: Addon[];
}

const AddonsScreen = ({ addons = [] }: Props) => {
  const currentUser = getCurrentUser();
  const effectiveHotelId = getEffectiveHotelId(currentUser);
  const isSuper = isSuperAdmin(currentUser);
  
  // Filter addons based on user role
  const filteredAddons = effectiveHotelId 
    ? addons.filter(addon => addon.hotelId === effectiveHotelId)
    : addons;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title="Addons Management"
            description={effectiveHotelId 
              ? "Manage your hotel addons and services" 
              : "Manage all hotel addons and services"
            }
          />
          <Button>
            <a
              href="/admin/addons/new"
              className="text-xs md:text-sm flex items-center"
            >
              <Plus className="mr-2 h-4 w-4 text-white" /> Add Addon
            </a>
          </Button>
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={filteredAddons}
          datePickers={datePickers}
          hiddenColumns={isSuper ? [] : ["hotelName"]}
        />
      </div>
    </PageContainer>
  );
};

export default AddonsScreen;