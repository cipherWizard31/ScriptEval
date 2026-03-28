'use client'

import { CircleCheckBig, ClipboardClock, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/records/dashboard',
    label: 'Pending Scripts',
    icon: ClipboardClock,
  },
  {
    href: '/records/cleared',
    label: 'Cleared Scripts',
    icon: CircleCheckBig,
  },
]

const RecordsDashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/" className="text-base font-semibold text-gray-900 tracking-tight">
          ScriptEval
        </Link>
        <Link href="/records/dashboard" className="ml-2 text-xs text-gray-400 font-normal">
          Records Office
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-gray-700' : 'text-gray-400'
                }`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        <button
          onClick={() => {}}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0 text-gray-400" />
          Settings
        </button>
        <button
          onClick={() => {}}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" />
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default RecordsDashboardSidebar