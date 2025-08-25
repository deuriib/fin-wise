// src/components/dashboard/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  CircleDollarSign,
  BarChart3,
  Settings,
  LogOut,
  Repeat,
  CreditCard,
  Landmark,
  HelpCircle,
  Target,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FinWiseLogo } from "@/components/icons/logo";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/accounts",
    icon: Landmark,
    label: "Accounts",
  },
  {
    href: "/dashboard/transactions",
    icon: Wallet,
    label: "Transactions",
  },
   {
    href: "/dashboard/recurring",
    icon: Repeat,
    label: "Recurring",
  },
  {
    href: "/dashboard/budgets",
    icon: CircleDollarSign,
    label: "Budgets",
  },
  {
    href: "/dashboard/goals",
    icon: Target,
    label: "Goals",
  },
   {
    href: "/dashboard/credit-cards",
    icon: CreditCard,
    label: "Credit Cards",
  },
  {
    href: "/dashboard/reports",
    icon: BarChart3,
    label: "Reports",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <FinWiseLogo className="h-10 w-auto text-primary" />
      </SidebarHeader>
      <SidebarSeparator className="my-1" />
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
                <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === "/dashboard/settings"}>
                    <Link href="/dashboard/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help" isActive={pathname === "/dashboard/help"}>
                    <Link href="/dashboard/help">
                        <HelpCircle />
                        <span>Help</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator className="my-1" />
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
