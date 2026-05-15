"use client"

import Link from "next/link";
import { FileText, ShieldCheck, Lock, Clapperboard, ClipboardList } from "lucide-react";

const cards = [
  {
    href: "/forms/upload",
    icon: FileText,
    title: "Public Form",
    description: "Register new scripts to the system for evaluation.",
    accent: "var(--success)",
    accentBg: "var(--success-bg)",
  },
  {
    href: "/records/dashboard",
    icon: ClipboardList,
    title: "Records Office",
    description: "Strip contact information from scripts and forward them to the theater class.",
    accent: "var(--warning)",
    accentBg: "var(--warning-bg)",
  },
  {
    href: "/admin/dashboard",
    icon: Clapperboard,
    title: "Theater Class",
    description: "Manage the script database, assign scripts to evaluators, and oversee the system.",
    accent: "var(--indigo-light)",
    accentBg: "var(--indigo-glow)",
  },
  {
    href: "/evaluator/dashboard",
    icon: ShieldCheck,
    title: "Evaluator Portal",
    description: "View assigned scripts, evaluate based on instructions, and submit results.",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
  },
];

export default function LandingPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 70%), var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--indigo-glow)",
          border: "1px solid rgba(129,140,248,0.25)",
          borderRadius: "999px",
          padding: "0.3rem 0.9rem",
          marginBottom: "1.25rem",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--indigo-light)", display: "inline-block" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--indigo-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Secure Script Management
          </span>
        </div>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 900,
          color: "var(--text)",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
          marginBottom: "0.875rem",
        }}>
          ScriptEval
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "36rem", margin: "0 auto" }}>
          The internal gateway for secure theatrical script management and anonymous evaluation.
        </p>
      </div>

      {/* Portal Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        width: "100%",
        maxWidth: "720px",
      }}>
        {cards.map(({ href, icon: Icon, title, description, accent, accentBg }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "block",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              padding: "1.75rem",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              backdropFilter: "blur(20px)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: accentBg,
              border: `1px solid ${accent}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}>
              <Icon size={18} color={accent} strokeWidth={2} />
            </div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.375rem" }}>
              {title}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {description}
            </p>
          </Link>
        ))}

        {/* Auth portal — full width */}
        <Link
          href="/login"
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            padding: "1.25rem 1.75rem",
            textDecoration: "none",
            transition: "background 0.2s, border-color 0.2s",
            backdropFilter: "blur(20px)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: 8,
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.20)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock size={16} color="var(--danger)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text)" }}>Authentication Portal</span>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, color: "var(--indigo-light)",
                  background: "var(--indigo-glow)", border: "1px solid rgba(129,140,248,0.25)",
                  borderRadius: 999, padding: "0.1rem 0.5rem", textTransform: "uppercase", letterSpacing: "0.06em",
                }}>Secure</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                Login for Evaluators, Record Office, and Theater Class Administrators.
              </p>
            </div>
          </div>
          <span style={{ fontSize: "1.25rem", color: "var(--text-faint)" }}>→</span>
        </Link>
      </div>
    </main>
  );
}
