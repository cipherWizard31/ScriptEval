// app/records/review/[id]/page.tsx
import db from "@/lib/db";
import { notFound } from "next/navigation";
import RedactionViewer from "./RedactionViewer";

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params
  const script = db
    .prepare(
      `SELECT id, title, authorName, contactInfo, internalPath
       FROM scripts
       WHERE id = ? AND status = 'PENDING_RECORDS'`
    )
    .get(id) as {
      id: string;
      title: string;
      authorName: string;
      contactInfo: string;
      internalPath: string;
    } | undefined;

  if (!script) notFound();

  // Build a browser-accessible URL — the API route reads the file from disk
  const fileUrl = `/api/scripts/${id}/file`

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto py-12 px-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-8">
          <div>
            <a
              href="/records/dashboard"
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Back to Vault
            </a>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">
              {script.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-xl">
              Review the script below for any content that could identify the
              writer. Use the <strong>Mark Text</strong> or{" "}
              <strong>Mark Area</strong> tools to flag it, then hit{" "}
              <strong>Apply Redactions</strong> to burn it out permanently
              before clearing.
            </p>
          </div>

          {/* Writer identity — only visible here in the Records Office */}
          <div className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-800 mb-1">Writer Identity</p>
            <p className="text-amber-700">
              <span className="font-medium">Name:</span> {script.authorName}
            </p>
            <p className="text-amber-700">
              <span className="font-medium">Contact:</span> {script.contactInfo}
            </p>
          </div>
        </div>

        {/* EmbedPDF Redaction Viewer */}
        <RedactionViewer scriptId={script.id} fileUrl={fileUrl} />
      </div>
    </div>
  );
}