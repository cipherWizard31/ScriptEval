// app/records/review/[id]/RedactionViewer.tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPluginRegistration } from '@embedpdf/core'
import { EmbedPDF } from '@embedpdf/core/react'
import { usePdfiumEngine } from '@embedpdf/engines/react'
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react'
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react'
import { DocumentContent, DocumentManagerPluginPackage } from '@embedpdf/plugin-document-manager/react'
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react'
import { SelectionLayer, SelectionPluginPackage } from '@embedpdf/plugin-selection/react'
import { InteractionManagerPluginPackage, PagePointerProvider } from '@embedpdf/plugin-interaction-manager/react'
import { RedactionLayer, RedactionPluginPackage, useRedaction } from '@embedpdf/plugin-redaction/react'
import { ExportPluginPackage, useExport } from '@embedpdf/plugin-export/react'
import { applyRedactionsAndClear } from '@/app/actions/redact-and-clear'
import toast from 'react-hot-toast'

interface Props {
  scriptId: any
  fileUrl: string
}

type Status = 'idle' | 'applying' | 'saving' | 'done' | 'error'

// ── Toolbar — must live inside <EmbedPDF> so hooks can access context ───────
function RedactionToolbar({
  documentId,
  scriptId,
  onFinalize,
}: {
  documentId: string
  scriptId: any
  onFinalize: (base64: string | null) => Promise<void>
}) {
  const { state, provides: redactionApi } = useRedaction(documentId)
  const { provides: exportApi } = useExport(documentId)
  const [status, setStatus] = useState<Status>('idle')

  const isBusy = status === 'applying' || status === 'saving' || status === 'done'
  const hasPending = (state?.pendingCount ?? 0) > 0

  async function handleApplyAndClear() {
    if (!redactionApi || !exportApi) return
    try {
      // 1. Burn all pending marks permanently into the in-memory PDF
      setStatus('applying')
      await redactionApi.commitAllPending()

      // 2. Export the redacted PDF as an ArrayBuffer
      setStatus('saving')
      const task = exportApi.saveAsCopy()
      const buffer = await task.promise

      // 3. Base64-encode and send to the server action via parent handler
      const base64 = Buffer.from(buffer).toString('base64')
      await onFinalize(base64)
    } catch (err) {
      console.error(err)
      setStatus('error')
      toast.error('Failed to export redacted PDF. Please try again.')
    }
  }

  async function handleClearWithoutRedacting() {
    setStatus('saving')
    await onFinalize(null)
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 gap-4">
      {/* Left — redaction tools + pending badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => redactionApi?.toggleRedactSelection()}
          disabled={isBusy}
          className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ✏️ Mark Text
        </button>
        <button
          onClick={() => redactionApi?.toggleMarqueeRedact()}
          disabled={isBusy}
          className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ▬ Mark Area
        </button>

        {hasPending && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-400/30">
            {state.pendingCount} pending
          </span>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        <a
          href="/records/dashboard"
          className="text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </a>

        {/* Primary: apply redactions + clear */}
        <button
          onClick={handleApplyAndClear}
          disabled={isBusy || !hasPending}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'applying'
            ? 'Applying redactions…'
            : status === 'saving'
            ? 'Saving…'
            : status === 'done'
            ? 'Done!'
            : 'Apply & Clear'}
        </button>

        {/* Secondary: skip redaction, just clear the DB record */}
        {!hasPending && (
          <button
            onClick={handleClearWithoutRedacting}
            disabled={isBusy}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear without redacting
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main exported component ─────────────────────────────────────────────────
export default function RedactionViewer({ scriptId, fileUrl }: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { engine, isLoading } = usePdfiumEngine()

  // Stable plugin list — useMemo prevents recreation on every render
  const plugins = useMemo(() => [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: fileUrl }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(SelectionPluginPackage),
    createPluginRegistration(RedactionPluginPackage, { drawBlackBoxes: true }),
    createPluginRegistration(ExportPluginPackage, {
      defaultFileName: `script-${scriptId}-redacted.pdf`,
    }),
  ], [fileUrl, scriptId])

  // Shared finalize handler — called by toolbar with base64 or null
  async function handleFinalize(base64Data: string | null) {
    setIsSaving(true)
    const toastId = toast.loading('Processing redactions…')

    const res = await applyRedactionsAndClear({
      scriptId,
      redactedPdfBase64: base64Data,
    })

    if (res.success) {
      toast.success('Identity stripped. Script moved to cleared pool.', { id: toastId })
      router.push('/records/dashboard')
    } else {
      toast.error(res.error || 'Error saving', { id: toastId })
      setIsSaving(false)
    }
  }

  // ── Loading states ──────────────────────────────────────────────────────
  if (isLoading || !engine) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-100 h-[75vh]">
        <div className="text-center space-y-2">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading PDF engine…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-gray-100 relative">
      {/* Processing overlay — shown while server action is running */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="font-semibold text-indigo-600">Processing Redactions…</p>
          </div>
        </div>
      )}

      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId && (
            <DocumentContent documentId={activeDocumentId}>
              {({ isLoaded }) =>
                isLoaded ? (
                  <div className="flex flex-col h-full">
                    {/* Toolbar */}
                    <RedactionToolbar
                      documentId={activeDocumentId}
                      scriptId={scriptId}
                      onFinalize={handleFinalize}
                    />

                    {/* PDF viewport */}
                    <Viewport
                      documentId={activeDocumentId}
                      style={{ height: '75vh', backgroundColor: '#f1f3f5' }}
                    >
                      <Scroller
                        documentId={activeDocumentId}
                        renderPage={({ width, height, pageIndex }) => (
                          <div style={{ width, height }}>
                            <PagePointerProvider
                              documentId={activeDocumentId}
                              pageIndex={pageIndex}
                            >
                              <RenderLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                              />
                              <SelectionLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                              />
                              <RedactionLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                              />
                            </PagePointerProvider>
                          </div>
                        )}
                      />
                    </Viewport>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[75vh]">
                    <div className="text-center space-y-2">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <p className="text-sm text-gray-400">Loading document…</p>
                    </div>
                  </div>
                )
              }
            </DocumentContent>
          )
        }
      </EmbedPDF>
    </div>
  )
}