export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ToolCall {
  name: string;
  parameters: Record<string, any>;
}

export interface ToolResult {
  content: string;
}

export interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface MCPRequest {
  jsonrpc: "2.0";
  id?: number;
  method: string;
  messages: Array<{
    role: string;
    content: string;
    tool_calls?: Array<{
      name: string;
      parameters: Record<string, any>;
    }>;
  }>;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: number;
  result: {
    messages: Array<{
      role: string;
      content: string;
      tool_call_id?: string;
      tool_calls?: Array<{
        name: string;
        parameters: Record<string, any>;
      }>;
    }>;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface MCPToolsResponse {
  jsonrpc: "2.0";
  id: number;
  method: "mcp/tools";
  result: {
    tools: Array<{
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
      };
    }>;
  };
}

export interface MCPErrorResponse {
  jsonrpc: "2.0";
  id: number | null;
  error: {
    code: number;
    message: string;
  };
}
