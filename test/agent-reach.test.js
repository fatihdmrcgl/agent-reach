import test from "node:test";
import assert from "node:assert/strict";
import { AgentReach } from "../src/index.js";
import { GitHubProvider } from "../src/providers/github.js";

test("registers and lists connectors", () => {
  const reach = new AgentReach();
  reach.register("fake", { capabilities: ["search"] });

  assert.deepEqual(reach.list(), [{ name: "fake", capabilities: ["search"] }]);
});

test("searchAll normalizes provider failures", async () => {
  const reach = new AgentReach({
    connectors: {
      broken: {
        async search() {
          throw new Error("nope");
        }
      }
    }
  });

  const [result] = await reach.searchAll("agents");
  assert.equal(result.ok, false);
  assert.equal(result.error, "nope");
});

test("GitHub search maps repository results", async () => {
  const fetchImpl = async () =>
    new Response(
      JSON.stringify({
        items: [
          {
            id: 1,
            full_name: "openai/example",
            html_url: "https://github.com/openai/example",
            description: "Example repo",
            stargazers_count: 42,
            language: "JavaScript",
            updated_at: "2026-01-01T00:00:00Z"
          }
        ]
      }),
      { status: 200 }
    );

  const provider = new GitHubProvider({ fetchImpl });
  const [result] = await provider.search("agent");

  assert.equal(result.provider, "github");
  assert.equal(result.title, "openai/example");
  assert.equal(result.stars, 42);
});
