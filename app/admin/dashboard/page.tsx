// app/admin/dashboard/page.tsx
import AdminDashboardSidebar from "@/app/components/admin/Sidebar";
import db from "@/lib/db";
import { assignScript } from "@/app/actions/admin-actions";

export default async function AdminDashboard() {
  // Fetch available evaluators
  const evaluators = db.prepare("SELECT id, name, email FROM user WHERE role = 'evaluator' AND (banned = 0 OR banned IS NULL)").all() as any[];

  // Fetch cleared scripts needing assignment
  const unassignedScripts = db
    .prepare(
      "SELECT id, title, createdAt FROM scripts WHERE status = 'CLEARED' ORDER BY createdAt DESC"
    )
    .all() as any[];

  // Fetch already assigned scripts
  // Note: For now, we just join with user table to get evaluator name
  const assignedScripts = db
    .prepare(
      `SELECT s.id, s.title, s.createdAt, u.name as evaluatorName 
       FROM scripts s 
       JOIN user u ON s.evaluatorId = u.id 
       WHERE s.status = 'ASSIGNED' 
       ORDER BY s.createdAt DESC`
    )
    .all() as any[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminDashboardSidebar />
      <div className="pl-64">
        <div className="max-w-6xl mx-auto py-12 px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Script Assignments</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Distribute cleared, anonymized scripts to active evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Needs Assignment Column */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
                Awaiting Assignment
                <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  {unassignedScripts.length}
                </span>
              </h2>
              
              <div className="space-y-4">
                {unassignedScripts.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                    <p className="text-sm text-slate-400 font-medium">No scripts currently need assignment.</p>
                  </div>
                ) : (
                  unassignedScripts.map((script) => (
                    <div key={script.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg mb-1">{script.title}</h3>
                          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Cleared on {new Date(script.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <form action={assignScript} className="flex gap-3">
                        <input type="hidden" name="scriptId" value={script.id} />
                        <select 
                          name="evaluatorId" 
                          required
                          defaultValue=""
                          className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select an Evaluator...</option>
                          {evaluators.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name} ({ev.email})</option>
                          ))}
                        </select>
                        <button 
                          type="submit"
                          className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          Assign
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Assigned Column */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
                In Evaluation
                <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                  {assignedScripts.length}
                </span>
              </h2>

              <div className="space-y-4">
                {assignedScripts.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                    <p className="text-sm text-slate-400 font-medium">No scripts are currently assigned.</p>
                  </div>
                ) : (
                  assignedScripts.map((script) => (
                    <div key={script.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center group">
                      <div>
                        <h3 className="font-bold text-slate-900">{script.title}</h3>
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          Evaluator: {script.evaluatorName}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(script.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
