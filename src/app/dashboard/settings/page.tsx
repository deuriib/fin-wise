// src/app/dashboard/settings/page.tsx
"use client";

import { SettingsClient } from "@/components/dashboard/settings-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Category } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
  
  const isLoading = categoriesLoading;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <SettingsClient initialCategories={categories} />;
}
