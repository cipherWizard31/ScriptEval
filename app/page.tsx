import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-5xl font-black text-slate-900 mb-2">ScriptEval</h1>
      <p className="text-slate-500 mb-12 text-center max-w-sm">
        The internal gateway for secure theatrical script management.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Evaluator Card */}
        <Link href="/evaluator/dashboard" className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-all">
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-700">Evaluator Portal</h2>
          <p className="text-sm text-slate-500">See assigned scripts and evaluate based on instructions.</p>
        </Link>

        {/* Admin Card */}
        <Link href="/admin/upload" className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all">
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700">Administration</h2>
          <p className="text-sm text-slate-500">Manages the script database and the assigns scripts to the evaluators</p>
        </Link>

        {/* Scripter Card */}
        <Link href="/scripter/upload" className="group p-8 border-2 border-slate-100 rounded-2xl hover:border-green-200 hover:bg-green-50/30 transition-all">
          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-700">Scripter</h2>
          <p className="text-sm text-slate-500">Register new scripts to the system for evaluation.</p>
        </Link>
      </div>
    </main>
  );
}