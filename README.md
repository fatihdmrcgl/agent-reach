# Agent-Reach

Agent-Reach is a small open-source access layer for AI agents. It gives an
agent one consistent interface for sources such as GitHub, Reddit, YouTube, X,
Instagram, and future connectors.

The project starts with dependency-free Node.js ESM modules so the first
version is easy to inspect, fork, and deploy.

## What it does

- Registers source connectors behind one `AgentReach` interface.
- Normalizes search results into predictable objects.
- Supports GitHub, Reddit, YouTube, X, and Instagram starter connectors.
- Keeps credentials in environment variables.
- Provides a runnable research-agent example.

## Quick start

```bash
cp .env.example .env
node examples/research-agent.js "open-source ai agents"
```

Public Reddit search works without a token. Most other providers need their
official API credentials.

## Example

```js
import { AgentReach, createDefaultConnectors } from "./src/index.js";

const reach = new AgentReach({
  connectors: createDefaultConnectors()
});

const results = await reach.searchAll("startup agents", {
  providers: ["github", "reddit"],
  limit: 5
});

console.log(results);
```

## Provider status

| Provider | Status | Notes |
| --- | --- | --- |
| GitHub | Read/search | Uses GitHub REST API. Token is optional for public data but recommended. |
| Reddit | Public search/OAuth | Public JSON search works; OAuth bearer token is supported. |
| YouTube | Search | Requires `YOUTUBE_API_KEY`. |
| X | Recent search | Requires `X_BEARER_TOKEN` and API access. |
| Instagram | Profile/media | Requires `INSTAGRAM_ACCESS_TOKEN`; public search is intentionally not exposed. |

## Roadmap

- OAuth helpers and credential vault adapters.
- Rate-limit metadata per response.
- Browser and scraping adapters where platform terms allow it.
- Vector-ready ingestion pipeline.
- MCP server wrapper for agent runtimes.

## Compliance note

Use official APIs and respect each platform's terms of service, robots rules,
rate limits, and user privacy requirements.
