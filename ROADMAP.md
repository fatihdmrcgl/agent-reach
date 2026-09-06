# Agent-Reach Roadmap

This roadmap turns Agent-Reach from a connector scaffold into a useful access
layer for AI agents.

## Phase 1: Reliable Connectors

- Add request retries with exponential backoff.
- Return provider rate-limit metadata when APIs expose it.
- Add typed result shapes for posts, repositories, videos, profiles, and issues.
- Add integration tests with mocked API responses for every provider.
- Document required API credentials per provider.

## Phase 2: Agent-Friendly Runtime

- Add a task-oriented `collect()` API for multi-source research.
- Add source attribution and deduplication across providers.
- Add cache adapters for filesystem, SQLite, and Redis.
- Add event hooks for tracing, logging, and observability.
- Add a small CLI for quick source queries.

## Phase 3: Ingestion Pipeline

- Normalize content into a vector-search-ready document format.
- Add chunking and metadata extraction helpers.
- Add export adapters for JSONL and Markdown.
- Add source compliance settings per provider.

## Phase 4: Ecosystem

- Publish an MCP server wrapper.
- Publish npm package builds.
- Add examples for LangChain, OpenAI Agents SDK, and custom agent loops.
- Add provider contribution templates.

## First MVP Target

The first usable MVP should answer:

> Given a research query, collect public results from GitHub and Reddit, normalize
> them, and export a JSON report with source links.

That MVP avoids paid API keys and proves the core connector interface.
