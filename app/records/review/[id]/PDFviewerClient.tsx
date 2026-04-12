// app/records/review/[id]/PDFReviewerClient.tsx
'use client'

import dynamic from 'next/dynamic'

const PDFReviewer = dynamic(() => import('./PDFReviewer'), { ssr: false })

export default function PDFReviewerClient({ scriptId }: { scriptId: string }) {
  return <PDFReviewer scriptId={scriptId} />
}