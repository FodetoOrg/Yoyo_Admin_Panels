import { Hotel, Users, Calendar, Receipt, LayoutDashboard, MapPin, CreditCard, Bed, Tag, Percent, DollarSign } from "lucide-react";
import { UserRole } from "./auth";

export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    icon?: any;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: NavItem[];
    allowedRoles?: any[]; // New property for role-based access
    badge?: string; // New property for showing badges
    show?: boolean;
  }

  export const navItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
      show: true,
    },
    {
      title: "Cities",
      url: "/admin/cities",
      icon: MapPin,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN],
      show: true,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN],
      show: true,
    },
    {
      title: "Hotels",
      url: "/admin/hotels",
      icon: Hotel,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN],
      show: true,
    },
    {
      title: "Room Types",
      url: "/admin/room-types",
      icon: Tag,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN],
      show: true,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: Calendar,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
      show: true,
    },
    // {
    //   title: "Invoices",
    //   url: "/admin/invoices",
    //   icon: Receipt,
    //   isActive: false,
    //   allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    //   show: true,
    // },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    show: true,
  },
    {
      title: "Rooms",
      url: "/admin/rooms",
      icon: Bed,
      isActive: false,
      allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
      show: true,
    },
  {
    title: "Coupons",
    url: "/admin/coupons",
    icon: Percent,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
  },
    // {
    //   title: "Revenue Management",
    //   url: "/admin/revenue",
    //   icon: DollarSign,
    //   isActive: false,
    //   allowedRoles: [UserRole.SUPER_ADMIN],
    //   show: true,
    // },
    // {
    //   title: "Dynamic Pricing",
    //   url: "/admin/pricing",
    //   icon: DollarSign,
    //   isActive: false,
    //   allowedRoles: [UserRole.SUPER_ADMIN],
    //   show: true,
    // },
    
  ];