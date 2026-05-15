"use client";

import { useSession } from "@/lib/auth-client";

export default function UserBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div style={{
      position: "fixed",
      top: "1.25rem",
      right: "1.25rem",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "999px",
      padding: "0.375rem 0.875rem",
      backdropFilter: "blur(12px)",
      fontSize: "0.8125rem",
      color: "var(--text-muted)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}>
      <span style={{
        width: 7, height: 7,
        borderRadius: "50%",
        background: "var(--success)",
        display: "inline-block",
        boxShadow: "0 0 6px var(--success)",
      }} />
      <span>
        Logged in as{" "}
        <strong style={{ color: "var(--text)", fontWeight: 600 }}>
          {session.user.name}
        </strong>
      </span>
    </div>
  );
}
