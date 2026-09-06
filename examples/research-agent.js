import { AgentReach, createDefaultConnectors } from "../src/index.js";

const query = process.argv.slice(2).join(" ") || "open-source ai agents";

const reach = new AgentReach({
  connectors: createDefaultConnectors()
});

console.log("Available connectors:");
console.table(reach.list());

const results = await reach.searchAll(query, {
  providers: ["github", "reddit", "youtube", "x"],
  limit: 5
});

for (const providerResult of results) {
  console.log(`\n# ${providerResult.provider}`);

  if (!providerResult.ok) {
    console.log(`Skipped: ${providerResult.error}`);
    continue;
  }

  for (const item of providerResult.results) {
    console.log(`- ${item.title}`);
    if (item.url) {
      console.log(`  ${item.url}`);
    }
  }
}
