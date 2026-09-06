import { MissingCredentialError, UnsupportedCapabilityError } from "../errors.js";
import { HttpClient } from "../utils/http-client.js";

export class InstagramProvider {
  constructor({ accessToken = process.env.INSTAGRAM_ACCESS_TOKEN, fetchImpl } = {}) {
    this.name = "instagram";
    this.capabilities = ["profile", "media"];
    this.accessToken = accessToken;
    this.client = new HttpClient({
      baseUrl: "https://graph.instagram.com",
      fetchImpl
    });
  }

  async search() {
    throw new UnsupportedCapabilityError("Instagram public content search is not exposed by this starter connector.");
  }

  async getProfile(userId = "me") {
    if (!this.accessToken) {
      throw new MissingCredentialError("INSTAGRAM_ACCESS_TOKEN is required for Instagram access.");
    }

    return this.client.request(`/${userId}`, {
      query: {
        fields: "id,username,account_type,media_count",
        access_token: this.accessToken
      }
    });
  }

  async listMedia(userId = "me", { limit = 25 } = {}) {
    if (!this.accessToken) {
      throw new MissingCredentialError("INSTAGRAM_ACCESS_TOKEN is required for Instagram access.");
    }

    return this.client.request(`/${userId}/media`, {
      query: {
        fields: "id,caption,media_type,media_url,permalink,timestamp",
        limit: Math.min(limit, 100),
        access_token: this.accessToken
      }
    });
  }
}
