# Orebound — React version

A 24/7 Minecraft server hosting site: landing page, pricing plans, sign in / create account, a dashboard, and a forum — built with React, React Router, and Vite. No backend: accounts, plans, whitelist, and forum posts are stored in the browser's `localStorage`, so it's a fully working demo out of the box.

## Run it

```
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              entry point, wraps the app in the router + state provider
  App.jsx                route definitions
  index.css              all styling (design tokens, components, responsive rules)
  lib/
    data.js               static data: pricing plans, forum categories, seed threads
    store.jsx             global state (auth, plans, forum, toasts, theme) + localStorage persistence
  components/
    Header.jsx             top nav, auth buttons, theme toggle, mobile menu
    Footer.jsx
    ToastHost.jsx           toast notifications
    PlanGrid.jsx            reusable pricing card grid (used on Home and Plans)
    ThreadList.jsx          reusable forum thread row list
    NewThreadForm.jsx       reusable "start a thread" form
  pages/
    Home.jsx                landing page
    Plans.jsx                full pricing page
    Login.jsx                sign-in form
    Signup.jsx                create-account form
    Dashboard.jsx             account dashboard (requires sign-in)
    Forum.jsx                  forum index — categories + recent threads
    ForumCategory.jsx           thread list within one category
    ForumThread.jsx              single thread + replies
```

## Notes

- Every page lives in its own file under `src/pages/`; shared UI (plan cards, thread rows, the new-thread form) is split into `src/components/` so nothing is duplicated across pages.
- Auth is a demo only — passwords are stored in plain text in `localStorage`, there's no server, and nothing is encrypted. Swap `src/lib/store.jsx` for real API calls to connect it to a backend.
- Player counts, TPS, and the console feed on the home page are simulated for demonstration.
