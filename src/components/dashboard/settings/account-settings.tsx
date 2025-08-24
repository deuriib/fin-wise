// src/components/dashboard/settings/account-settings.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AccountSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Account & Security</CardTitle>
        <CardDescription>
          Manage your account settings and security preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
                It's a good idea to use a strong password that you're not using elsewhere.
            </p>
            <Button variant="outline">Change Password</Button>
        </div>
        <Separator />
         <div>
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account.
            </p>
            <Button variant="outline" disabled>Enable 2FA</Button>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-destructive/10 p-6">
        <div className="flex flex-col">
            <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all of your data. This action is not reversible.
            </p>
            <Button variant="destructive">Delete My Account</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
