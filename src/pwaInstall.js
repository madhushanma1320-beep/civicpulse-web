// Catches the browser's install event once, as early as possible,
// so any Install button (header or Profile) can use it later.
let deferredPrompt = null
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => fn(deferredPrompt))
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  notify()
})

export function getInstallPrompt() {
  return deferredPrompt
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function clearInstallPrompt() {
  deferredPrompt = null
  notify()
}