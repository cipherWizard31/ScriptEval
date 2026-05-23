// app/evaluator/evaluate/[id]/EvaluateForm.tsx
'use client'

import React, { useState, useRef } from 'react'
import { submitEvaluation } from '@/app/actions/evaluator-actions'
import EvaluatorSidebar from '@/app/components/evaluator/Sidebar'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  scriptId: string;
  scriptTitle: string;
}

export default function EvaluateForm({ scriptId, scriptTitle }: Props) {
  const router = useRouter()
  const [score, setScore] = useState<number>(70)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const scoreColor =
    score >= 80 ? 'var(--success)' :
    score >= 50 ? 'var(--warning)' :
    'var(--danger)'

  const scoreLabel =
    score >= 80 ? 'Excellent' :
    score >= 60 ? 'Good' :
    score >= 40 ? 'Fair' :
    'Poor'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim()) { toast.error('Evaluation notes are required.'); return; }

    setSubmitting(true)
    const toastId = toast.loading('Submitting evaluation…')

    try {
      const fd = new FormData()
      fd.append('scriptId', scriptId)
      fd.append('score', String(score))
      fd.append('notes', notes)
      await submitEvaluation(fd)
      toast.success('Evaluation submitted successfully.', { id: toastId })
      setTimeout(() => router.push('/evaluator/dashboard'), 1500)
    } catch (err: any) {
      toast.error(err.message || 'Submission failed.', { id: toastId })
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <EvaluatorSidebar />
      <div className="page-content">
        <div className="page-inner" style={{ maxWidth: '52rem' }}>

          {/* Back */}
          <a
            href="/evaluator/dashboard"
            style={{ fontSize: '0.875rem', color: 'var(--indigo-light)', fontWeight: 500, textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}
          >
            ← Back to Dashboard
          </a>

          <div className="page-header">
            <h1>Evaluate Script</h1>
            <p>Read the script, then score it and write your evaluation notes below.</p>
          </div>

          {/* Download */}
          <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>{scriptTitle}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>Author identity has been stripped — evaluate anonymously.</p>
            </div>
            <a
              href={`/api/download/${scriptId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              ↓ Download PDF
            </a>
          </div>

          {/* Evaluation Form */}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

              {/* Score Slider */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Overall Score
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: scoreColor, letterSpacing: '-1px', lineHeight: 1 }}>
                      {score}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: scoreColor, background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`, borderRadius: 999, padding: '0.2rem 0.6rem' }}>
                      {scoreLabel}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  style={{
                    width: '100%',
                    appearance: 'none',
                    height: 6,
                    borderRadius: 999,
                    background: `linear-gradient(to right, ${scoreColor} ${score}%, rgba(255,255,255,0.10) ${score}%)`,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>1 — Poor</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>100 — Excellent</span>
                </div>
              </div>

              {/* Criteria hint */}
              <div style={{
                background: 'var(--indigo-glow)',
                border: '1px solid rgba(129,140,248,0.18)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.875rem 1rem',
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--indigo-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Evaluation Criteria
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: 0, margin: 0 }}>
                  {['Plot structure & coherence', 'Character development', 'Dialogue quality', 'Thematic depth', 'Stage directions & formatting'].map(c => (
                    <li key={c} style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--indigo-light)', display: 'inline-block', flexShrink: 0 }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div className="field">
                <label htmlFor="notes">Evaluation Notes *</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Write a detailed evaluation of the script. Comment on its strengths, weaknesses, and overall suitability…"
                  style={{ minHeight: 160 }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.4rem' }}>
                  Be thorough — your notes will be reviewed by the Theater Class admin.
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-faint)' }}>
                <a href="/evaluator/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                  Cancel
                </a>
                <button
                  type="submit"
                  disabled={submitting || !notes.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting…' : 'Submit Evaluation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
