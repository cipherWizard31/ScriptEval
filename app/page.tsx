"use client"

import Link from "next/link";
import LogOutFunction from "./actions/log-out";

export default function LandingPage() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative">
      <h1 className="text-5xl font-black text-slate-900 mb-2">ScriptEval</h1>
      <p className="text-slate-500 mb-12 text-center max-w-sm">
        The internal gateway for secure theatrical script management.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Public Forms Card */}
        <Link
          href="/forms/upload"
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-green-200 hover:bg-green-50/30 transition-all"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-700">
            Public Form
          </h2>
          <p className="text-sm text-slate-500">
            Register new scripts to the system for evaluation.
          </p>
        </Link>

        {/* Records Office Card */}
        <Link
          href="/records/dashboard"
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-green-200 hover:bg-green-50/30 transition-all"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-700">
            Records Office
          </h2>
          <p className="text-sm text-slate-500">
            Strip all contact information from the script and send it to the
            theater class.
          </p>
        </Link>

        {/* Login / Auth Portal Card */}
        <Link
          href="/login"
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700">
              Authentication Portal
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">Secure</span>
          </div>
          <p className="text-sm text-slate-500">
            Secure login for Evaluators, Record Office, and Theater Class Administrators.
          </p>
        </Link>

        {/* Logout / Auth Portal Card */}
        <button
          onClick={async () => LogOutFunction()}
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-slate-800 group-hover:text-red-700">
              Logout
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">Secure</span>
          </div>
          <p className="text-sm text-slate-500">
            Logout of the system.
          </p>
        </button>

        {/* Theater Class(Admin) Card */}
        <Link
          href="/admin/dashboard"
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700">
            Theater Class (Admin)
          </h2>
          <p className="text-sm text-slate-500">
            Manages the script database and the assigns scripts to the
            evaluators, and manages the entire system.
          </p>
        </Link>
        
        {/* Evaluator Card */}
        <Link
          href="/evaluator/dashboard"
          className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-all"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-700">
            Evaluator Portal
          </h2>
          <p className="text-sm text-slate-500">
            See assigned scripts, evaluate based on instructions and send them to the results.
          </p>
        </Link>
      </div>
    </main>
  );
}
