import { useState } from 'react'
import { cardClass, labelClass, inputClass, btnPrimary, btnSecondary, errorClass } from '../ui'

const emptyForm = { name: '', relationship: '', phone: '' }

export default function ContactForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please enter a name and phone number.')
      return
    }

    // Allow digits, spaces, dashes and a leading +, with 7 to 15 digits in total
    const digits = form.phone.replace(/\D/g, '')
    if (!/^\+?[\d\s-]+$/.test(form.phone.trim()) || digits.length < 7 || digits.length > 15) {
      setError('Please enter a valid phone number.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSubmit({
        name: form.name.trim(),
        relationship: (form.relationship ?? '').trim(),
        phone: form.phone.trim(),
      })
    } catch (err) {
      console.error(err)
      setError('Could not save. Check your connection and try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${cardClass} space-y-4 md:p-6`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="relationship" className={labelClass}>
            Relationship
          </label>
          <input
            id="relationship"
            name="relationship"
            placeholder="e.g. Mother, Friend, Doctor"
            value={form.relationship}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+94 77 123 4567"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? 'Saving…' : 'Save contact'}
        </button>
        <button type="button" onClick={onCancel} className={btnSecondary}>
          Cancel
        </button>
      </div>
    </form>
  )
}