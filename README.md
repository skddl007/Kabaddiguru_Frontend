"# Kabaddiguru Frontend"

## Environment Setup

This app reads variables from `.env.local` and `config.env` (if present). Client-exposed vars must start with `NEXT_PUBLIC_`.

### API base URL

- Development: defaults to `http://localhost:8000`.
- Production: set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

Example `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend.example.com
```

Restart the dev server after changing env variables.
