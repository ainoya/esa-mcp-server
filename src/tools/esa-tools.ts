import { mcpServer } from "../mcp-server";

// esa.ioの記事を取得するツール
mcpServer.registerTool({
  name: "get_esa_post",
  description: "esa.ioから記事を取得します",
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
});

// esa.ioの記事を検索するツール
mcpServer.registerTool({
  name: "search_esa_posts",
  description: "esa.ioで記事を検索します",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "検索クエリ",
      },
    },
    required: ["query"],
  },
});
