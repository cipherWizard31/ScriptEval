// app/records/dashboard/page.tsx
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default function RecordsDashboard() {
  // Fetch only scripts waiting for Records Office clearance
  const scripts = db.prepare("SELECT * FROM scripts WHERE status = 'PENDING_RECORDS' ORDER BY createdAt DESC").all() as any[];

  async function clearScript(formData: FormData) {
    'use server'
    const id = formData.get('id');
    db.prepare("UPDATE scripts SET status = 'CLEARED' WHERE id = ?").run(id);
    revalidatePath('/records/dashboard');
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Records Office Vault</h1>
            <p className="mt-2 text-sm text-gray-600">
              A list of all incoming submissions. Clearing a script removes the writer's identity for the evaluation phase.
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Play Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Writer Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contact Info
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {scripts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-sm text-gray-500 italic">
                          No pending submissions found in the vault.
                        </td>
                      </tr>
                    ) : (
                      scripts.map((script) => (
                        <tr key={script.id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
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
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <form action={clearScript}>
                              <input type="hidden" name="id" value={script.id} />
                              <button
                                type="submit"
                                className="text-indigo-600 hover:text-indigo-900 font-bold"
                              >
                                Clear & Strip<span className="sr-only">, {script.title}</span>
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
  );
}