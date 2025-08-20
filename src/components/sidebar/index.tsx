import React, { useEffect, useState } from "react";
import { getCurrentUser, getEffectiveRole, isHotelAdmin, isSuperAdmin, UserRole } from "@/lib/utils/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationPermissionBanner } from "@/components/notifications/NotificationPermissionBanner";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  Hotel,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { deleteCookie, CONSTANTS } from "@/lib/utils/api";
import { Breadcrumbs } from "./Breadcrumbs";
import { Icons } from "./Icons";

// Enhanced NavItem interface with role-based access
export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon | React.ComponentType<any>; // Fixed icon type
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  allowedRoles?: UserRole[];
  badge?: string;
  show?: boolean;
}

const company = {
  name: "Packed Freshly",
  logo: GalleryVerticalEnd,
  plan: "Enterprise",
};

interface AppSidebarProps {
  children: React.ReactNode;
  pathname: string;
  navItems: NavItem[];
  user: any;
}

export default function AppSidebar({
  children,
  pathname,
  navItems,
  user,
}: AppSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  const currentUser = user;
  const effectiveRole = getEffectiveRole(currentUser);

  // Function to check if current path matches any item in the navigation
  const isPathActive = (item: NavItem): boolean => {
    if (pathname === item.url) return true;
    if (item.items) {
      return item.items.some(subItem => pathname === subItem.url);
    }
    return false;
  };

  // Function to determine if a collapsible should be open based on current path
  const shouldBeOpen = (item: NavItem): boolean => {
    if (item.items) {
      return item.items.some(subItem => pathname === subItem.url);
    }
    return false;
  };

  useEffect(() => {
    // Filter navigation items based on effective role
    const filtered = navItems.filter((item) => {
      if (!item.show) return false;

      // For hotel admins (including super admin viewing as hotel admin) 
      if (effectiveRole === UserRole.HOTEL_ADMIN) {
        // Hide Cities page for hotel admins
        if (item.url === "/admin/cities") return false;
        // Hide Users page for hotel admins
        if (item.url === "/admin/users") return false;
        // Hide Hotels page for hotel admins
        if (item.url === "/admin/hotels") return false;
      }

      return true;
    });

    // Set initial open state based on current path
    const initialOpenItems: string[] = [];
    filtered.forEach(item => {
      if (shouldBeOpen(item)) {
        initialOpenItems.push(item.title);
      }
    });

    setFilteredNavItems(filtered);
    setOpenCollapsibles(initialOpenItems);
  }, [navItems, effectiveRole, pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    // Clear all authentication cookies
    deleteCookie(CONSTANTS.ACCESS_TOKEN_KEY);
    deleteCookie(CONSTANTS.REFRESH_TOKEN_KEY);
    deleteCookie(CONSTANTS.USER);

    // Clear localStorage
    localStorage.removeItem("viewAsHotel");
    localStorage.removeItem("viewAsHotelName");
    localStorage.removeItem("currentUser");

    // Redirect to auth page
    window.location.href = "/auth";
  };

  const renderIcon = (IconComponent: any | undefined) => {
    if (!IconComponent) return null;

    // Check if it's a valid React component (Lucide icon)
    if (typeof IconComponent === 'function') {
      return <IconComponent className="w-5 h-5" />;
    }

    // If it's already a React element
    if (React.isValidElement(IconComponent)) {
      return React.cloneElement(IconComponent, { className: "w-5 h-5" });
    }

    // Log warning for debugging
    console.warn('Invalid icon type received:', typeof IconComponent, IconComponent);
    return null;
  };

  const handleCollapsibleChange = (itemTitle: string, isOpen: boolean) => {
    setOpenCollapsibles(prev => {
      if (isOpen) {
        return [...prev, itemTitle];
      } else {
        return prev.filter(title => title !== itemTitle);
      }
    });
  };

  return (
    <NotificationProvider userId={user?.id}>
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {/* Notification Permission Banner */}
          {showNotificationBanner && (
            <NotificationPermissionBanner
              onPermissionGranted={() => setShowNotificationBanner(false)}
              onDismiss={() => setShowNotificationBanner(false)}
            />
          )}
          
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <company.logo className="w-6 h-6" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-base">{company.name}</span>
            <div className="flex items-center gap-2 px-4">
              <NotificationBell userId={user?.id} />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const hasSubItems = item?.items && item?.items?.length > 0;
                const isItemActive = isPathActive(item);
                const hasActiveChild = hasSubItems && item.items?.some(subItem => pathname === subItem.url);
                const isCollapsibleOpen = openCollapsibles.includes(item.title);

                return hasSubItems ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    open={isCollapsibleOpen}
                    onOpenChange={(isOpen) => handleCollapsibleChange(item.title, isOpen)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={false} // Don't highlight parent when child is active
                          disabled={item.disabled}
                          className={`text-sm h-11 hover:bg-gray-100`}
                          
                        >
                          {renderIcon(item.icon)}
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto mr-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isSubItemActive = pathname === subItem.url;
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubItemActive}
                                  className={`text-sm h-9 ml-4 ${isSubItemActive
                                    ? 'bg-black text-white hover:bg-black hover:text-white'
                                    : 'hover:bg-gray-100'
                                    }`}
                                    style={isSubItemActive?{
                                      backgroundColor:"gray",
                                      color:'white'
                                    }:{}}
                                >
                                  <a href={subItem.url}>
                                    {renderIcon(subItem.icon)}
                                    <span className="font-medium">{subItem.title}</span>
                                   
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                      disabled={item.disabled}
                     
                      className={`text-sm h-11 ${pathname === item.url
                        ? 'bg-black text-white hover:bg-black hover:text-white'
                        : 'hover:bg-gray-100'
                        }`}
                        style={pathname === item.url?{
                          backgroundColor:"black",
                          color:'white'
                        }:{}}
                    >
                      <a href={item.url}>
                        {renderIcon(item.icon)}
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <LogOut
                  onClick={handleLogout}
                  className="ml-auto w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs pathname={pathname} />
          </div>
          <div className="flex hidden items-center gap-2 px-4">
            {notifications > 0 && (
              <Badge variant="destructive">
                {notifications} new notifications
              </Badge>
            )}
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
    </NotificationProvider>
  );
}