import { useState } from 'react'
import { Plus, Pencil, Trash2, Phone } from 'lucide-react'
import { useUserCollection } from '../hooks/useUserCollection'
import ContactForm from '../components/ContactForm'
import { cardClass, btnPrimary, btnIcon, btnDanger, errorClass } from '../ui'

export default function Contacts() {
  const { items: contacts, loading, error, addItem, updateItem, deleteItem } =
    useUserCollection('contacts')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [actionError, setActionError] = useState('')

  async function handleCreate(data) {
    await addItem(data)
    setShowForm(false)
  }

  async function handleUpdate(data) {
    await updateItem(editing.id, data)
    setEditing(null)
  }

  async function handleDelete(contact) {
    if (!window.confirm(`Delete ${contact.name} from your contacts?`)) return
    try {
      setActionError('')
      await deleteItem(contact.id)
    } catch (err) {
      console.error(err)
      setActionError('Could not delete the contact. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Emergency Contacts</h2>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className={btnPrimary}>
            <Plus size={18} aria-hidden="true" /> Add contact
          </button>
        )}
      </div>

      {showForm && <ContactForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {editing && (
        <ContactForm
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

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-2xl bg-raised" />
          ))}
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-line-strong p-8 text-center">
          <p className="font-medium">No emergency contacts yet</p>
          <p className="mt-1 text-sm text-ink-2">
            Add the people you'd want to reach first in an emergency.
          </p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <li key={contact.id} className={cardClass}>
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              {contact.relationship && (
                <p className="text-sm text-ink-3">{contact.relationship}</p>
              )}
              <p className="mt-2 font-mono text-ink-2">{contact.phone}</p>

              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-ok px-3 py-1 text-sm font-semibold text-on-primary hover:opacity-90"
                >
                  <Phone size={16} aria-hidden="true" /> Call
                </a>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditing(contact)
                  }}
                  aria-label={`Edit ${contact.name}`}
                  className={btnIcon}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(contact)}
                  aria-label={`Delete ${contact.name}`}
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