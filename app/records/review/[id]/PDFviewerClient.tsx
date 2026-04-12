// app/records/review/[id]/PDFReviewerClient.tsx
'use client'

import dynamic from 'next/dynamic'

const PDFReviewer = dynamic(() => import('./PDFReviewer'), { ssr: false })

interface Props {
  scriptId: string
  pdfBase64: string | null
}

export default function PDFReviewerClient({ scriptId, pdfBase64 }: Props) {
  return <PDFReviewer scriptId={scriptId} pdfBase64={pdfBase64} />
}