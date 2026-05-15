// app/records/review/[id]/page.tsx
import db from "@/lib/db";
import { readFile } from "fs/promises";
import { notFound } from "next/navigation";
import PDFReviewerClient from "./PDFviewerClient";
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";

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

  let pdfBase64: string | null = null;
  try {
    const buffer = await readFile(script.internalPath);
    pdfBase64 = buffer.toString('base64');
  } catch {
    // pdfBase64 stays null; the client component will show an error state
  }

  return (
    <div className="app-shell">
      <RecordsDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", marginBottom: "1.75rem" }}>
            <div>
              <a
                href="/records/dashboard"
                style={{ fontSize: "0.875rem", color: "var(--indigo-light)", fontWeight: 500, textDecoration: "none" }}
              >
                ← Back to Vault
              </a>
              <h1 style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>
                {script.title}
              </h1>
              <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "42rem" }}>
                Review the script for any content that could identify the writer. Download, redact
                externally if needed, re-upload the clean version, then hit Clear &amp; Strip.
              </p>
            </div>

            {/* Writer identity panel */}
            <div style={{
              flexShrink: 0,
              background: "var(--warning-bg)",
              border: "1px solid var(--warning-border)",
              borderRadius: "var(--radius-sm)",
              padding: "0.875rem 1.125rem",
              fontSize: "0.875rem",
              minWidth: "200px",
            }}>
              <p style={{ fontWeight: 700, color: "var(--warning)", marginBottom: "0.5rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Writer Identity
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>Name:</span> {script.authorName}
              </p>
              <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>Contact:</span> {script.contactInfo}
              </p>
            </div>
          </div>

          <PDFReviewerClient scriptId={script.id} pdfBase64={pdfBase64} />
        </div>
      </div>
    </div>
  );
}