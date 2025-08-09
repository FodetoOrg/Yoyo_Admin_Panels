import {
  Hotel,
  Users,
  Calendar,
  Receipt,
  LayoutDashboard,
  MapPin,
  CreditCard,
  Bed,
  Tag,
  Percent,
  DollarSign,
  UserCheck,
  Shield,
  UserCog,
  Building,
  Settings,
  PieChart,
  TrendingUp,
  Gift
} from "lucide-react";
import { UserRole } from "./auth";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  allowedRoles?: any[];
  badge?: string;
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
    items: [
      {
        title: "Customers",
        url: "/admin/users/customers",
        icon: UserCheck,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "234"
      },
      {
        title: "Hotel Admins",
        url: "/admin/users/hotelAdmins",
        icon: Shield,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "12"
      },

    ]
  },
  {
    title: "Hotels",
    url: "/admin/hotels",
    icon: Hotel,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
    items: [
      {
        title: "All Hotels",
        url: "/admin/hotels/",
        icon: Building,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      },
      {
        title: "Active Hotels ",
        url: "/admin/hotels/active",
        icon: Settings,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      },
      {
        title: "Inactive Hotels ",
        url: "/admin/hotels/inactive",
        icon: Settings,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      },
    ]
  },
  {
    title: "Room Types",
    url: "/admin/room-types",
    icon: Users,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
    items: [
      {
        title: "All Room Types",
        url: "/admin/room-types/",
        icon: UserCheck,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "234"
      },
      {
        title: "Active Room Types",
        url: "/admin/room-types/active",
        icon: UserCheck,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "234"
      },
      {
        title: "Inactive Room Types",
        url: "/admin/room-types/inactive",
        icon: Shield,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "12"
      },

    ]
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: Calendar,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    show: true,
    items: [
      {
        title: "All Bookings",
        url: "/admin/bookings",
        icon: Calendar,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
      {
        title: "Confirmed",
        url: "/admin/bookings/confirmed",
        icon: Calendar,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
      {
        title: "Cancelled",
        url: "/admin/bookings/cancelled",
        icon: Calendar,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
    ]
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    show: true,
    items: [
      {
        title: "All Payments",
        url: "/admin/payments",
        icon: CreditCard,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
      {
        title: "Pending",
        url: "/admin/payments/pending",
        icon: CreditCard,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
        badge: "3"
      },
      {
        title: "Completed",
        url: "/admin/payments/completed",
        icon: CreditCard,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },

    ]
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
    title: "Addons",
    url: "/admin/addons",
    icon: Percent,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    show: true,
    items: [
      {
        title: "All Addons",
        url: "/admin/addons",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
      {
        title: "Active Addons",
        url: "/admin/addons/active",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
        badge: "8"
      },
      {
        title: "Inactive Addons",
        url: "/admin/addons/expired",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
        show: true,
      },
    ]
  },
  {
    title: "Wallet Usage",
    url: "/admin/wallet-usages",
    icon: Percent,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
    items: [
      {
        title: "All Wallet Usage",
        url: "/admin/wallet-usages",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      }
    ]
  },
  {
    title: "Refunds",
    url: "/admin/refunds",
    icon: Percent,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
    items: [
      {
        title: "All Refunds",
        url: "/admin/refunds",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      }
    ]
  },
  {
    title: "Coupons",
    url: "/admin/coupons",
    icon: Percent,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN],
    show: true,
    items: [
      {
        title: "All Coupons",
        url: "/admin/coupons",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      },
      {
        title: "Active",
        url: "/admin/coupons/active",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
        badge: "8"
      },
      {
        title: "Expired",
        url: "/admin/coupons/expired",
        icon: Gift,
        allowedRoles: [UserRole.SUPER_ADMIN],
        show: true,
      },
      
    ]
  },
  {
    title: "Settings",
    url: "/admin/configurations",
    icon: Bed,
    isActive: false,
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HOTEL_ADMIN],
    show: true,

  },
]