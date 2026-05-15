'use client'

import { FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const navItems = [
  { href: '/evaluator/dashboard', label: 'My Scripts', icon: FileText },
]

const EvaluatorSidebar = () => {
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
        <span className="sidebar-section-label">Evaluator</span>
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

export default EvaluatorSidebar
