# Retro & Action Tracker

AI-powered tool that extracts action items from retrospective meeting notes and helps track their progress.

## Features

- **AI Extraction**: Paste retro notes and let Claude extract structured action items
- **Action Review**: Edit extracted actions before saving
- **Status Dashboard**: Track actions as open, in-progress, or closed
- **Blocker Detection**: Highlights blocking items for priority attention

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Claude API (claude-sonnet-4-6)

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and add your API key
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/extract` | Extract actions from retro notes via Claude |
| GET | `/api/actions` | List all actions |
| POST | `/api/actions/bulk` | Save multiple actions |
| PATCH | `/api/actions/[id]` | Update action status |

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
git push origin master
# Then import repo at https://vercel.com/new
# Add ANTHROPIC_API_KEY in Vercel environment settings
```
