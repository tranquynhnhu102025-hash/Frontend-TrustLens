# TrustLens Frontend

React + Vite frontend for TrustLens. The app provides landing pages, auth screens, dashboards, class management, uploads, analysis status, and report views.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

## Project Structure

```text
src/
  components/    Shared UI and route guards
  features/      Feature screens
  services/      API clients and domain services
  mocks/         Mock data for local development
  App.tsx        Route configuration
  main.tsx       Application entry point
```

## Setup

```powershell
cd apps/frontend
npm install
```

Create a `.env` file when you want to connect to the backend:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false
```

For mock-mode development:

```env
VITE_USE_MOCK=true
```

## Development

```powershell
# Start with default Vite mode
npm run dev

# Start with mock mode
npm run dev:mock

# Start with backend mode
npm run dev:backend
```

Default dev URL:

- `http://localhost:5173`

## Build

```powershell
npm run build
npm run preview
```

## Lint

```powershell
npm run lint
```

## Git Note

This folder is configured as a Git submodule from the root repository. If your IDE Source Control does not show this project, confirm `apps/frontend/.git` exists and points to `../../.git/modules/apps/frontend`, then reload the IDE window.
