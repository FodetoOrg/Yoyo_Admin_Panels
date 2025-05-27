"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataPoint {
  [key: string]: string | number;
}

interface BarGraphProps {
  data?: DataPoint[];
  chartConfig?: ChartConfig;
  xAxisKey?: string;
  colors?: string[];
  dateFormat?: string;
  showGrid?: boolean;
}

export function BarGraph({ 
  data = [], 
  chartConfig = {},
  xAxisKey = 'date',
  colors = [
    'hsl(210, 70%, 50%)',   // Bright Blue
    'hsl(120, 60%, 50%)',   // Vibrant Green
    'hsl(340, 70%, 50%)',   // Coral Red
    'hsl(40, 80%, 50%)',    // Warm Orange
    'hsl(280, 60%, 50%)',   // Purple
    'hsl(30, 80%, 50%)'     // Deep Orange
  ],
  dateFormat = "short",
  showGrid = true
}: BarGraphProps) {
  const getDataKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key !== xAxisKey);
  }, [data, xAxisKey]);

  const formatDate = (value: string | number): string => {
    if (typeof value !== 'string') return String(value);
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    if (dateFormat === "full") {
      options.year = "numeric";
    }

    return date.toLocaleDateString("en-US", options);
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[280px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {showGrid && (
          <CartesianGrid 
            vertical={false} 
            horizontal={true}
            className="stroke-gray-100"
          />
        )}
        <YAxis 
          tickLine={false}
          axisLine={false}
          className="text-xs"
        />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={formatDate}
        />
        <Tooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="label"
              labelFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        {getDataKeys.map((key, index) => (
          <Bar 
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            fillOpacity={0.7}
            name={chartConfig[key]?.label || key}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}