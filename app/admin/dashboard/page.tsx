// app/admin/dashboard/page.tsx
import AdminDashboardSidebar from "@/app/components/admin/Sidebar";
import db from "@/lib/db";
import { assignScript } from "@/app/actions/admin-actions";

export default async function AdminDashboard() {
  const evaluators = db
    .prepare("SELECT id, name, email FROM user WHERE role = 'evaluator' AND (banned = 0 OR banned IS NULL)")
    .all() as any[];

  const unassignedScripts = db
    .prepare("SELECT id, title, createdAt FROM scripts WHERE status = 'CLEARED' ORDER BY createdAt DESC")
    .all() as any[];

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
    <div className="app-shell">
      <AdminDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Script Assignments</h1>
            <p>Distribute cleared, anonymized scripts to active evaluators.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>

            {/* Awaiting Assignment */}
            <section>
              <h2 className="section-title">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", display: "inline-block" }} />
                Awaiting Assignment
                <span className="badge badge-muted" style={{ marginLeft: "0.25rem", borderRadius: "999px" }}>
                  {unassignedScripts.length}
                </span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {unassignedScripts.length === 0 ? (
                  <div className="empty-state"><p>No scripts currently need assignment.</p></div>
                ) : (
                  unassignedScripts.map((script) => (
                    <div key={script.id} className="card" style={{ padding: "1.25rem" }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <h3 style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                          {script.title}
                        </h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Cleared {new Date(script.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <form action={assignScript} style={{ display: "flex", gap: "0.625rem" }}>
                        <input type="hidden" name="scriptId" value={script.id} />
                        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                          <select name="evaluatorId" required defaultValue="">
                            <option value="" disabled>Select an Evaluator…</option>
                            {evaluators.map(ev => (
                              <option key={ev.id} value={ev.id}>{ev.name} ({ev.email})</option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap", alignSelf: "flex-end" }}>
                          Assign
                        </button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* In Evaluation */}
            <section>
              <h2 className="section-title">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--indigo-light)", display: "inline-block" }} />
                In Evaluation
                <span className="badge badge-muted" style={{ marginLeft: "0.25rem", borderRadius: "999px" }}>
                  {assignedScripts.length}
                </span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {assignedScripts.length === 0 ? (
                  <div className="empty-state"><p>No scripts are currently assigned.</p></div>
                ) : (
                  assignedScripts.map((script) => (
                    <div key={script.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                          {script.title}
                        </h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--indigo-light)", fontWeight: 600 }}>
                          {script.evaluatorName}
                        </p>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
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
