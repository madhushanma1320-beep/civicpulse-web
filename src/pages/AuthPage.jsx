import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { labelClass, inputClass, btnPrimary, errorClass } from '../ui'

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'No internet connection. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function AuthPage() {
  const { login, signup } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || password.length < 6) {
      setError('Enter your email and a password of at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
    } catch (err) {
      console.error(err)
      setError(friendlyError(err.code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4 text-ink">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 shadow-md">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <img
            src="/pwa-64x64.png"
            alt=""
            width="40"
            height="40"
            className="h-10 w-10 rounded-full"
          />
          CivicPulse
        </h1>        
        <p className="mt-1 text-sm text-ink-2">
          {isSignup ? 'Create your account' : 'Log in to your account'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className={errorClass}>
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className={`${btnPrimary} w-full`}>
            {submitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup)
            setError('')
          }}
          className="mt-4 w-full text-sm text-ink-2 underline-offset-2 hover:text-ink hover:underline"
        >
          {isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
        </button>
      </div>
    </main>
  )
}