// app/records/cleared/page.tsx
import db from "@/lib/db";
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";

export default async function ClearedScripts() {
  const scripts = db
    .prepare("SELECT id, title, createdAt FROM scripts WHERE status = 'CLEARED' ORDER BY createdAt DESC")
    .all() as { id: number; title: string; createdAt: string }[];

  return (
    <div className="app-shell">
      <RecordsDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Sent to Theater Class</h1>
            <p>
              Scripts cleared and forwarded for anonymous evaluation. Identity data has been
              permanently stripped from these records.
            </p>
          </div>

          {/* Count pill */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span className="badge badge-success">
              <span className="dot" />
              {scripts.length} script{scripts.length !== 1 ? "s" : ""} cleared
            </span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Play Title</th>
                  <th>Submitted</th>
                  <th>Identity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scripts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "3rem", fontStyle: "italic", color: "var(--text-faint)" }}>
                      No scripts have been cleared yet.
                    </td>
                  </tr>
                ) : (
                  scripts.map((script, index) => (
                    <tr key={script.id}>
                      <td style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                        {index + 1}
                      </td>
                      <td className="td-primary">{script.title}</td>
                      <td>
                        {new Date(script.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td style={{ fontStyle: "italic", color: "var(--text-faint)" }}>Stripped</td>
                      <td>
                        <span className="badge badge-success">
                          <span className="dot" />
                          In Evaluation
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}