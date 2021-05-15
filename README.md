# Lobbywatch Frontend

Lobbywatch.ch build with React.js and the [Next.js](https://github.com/zeit/next.js/) Framework.

## Prerequisites

To run the application you'll need Node.js v14 or higher.

## Develop

Run the following commands to start a local development server:

```bash
npm install
npm run dev
```

or with env settings

```bash
npm install
NEXT_PUBLIC_PUBLIC_BASE_URL='http://lobbywatch.local' NEXT_PUBLIC_DEBUG_INFORMATION=1 npm run dev
```

## Deploy

The `main` branch is automatically deployed to production by Vercel.
