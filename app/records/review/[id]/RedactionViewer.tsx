// app/records/review/[id]/RedactionViewer.tsx
'use client'

import { useState } from 'react'
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

interface Props {
  scriptId: number
  filePath: string
}

// ── Inner toolbar — lives inside <EmbedPDF> so hooks work ──────────────────
function RedactionToolbar({
  documentId,
  scriptId,
}: {
  documentId: string
  scriptId: number
}) {
  const { state, provides: redactionApi } = useRedaction(documentId)
  const { provides: exportApi } = useExport(documentId)
  const [status, setStatus] = useState<'idle' | 'applying' | 'saving' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function handleApplyAndClear() {
    if (!redactionApi || !exportApi) return

    // Step 1: burn all pending marks out of the PDF in-memory
    setStatus('applying')
    await redactionApi.commitAllPending()

    // Step 2: export the now-redacted PDF as an ArrayBuffer
    setStatus('saving')
    try {
      const task = exportApi.saveAsCopy()
      const buffer = await task.promise

      // Step 3: base64-encode and hand off to server action
      const base64 = Buffer.from(buffer).toString('base64')
      const res = await applyRedactionsAndClear({ scriptId, redactedPdfBase64: base64 })

      if (res.success) {
        setStatus('done')
        setMessage('Redactions applied. Script cleared and sent to Theater Class.')
        setTimeout(() => { window.location.href = '/records/dashboard' }, 2000)
      } else {
        setStatus('error')
        setMessage(res.error || 'Something went wrong saving the file.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('Failed to export redacted PDF. Please try again.')
    }
  }

  const isBusy = status === 'applying' || status === 'saving' || status === 'done'

  return (
    <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-4 py-2 gap-4">
      {/* Redaction tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => redactionApi?.toggleRedactSelection()}
          className="rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
        >
          ✏️ Mark Text
        </button>
        <button
          onClick={() => redactionApi?.toggleMarqueeRedact()}
          className="rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
        >
          ▬ Mark Area
        </button>

        {/* Pending count badge */}
        {state?.pendingCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-400/30">
            {state.pendingCount} pending
          </span>
        )}
      </div>

      {/* Right side — status + actions */}
      <div className="flex items-center gap-3">
        {message && (
          <p className={`text-xs font-medium ${status === 'done' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <a
          href="/records/dashboard"
          className="text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </a>
        <button
          onClick={handleApplyAndClear}
          disabled={isBusy || (state?.pendingCount === 0 && status === 'idle')}
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

        {/* Skip redaction — clear without editing */}
        {status === 'idle' && state?.pendingCount === 0 && (
          <button
            onClick={async () => {
              setStatus('saving')
              const res = await applyRedactionsAndClear({
                scriptId,
                redactedPdfBase64: null,
              })
              if (res.success) {
                setStatus('done')
                setMessage('Script cleared.')
                setTimeout(() => { window.location.href = '/records/dashboard' }, 2000)
              } else {
                setStatus('error')
                setMessage(res.error || 'Error clearing script.')
              }
            }}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear without redacting
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main viewer component ───────────────────────────────────────────────────
export default function RedactionViewer({ scriptId, filePath }: Props) {
  const { engine, isLoading } = usePdfiumEngine()

  // Build plugin list — must be stable (defined outside render or memoized)
  const plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: filePath }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(SelectionPluginPackage),
    createPluginRegistration(RedactionPluginPackage, {
      drawBlackBoxes: true,
    }),
    createPluginRegistration(ExportPluginPackage, {
      defaultFileName: `script-${scriptId}-redacted.pdf`,
    }),
  ]

  if (isLoading || !engine) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 h-[75vh]">
        <p className="text-sm text-gray-400">Loading PDF engine…</p>
      </div>
    )
  }

  return (
    <EmbedPDF engine={engine} plugins={plugins}>
      {({ activeDocumentId }) =>
        activeDocumentId && (
          <DocumentContent documentId={activeDocumentId}>
            {({ isLoaded }) =>
              isLoaded ? (
                <div className="flex flex-col rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <RedactionToolbar
                    documentId={activeDocumentId}
                    scriptId={scriptId}
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
                <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 h-[75vh]">
                  <p className="text-sm text-gray-400">Loading document…</p>
                </div>
              )
            }
          </DocumentContent>
        )
      }
    </EmbedPDF>
  )
}