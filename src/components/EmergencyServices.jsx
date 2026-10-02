import { Phone } from 'lucide-react'
import services from '../data/emergencyServices.json'
import { cardClass } from '../ui'

// Built-in emergency numbers from local JSON: shown to every user, even offline
export default function EmergencyServices({ compact = false }) {
  // Small quick-call buttons for the Dashboard
  if (compact) {
    return (
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {services.map((s) => (
          <li key={s.number}>
            <a
              href={`tel:${s.number}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-line bg-card px-3 py-2 hover:bg-raised"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{s.short}</span>
                <span className="font-mono text-lg">{s.number}</span>
              </span>
              <Phone size={18} className="shrink-0 text-ink-3" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    )
  }

  // Full cards for the Contacts page
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <li key={s.number} className={`${cardClass} flex flex-col`}>
          <span className="w-fit rounded-full border border-line bg-raised px-2 py-0.5 text-xs font-medium text-ink-2">
            Emergency service
          </span>
          <h4 className="mt-2 font-semibold">{s.name}</h4>
          <p className="mt-1 flex-1 text-sm text-ink-2">{s.description}</p>
          <a
            href={`tel:${s.number}`}
            className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary hover:bg-primary-hover"
          >
            <Phone size={16} aria-hidden="true" /> Call {s.number}
          </a>
        </li>
      ))}
    </ul>
  )
}