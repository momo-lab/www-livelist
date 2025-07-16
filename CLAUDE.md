# CLAUDE.md

このリポジトリでは、Claude Code とのやりとりは日本語で行ってください。

## コマンド

- `yarn dev` - 開発サーバーを起動
- `yarn test` - テストを実行
- `yarn lint` - ESLintチェック
- `yarn format` - Prettierでフォーマット
- `yarn build:prod` / `yarn build:test` - ビルド
- `yarn full-deploy:prod` / `yarn full-deploy:test` - 完全デプロイパイプライン

## アーキテクチャ

### コア構造

アイドルのライブイベント情報を表示するReactアプリケーションです。以下の技術を使用：

- **React 19** with TypeScript
- **Vite 7** ビルドツール
- **Tailwind CSS v4** スタイリング
- **shadcn/ui** コンポーネント
- **React Router** ナビゲーション
- **Vitest** テスト

### 主要コンポーネント

- **LiveEventsProvider**: JSONからデータ取得
- **LiveEventTable**: イベント表示テーブル
- **useEventTableData**: データ処理・フィルタリング

### 型定義 (`src/types/index.d.ts`)

- `Idol`: アイドル情報
- `LiveEvent`: 基本イベント
- `TableEvent`: テーブル表示用

## 重要な注意事項

- コミュニケーションはすべて日本語で行うこと
- コミットメッセージは日本語で記述する
- コミットメッセージに「Generated with [Claude Code]」や「Co-Authored-By: Claude」の行を含めない
- アプリは`src/`ディレクトリに対して`@`パスエイリアスを使用
- 日付処理は`src/lib/utils.ts`のカスタムユーティリティを使用
