import { DateRangePicker } from "@/components/DateRangePicker";
import { AreaGraph } from "@/components/Graphs/AreaGraph";
import { BarGraph } from "@/components/Graphs/BarGraph";
import PieGraph from "@/components/Graphs/PieGraph";
import { Heading } from "@/components/Heading";
import PageContainer from "@/components/PageContainer";
import StatsCard from "@/components/StatsCard";
import TabGroup from "@/components/TabGroup";
import React from "react";
import type { DateRange } from "react-day-picker";


const data = [
  { date: "Jan", sales: 100, revenue: 1000, profit: 500 },
  { date: "Feb", sales: 150, revenue: 1500, profit: 750 },
  // ...
];

const dataBar = [
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-02-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-03-03",
    sales: 200,
    revenue: 2000,
    profit: 1000,
  },
  {
    date: "2024-04-04",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-05-05",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-06-06",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-07-07",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-08-08",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-09-09",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-10-10",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-11-11",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-12-12",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2025-01-01",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2025-01-02",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2025-01-03",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2025-01-04",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2025-01-05",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2025-01-06",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },
  {
    date: "2024-01-01",
    sales: 100,
    revenue: 1000,
    profit: 500,
  },
  {
    date: "2024-01-02",
    sales: 150,
    revenue: 1500,
    profit: 750,
  },

  // ...
];

const chartConfig = {
  sales: { label: "Total Sales" },
  revenue: { label: "Revenue" },
  profit: { label: "Profit" },
};


const Dasboard = () => {
  return (
    <div >
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Hotels" value="10" />
        <StatsCard title="Total Hotels" value="10" />
        <StatsCard title="Total Hotels" value="10" />
        <StatsCard title="Total Hotels" value="10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AreaGraph
          data={data}
          xAxisKey="date"
          colors={["#ff0000", "#00ff00", "#0000ff"]} // Optional custom colors
        />
        <AreaGraph
          data={data}
          xAxisKey="date"
          colors={["#ff0000", "#00ff00", "#0000ff"]} // Optional custom colors
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarGraph
          data={dataBar}
          chartConfig={chartConfig}
          xAxisKey="date"
          dateFormat="full"
          showGrid={true}
        />
        <BarGraph
          data={dataBar}
          chartConfig={chartConfig}
          xAxisKey="date"
          dateFormat="full"
          showGrid={true}
        />
      </div>
      <PieGraph
        data={[
          {
            name: "Sales",
            value: 100,
          },
          {
            name: "Sales",
            value: 100,
          },
          {
            name: "Sales",
            value: 100,
          },
        ]}
        className="mx-auto aspect-square max-h-[360px]"
        labelText="Total"
        fillKey="fill"
      />
    </div>
  );
};

export default Dasboard;
