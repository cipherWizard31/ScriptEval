// app/records/review/[id]/PDFReviewer.tsx
'use client'

import { useState, useEffect } from 'react'
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
}

export default function PDFReviewer({ scriptId }: Props) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [replacedFile, setReplacedFile] = useState<File | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [fetchError, setFetchError] = useState(false)

  // Fetch PDF as blob from API route — no base64 serialization issues
  useEffect(() => {
    fetch(`/api/scripts/${scriptId}/file`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then(blob => setPdfBlob(blob))
      .catch(() => setFetchError(true))
  }, [scriptId])

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
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600 tabular-nums">
            {numPages > 0 ? `${currentPage} / ${numPages}` : '—'}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={!pdfBlob}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
          <a href="/records/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
            Cancel
          </a>
          <button
            onClick={handleClear}
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Clearing…' : replacedFile ? 'Upload & Clear' : 'Clear & Strip'}
          </button>
        </div>
      </div>

      {/* Re-upload section */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Spotted identifying info in the script?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Redact it externally in any PDF editor, then upload the cleaned version before clearing.
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={e => setReplacedFile(e.target.files?.[0] ?? null)}
            />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {replacedFile ? `✓ ${replacedFile.name}` : 'Upload cleaned PDF'}
            </span>
          </label>
        </div>
        {replacedFile && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-green-50 border border-green-200 px-3 py-2">
            <p className="text-xs text-green-700 font-medium">
              Replacement ready — this file will overwrite the original when you click Upload &amp; Clear.
            </p>
            <button
              onClick={() => setReplacedFile(null)}
              className="text-xs text-green-600 hover:text-green-800 font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="rounded-lg border border-gray-200 bg-gray-100 overflow-auto flex justify-center py-6 min-h-[75vh]">
        {fetchError ? (
          <div className="flex items-center justify-center h-[75vh]">
            <p className="text-sm text-red-500">Failed to load PDF.</p>
          </div>
        ) : !pdfBlob ? (
          <div className="flex items-center justify-center h-[75vh]">
            <div className="text-center space-y-2">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-sm text-gray-400">Loading PDF…</p>
            </div>
          </div>
        ) : (
          <Document
            file={pdfBlob}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center h-[75vh]">
                <div className="text-center space-y-2">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  <p className="text-sm text-gray-400">Rendering…</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-[75vh]">
                <p className="text-sm text-red-500">Failed to render PDF.</p>
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
    </div>
  )
}