import { useState } from 'react'
import { Plus, Pencil, Trash2, CircleCheck, RotateCcw, MapPin } from 'lucide-react'
import { useIncidents } from '../hooks/useIncidents'
import IncidentForm from '../components/IncidentForm'
import { optimizedImage } from '../utils/uploadImage'
import {
  cardClass,
  btnPrimary,
  btnSmall,
  btnIcon,
  btnDanger,
  errorClass,
  severityStyles,
} from '../ui'

export default function Incidents() {
  const { incidents, loading, error, addIncident, updateIncident, deleteIncident } =
    useIncidents()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [actionError, setActionError] = useState('')

  async function handleCreate(data) {
    await addIncident(data)
    setShowForm(false)
  }

  async function handleUpdate(data) {
    await updateIncident(editing.id, data)
    setEditing(null)
  }

  async function handleDelete(incident) {
    if (!window.confirm(`Delete "${incident.title}"? This cannot be undone.`)) return
    try {
      setActionError('')
      await deleteIncident(incident.id)
    } catch (err) {
      console.error(err)
      setActionError('Could not delete the report. Please try again.')
    }
  }

  async function toggleStatus(incident) {
    try {
      setActionError('')
      await updateIncident(incident.id, {
        status: incident.status === 'open' ? 'resolved' : 'open',
      })
    } catch (err) {
      console.error(err)
      setActionError('Could not update the status. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Incident Reports</h2>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className={btnPrimary}>
            <Plus size={18} aria-hidden="true" /> New report
          </button>
        )}
      </div>

      {showForm && (
        <IncidentForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editing && (
        <IncidentForm
          initialData={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {(error || actionError) && (
        <p role="alert" className={errorClass}>
          {error || actionError}
        </p>
      )}

      {/* Loading: skeleton cards */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 animate-pulse rounded-2xl bg-raised" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && incidents.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-line-strong p-8 text-center">
          <p className="font-medium">No incident reports yet</p>
          <p className="mt-1 text-sm text-ink-2">Tap "New report" to log your first incident.</p>
        </div>
      )}

      {/* List of reports */}
      {!loading && incidents.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <li key={incident.id} className={`${cardClass} flex flex-col`}>
              {incident.photoUrl && (
                <img
                  src={optimizedImage(incident.photoUrl)}
                  alt={`Photo of ${incident.title}`}
                  loading="lazy"
                  className="mb-3 aspect-video w-full rounded-lg object-cover"
                />
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${severityStyles[incident.severity]}`}
                >
                  {incident.severity.toUpperCase()}
                </span>
                <span className="rounded-full border border-line bg-raised px-2 py-1 text-xs font-medium text-ink-2">
                  {incident.type}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    incident.status === 'resolved'
                      ? 'bg-ok text-on-primary'
                      : 'border border-line-strong text-ink-2'
                  }`}
                >
                  {incident.status}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold">{incident.title}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-2">{incident.description}</p>

              {incident.address && (
                <p className="mt-2 flex items-start gap-1 text-xs text-ink-3">
                  <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {incident.address}
                </p>
              )}

              <p className="mt-3 font-mono text-xs text-ink-3">
                {incident.createdAt ? incident.createdAt.toDate().toLocaleString() : 'Just now'}
              </p>

              <div className="mt-4 flex gap-2">
                <button onClick={() => toggleStatus(incident)} className={btnSmall}>
                  {incident.status === 'open' ? (
                    <>
                      <CircleCheck size={16} aria-hidden="true" /> Resolve
                    </>
                  ) : (
                    <>
                      <RotateCcw size={16} aria-hidden="true" /> Reopen
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditing(incident)
                  }}
                  aria-label={`Edit ${incident.title}`}
                  className={btnIcon}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(incident)}
                  aria-label={`Delete ${incident.title}`}
                  className={btnDanger}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}