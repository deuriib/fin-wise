// src/components/dashboard/settings-client.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesSettings } from "./settings/categories-settings";
import { ProfileSettings } from "./settings/profile-settings";
import { GeneralSettings } from "./settings/general-settings";
import type { Category } from "@/lib/types";
import type { User } from "firebase/auth";

interface SettingsClientProps {
  initialCategories: Category[];
  user: User;
}

export function SettingsClient({ initialCategories, user }: SettingsClientProps) {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application settings.
          </p>
        </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesSettings initialCategories={initialCategories} />
        </TabsContent>
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
