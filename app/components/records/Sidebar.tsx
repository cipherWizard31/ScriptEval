import Link from 'next/link'
import React from 'react'

const RecordsDashboardSidebar = () => {
  return (
    <div>
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <Link href={'/'} className="text-base font-semibold text-gray-900 tracking-tight">
            ScriptEval
          </Link>
          <Link href={"#"} className="ml-2 text-xs text-gray-400 font-normal">
            Records Office
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="/records/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
            Vault — Pending
          </a>
          <a
            href="/theater/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6m9-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Theater Class
          </a>
        </nav>
      </aside>
    </div>
  )
}

export default RecordsDashboardSidebar