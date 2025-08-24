// src/app/dashboard/profile/page.tsx
"use client";

import { ProfileClient } from "@/components/dashboard/profile-client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    
    if (loading || !user) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <ProfileClient user={user} />;
}
