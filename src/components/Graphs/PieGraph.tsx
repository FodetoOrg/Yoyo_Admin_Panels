import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Function to generate random pastel colors
const generateRandomColor = () => {
  // Generate higher base values for lighter colors
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 65%)`;
};

interface PieGraphProps {
  data: { name: string; value: number }[];

  className?: string;
  labelText?: string;
  fillKey?: string;
}
const dataKey = "value";
const nameKey = "name";
export function PieGraph({
  data = [],

  className = "mx-auto aspect-square max-h-[360px]",
  labelText = "Total",
  fillKey = "fill",
}: PieGraphProps) {
  const chartConfig = useMemo(() => {
    if (!data.length) return {};

    return {
      [dataKey]: {
        label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1),
      },
      ...data.reduce(
        (acc, item) => ({
          ...acc,
          [item[nameKey]]: {
            label: item[nameKey],
          },
        }),
        {}
      ),
    };
  }, [data, dataKey, nameKey]);

  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0);
  }, [data, dataKey]);

  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      [fillKey]: item[fillKey] || generateRandomColor(),
    }));
  }, [data, fillKey]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={processedData}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
          strokeWidth={5}
          fill={(entry) => entry[fillKey]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {labelText}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export default PieGraph;
