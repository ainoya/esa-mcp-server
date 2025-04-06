# esa-mcp-server

This repository is a sample implementation of MCP (Model Completion Protocol) server for esa.io and is not suitable for production use.

## Alternative Implementations

Please consider using the following MCP server implementations instead:

- <https://github.com/kajirita2002/esa-mcp-server>
- <https://github.com/d-kimuson/esa-mcp-server>

## Development

### Prerequisites

- Node.js
- pnpm

### Setup

```bash
pnpm install
```

### Running the development server

```bash
pnpm dev
```

## Dependencies

- Package Manager: pnpm
- Main packages:
  - hono
  - @hono/node-server
  - typescript
  - @types/node

## Features

1. MCP Server Implementation
   - Server implementation compliant with Anthropic's MCP protocol
2. Tool Definition and Implementation
   - Implementation of tools utilizing esa.io API
