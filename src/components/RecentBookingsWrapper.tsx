"use client";

import React, { useState, useEffect } from "react";
import { RecentBookingsModal } from "./RecentBookingsModal";
import { RecentBookingsButton } from "./RecentBookingsButton";

interface RecentBookingsWrapperProps {
  userRole: string;
}

export const RecentBookingsWrapper: React.FC<RecentBookingsWrapperProps> = ({
  userRole
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('dashboard-visited');
    if (!hasVisited) {
      localStorage.setItem('dashboard-visited', 'true');
      setIsFirstVisit(true);
    }

    // Listen for custom events to open modal
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    document.addEventListener('openRecentBookingsModal', handleOpenModal);

    // Auto-open modal on first visit after a delay
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 2000); // 2 second delay

      return () => {
        clearTimeout(timer);
        document.removeEventListener('openRecentBookingsModal', handleOpenModal);
      };
    }

    return () => {
      document.removeEventListener('openRecentBookingsModal', handleOpenModal);
    };
  }, [isFirstVisit]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <RecentBookingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userRole={userRole}
      />
      <RecentBookingsButton onClick={handleOpenModal} />
    </>
  );
};
