// app/evaluator/dashboard/page.tsx
import db from '@/lib/db';

interface Script {
  id: string;
  title: string;
  authorName: string;
  uploadedAt: string;
}

export default function EvaluatorDashboard() {
  // Evaluators only need to see what's available to read
  const scripts = db.prepare('SELECT id, title, authorName, uploadedAt FROM scripts ORDER BY uploadedAt DESC').all() as Script[];

  return (
    <main className="min-h-screen bg-stone-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-stone-200 pb-6">
          <h1 className="text-2xl font-serif font-bold text-stone-800">Evaluator Portal</h1>
          <p className="text-stone-500">Select a script from the vault to begin your review.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scripts.length === 0 ? (
            <p className="text-stone-400 italic">No scripts currently assigned for evaluation.</p>
          ) : (
            scripts.map((script) => (
              <div key={script.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-stone-900 line-clamp-1">{script.title}</h2>
                  <p className="text-sm text-stone-500">by {script.authorName}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs text-stone-400">
                    Added {new Date(script.uploadedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={`/api/download/${script.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-amber-700 hover:text-amber-900 px-4 py-2 bg-amber-50 rounded-lg transition-colors"
                  >
                    Read Script
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}