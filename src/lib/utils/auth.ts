// Auth utility functions
export const getCurrentUser = (astroLocals?: any) => {
  // Get user from Astro.locals.user if available
  if (astroLocals?.user) {
    return astroLocals.user;
  }
  
  // Fallback for client-side (this should be replaced with proper client auth)
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
  }
  
  // Default fallback
  return {
    id: "usr_001",
    name: "John Doe",
    email: "john@example.com",
    role: "super_admin",
    hotelId: null,
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