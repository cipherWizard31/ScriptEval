"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FileText, ShieldCheck, Clapperboard, ClipboardList,
  ArrowRight, Star, Zap, Lock, CheckCircle, ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Script Submission",
    description:
      "Writers submit their scripts through a clean multi-step form. Contact details are captured securely and kept separate from the creative work.",
    accent: "var(--success)",
    accentBg: "var(--success-bg)",
  },
  {
    icon: ClipboardList,
    title: "Anonymized Records",
    description:
      "The records office strips all identifying information before forwarding scripts — ensuring evaluators judge the work, not the writer.",
    accent: "var(--warning)",
    accentBg: "var(--warning-bg)",
  },
  {
    icon: Clapperboard,
    title: "Theater Class Admin",
    description:
      "Administrators assign scripts, track evaluation progress, and manage the full pipeline from a powerful centralized dashboard.",
    accent: "var(--indigo-light)",
    accentBg: "var(--indigo-glow)",
  },
  {
    icon: ShieldCheck,
    title: "Evaluator Portal",
    description:
      "Evaluators receive only what they need — anonymized scripts and structured scoring rubrics — keeping the process fair and auditable.",
    accent: "#c084fc",
    accentBg: "rgba(192,132,252,0.08)",
  },
];

const steps = [
  { num: "01", title: "Submit", desc: "Writer fills out the public form with their details and script file." },
  { num: "02", title: "Anonymize", desc: "Records office redacts all personal info before passing it forward." },
  { num: "03", title: "Assign", desc: "Theater class admin assigns the script to one or more evaluators." },
  { num: "04", title: "Evaluate", desc: "Evaluators score the script and submit their structured feedback." },
];

const stats = [
  { value: "100%", label: "Anonymous Evaluation" },
  { value: "4-Step", label: "Secure Pipeline" },
  { value: "Role-Based", label: "Access Control" },
];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

