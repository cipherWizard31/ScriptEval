"use client";

import { useSession } from "@/lib/auth-client";

export default function UserBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="absolute top-6 right-6 z-50 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500"></span>
      Logged in as <span className="font-bold">{session.user.name}</span> ({session.user.email})
    </div>
  );
}
