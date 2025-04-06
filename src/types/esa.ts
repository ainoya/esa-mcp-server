export interface EsaPost {
  number: number;
  name: string;
  full_name: string;
  wip: boolean;
  body_md: string;
  body_html: string;
  created_at: string;
  updated_at: string;
  message: string;
  url: string;
  tags: string[];
  category: string;
  revision_number: number;
  created_by: EsaUser;
  updated_by: EsaUser;
  kind: string;
  comments_count: number;
  tasks_count: number;
  done_tasks_count: number;
  stargazers_count: number;
  watchers_count: number;
  star: boolean;
  watch: boolean;
}

export interface EsaUser {
  name: string;
  screen_name: string;
  icon: string;
}

export interface EsaSearchResult {
  posts: EsaPost[];
  total_count: number;
  page: number;
  per_page: number;
  max_per_page: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface EsaCreatePostParams {
  name: string;
  body_md: string;
  tags?: string[];
  category?: string;
  wip?: boolean;
  message?: string;
  user?: string;
}

export interface EsaSearchParams {
  q: string;
  page?: number;
  per_page?: number;
  include?: string[];
  sort?:
    | "updated"
    | "created"
    | "number"
    | "stars"
    | "watches"
    | "comments"
    | "best_match";
  order?: "desc" | "asc";
}
