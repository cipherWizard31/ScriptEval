// app/admin/users/page.tsx
import AdminDashboardSidebar from "@/app/components/admin/Sidebar";
import db from "@/lib/db";
import { updateUserRole } from "@/app/actions/admin-actions";

export default async function AdminUsersPage() {
  const users = db.prepare("SELECT id, name, email, role, createdAt FROM user ORDER BY createdAt DESC").all() as any[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminDashboardSidebar />
      <div className="pl-64">
        <div className="max-w-6xl mx-auto py-12 px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Access Management</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Control the clearance levels and responsibilities of Operatives inside the portal.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Operative
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Registered On
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Current Clearance
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Modify Clearance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        <span className="text-sm text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {user.role === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {user.role}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <form action={updateUserRole} className="flex gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <select 
                          name="role" 
                          defaultValue={user.role}
                          className="bg-slate-50 border border-slate-200 rounded-md text-xs font-medium px-2 py-1.5 text-slate-700 outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="evaluator">Evaluator</option>
                          <option value="record office">Record Office</option>
                          <option value="theater class">Theater Class</option>
                        </select>
                        <button 
                          type="submit"
                          className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
