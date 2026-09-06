import { HttpClient } from "../utils/http-client.js";

export class GitHubProvider {
  constructor({ token = process.env.GITHUB_TOKEN, fetchImpl } = {}) {
    this.name = "github";
    this.capabilities = ["search", "repository", "issues"];
    this.client = new HttpClient({
      baseUrl: "https://api.github.com",
      fetchImpl,
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "agent-reach",
        ...(token ? { authorization: `Bearer ${token}` } : {})
      }
    });
  }

  async search(query, { limit = 10 } = {}) {
    const data = await this.client.request("/search/repositories", {
      query: {
        q: query,
        per_page: Math.min(limit, 100)
      }
    });

    return (data.items || []).map((repo) => ({
      provider: this.name,
      type: "repository",
      id: repo.id,
      title: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      raw: repo
    }));
  }

  async getRepository(owner, repo) {
    return this.client.request(`/repos/${owner}/${repo}`);
  }

  async listIssues(owner, repo, { state = "open", limit = 20 } = {}) {
    return this.client.request(`/repos/${owner}/${repo}/issues`, {
      query: {
        state,
        per_page: Math.min(limit, 100)
      }
    });
  }
}
