# One-Week Project: “TaskM” - Task Manager with Auth, UI, DB, and AI

A simple but elegant productivity web app with:
- User authentication (Supabase)
- Task creation, editing, and filtering
- AI-assisted task suggestions
- Modern UI (Tailwind + shadcn/ui)
- Hosted online (Vercel)

## Features (Planned for 7 Days)

| Feature | Tools to Learn/Use |
|--------|--------------------|
| Sign up / Sign in | Supabase Auth + shadcn/ui Inputs/Dialogs |
| Create/edit/delete task | Supabase DB (PostgreSQL) |
| Tag tasks as “Todo”, “In Progress”, “Done” | UI logic + DB updates |
| Filter/search tasks | Tailwind forms + query filters |
| Dark mode toggle | Next.js Dark mode |

## Stretch Features

| Feature | Tools |
|--------|-------|
| AI: Breaks down high-level tasks into mini tasks | Gemini API (text generation) |
| File attachment to tasks | Supabase Storage |
| Pomodoro timer w/ animation | Framer Motion |
| Realtime sync | Supabase Realtime (if time permits) |

## Day-by-Day Plan (1-Week Sprint)

| Day | Goal | Tasks |
|-----|------|-------|
| 1 | Setup Project | Init Next.js + Tailwind + shadcn/ui + Supabase |
| 2 | User Auth | Implement register/login/logout pages using Supabase |
| 3 | Task CRUD | Create task DB in Supabase, build task list UI |
| 4 | Task Filters + Dark Mode | Add filtering (by tag/status) and toggle theme |
| 5 | Add AI (Gemini API) | Build "suggest 3 tasks" button with Gemini API gemini-2.5-pro (Changed from OpenAI text-davinci/gpt-3.5) |
| 6 | Polish UI | Add animations (Framer Motion), responsive layout, UX cleanup |
| 7 | Deploy & Share | Deploy to Vercel, test user flow, write simple README |

## Tools/Stack

- **Frontend:** Next.js + Tailwind CSS  
- **UI Kit:** shadcn/ui (Buttons, Dialogs, Tabs, etc.)  
- **Backend/DB:** Supabase (Auth, DB, Storage)  
- **AI:** Gemini API for task suggestions  
- **Deployment:** Vercel (1-click for Next.js)  
- **Animation:** Framer Motion (for small touches)

## Pages

- `/login` – Sign in / Sign up (Supabase)  
- `/dashboard` – View and filter tasks  
- `/task/[id]` – Task details and notes  
- `/settings` – Toggle theme, logout, manage profile

## Takeaways (What will be learned)

- Tailwind + shadcn/ui layout and theming  
- Supabase full-stack usage (Auth, DB, Storage)  
- RESTful client-side data fetching  
- Basic integration with Gemini API  
- How to ship a real web app in a week  
