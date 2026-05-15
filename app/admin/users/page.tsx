// app/admin/users/page.tsx
import AdminDashboardSidebar from "@/app/components/admin/Sidebar";
import db from "@/lib/db";
import { updateUserRole } from "@/app/actions/admin-actions";

export default async function AdminUsersPage() {
  const users = db
    .prepare("SELECT id, name, email, role, createdAt FROM user ORDER BY createdAt DESC")
    .all() as any[];

  return (
    <div className="app-shell">
      <AdminDashboardSidebar />
      <div className="page-content">
        <div className="page-inner">
          <div className="page-header">
            <h1>User Management</h1>
            <p>Control the clearance levels and responsibilities of operatives inside the portal.</p>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Operative</th>
                  <th>Registered</th>
                  <th>Clearance</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="td-primary">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, color: "var(--text)" }}>{user.name}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>{user.email}</span>
                      </div>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.role === "pending" ? (
                        <span className="badge badge-warning">
                          <span className="dot" />
                          Pending
                        </span>
                      ) : (
                        <span className="badge badge-indigo">
                          <span className="dot" style={{ background: "var(--indigo-light)" }} />
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td>
                      <form action={updateUserRole} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="hidden" name="userId" value={user.id} />
                        <div className="field" style={{ marginBottom: 0 }}>
                          <select name="role" defaultValue={user.role} style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem" }}>
                            <option value="pending">Pending</option>
                            <option value="evaluator">Evaluator</option>
                            <option value="record office">Record Office</option>
                            <option value="theater class">Theater Class</option>
                          </select>
                        </div>
                        <button type="submit" className="btn btn-ghost btn-sm">Save</button>
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
