import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, TriangleAlert, Phone, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import InstallButton from './InstallButton'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incidents', label: 'Incidents', icon: TriangleAlert },
  { to: '/contacts', label: 'Contacts', icon: Phone },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Layout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-page pb-16 text-ink md:pb-0">
      {/* Top bar: logo on all screens, links only from md (tablet) up */}
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <span className="flex items-center gap-2 text-xl font-semibold">
            <span className="h-3 w-3 rounded-full bg-primary" aria-hidden="true" />
            CivicPulse
          </span>

          <nav aria-label="Main" className="hidden gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'text-ink-2 hover:bg-raised hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

                    <div className="hidden items-center gap-2 md:flex">
            <InstallButton className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary hover:bg-primary-hover" />
            <button
              onClick={logout}
              className="rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium text-ink-2 hover:bg-raised hover:text-ink"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-6xl flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer: 1 column on phones, 3 columns from md up */}
      <footer className="border-t border-line bg-card text-ink-2">
        <div className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="font-semibold text-ink">CivicPulse</p>
            <p className="mt-1 text-sm">Report incidents and reach help fast.</p>
          </div>
          <div>
            <p className="font-semibold text-ink">Emergency numbers (Sri Lanka)</p>
            <p className="mt-1 text-sm">Police 119 · Ambulance 1990 · Fire 110</p>
          </div>
          <div>
            <p className="font-semibold text-ink">About</p>
            <p className="mt-1 text-sm">© 2026 CivicPulse · COMP50075</p>
            <p className="mt-1 text-sm">Address data © OpenStreetMap contributors</p>
          </div>
        </div>
      </footer>

      {/* Bottom nav: phones only */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 border-t border-line bg-card md:hidden"
      >
        <ul className="grid grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 border-t-2 py-2 text-xs font-medium ${
                      isActive ? 'border-primary text-ink' : 'border-transparent text-ink-3'
                    }`
                  }
                >
                  <Icon size={22} aria-hidden="true" />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}