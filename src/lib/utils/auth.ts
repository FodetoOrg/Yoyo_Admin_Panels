// Auth utility functions
export enum UserRole {
  USER = 'user',
  HOTEL_ADMIN = 'hotel',
  STAFF = 'staff',
  SUPER_ADMIN = 'superAdmin'
}

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
  
  return null;
};

export const getViewAsContext = () => {
  if (typeof window !== 'undefined') {
    const viewAsHotel = localStorage.getItem("viewAsHotel");
    return viewAsHotel ? { hotelId: viewAsHotel, isViewingAs: true } : null;
  }
  return null;
};

export const isHotelAdmin = (user: any) => {
  return user?.role === UserRole.HOTEL_ADMIN;
};

export const isSuperAdmin = (user: any) => {
  return user?.role === UserRole.SUPER_ADMIN;
};

export const isStaff = (user: any) => {
  return user?.role === UserRole.STAFF;
};

export const getEffectiveRole = (user: any) => {
  const viewAsContext = getViewAsContext();
  if (viewAsContext && isSuperAdmin(user)) {
    return UserRole.HOTEL_ADMIN;
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

export const canAccessPage = (user: any, page: string) => {
  if (!user) return false;
  
  const role = user.role;
  
  // Super admin can access everything
  if (role === UserRole.SUPER_ADMIN) return true;
  
  // Hotel admin access restrictions
  if (role === UserRole.HOTEL_ADMIN) {
    const allowedPages = [
      '/admin/dashboard',
      '/admin/bookings',
      '/admin/invoices', 
      '/admin/payments',
      '/admin/rooms'
    ];
    
    return allowedPages.some(allowedPage => page.startsWith(allowedPage));
  }
  
  // Staff access (not implemented yet)
  if (role === UserRole.STAFF) {
    return false; // No access for now
  }
  
  // Regular users don't have admin access
  return false;
};

export const redirectIfUnauthorized = (Astro: any, requiredRole?: UserRole) => {
  const user = Astro.locals.user;
  
  if (!user) {
    Astro.cookies.delete('accessToken');
    Astro.cookies.delete('refreshToken');
    return Astro.redirect('/auth');
  }
  
  // Check if user can access this page
  if (!canAccessPage(user, Astro.url.pathname)) {
    return Astro.redirect('/admin/dashboard');
  }
  
  // Check specific role requirement
  if (requiredRole && user.role !== requiredRole && user.role !== UserRole.SUPER_ADMIN) {
    return Astro.redirect('/admin/dashboard');
  }
  
  return null;
};