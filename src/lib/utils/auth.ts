// Auth utility functions
export const getCurrentUser = () => {
  // This should come from your actual auth context/API
  // For now, returning mock data
  return {
    id: "usr_001",
    name: "John Doe",
    email: "john@example.com",
    role: "super_admin", // or "hotel_admin"
    hotelId: null, // for hotel_admin, this would be their hotel ID
  };
};

export const getViewAsContext = () => {
  if (typeof window !== 'undefined') {
    const viewAsHotel = localStorage.getItem("viewAsHotel");
    return viewAsHotel ? { hotelId: viewAsHotel, isViewingAs: true } : null;
  }
  return null;
};

export const isHotelAdmin = (user: any) => {
  return user?.role === "hotel_admin";
};

export const isSuperAdmin = (user: any) => {
  return user?.role === "super_admin";
};

export const getEffectiveRole = (user: any) => {
  const viewAsContext = getViewAsContext();
  if (viewAsContext && isSuperAdmin(user)) {
    return "hotel_admin";
  }
  return user?.role;
};

export const getEffectiveHotelId = (user: any) => {
  const viewAsContext = getViewAsContext();
  if (viewAsContext && isSuperAdmin(user)) {
    return viewAsContext.hotelId;
  }
  return user?.hotelId;
};