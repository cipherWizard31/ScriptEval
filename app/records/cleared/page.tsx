// app/records/cleared/page.tsx
import db from "@/lib/db";
import RecordsDashboard from "../dashboard/page";
import RecordsDashboardSidebar from "@/app/components/records/Sidebar";

export default async function ClearedScripts() {
  const scripts = db
    .prepare(
      "SELECT id, title, createdAt FROM scripts WHERE status = 'CLEARED' ORDER BY createdAt DESC"
    )
    .all() as { id: number; title: string; createdAt: string }[];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <RecordsDashboardSidebar />

      {/* Main content */}
      <div className="pl-64">
        <div className="max-w-5xl mx-auto py-12 px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sent to Theater Class
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Scripts that have been cleared and forwarded for anonymous
              evaluation. Identity data has been permanently stripped from these
              records.
            </p>
          </div>

          {/* Stats pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 ring-1 ring-inset ring-green-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">
              {scripts.length} script{scripts.length !== 1 ? "s" : ""} cleared
            </span>
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
                          #
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Play Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Submitted
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Identity
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Status
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
                            No scripts have been cleared yet.
                          </td>
                        </tr>
                      ) : (
                        scripts.map((script, index) => (
                          <tr
                            key={script.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-gray-400 tabular-nums">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                              {script.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(script.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 italic">
                              Stripped
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                <span className="h-1 w-1 rounded-full bg-green-500" />
                                In Evaluation
              	              </span>
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