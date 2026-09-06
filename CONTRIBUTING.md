# Contributing to Agent-Reach

Thanks for helping improve Agent-Reach.

## Development

Use Node.js 18 or newer.

```bash
npm test
node examples/research-agent.js "open-source ai agents"
```

The project intentionally starts without runtime dependencies. Add dependencies
only when they clearly improve reliability, platform compliance, or developer
experience.

## Connector Rules

- Prefer official APIs when available.
- Respect each platform's terms, rate limits, robots rules, and privacy rules.
- Keep provider responses normalized into predictable result objects.
- Preserve the original provider response in `raw` when useful for advanced
  users.
- Throw typed errors from `src/errors.js` for missing credentials or unsupported
  capabilities.

## Pull Request Checklist

- Tests cover the provider behavior or public API change.
- README or roadmap is updated if the user-facing behavior changes.
- Credentials are read from options or environment variables, never hardcoded.
- Public result objects include source URLs when available.
