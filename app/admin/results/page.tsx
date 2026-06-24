// app/admin/results/page.tsx
import AdminDashboardSidebar from "@/app/components/admin/Sidebar";
import db from "@/lib/db";

interface EvaluatedScript {
  id: string;
  title: string;
  evaluationScore: number;
  evaluationNotes: string;
  evaluatedAt: string;
  evaluatorName: string;
}

export default async function AdminResultsPage() {
  const results = db
    .prepare(
      `SELECT s.id, s.title, s.evaluationScore, s.evaluationNotes, s.evaluatedAt,
              u.name as evaluatorName
       FROM scripts s
       JOIN user u ON s.evaluatorId = u.id
       WHERE s.status = 'EVALUATED'
       ORDER BY s.evaluatedAt DESC`
    )
    .all() as EvaluatedScript[];

  return (
    <div className="app-shell">
      <AdminDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Evaluation Results</h1>
            <p>Scripts that have been scored and reviewed by evaluators. Use the Announce button to publish results.</p>
          </div>

          {/* Count pill */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-indigo">
              <span className="dot" style={{ background: 'var(--indigo-light)' }} />
              {results.length} evaluated script{results.length !== 1 ? 's' : ''}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <p>No scripts have been evaluated yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map((script) => {
                const score = script.evaluationScore;
                const scoreColor =
                  score >= 80 ? 'var(--success)' :
                  score >= 50 ? 'var(--warning)' :
                  'var(--danger)';
                const scoreLabel =
                  score >= 80 ? 'Excellent' :
                  score >= 60 ? 'Good' :
                  score >= 40 ? 'Fair' : 'Poor';

                return (
                  <div key={script.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

                    {/* Score badge */}
                    <div style={{
                      flexShrink: 0,
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-sm)',
                      background: `${scoreColor}12`,
                      border: `1px solid ${scoreColor}30`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 900, color: scoreColor, lineHeight: 1, letterSpacing: '-1px' }}>
                        {score}
                      </span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: scoreColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {scoreLabel}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem', marginBottom: '0.2rem' }}>
                            {script.title}
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                            Evaluated by{' '}
                            <span style={{ color: 'var(--indigo-light)', fontWeight: 600 }}>{script.evaluatorName}</span>
                            {' · '}
                            {new Date(script.evaluatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>

                        {/* Announce button — placeholder */}
                        <button
                          disabled
                          title="Announce feature coming soon"
                          style={{
                            flexShrink: 0,
                            padding: '0.4rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            borderRadius: 'var(--radius-btn)',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            color: 'rgba(255,255,255,0.30)',
                            cursor: 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                          }}
                        >
                          <span style={{ fontSize: '0.75rem' }}>📣</span>
                          Announce
                        </button>
                      </div>

                      {/* Notes */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-faint)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem 1rem',
                        marginTop: '0.5rem',
                      }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
                          Evaluator Notes
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                          {script.evaluationNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
