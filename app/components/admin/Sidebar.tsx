'use client'

import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Script Assignments',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
  },
]

const AdminDashboardSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); 
        },
      },
    });
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
      <div className="px-6 py-5 flex items-baseline border-b border-slate-800">
        <Link href="/" className="text-base font-bold text-white tracking-tight hover:text-blue-400 transition-colors">
          ScriptEval
        </Link>
        <span className="ml-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
          Admin
        </span>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-blue-200' : 'text-slate-500'
                }`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1 bg-slate-950/50">
        <button
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-500" />
          System Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default AdminDashboardSidebar
