import { Tool } from "../types/mcp";
import { EsaClient } from "../clients/esa";

export const createEsaTools = (client: EsaClient): Tool[] => {
  return [
    {
      name: "search_posts",
      description: "ESAの記事を検索します",
      parameters: {
        type: "object",
        properties: {
          q: {
            type: "string",
            description: "検索クエリ",
          },
        },
        required: ["q"],
      },
    },
    {
      name: "get_post",
      description: "指定した記事の詳細を取得します",
      parameters: {
        type: "object",
        properties: {
          post_number: {
            type: "number",
            description: "記事番号",
          },
        },
        required: ["post_number"],
      },
    },
    {
      name: "create_post",
      description: "新しい記事を作成します",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "記事のタイトル",
          },
          body_md: {
            type: "string",
            description: "記事の本文（Markdown形式）",
          },
        },
        required: ["name", "body_md"],
      },
    },
  ];
};

export const handleEsaToolCall = async (
  client: EsaClient,
  toolCall: { name: string; parameters: any }
): Promise<string> => {
  switch (toolCall.name) {
    case "search_posts":
      const searchResult = await client.searchPosts({
        q: toolCall.parameters.q,
      });
      return JSON.stringify(searchResult);
    case "get_post":
      const post = await client.getPost(toolCall.parameters.post_number);
      return JSON.stringify(post);
    case "create_post":
      const newPost = await client.createPost({
        name: toolCall.parameters.name,
        body_md: toolCall.parameters.body_md,
      });
      return JSON.stringify(newPost);
    default:
      throw new Error(`Unknown tool: ${toolCall.name}`);
  }
};
