import { createServer, IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
}

interface MCPResponse {
  type: string;
  data: any;
}

class MCPServer {
  private tools: Tool[] = [];
  private clients: Set<ServerResponse> = new Set();

  constructor() {
    this.setupServer();
  }

  private setupServer() {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      // CORSヘッダーを設定
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      // プリフライトリクエストの処理
      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      try {
        const url = new URL(req.url || "", `http://${req.headers.host}`);

        if (url.pathname === "/mcp") {
          if (req.method === "GET") {
            this.handleSSE(req, res);
          } else if (req.method === "POST") {
            this.handleToolCall(req, res);
          } else {
            res.writeHead(405);
            res.end("Method Not Allowed");
          }
        } else {
          res.writeHead(404);
          res.end("Not Found");
        }
      } catch (error) {
        console.error("Error handling request:", error);
        res.writeHead(500);
        res.end("Internal Server Error");
      }
    });

    server.listen(3000, "0.0.0.0", () => {
      console.log("MCP Server is running on port 3000");
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
    });
  }

  private handleSSE(req: IncomingMessage, res: ServerResponse) {
    // Keep-Aliveの設定
    req.socket.setKeepAlive(true);
    res.socket?.setKeepAlive(true);

    // タイムアウトを無効化
    req.socket.setTimeout(0);
    res.socket?.setTimeout(0);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    });

    // 初期化メッセージを送信
    this.sendSSEMessage(res, {
      type: "init",
      data: {
        tools: this.tools,
      },
    });

    // クライアントを登録
    this.clients.add(res);

    // 定期的なキープアライブメッセージを送信
    const keepAliveInterval = setInterval(() => {
      this.sendSSEMessage(res, {
        type: "ping",
        data: { timestamp: Date.now() },
      });
    }, 15000);

    // 接続が閉じられたときのクリーンアップ
    const cleanup = () => {
      clearInterval(keepAliveInterval);
      this.clients.delete(res);
      console.log("Client disconnected");
    };

    req.on("close", cleanup);
    req.on("end", cleanup);
    res.on("close", cleanup);
    res.on("error", (error) => {
      console.error("Response error:", error);
      cleanup();
    });
  }

  private async handleToolCall(req: IncomingMessage, res: ServerResponse) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const toolCall = JSON.parse(body) as ToolCall;
        const result = await this.executeToolCall(toolCall);

        // ツール実行結果をブロードキャスト
        this.broadcastMessage({
          type: "tool_call_result",
          data: {
            id: toolCall.id,
            result,
          },
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error("Error handling tool call:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
  }

  private sendSSEMessage(res: ServerResponse, message: MCPResponse) {
    try {
      if (!res.writableEnded) {
        const data = JSON.stringify(message.data);
        res.write(`event: ${message.type}\n`);
        res.write(`data: ${data}\n\n`);
      }
    } catch (error) {
      console.error("Error sending SSE message:", error);
      this.clients.delete(res);
    }
  }

  private broadcastMessage(message: MCPResponse) {
    for (const client of this.clients) {
      this.sendSSEMessage(client, message);
    }
  }

  public registerTool(tool: Tool) {
    this.tools.push(tool);
    this.broadcastMessage({
      type: "tools_update",
      data: {
        tools: this.tools,
      },
    });
  }

  private async executeToolCall(call: ToolCall) {
    // ここでツールの実行ロジックを実装
    // 例: esa.ioのAPIを呼び出すなど
    return { result: "Tool executed successfully" };
  }
}

export const mcpServer = new MCPServer();
