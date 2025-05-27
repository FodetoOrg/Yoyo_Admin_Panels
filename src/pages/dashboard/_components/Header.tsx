import { DateRangePicker } from "@/components/DateRangePicker";
import { Heading } from "@/components/Heading";
import TabGroup from "@/components/TabGroup";
import React from "react";

const DashboardTabs = [
  {
    value: "Overview",
    action: "/dashboard",
  },
  {
    value: "Cities",
    action: "/dashboard/cities",
  },
  {
    value: "Hotels",
    action: "/dashboard/hotels",
  },
];

const defaultRange = {
  from: new Date(2024, 0, 1),
  to: new Date(2024, 0, 31),
};

const Header = ({ currentTab }: { currentTab: string }) => {
  return (
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
  );
};

export default Header;
