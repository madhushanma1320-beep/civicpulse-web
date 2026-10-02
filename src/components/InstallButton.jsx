import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { getInstallPrompt, subscribe, clearInstallPrompt } from '../pwaInstall'

export default function InstallButton({ className }) {
  // Start with the event if it already fired before this button appeared
  const [installEvent, setInstallEvent] = useState(getInstallPrompt)

  // Update if the event fires (or the app gets installed) while this button is on screen
  useEffect(() => subscribe(setInstallEvent), [])

  // Only show the button when installing is actually possible
  if (!installEvent) return null

  async function handleInstall() {
    installEvent.prompt()
    await installEvent.userChoice
    clearInstallPrompt()
  }

  return (
    <button onClick={handleInstall} className={className}>
      <Download size={16} aria-hidden="true" /> Install app
    </button>
  )
}