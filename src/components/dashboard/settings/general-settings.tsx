// src/components/dashboard/settings/general-settings.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">General Settings</CardTitle>
        <CardDescription>
          Manage your application preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-switch" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                Receive emails about your account activity.
                </span>
            </Label>
            <Switch id="notifications-switch" />
        </div>
         <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="theme-switch" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                Toggle between light and dark themes.
                </span>
            </Label>
            <Switch id="theme-switch" disabled />
        </div>
      </CardContent>
    </Card>
  );
}
