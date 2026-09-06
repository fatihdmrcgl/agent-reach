import { MissingCredentialError } from "../errors.js";
import { HttpClient } from "../utils/http-client.js";

export class YouTubeProvider {
  constructor({ apiKey = process.env.YOUTUBE_API_KEY, fetchImpl } = {}) {
    this.name = "youtube";
    this.capabilities = ["search"];
    this.apiKey = apiKey;
    this.client = new HttpClient({
      baseUrl: "https://www.googleapis.com/youtube/v3",
      fetchImpl
    });
  }

  async search(query, { limit = 10, type = "video" } = {}) {
    if (!this.apiKey) {
      throw new MissingCredentialError("YOUTUBE_API_KEY is required for YouTube search.");
    }

    const data = await this.client.request("/search", {
      query: {
        key: this.apiKey,
        q: query,
        part: "snippet",
        maxResults: Math.min(limit, 50),
        type
      }
    });

    return (data.items || []).map((item) => ({
      provider: this.name,
      type: item.id.kind?.replace("youtube#", "") || type,
      id: item.id.videoId || item.id.channelId || item.id.playlistId,
      title: item.snippet.title,
      url: item.id.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : undefined,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      raw: item
    }));
  }
}
