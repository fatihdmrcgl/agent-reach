import { ProviderRequestError } from "../errors.js";

export class HttpClient {
  constructor({ baseUrl = "", headers = {}, fetchImpl = globalThis.fetch, timeoutMs = 15000 } = {}) {
    if (!fetchImpl) {
      throw new Error("A fetch implementation is required. Use Node.js 18+ or pass fetchImpl.");
    }

    this.baseUrl = baseUrl;
    this.headers = headers;
    this.fetchImpl = fetchImpl;
    this.timeoutMs = timeoutMs;
  }

  async request(path, { method = "GET", query = {}, headers = {}, body } = {}) {
    const url = new URL(path, this.baseUrl || "http://localhost");

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(url.toString(), {
        method,
        headers: {
          ...this.headers,
          ...headers,
          ...(body ? { "content-type": "application/json" } : {})
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new ProviderRequestError(`Provider request failed with ${response.status}`, {
          status: response.status,
          response: data
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ProviderRequestError) {
        throw error;
      }

      throw new ProviderRequestError(error.message, { cause: error.name });
    } finally {
      clearTimeout(timer);
    }
  }
}
