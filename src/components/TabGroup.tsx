import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const TabGroup = ({
  tabs = [],
  currentTab = tabs.length > 0 ? tabs[0].value : "",
}: {
  tabs: {
    value: string;
    action: string | (() => void);
  }[];
  currentTab: string;
}) => {
  return tabs.length > 0 ? (
    <Tabs defaultValue={currentTab} className="w-[400px]">
      <TabsList>
        {tabs.map((tab) =>
          typeof tab.action === "function" ? (
            <TabsTrigger key={tab.value} value={tab.value} onClick={tab.action}>
              {tab.value}
            </TabsTrigger>
          ) : (
            <TabsTrigger key={tab.value} value={tab.value} onClick={() => {}}>
              <a href={tab.action}>{tab.value}</a>
            </TabsTrigger>
          )
        )}
      </TabsList>
    </Tabs>
  ) : (
    <></>
  );
};

export default TabGroup;
