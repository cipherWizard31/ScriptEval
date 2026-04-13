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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        checkRoleAndRedirect(data?.user?.role as string);

      } else {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "User",
        });

        if (error) throw new Error(error.message);
        toast.success("Account created securely.");
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
      case "theater class":
        router.push("/admin/dashboard");
        break;
      case "record office":
        router.push("/records/dashboard");
        break;
      case "evaluator":
      default:
        router.push("/evaluator/dashboard");
        break;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            ScriptEval
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {isLogin ? "Welcome back to the portal." : "Request access credentials."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ident Code (Email)
              </label>
              <input
                type="email"
                required
                placeholder="operative@theater.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Passkey
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Clearances are now assigned manually by Theater Class Administrators */}
                <p className="text-xs text-slate-500 italic mt-2">
                  * New accounts will remain in 'Pending' status until approved and assigned a clearance level by an Administrator.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-slate-900 text-white px-4 py-3.5 font-semibold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center justify-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? "Authenticate" : "Register Credentials"}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            {isLogin ? "No clearance yet?" : "Already cleared?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4 transition-all focus:outline-none"
            >
              {isLogin ? "Request Access" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
