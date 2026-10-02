# CivicPulse – Incident Reporting PWA

A mobile-first Progressive Web App for reporting incidents and managing emergency contacts, built for COMP50075 Web Development.

**Live app:** https://civicpulse-web-f7bf3.web.app

## Features

- Email/password sign-up and login (Firebase Authentication)
- Incident reports with full CRUD in Cloud Firestore: create, view in real time, edit, resolve/reopen, delete
- Emergency contacts with full CRUD and one-tap calling
- Photo upload with automatic optimisation (Cloudinary)
- Geolocation tagging with address lookup (OpenStreetMap Nominatim API)
- Incident types and severity levels loaded from a local JSON config
- Dashboard with live statistics
- Responsive layout: bottom navigation on phones, top navigation on tablet and desktop
- Dark/light mode that follows the device setting
- Installable PWA with offline support (service worker and Firestore offline cache)

## Tech stack

React 19 (Vite), Tailwind CSS v4, React Router, Firebase (Authentication, Firestore, Hosting), Cloudinary, vite-plugin-pwa (Workbox), lucide-react icons.

## Running locally

1. Clone the repository and install dependencies:

```
   git clone <repo-url>
   cd incident-app
   npm install
```

2. Copy `.env.example` to `.env.local` and fill in your Firebase and Cloudinary values.
3. Start the development server:

```
   npm run dev
```

## Building and deploying

```
npm run build
firebase deploy
```

`npm run preview` serves the production build locally, which is needed to test the service worker and install prompt.

## Project structure

- `src/context/AuthContext.jsx`: authentication state shared through the Context API
- `src/hooks/useUserCollection.js`: reusable real-time Firestore CRUD hook
- `src/pages/`: Dashboard, Incidents, Contacts, Profile and login pages
- `src/components/`: layout, forms and install button
- `src/data/incidentTypes.json`: local configuration
- `firestore.rules`: security rules restricting each user to their own data

## Credits

- Design system based on my CivicPulse work for COMP50070 Interface, Design and UX
- Address data © OpenStreetMap contributors
- Icons: Lucide
- Generative AI (Claude, Anthropic) was used to help write and explain code; see the report for details