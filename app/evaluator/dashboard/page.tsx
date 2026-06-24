// app/evaluator/dashboard/page.tsx
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import EvaluatorSidebar from '@/app/components/evaluator/Sidebar';

interface Script {
  id: string;
  title: string;
  createdAt: string;
}

export default async function EvaluatorDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const scripts = db
    .prepare("SELECT id, title, createdAt FROM scripts WHERE status = 'ASSIGNED' AND evaluatorId = ? ORDER BY createdAt DESC")
    .all(session.user.id) as Script[];

  return (
    <div className="app-shell">
      <EvaluatorSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>My Assigned Scripts</h1>
            <p>Select a script from the vault to begin your anonymous review.</p>
          </div>

          {scripts.length === 0 ? (
            <div className="empty-state">
              <p>No scripts are currently assigned to you for evaluation.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}>
              {scripts.map((script) => (
                <div key={script.id} className="card" style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1.25rem",
                }}>
                  <div>
                    <h2 style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "0.375rem",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {script.title}
                    </h2>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-faint)", fontStyle: "italic" }}>
                      Author Identity Restricted
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                      Cleared {new Date(script.createdAt).toLocaleDateString()}
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a
                        href={`/api/download/${script.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1, textAlign: "center", textDecoration: "none" }}
                      >
                        ↓ Read
                      </a>
                      <a
                        href={`/evaluator/evaluate/${script.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 2, textAlign: "center", textDecoration: "none" }}
                      >
                        Evaluate →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}