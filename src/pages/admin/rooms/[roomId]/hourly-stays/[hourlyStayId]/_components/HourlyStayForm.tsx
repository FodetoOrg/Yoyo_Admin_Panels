
import React from "react";
import PageContainer from "@/components/PageContainer";
import  DynamicForm  from "@/components/GloabalForm/DynamicForm";
import { getFormConfig } from "./config";

interface HourlyStayData {
  id: string;
  roomId: string;
  hours: number;
  price: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface RoomData {
  id: string;
  name: string;
  roomNumber: string;
  hotelId: string;
}

interface Props {
  roomId: string;
  roomData: RoomData;
  hourlyStayData?: HourlyStayData | null;
  currentUser: any;
}

const HourlyStayForm: React.FC<Props> = ({ roomId, roomData, hourlyStayData, currentUser }) => {
  const formConfig = getFormConfig(roomId, roomData, hourlyStayData);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {hourlyStayData ? "Edit Hourly Stay Package" : "Add Hourly Stay Package"}
          </h1>
          <p className="text-muted-foreground">
            {hourlyStayData ? "Update" : "Create"} hourly stay package for {roomData.name} (Room {roomData.roomNumber})
          </p>
        </div>
        <DynamicForm config={formConfig} />
      </div>
    </PageContainer>
  );
};

export default HourlyStayForm;
