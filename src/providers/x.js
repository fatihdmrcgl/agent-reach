import { MissingCredentialError } from "../errors.js";
import { HttpClient } from "../utils/http-client.js";

export class XProvider {
  constructor({ bearerToken = process.env.X_BEARER_TOKEN, fetchImpl } = {}) {
    this.name = "x";
    this.capabilities = ["search"];
    this.bearerToken = bearerToken;
    this.client = new HttpClient({
      baseUrl: "https://api.x.com/2",
      fetchImpl,
      headers: bearerToken ? { authorization: `Bearer ${bearerToken}` } : {}
    });
  }

  async search(query, { limit = 10 } = {}) {
    if (!this.bearerToken) {
      throw new MissingCredentialError("X_BEARER_TOKEN is required for X recent search.");
    }

    const data = await this.client.request("/tweets/search/recent", {
      query: {
        query,
        max_results: Math.max(10, Math.min(limit, 100)),
        "tweet.fields": "created_at,author_id,public_metrics,lang"
      }
    });

    return (data.data || []).map((tweet) => ({
      provider: this.name,
      type: "tweet",
      id: tweet.id,
      title: tweet.text,
      url: `https://x.com/i/web/status/${tweet.id}`,
      authorId: tweet.author_id,
      createdAt: tweet.created_at,
      metrics: tweet.public_metrics,
      raw: tweet
    }));
  }
}
