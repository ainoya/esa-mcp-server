import {
  EsaPost,
  EsaSearchResult,
  EsaCreatePostParams,
  EsaSearchParams,
} from "../types/esa";

export class EsaClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly teamName: string;

  constructor(accessToken: string, teamName: string) {
    this.accessToken = accessToken;
    this.teamName = teamName;
    this.baseUrl = `https://api.esa.io/v1/teams/${teamName}`;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Esa API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * 記事を検索する
   */
  async searchPosts(params: EsaSearchParams): Promise<EsaSearchResult> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", params.q);

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params.include) queryParams.append("include", params.include.join(","));
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    return this.request<EsaSearchResult>(`/posts?${queryParams.toString()}`);
  }

  /**
   * 記事を取得する
   */
  async getPost(postNumber: number): Promise<EsaPost> {
    return this.request<EsaPost>(`/posts/${postNumber}`);
  }

  /**
   * 記事を作成する
   */
  async createPost(params: EsaCreatePostParams): Promise<EsaPost> {
    return this.request<EsaPost>("/posts", {
      method: "POST",
      body: JSON.stringify({
        post: params,
      }),
    });
  }
}
