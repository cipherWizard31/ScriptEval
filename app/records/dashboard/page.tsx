// app/records/dashboard/page.tsx
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";
import db from "@/lib/db";
import PendingTable from "@/app/components/records/PendingTable";

export default async function RecordsDashboard() {
  const scripts = db
    .prepare("SELECT * FROM scripts WHERE status = 'PENDING_RECORDS' ORDER BY createdAt DESC")
    .all() as any[];

  return (
    <div className="app-shell">
      <RecordsDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>Records Office Vault</h1>
            <p>
              Incoming submissions awaiting clearance. Clearing a script strips the writer&apos;s
              identity before it moves to the evaluation phase.
            </p>
          </div>

          <PendingTable scripts={scripts} />
        </div>
      </div>
    </div>
  );
}