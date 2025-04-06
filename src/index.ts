import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createEsaTools, handleEsaToolCall } from "./tools/esa.js";
import { EsaClient } from "./clients/esa.js";
import { z } from "zod";

// esa.ioクライアントの初期化
const esaClient = new EsaClient(
  process.env.ESA_ACCESS_TOKEN || "",
  process.env.ESA_TEAM_NAME || ""
);

// MCPサーバーの初期化
const server = new McpServer({
  name: "esa-mcp-server",
  version: "1.0.0",
});

// esa.ioのツールを登録
const esaTools = createEsaTools(esaClient);
for (const tool of esaTools) {
  const paramsSchema = Object.entries(tool.parameters.properties).reduce(
    (acc, [key, value]) => {
      switch (value.type) {
        case "number":
          acc[key] = z.number();
          break;
        case "string":
        default:
          acc[key] = z.string();
          break;
      }
      return acc;
    },
    {} as Record<string, z.ZodType>
  );

  server.tool(tool.name, paramsSchema, async (params) => {
    // パラメータの型変換
    const convertedParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (tool.parameters.properties[key].type === "number") {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const result = await handleEsaToolCall(esaClient, {
      name: tool.name,
      parameters: convertedParams,
    });
    return {
      content: [{ type: "text", text: result }],
    };
  });
}

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: { [sessionId: string]: SSEServerTransport } = {};

app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`esa-mcp-server is running on port ${port}`);
});
