// app/records/dashboard/page.tsx
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";
import db from "@/lib/db";

export default async function RecordsDashboard() {
  const scripts = db
    .prepare(
      "SELECT * FROM scripts WHERE status = 'PENDING_RECORDS' ORDER BY createdAt DESC"
    )
    .all() as any[];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <RecordsDashboardSidebar />
      {/* Main content — offset for sidebar */}
      <div className="pl-64">
        <div className="max-w-5xl mx-auto py-12 px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Records Office Vault
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Incoming submissions awaiting clearance. Clearing a script strips
              the writer&apos;s identity before it moves to the evaluation phase.
            </p>
          </div>

          {/* Table */}
          <div className="flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Play Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Writer Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Contact Info
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {scripts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-sm text-gray-400 italic"
                          >
                            No pending submissions in the vault.
                          </td>
                        </tr>
                      ) : (
                        scripts.map((script) => (
                          <tr
                            key={script.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                              {script.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                              {script.authorName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                              {script.contactInfo}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                                Needs Clearance
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                              <a
                                href={`/records/review/${script.id}`}
                                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                  />
                                </svg>
                                Review PDF
                                <span className="sr-only">, {script.title}</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}