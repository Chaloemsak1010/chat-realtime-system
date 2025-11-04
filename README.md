## Realtime Chat (Next.js 14 + Tailwind, frontend-only)

### Setup
1. Install deps:
```bash
npm i
```
2. Run dev server:
```bash
npm run dev
```

### Notes
- Frontend-only: no backend, no Firebase.
- "Realtime" is simulated across tabs using BroadcastChannel + localStorage.
- Messages are in-memory per tab and not persisted.
- Room owner (creator) can delete the room (enforced in UI).
