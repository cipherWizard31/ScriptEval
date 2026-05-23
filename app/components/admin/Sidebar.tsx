'use client'

import { LayoutDashboard, Users, Trophy, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const navItems = [
  { href: '/admin/dashboard', label: 'Script Assignments', icon: LayoutDashboard },
  { href: '/admin/users',     label: 'User Management',   icon: Users },
  { href: '/admin/results',   label: 'Results',           icon: Trophy },
]

const AdminDashboardSidebar = () => {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-brand">ScriptEval</Link>
        <span className="sidebar-section-label">Admin</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link${pathname === href ? ' active' : ''}`}
          >
            <Icon className="icon" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-btn danger">
          <LogOut className="icon" />
          Log Out
        </button>
      </div>
    </aside>
  )
}

export default AdminDashboardSidebar
