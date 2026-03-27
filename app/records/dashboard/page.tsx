// app/records/dashboard/page.tsx
import db from '@/lib/db';
import { stripAndSend } from '@/app/actions/records-actions';

export default function RecordsDashboard() {
  const scripts = db.prepare("SELECT * FROM scripts WHERE status = 'PENDING_RECORDS'").all() as any[];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Records Office: Intake Queue</h1>
      <table className="w-full border text-black">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 border">Author & Contact</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {scripts.map(s => (
            <tr key={s.id}>
              <td className="p-2 border">
                <strong>{s.authorName}</strong><br/>
                <span className="text-xs text-slate-500">{s.contactInfo}</span>
              </td>
              <td className="p-2 border">{s.title}</td>
              <td className="p-2 border text-right">
                <form action={stripAndSend}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Strip Info & Send to Admin
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}