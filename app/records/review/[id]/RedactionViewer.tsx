// app/records/review/[id]/RedactionViewer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPluginRegistration } from '@embedpdf/core'
import { EmbedPDF } from '@embedpdf/core/react'
import { usePdfiumEngine } from '@embedpdf/engines/react'
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react'
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react'
import {
  DocumentContent,
  DocumentManagerPluginPackage,
  useDocumentManagerCapability,
} from '@embedpdf/plugin-document-manager/react'
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react'
import { SelectionLayer, SelectionPluginPackage } from '@embedpdf/plugin-selection/react'
import { InteractionManagerPluginPackage, PagePointerProvider } from '@embedpdf/plugin-interaction-manager/react'
import { RedactionLayer, RedactionPluginPackage, useRedaction } from '@embedpdf/plugin-redaction/react'
import { ExportPluginPackage, useExport } from '@embedpdf/plugin-export/react'
import { applyRedactionsAndClear } from '@/app/actions/redact-and-clear'
import toast from 'react-hot-toast'

interface Props {
  scriptId: string
  fileBase64: string
}

type Status = 'idle' | 'applying' | 'saving' | 'done' | 'error'

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// Stable plugin list — no documents, we open them manually after engine is ready
const PLUGINS = [
  createPluginRegistration(DocumentManagerPluginPackage),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(InteractionManagerPluginPackage),
  createPluginRegistration(SelectionPluginPackage),
  createPluginRegistration(RedactionPluginPackage, { drawBlackBoxes: true }),
  createPluginRegistration(ExportPluginPackage, { defaultFileName: 'redacted.pdf' }),
]

// ── Toolbar ──────────────────────────────────────────────────────────────────
function RedactionToolbar({
  documentId,
  scriptId,
  onFinalize,
}: {
  documentId: string
  scriptId: string
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
      setStatus('applying')
      await redactionApi.commitAllPending()
      setStatus('saving')
      const task = exportApi.saveAsCopy()
      const buffer = await task.promise
      const base64 = Buffer.from(buffer).toString('base64')
      await onFinalize(base64)
    } catch (err) {
      console.error(err)
      setStatus('error')
      toast.error('Failed to export redacted PDF. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 gap-4">
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
      <div className="flex items-center gap-3">
        <a href="/records/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
          Cancel
        </a>
        <button
          onClick={handleApplyAndClear}
          disabled={isBusy || !hasPending}
          className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'applying' ? 'Applying…' : status === 'saving' ? 'Saving…' : status === 'done' ? 'Done!' : 'Apply & Clear'}
        </button>
        {!hasPending && status === 'idle' && (
          <button
            onClick={() => onFinalize(null)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear without redacting
          </button>
        )}
      </div>
    </div>
  )
}

// ── Document opener — runs inside EmbedPDF context ───────────────────────────
function DocumentOpener({
  fileBytes,
  scriptId,
  onFinalize,
  isSaving,
}: {
  fileBytes: Uint8Array
  scriptId: string
  onFinalize: (base64: string | null) => Promise<void>
  isSaving: boolean
}) {
  const { provides: docManager } = useDocumentManagerCapability()
  const [documentId, setDocumentId] = useState<string | null>(null)
  const opened = useRef(false)

  useEffect(() => {
    if (!docManager || opened.current) return
    opened.current = true

    const task = docManager.openDocumentBuffer({
      id: scriptId,
      content: fileBytes,
    })

    task.promise
      .then((doc: any) => setDocumentId(doc.id ?? scriptId))
      .catch((err: any) => {
        console.error('Failed to open document buffer:', err)
        toast.error('Failed to open PDF document.')
      })
  }, [docManager, fileBytes, scriptId])

  if (!documentId) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <div className="text-center space-y-2">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400">Opening document…</p>
        </div>
      </div>
    )
  }

  return (
    <DocumentContent documentId={documentId}>
      {({ isLoaded }) =>
        isLoaded ? (
          <div className="flex flex-col relative">
            {isSaving && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  <p className="font-semibold text-indigo-600">Processing Redactions…</p>
                </div>
              </div>
            )}
            <RedactionToolbar
              documentId={documentId}
              scriptId={scriptId}
              onFinalize={onFinalize}
            />
            <Viewport documentId={documentId} style={{ height: '75vh', backgroundColor: '#f1f3f5' }}>
              <Scroller
                documentId={documentId}
                renderPage={({ width, height, pageIndex }) => (
                  <div style={{ width, height }}>
                    <PagePointerProvider documentId={documentId} pageIndex={pageIndex}>
                      <RenderLayer documentId={documentId} pageIndex={pageIndex} />
                      <SelectionLayer documentId={documentId} pageIndex={pageIndex} />
                      <RedactionLayer documentId={documentId} pageIndex={pageIndex} />
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
              <p className="text-sm text-gray-400">Rendering pages…</p>
            </div>
          </div>
        )
      }
    </DocumentContent>
  )
}

// ── Main exported component ──────────────────────────────────────────────────
export default function RedactionViewer({ scriptId, fileBase64 }: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { engine, isLoading } = usePdfiumEngine()

  // Convert once — ref so it never triggers re-renders
  const fileBytesRef = useRef<Uint8Array | null>(null)
  if (!fileBytesRef.current) {
    fileBytesRef.current = base64ToUint8Array(fileBase64)
  }

  async function handleFinalize(base64Data: string | null) {
    setIsSaving(true)
    const toastId = toast.loading('Processing redactions…')
    const res = await applyRedactionsAndClear({ scriptId, redactedPdfBase64: base64Data })
    if (res.success) {
      toast.success('Identity stripped. Script moved to cleared pool.', { id: toastId })
      router.push('/records/dashboard')
    } else {
      toast.error(res.error || 'Error saving', { id: toastId })
      setIsSaving(false)
    }
  }

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
    <div className="border rounded-xl overflow-hidden bg-gray-100">
      <EmbedPDF engine={engine} plugins={PLUGINS}>
        {() => (
          <DocumentOpener
            fileBytes={fileBytesRef.current!}
            scriptId={scriptId}
            onFinalize={handleFinalize}
            isSaving={isSaving}
          />
        )}
      </EmbedPDF>
    </div>
  )
}