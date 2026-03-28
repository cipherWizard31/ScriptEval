import RecordsDashboardSidebar from "@/app/components/records/Sidebar";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function RecordsDashboard() {
  const scripts = db
    .prepare(
      "SELECT * FROM scripts WHERE status = 'PENDING_RECORDS' ORDER BY createdAt DESC"
    )
    .all() as any[];

  async function clearScript(formData: FormData) {
    "use server";
    const id = formData.get("id");
    db.prepare(
      `UPDATE scripts
       SET status = 'CLEARED', authorName = NULL, contactInfo = NULL
       WHERE id = ?`
    ).run(id);
    revalidatePath("/records/dashboard");
  }

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
                <div className="overflow-hidden shadow sm:rounded-lg">
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
                              <form action={clearScript}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={script.id}
                                />
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                                >
                                  Clear &amp; Strip
                                  <span className="sr-only">
                                    , {script.title}
                                  </span>
                                </button>
                              </form>
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