"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, BookOpen } from "lucide-react";

interface RecentBookingsButtonProps {
  onClick: () => void;
  className?: string;
}

export const RecentBookingsButton: React.FC<RecentBookingsButtonProps> = ({
  onClick,
  className = ""
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={`fixed top-4 right-20 z-50 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 ${className}`}
    >
      <BookOpen className="h-4 w-4 mr-2" />
      Recent Bookings
    </Button>
  );
};
