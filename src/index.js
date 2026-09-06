import { GitHubProvider } from "./providers/github.js";
import { InstagramProvider } from "./providers/instagram.js";
import { RedditProvider } from "./providers/reddit.js";
import { XProvider } from "./providers/x.js";
import { YouTubeProvider } from "./providers/youtube.js";

export class AgentReach {
  constructor({ connectors = {} } = {}) {
    this.connectors = new Map();

    for (const [name, connector] of Object.entries(connectors)) {
      this.register(name, connector);
    }
  }

  register(name, connector) {
    if (!name || !connector) {
      throw new Error("register(name, connector) requires both arguments.");
    }

    this.connectors.set(name, connector);
    return this;
  }

  get(name) {
    const connector = this.connectors.get(name);

    if (!connector) {
      throw new Error(`Unknown connector: ${name}`);
    }

    return connector;
  }

  list() {
    return [...this.connectors.entries()].map(([name, connector]) => ({
      name,
      capabilities: connector.capabilities || []
    }));
  }

  async searchAll(query, { providers, limit = 10 } = {}) {
    const selectedProviders = providers || [...this.connectors.keys()];
    const searches = selectedProviders.map(async (name) => {
      const connector = this.get(name);

      if (typeof connector.search !== "function") {
        return { provider: name, ok: false, error: "Search is not supported by this connector." };
      }

      try {
        const results = await connector.search(query, { limit });
        return { provider: name, ok: true, results };
      } catch (error) {
        return { provider: name, ok: false, error: error.message, details: error.details };
      }
    });

    return Promise.all(searches);
  }
}

export function createDefaultConnectors(options = {}) {
  return {
    github: new GitHubProvider(options.github),
    reddit: new RedditProvider(options.reddit),
    youtube: new YouTubeProvider(options.youtube),
    x: new XProvider(options.x),
    instagram: new InstagramProvider(options.instagram)
  };
}

export {
  GitHubProvider,
  InstagramProvider,
  RedditProvider,
  XProvider,
  YouTubeProvider
};
