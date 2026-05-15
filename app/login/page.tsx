"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message);
        checkRoleAndRedirect(data?.user?.role as string);
      } else {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "User",
        });
        if (error) throw new Error(error.message);
        toast.success("Account created. Awaiting administrator approval.");
        checkRoleAndRedirect(data?.user?.role as string);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkRoleAndRedirect = (role?: string) => {
    switch (role) {
      case "theater class":  router.push("/admin/dashboard"); break;
      case "record office":  router.push("/records/dashboard"); break;
      case "evaluator":
      default:               router.push("/evaluator/dashboard"); break;
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.14) 0%, transparent 70%), var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "2.5rem",
        backdropFilter: "blur(24px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: 900,
            color: "var(--text)",
            letterSpacing: "-0.5px",
            marginBottom: "0.375rem",
          }}>
            ScriptEval
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {isLogin ? "Welcome back to the portal." : "Request access credentials."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Name field (sign-up only) */}
          {!isLogin && (
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                required={!isLogin}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="operative@theater.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)", lineHeight: 1.6 }}>
              * New accounts remain in 'Pending' status until approved and assigned a clearance level by an Administrator.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem" }}
          >
            {isLoading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{
          marginTop: "1.75rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid var(--border-faint)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {isLogin ? "No account yet?" : "Already have access?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--indigo-light)",
                fontWeight: 700,
                fontSize: "0.875rem",
                fontFamily: "inherit",
              }}
            >
              {isLogin ? "Request Access" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