export default function HomePage() {
  const scrollY = useScrollY();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 2rem",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 20 ? "rgba(15,15,20,0.85)" : "transparent",
        backdropFilter: scrollY > 20 ? "blur(20px)" : "none",
        borderBottom: scrollY > 20 ? "1px solid var(--border-faint)" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--indigo)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Clapperboard size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", letterSpacing: "-0.3px" }}>
            ScriptEval
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/directory" style={{
            fontSize: "0.85rem", fontWeight: 500, color: "var(--text-muted)",
            textDecoration: "none", padding: "0.4rem 0.75rem", borderRadius: 8,
            transition: "color 0.2s, background 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            Portals
          </Link>
          <Link href="/forms/upload" style={{
            fontSize: "0.85rem", fontWeight: 700, color: "#fff",
            background: "var(--indigo)", textDecoration: "none",
            padding: "0.45rem 1.1rem", borderRadius: 8,
            transition: "background 0.2s, transform 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--indigo-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--indigo)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Submit a Script
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "6rem 1.5rem 4rem",
        textAlign: "center",
        position: "relative",
        background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(79,70,229,0.22) 0%, transparent 65%)",
      }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(79,70,229,0.07)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "8%",
          width: 250, height: 250, borderRadius: "50%",
          background: "rgba(192,132,252,0.06)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: "var(--indigo-glow)",
          border: "1px solid rgba(129,140,248,0.30)",
          borderRadius: 999, padding: "0.3rem 1rem",
          marginBottom: "2rem",
        }}>
          <Star size={12} color="var(--indigo-light)" fill="var(--indigo-light)" />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--indigo-light)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Blind Script Evaluation Platform
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(3rem, 8vw, 5.5rem)",
          fontWeight: 900,
          color: "var(--text)",
          letterSpacing: "-2.5px",
          lineHeight: 1.05,
          maxWidth: "14ch",
          marginBottom: "1.5rem",
        }}>
          Fair Scripts.{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--indigo-light), #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Zero Bias.
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "var(--text-muted)",
          maxWidth: "42rem",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}>
          ScriptEval is a secure, end-to-end platform for theatrical script submission and
          anonymous peer evaluation — built to eliminate bias from the review process.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/forms/upload" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "var(--indigo)", color: "#fff",
            textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
            padding: "0.85rem 2rem", borderRadius: 12,
            boxShadow: "0 0 40px rgba(79,70,229,0.35)",
            transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--indigo-hover)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 0 60px rgba(79,70,229,0.50)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--indigo)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 0 40px rgba(79,70,229,0.35)"; }}
          >
            Submit Your Script <ArrowRight size={16} />
          </Link>
          <Link href="/directory" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            color: "var(--text-muted)", textDecoration: "none",
            fontWeight: 600, fontSize: "0.95rem",
            padding: "0.85rem 2rem", borderRadius: 12,
            backdropFilter: "blur(12px)",
            transition: "background 0.2s, color 0.2s, transform 0.15s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--surface-hover)"; el.style.color = "var(--text)"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--surface)"; el.style.color = "var(--text-muted)"; el.style.transform = "translateY(0)"; }}
          >
            View Portals <ChevronRight size={16} />
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "2.5rem", marginTop: "4rem",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{
        padding: "6rem 1.5rem",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "0.3rem 1rem", marginBottom: "1.25rem",
          }}>
            <Zap size={12} color="var(--warning)" fill="var(--warning)" />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Platform Features
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900,
            color: "var(--text)", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "0.875rem",
          }}>
            Everything your theater program needs
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "40rem", margin: "0 auto" }}>
            A role-based platform designed from the ground up to keep scripts anonymous, evaluations fair, and administration effortless.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}>
          {features.map(({ icon: Icon, title, description, accent, accentBg }) => (
            <div key={title} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              padding: "2rem",
              backdropFilter: "blur(20px)",
              transition: "transform 0.2s, background 0.2s, border-color 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.background = "var(--surface-hover)"; el.style.borderColor = `${accent}40`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.background = "var(--surface)"; el.style.borderColor = "var(--border)"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: accentBg, border: `1px solid ${accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <Icon size={20} color={accent} strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(79,70,229,0.08) 0%, transparent 70%)",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900,
              color: "var(--text)", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "0.875rem",
            }}>
              How it works
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "36rem", margin: "0 auto" }}>
              Four clear stages. Every participant only sees exactly what they need to see.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    display: "none",
                    position: "absolute", top: 22, left: "calc(100% - 12px)",
                    width: "calc(100% - 24px)", height: 1,
                    background: "var(--border-faint)", zIndex: 0,
                  }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "var(--indigo-glow)",
                    border: "1px solid rgba(129,140,248,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--indigo-light)" }}>{step.num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.375rem" }}>{step.title}</div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          padding: "3.5rem 2.5rem",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* BG glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(79,70,229,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            background: "var(--indigo-glow)", border: "1px solid rgba(129,140,248,0.25)",
            borderRadius: 999, padding: "0.3rem 1rem", marginBottom: "1.5rem",
          }}>
            <Lock size={12} color="var(--indigo-light)" />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--indigo-light)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Role-Based Access
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900,
            color: "var(--text)", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "1rem",
          }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "36rem", margin: "0 auto 2rem" }}>
            Writers submit through the public form. Evaluators and administrators sign in through the secure portal.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/forms/upload" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--indigo)", color: "#fff", textDecoration: "none",
              fontWeight: 700, fontSize: "0.9rem",
              padding: "0.75rem 1.75rem", borderRadius: 10,
              boxShadow: "0 0 30px rgba(79,70,229,0.30)",
              transition: "background 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--indigo-hover)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--indigo)"; el.style.transform = "translateY(0)"; }}
            >
              <FileText size={15} /> Submit a Script
            </Link>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
              color: "var(--text-muted)", textDecoration: "none",
              fontWeight: 600, fontSize: "0.9rem",
              padding: "0.75rem 1.75rem", borderRadius: 10,
              transition: "background 0.2s, color 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--surface-hover)"; el.style.color = "var(--text)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.color = "var(--text-muted)"; el.style.transform = "translateY(0)"; }}
            >
              <Lock size={15} /> Staff Login
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            {["No account required for writers", "Evaluation is fully anonymous", "Secure role-based access"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <CheckCircle size={13} color="var(--success)" />
                <span style={{ fontSize: "0.8rem", color: "var(--text-faint)", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border-faint)",
        padding: "1.75rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "var(--indigo)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Clapperboard size={12} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>ScriptEval</span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
          Secure theatrical script evaluation platform.
        </span>
        <Link href="/directory" style={{
          fontSize: "0.8rem", color: "var(--text-faint)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "0.3rem",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-faint)"; }}
        >
          All portals <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
