import { ClipboardClock } from 'lucide-react'
import Link from 'next/link'

const RecordsDashboardSidebar = () => {
  return (
    <div>
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href={'/'} className="text-base font-semibold text-gray-900 tracking-tight">
            ScriptEval
          </Link>
          <Link href={"/records/dashboard"} className="ml-2 text-xs text-gray-400 font-normal">
            Records Office
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="/records/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
          >
            <ClipboardClock />
            Pending Scripts
          </a>
         
        </nav>
      </aside>
    </div>
  )
}

export default RecordsDashboardSidebar