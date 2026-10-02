import { Link } from 'react-router-dom'
import { TriangleAlert, Flame, CircleCheck, Phone, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useIncidents } from '../hooks/useIncidents'
import { useUserCollection } from '../hooks/useUserCollection'
import { cardClass, btnPrimary, btnSecondary, errorClass, severityStyles } from '../ui'

export default function Dashboard() {
  const { user } = useAuth()
  const { incidents, loading, error } = useIncidents()
  const { items: contacts, loading: contactsLoading } = useUserCollection('contacts')

  const busy = loading || contactsLoading
  const openCount = incidents.filter((i) => i.status === 'open').length
  const highOpen = incidents.filter((i) => i.severity === 'high' && i.status === 'open').length
  const resolvedCount = incidents.length - openCount
  const recent = incidents.slice(0, 3)

  const stats = [
    { label: 'Open incidents', value: openCount, icon: TriangleAlert },
    { label: 'High severity open', value: highOpen, icon: Flame },
    { label: 'Resolved', value: resolvedCount, icon: CircleCheck },
    { label: 'Emergency contacts', value: contacts.length, icon: Phone },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-ink-3">Welcome back</p>
          <h2 className="break-all text-2xl font-semibold">{user.email}</h2>
        </div>
        <div className="flex gap-2">
          <Link to="/incidents" className={btnPrimary}>
            <Plus size={18} aria-hidden="true" /> Report incident
          </Link>
          <Link to="/contacts" className={btnSecondary}>
            Contacts
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}

      {/* Stats: 2 columns on phones, 4 from tablet up */}
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <li key={label} className={cardClass}>
            <Icon size={20} className="text-ink-3" aria-hidden="true" />
            {busy ? (
              <div className="mt-3 h-9 w-12 animate-pulse rounded bg-raised" />
            ) : (
              <p className="mt-3 font-mono text-3xl font-medium">{value}</p>
            )}
            <p className="mt-1 text-sm text-ink-2">{label}</p>
          </li>
        ))}
      </ul>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent incidents</h3>
          <Link to="/incidents" className="text-sm font-medium text-ink-2 underline hover:text-ink">
            View all
          </Link>
        </div>

        {busy && (
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 animate-pulse rounded-2xl bg-raised" />
            ))}
          </div>
        )}

        {!busy && recent.length === 0 && (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-line-strong p-6 text-center text-ink-2">
            No incidents reported yet.
          </div>
        )}

        {!busy && recent.length > 0 && (
          <ul className="mt-3 space-y-2">
            {recent.map((incident) => (
              <li
                key={incident.id}
                className={`${cardClass} flex items-center justify-between gap-3`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{incident.title}</p>
                  <p className="text-sm text-ink-3">
                    {incident.type} ·{' '}
                    {incident.createdAt
                      ? incident.createdAt.toDate().toLocaleDateString()
                      : 'Just now'}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${severityStyles[incident.severity]}`}
                >
                  {incident.severity.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}