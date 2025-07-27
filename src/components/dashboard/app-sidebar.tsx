"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  CircleDollarSign,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FinWiseLogo } from "@/components/icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/transactions",
    icon: Wallet,
    label: "Transactions",
  },
  {
    href: "/dashboard/budgets",
    icon: CircleDollarSign,
    label: "Budgets",
  },
  {
    href: "/dashboard/reports",
    icon: BarChart3,
    label: "Reports",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <FinWiseLogo className="h-10 w-auto text-primary" />
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="#">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                    <Link href="/login">
                        <LogOut />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
