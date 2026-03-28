// app/records/review/[id]/page.tsx
import db from "@/lib/db";
import { notFound } from "next/navigation";
import RedactionViewer from "./RedactionViewer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: Props) {
  // 1. Await params for Next.js 15
  const { id } = await params;

  // 2. Fetch using internalPath to match your reverted DB
  const script = db
    .prepare(
      `SELECT id, title, authorName, contactInfo, internalPath 
       FROM scripts 
       WHERE id = ?`
    )
    .get(id) as {
      id: string;
      title: string;
      authorName: string;
      contactInfo: string;
      internalPath: string;
    } | undefined;

  if (!script) notFound();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto py-12 px-8">

        {/* --- THE HEADER SECTION --- */}
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
            <p className="mt-1 text-sm text-gray-600 max-w-xl">
              Review the script below. Use the redaction tools to remove any 
              identifying information before clearing this script for the theater class.
            </p>
          </div>

          {/* --- THE WRITER IDENTITY BOX --- */}
          <div className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm">
            <p className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Writer Identity (Confidential)
            </p>
            <p className="text-amber-900">
              <span className="font-medium text-amber-700">Name:</span> {script.authorName}
            </p>
            <p className="text-amber-900">
              <span className="font-medium text-amber-700">Contact:</span> {script.contactInfo}
            </p>
          </div>
        </div>

        {/* --- THE PDF VIEWER --- */}
        <div className="border rounded-xl shadow-inner bg-gray-50 overflow-hidden h-[800px]">
           <RedactionViewer 
             scriptId={script.id} 
             filePath={script.internalPath} 
           />
        </div>

      </div>
    </div>
  );
}