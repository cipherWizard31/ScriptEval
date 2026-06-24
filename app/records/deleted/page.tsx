// app/records/deleted/page.tsx
import db from "@/lib/db";
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";

export default async function DeletedScripts() {
  const scripts = db
    .prepare(
      `SELECT id, title, authorName, email, phone, deletedAt, createdAt
       FROM scripts
       WHERE status = 'DELETED'
       ORDER BY deletedAt DESC`
    )
    .all() as {
      id: string
      title: string
      authorName: string
      email: string
      phone: string
      deletedAt: string
      createdAt: string
    }[]

  return (
    <div className="app-shell">
      <RecordsDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Deleted Submissions</h1>
            <p>
              Scripts rejected and permanently removed from the vault. The original files
              have been erased; only the submission record remains.
            </p>
          </div>

          {/* Count pill */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span className="badge badge-muted">
              <span className="dot" style={{ background: "var(--text-faint)" }} />
              {scripts.length} deleted submission{scripts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Play Title</th>
                  <th>Writer Name</th>
                  <th>Contact</th>
                  <th>Submitted</th>
                  <th>Deleted On</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                {scripts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        fontStyle: "italic",
                        color: "var(--text-faint)",
                      }}
                    >
                      No submissions have been deleted.
                    </td>
                  </tr>
                ) : (
                  scripts.map((script, index) => (
                    <tr key={script.id}>
                      <td style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                        {index + 1}
                      </td>
                      <td className="td-primary">{script.title}</td>
                      <td>{script.authorName ?? <em style={{ color: "var(--text-faint)" }}>—</em>}</td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        {[script.email, script.phone].filter(Boolean).join(" · ") || (
                          <em style={{ color: "var(--text-faint)" }}>—</em>
                        )}
                      </td>
                      <td>
                        {new Date(script.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td style={{ color: "var(--danger)", fontSize: "0.8125rem" }}>
                        {script.deletedAt
                          ? new Date(script.deletedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                            color: "var(--text-faint)",
                          }}
                        >
                          Erased
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
  )
}
