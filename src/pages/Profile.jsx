import { useAuth } from '../context/AuthContext'
import InstallButton from '../components/InstallButton'
import { cardClass, btnPrimary, btnSecondary } from '../ui'

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className={cardClass}>
        <p className="text-sm text-ink-3">Logged in as</p>
        <p className="break-all font-medium">{user.email}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <InstallButton className={btnPrimary} />
          <button onClick={logout} className={btnSecondary}>
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}