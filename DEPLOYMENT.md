# Deployment

## Render

Using the included `render.yaml`:

1. Connect your GitHub repo to Render
2. Click "New" > "Blueprint" and select this repo
3. Render auto-detects the config and deploys

Manual setup:
- Build: `npm install && npm run build`
- Start: `npm start`
- Environment: Node

Set `NODE_ENV=production` and `PORT=10000` in environment variables.

## Local Dev

```bash
npm install
npm run dev
```
