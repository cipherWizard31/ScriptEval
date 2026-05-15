// app/records/dashboard/page.tsx
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";
import db from "@/lib/db";

export default async function RecordsDashboard() {
  const scripts = db
    .prepare("SELECT * FROM scripts WHERE status = 'PENDING_RECORDS' ORDER BY createdAt DESC")
    .all() as any[];

  return (
    <div className="app-shell">
      <RecordsDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Records Office Vault</h1>
            <p>
              Incoming submissions awaiting clearance. Clearing a script strips the writer&apos;s
              identity before it moves to the evaluation phase.
            </p>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Play Title</th>
                  <th>Writer Name</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {scripts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "3rem", fontStyle: "italic", color: "var(--text-faint)" }}>
                      No pending submissions in the vault.
                    </td>
                  </tr>
                ) : (
                  scripts.map((script) => (
                    <tr key={script.id}>
                      <td className="td-primary">{script.title}</td>
                      <td>{script.authorName}</td>
                      <td>{script.contactInfo}</td>
                      <td>
                        <span className="badge badge-warning">
                          <span className="dot" />
                          Needs Clearance
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <a
                          href={`/records/review/${script.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Review PDF
                        </a>
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