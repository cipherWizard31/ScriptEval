'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { deleteScript } from '@/app/actions/delete-script'

interface Script {
  id: string
  title: string
  authorName: string
  contactInfo: string
}

interface Props {
  scripts: Script[]
}

function DeleteConfirmModal({
  script,
  onConfirm,
  onCancel,
  isPending,
}: {
  script: Script
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#14141c',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '2rem',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--danger-bg)',
          border: '1px solid var(--danger-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          <AlertTriangle size={22} color='var(--danger)' />
        </div>

        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Delete this submission?
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '0.5rem' }}>
          You are about to permanently delete{' '}
          <strong style={{ color: 'var(--text)' }}>&ldquo;{script.title}&rdquo;</strong>{' '}
          by <strong style={{ color: 'var(--text)' }}>{script.authorName}</strong>.
        </p>
        <p style={{
          fontSize: '0.8rem', color: 'var(--danger)',
          background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
          borderRadius: 8, padding: '0.6rem 0.8rem',
          marginBottom: '1.75rem', lineHeight: 1.55,
        }}>
          The script file will be erased from the vault and cannot be recovered.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={isPending}
            style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-muted)', borderRadius: 'var(--radius-btn)',
              padding: '0.55rem 1.25rem', fontFamily: 'inherit',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            <X size={14} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            style={{
              background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
              color: 'var(--danger)', borderRadius: 'var(--radius-btn)',
              padding: '0.55rem 1.25rem', fontFamily: 'inherit',
              fontSize: '0.875rem', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              opacity: isPending ? 0.6 : 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-bg)'; }}
          >
            <Trash2 size={14} />
            {isPending ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PendingTable({ scripts }: Props) {
  const [pendingDelete, setPendingDelete] = useState<Script | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!pendingDelete) return
    startTransition(async () => {
      await deleteScript(pendingDelete.id)
      setPendingDelete(null)
    })
  }

  return (
    <>
      {pendingDelete && (
        <DeleteConfirmModal
          script={pendingDelete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
          isPending={isPending}
        />
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Play Title</th>
              <th>Writer Name</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scripts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', fontStyle: 'italic', color: 'var(--text-faint)' }}>
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
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/records/review/${script.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Review PDF
                      </Link>
                      <button
                        onClick={() => setPendingDelete(script)}
                        title="Delete submission"
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 30, height: 30,
                          background: 'var(--danger-bg)',
                          border: '1px solid var(--danger-border)',
                          borderRadius: 8,
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.18)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-bg)'; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
