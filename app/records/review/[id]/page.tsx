import db from "@/lib/db";
import { notFound } from "next/navigation";
import RedactionViewer from "./RedactionViewer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewPage({ params }: Props) {
  // Next.js 15 Fix: Await the params
  const { id } = await params;

  const script = db
    .prepare(
      `SELECT id, title, authorName, contactInfo, filePath
       FROM scripts
       WHERE id = ? AND status = 'PENDING_RECORDS'`
    )
    .get(id) as {
      id: number;
      title: string;
      authorName: string;
      contactInfo: string;
      filePath: string;
    } | undefined;

  if (!script) notFound();

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto py-12 px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-8">
          <div>
            <a href="/records/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              &larr; Back to Vault
            </a>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">{script.title}</h1>
            <p className="mt-1 text-sm text-gray-500 max-w-xl">
              Mark identifying text or areas, then hit <strong>Save & Clear</strong> to strip the identity.
            </p>
          </div>

          <div className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-800 mb-1">Writer Identity</p>
            <p className="text-amber-700"><span className="font-medium">Name:</span> {script.authorName}</p>
            <p className="text-amber-700"><span className="font-medium">Contact:</span> {script.contactInfo}</p>
          </div>
        </div>

        {/* Note: We pass the API URL, not the raw filePath */}
        <RedactionViewer 
          scriptId={script.id} 
          fileUrl={`/api/scripts/${script.id}`} 
        />
      </div>
    </div>
  );
}