// src/components/dashboard/profile-client.tsx
"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { updateDocument } from "@/services/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProfileClientProps {
  user: User;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (user.displayName === displayName) {
        setIsLoading(false);
        return;
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName });
      // Update Firestore user document
      await updateDocument(`users`, user.uid, { displayName });
      
      toast({ title: "Profile updated successfully." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Profile</CardTitle>
        <CardDescription>
          Update your personal information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleProfileUpdate}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Full Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email || ""} disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
