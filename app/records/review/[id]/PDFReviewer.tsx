// app/records/review/[id]/PDFReviewer.tsx
'use client'

import { useState, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouter } from 'next/navigation'
import { clearScript } from '@/app/actions/clear-script'
import { replaceScriptFile } from '@/app/actions/replace-script-file'
import toast from 'react-hot-toast'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface Props {
  scriptId: string
  pdfBase64: string | null
}

export default function PDFReviewer({ scriptId, pdfBase64 }: Props) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [replacedFile, setReplacedFile] = useState<File | null>(null)

  const pdfBlob = useMemo<Blob | null>(() => {
    if (!pdfBase64) return null
    const binary = atob(pdfBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new Blob([bytes], { type: 'application/pdf' })
  }, [pdfBase64])

  function handleDownload() {
    if (!pdfBlob) return
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `script-${scriptId}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleClear() {
    setIsSaving(true)
    const toastId = toast.loading('Clearing script…')

    if (replacedFile) {
      const arrayBuffer = await replacedFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const replaceRes = await replaceScriptFile({ scriptId, fileBase64: base64 })
      if (!replaceRes.success) {
        toast.error(replaceRes.error || 'Failed to save replacement file.', { id: toastId })
        setIsSaving(false)
        return
      }
    }

    const res = await clearScript(scriptId)
    if (res.success) {
      toast.success('Identity stripped. Script moved to cleared pool.', { id: toastId })
      router.push('/records/dashboard')
    } else {
      toast.error(res.error || 'Error clearing script.', { id: toastId })
      setIsSaving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "0.625rem 1rem",
      }}>
        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="btn btn-ghost btn-sm"
          >
            ← Prev
          </button>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
            {numPages > 0 ? `${currentPage} / ${numPages}` : '—'}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="btn btn-ghost btn-sm"
          >
            Next →
          </button>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <button
            onClick={handleDownload}
            disabled={!pdfBlob}
            className="btn btn-ghost btn-sm"
          >
            ↓ Download PDF
          </button>
          <a href="/records/dashboard" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
            Cancel
          </a>
          <button
            onClick={handleClear}
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            {isSaving ? 'Clearing…' : replacedFile ? 'Upload & Clear' : 'Clear & Strip'}
          </button>
        </div>
      </div>

      {/* Re-upload zone */}
      <div style={{
        background: "var(--surface)",
        border: "1.5px dashed var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "1rem 1.25rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.2rem" }}>
              Spotted identifying info in the script?
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
              Redact externally in any PDF editor, then upload the cleaned version before clearing.
            </p>
          </div>
          <label style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={e => setReplacedFile(e.target.files?.[0] ?? null)}
            />
            <span className="btn btn-ghost btn-sm">
              {replacedFile ? `✓ ${replacedFile.name}` : 'Upload cleaned PDF'}
            </span>
          </label>
        </div>
        {replacedFile && (
          <div style={{
            marginTop: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 0.875rem",
          }}>
            <p style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 500 }}>
              Replacement ready — this file will overwrite the original when you click Upload &amp; Clear.
            </p>
            <button
              onClick={() => setReplacedFile(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--success)", fontWeight: 600, marginLeft: "1rem" }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
        minHeight: "75vh",
      }}>
        {!pdfBase64 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "75vh" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--danger)" }}>Failed to load PDF from server.</p>
          </div>
        ) : (
          <Document
            file={pdfBlob}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "75vh" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 24, height: 24,
                    border: "2px solid var(--indigo)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "pdf-spin 0.8s linear infinite",
                    margin: "0 auto 0.5rem",
                  }} />
                  <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Rendering…</p>
                </div>
              </div>
            }
            error={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "75vh" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--danger)" }}>Failed to render PDF.</p>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-lg"
            />
          </Document>
        )}
      </div>
      <style>{`@keyframes pdf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}