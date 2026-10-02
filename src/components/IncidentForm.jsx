import { useState } from 'react'
import { MapPin, ImagePlus } from 'lucide-react'
import config from '../data/incidentTypes.json'
import { uploadImage } from '../utils/uploadImage'
import { getCurrentPosition, reverseGeocode } from '../utils/location'
import { cardClass, labelClass, inputClass, btnPrimary, btnSecondary, errorClass } from '../ui'

const emptyForm = {
  title: '',
  type: config.types[0],
  severity: 'medium',
  description: '',
  photoUrl: '',
  location: null,
  address: '',
}

export default function IncidentForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData })
  const [photoFile, setPhotoFile] = useState(null)
  const [preview, setPreview] = useState(initialData?.photoUrl ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.')
      return
    }
    setError('')
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleLocate() {
    setLocating(true)
    setError('')
    try {
      const coords = await getCurrentPosition()
      let address
      try {
        address = await reverseGeocode(coords.lat, coords.lng)
      } catch {
        address = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
      }
      setForm((f) => ({ ...f, location: coords, address }))
    } catch (err) {
      setError(
        err.code === 1
          ? 'Location permission was denied. You can still save the report without it.'
          : 'Could not get your location. Please try again.',
      )
    } finally {
      setLocating(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in the title and description.')
      return
    }

    setSaving(true)
    setError('')
    try {
      let photoUrl = form.photoUrl || ''
      if (photoFile) {
        photoUrl = await uploadImage(photoFile)
      }

      await onSubmit({
        title: form.title.trim(),
        type: form.type,
        severity: form.severity,
        description: form.description.trim(),
        photoUrl,
        location: form.location ?? null,
        address: form.address ?? '',
      })
    } catch (err) {
      console.error(err)
      setError('Could not save. Check your connection and try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${cardClass} space-y-4 md:p-6`}>
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            {config.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="severity" className={labelClass}>
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            value={form.severity}
            onChange={handleChange}
            className={inputClass}
          >
            {config.severities.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Photo */}
      <div>
        <label htmlFor="photo" className={`${btnSecondary} w-fit cursor-pointer text-sm`}>
          <ImagePlus size={18} aria-hidden="true" />
          {preview ? 'Change photo' : 'Add photo'}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="sr-only"
        />
        {preview && (
          <img
            src={preview}
            alt="Selected incident photo preview"
            className="mt-2 h-40 w-full rounded-lg object-cover md:w-64"
          />
        )}
      </div>

      {/* Location */}
      <div>
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className={`${btnSecondary} text-sm disabled:opacity-50`}
        >
          <MapPin size={18} aria-hidden="true" />
          {locating ? 'Getting location…' : form.location ? 'Update location' : 'Add my location'}
        </button>
        {form.address && <p className="mt-2 text-sm text-ink-2">{form.address}</p>}
      </div>

      {error && (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? 'Saving…' : 'Save report'}
        </button>
        <button type="button" onClick={onCancel} className={btnSecondary}>
          Cancel
        </button>
      </div>
    </form>
  )
}