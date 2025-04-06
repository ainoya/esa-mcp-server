# esa-mcp-server

esa.ioのMCPサーバー実装

## ファイルパターン

- `src/**/*.ts`
- `src/**/*.tsx`

## コマンド

- `pnpm install`: 依存関係のインストール
- `pnpm dev`: 開発サーバーの起動

## 依存関係

- パッケージマネージャー: pnpm
- 主要なパッケージ:
  - hono
  - @hono/node-server
  - typescript
  - @types/node

## タスク

1. MCPサーバーの実装
   - AnthropicのMCPプロトコルに準拠したサーバー実装
2. Honoフレームワークのセットアップ
   - Webアプリケーションフレームワークの設定
3. ツールの定義と実装
   - esa.ioのAPIを利用するツールの実装
