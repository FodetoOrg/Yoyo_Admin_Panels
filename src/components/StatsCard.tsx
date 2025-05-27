import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const StatsCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
