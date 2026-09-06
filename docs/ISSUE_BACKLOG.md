# Issue Backlog

Use these as the first GitHub issues.

## MVP

1. Add `collect()` API for GitHub and Reddit research
   - Accept a query and provider list.
   - Run providers concurrently.
   - Return normalized items plus errors.
   - Export a JSON report.

2. Add CLI command
   - `agent-reach search "query" --providers github,reddit --limit 10`.
   - Print compact table output.
   - Support `--json` for machine-readable output.

3. Add response cache
   - Filesystem cache adapter.
   - TTL option per provider.
   - Cache key should include provider, query, and limit.

## Connector Quality

4. Add rate-limit metadata
   - Parse GitHub rate-limit headers.
   - Add a common `rateLimit` object to provider responses.

5. Improve typed errors
   - Include provider name.
   - Include retryable status.
   - Keep original response metadata for debugging.

6. Add provider fixtures
   - Store representative API fixtures under `test/fixtures`.
   - Cover success, empty, rate limited, and credential missing cases.

## Later

7. Add YouTube integration test fixture.
8. Add Instagram profile/media example.
9. Add MCP server wrapper.
10. Add OpenAI Agents SDK example.
