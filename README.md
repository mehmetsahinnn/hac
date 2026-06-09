# RetroTool

The easiest way to run engaging online retrospectives for remote and hybrid teams.
Go back in time to improve the future - no sign up, fully anonymous, runs entirely in your browser.

## Features

- **Three templates** to choose from:
  - Mad / Sad / Glad
  - Liked / Learned / Lacked
  - Start / Stop / Continue
- **Sticky-note board** with three columns per template
- **Cards**: add, edit (double-click), delete, and upvote
- **Timer** (5:00) to time-box each phase
- **Action points** panel to capture concrete next steps
- **Export** a board to Markdown, and **Share** via copy-link
- **Anonymous & local**: boards are saved in your browser via localStorage. No account, no backend, no AI.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a warm, cozy "retro desktop" theme (see `DESIGN.md`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 and click **Create free, anonymous retro**.

## Routes

- `/` - landing page
- `/new` - pick a template
- `/retro/[id]` - the retrospective board
