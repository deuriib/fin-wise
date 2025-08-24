// src/components/dashboard/header.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

function getPageTitle(pathname: string) {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/dashboard/transactions":
      return "Transactions";
    case "/dashboard/recurring":
      return "Recurring";
    case "/dashboard/budgets":
      return "Budgets";
    case "/dashboard/credit-cards":
      return "Credit Cards";
    case "/dashboard/reports":
      return "Reports";
    case "/dashboard/profile":
      return "Profile";
    case "/dashboard/settings":
      return "Settings";
    default:
      return "FinWise";
  }
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const title = getPageTitle(pathname);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }


  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
