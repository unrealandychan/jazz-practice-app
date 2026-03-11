# Jazz Practice

> A focused, dark-themed practice companion for jazz musicians — built with Next.js 16, Firebase, and Tone.js.

Jazz Practice helps you log sessions, explore scales and standards, keep time with a drift-free metronome, and visualise your progress over time. It works across guitar, saxophone, piano, and any other instrument you play.

---

## Features

| Feature | Description |
|---|---|
| **Session Logger** | Start a built-in timer or log manually. Track instrument, topic, BPM, and notes. |
| **Scale & Mode Reference** | 12 essential jazz scales (Dorian, Bebop, Altered, Whole Tone, …) with keyboard diagrams. |
| **Standards Library** | 30+ jazz standards with chord progressions, feel, tempo range, and difficulty. |
| **Metronome** | Tone.js audio engine — no drift. Tap tempo, swing feel, any time signature. |
| **Progress Charts** | 30-day practice chart, daily streak counter, and breakdown by instrument and topic. |
| **Auth + Sync** | Google Sign-In via Firebase Auth. Data syncs across all your devices automatically. |

---

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **UI** — [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives + [Lucide](https://lucide.dev/) icons
- **Backend / DB** — [Firebase](https://firebase.google.com/) (Firestore + Auth)
- **Audio** — [Tone.js](https://tonejs.github.io/) (Web Audio, no scheduler drift)
- **Charts** — [Recharts](https://recharts.org/)
- **State** — [Zustand](https://zustand-demo.pmnd.rs/)
- **Testing** — [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **CI/CD** — GitHub Actions + [Vercel](https://vercel.com/)

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Firebase project](https://console.firebase.google.com/) with **Firestore** and **Google Auth** enabled

### 1 — Clone and install

```bash
git clone https://github.com/<your-handle>/jazz-practice-app.git
cd jazz-practice-app
npm install
```

### 2 — Configure environment variables

Create a `.env.local` file at the project root:

```bash
cp .env.example .env.local
```

Fill in your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> All values are available in **Firebase Console → Project Settings → Your apps → SDK setup and configuration**.

### 3 — Deploy Firestore security rules (first time)

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4 — Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Landing page + login — no auth required
│   └── (protected)/       # All app pages — requires Google sign-in
│       ├── dashboard/
│       ├── sessions/
│       ├── scales/
│       ├── standards/
│       ├── metronome/
│       └── progress/
├── components/            # Shared UI components (Sidebar, …)
├── contexts/              # AuthContext (useAuth hook)
├── data/                  # Static scales and standards data
├── lib/                   # Firebase init, auth helpers, utilities
├── services/              # Firestore CRUD (sessions, userProfile)
├── store/                 # Zustand stores (sessionTimer, metronome)
├── test/                  # Vitest unit tests
└── middleware.ts           # Edge middleware — cookie-based route protection
```

---

## Available Scripts

```bash
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm run start         # Serve production build locally
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run type-check    # tsc --noEmit
npm run test          # Vitest (single run)
npm run test:watch    # Vitest (watch mode)
npm run test:coverage # Vitest with coverage
```

---

## CI / CD

| Trigger | What runs |
|---|---|
| Every push / PR | Lint → Type-check → Test → Build (`ci.yml`) |
| Merge to `main` | Firestore rules deploy (`deploy-rules.yml`) |
| All PRs | Vercel preview deployment (automatic) |
| Weekly | Dependabot npm + Actions updates |

Secrets required in GitHub repository settings:

- `FIREBASE_SERVICE_ACCOUNT` — service account JSON (for rules deployment)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for Vercel deployment

---

## Contributing

Contributions are welcome! Please read the guidelines below before opening a PR.

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec — enforced by commitlint.
3. Make sure `npm run type-check` and `npm run test` both pass.
4. Open a pull request against `main`. A Vercel preview URL is generated automatically.

---

## License

[MIT](./LICENSE) © [Eddie Chan](https://github.com/eddiechan)
