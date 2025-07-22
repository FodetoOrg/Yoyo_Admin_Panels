import { DateRangePicker } from "@/components/DateRangePicker";
import { Heading } from "@/components/Heading";
import TabGroup from "@/components/TabGroup";
import ViewAsAdmin from "./ViewAsAdmin";
import React from "react";

const DashboardTabs = [
  {
    value: "Overview",
    action: "/admin/dashboard",
  },
  {
    value: "Cities",
    action: "/admin/dashboard/cities",
  },
  {
    value: "Hotels",
    action: "/admin/dashboard/hotels",
  },
];

const defaultRange = {
  from: new Date(2024, 0, 1),
  to: new Date(2024, 0, 31),
};

const Header = ({ 
  currentTab, 
  hotels = [], 
  currentUser = { role: "admin" } 
}: { 
  currentTab: string;
  hotels?: Array<{ id: string; name: string; ownerId: string }>;
  currentUser?: { role: string };
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {DashboardTabs.length > 0 && (
          <TabGroup tabs={DashboardTabs} currentTab={currentTab || ""} />
        )}
        <DateRangePicker
          field="date"
          defaultRange={defaultRange}
          onDateRangeChange={(range) => {
            console.log("Date range changed:", range);
          }}
        />
      </div>
      {/* <ViewAsAdmin hotels={hotels} currentUser={currentUser} /> */}
    </div>
  );
};

export default Header;
