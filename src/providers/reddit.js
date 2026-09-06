import { HttpClient } from "../utils/http-client.js";

export class RedditProvider {
  constructor({ bearerToken = process.env.REDDIT_BEARER_TOKEN, fetchImpl } = {}) {
    this.name = "reddit";
    this.capabilities = ["search"];
    this.bearerToken = bearerToken;
    this.client = new HttpClient({
      baseUrl: bearerToken ? "https://oauth.reddit.com" : "https://www.reddit.com",
      fetchImpl,
      headers: {
        "user-agent": "agent-reach/0.1",
        ...(bearerToken ? { authorization: `Bearer ${bearerToken}` } : {})
      }
    });
  }

  async search(query, { limit = 10, subreddit, sort = "relevance", time = "year" } = {}) {
    const path = subreddit ? `/r/${subreddit}/search.json` : "/search.json";
    const data = await this.client.request(path, {
      query: {
        q: query,
        limit: Math.min(limit, 100),
        sort,
        t: time,
        restrict_sr: subreddit ? 1 : undefined
      }
    });

    return (data.data?.children || []).map(({ data: post }) => ({
      provider: this.name,
      type: "post",
      id: post.id,
      title: post.title,
      url: `https://www.reddit.com${post.permalink}`,
      subreddit: post.subreddit,
      score: post.score,
      comments: post.num_comments,
      createdAt: new Date(post.created_utc * 1000).toISOString(),
      raw: post
    }));
  }
}
