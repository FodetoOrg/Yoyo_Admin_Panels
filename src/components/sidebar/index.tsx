import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Breadcrumbs } from "./Breadcrumbs";
import { Icons } from "./Icons";



// Define user roles
export type UserRole = "admin" | "employee" | "manager" | "store" | "customer";

// Enhanced NavItem interface with role-based access
export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: any; // Updated to use IconKeys type
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  allowedRoles?: UserRole[];
  badge?: string;
}

const company = {
  name: "Packed Freshly",
  logo: GalleryVerticalEnd,
  plan: "Enterprise",
};

// Mock current user
// const user: User = {
//   name: "John Doe",
//   email: "john@acme.com",
//   avatar: "https://avatars.githubusercontent.com/u/68379183?s=64&v=4",
//   role: 'admin'
// };

interface AppSidebarProps {
  children: React.ReactNode;
  pathname: string;
  navItems: NavItem[];
  user: {
    name: string;
    email: string;
    userType: string;
  };
}

export default function AppSidebar({
  children,
  pathname,
  navItems,
  user,
}: AppSidebarProps) {
  console.log("filteredNavs ", navItems);
  const [mounted, setMounted] = useState(false);
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const filtered = navItems.filter((item) => item.show);
    setFilteredNavItems(filtered);
  }, [navItems]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const renderIcon = (iconName: IconKeys | undefined) => {
    if (!iconName) return null;
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="size-4" /> : null;
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <company.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs flex items-center gap-2">
                {company.plan}
                <Badge variant="secondary" className="ml-2">
                  {user?.userType}
                </Badge>
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                          disabled={item.disabled}
                        >
                          {renderIcon(item.icon)}
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                disabled={subItem.disabled}
                              >
                                <a href={subItem.url}>
                                  {renderIcon(subItem.icon)}
                                  <span>{subItem.title}</span>
                                  {subItem.badge && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto"
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
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
                    >
                      <a href={item.url}>
                        {renderIcon(item.icon)}
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto">
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
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <LogOut
                  onClick={async () => {
                    
                  }}
                  className="ml-auto size-4"
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
  );
}
