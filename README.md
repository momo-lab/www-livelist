# www-livelist

アイドルのライブ情報を一覧表示するWebサイトです。

## プロジェクト概要

このプロジェクトは、[アイドルのライブ一覧を表示するサイト]を目的としています。

## 技術スタック

- **フロントエンド**: React, Vite
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **パッケージ管理**: pnpm

## 開発環境のセットアップ

1.  リポジトリをクローンします。
    ```bash
    git clone https://github.com/momo-lab/www-livelist.git
    cd www-livelist
    ```
2.  環境変数を設定します。
    `.env.sample` をコピーして `.env` ファイルを作成し、必要に応じて環境変数を設定してください。
    ```bash
    cp .env.sample .env
    ```
3.  依存関係をインストールします。
    ```bash
    pnpm install
    ```
4.  開発サーバーを起動します。
    ```bash
    pnpm dev
    ```
    開発サーバーは通常 `http://localhost:5173` で起動します。

## ビルドとデプロイ

本番環境へのビルドとデプロイは「v」で始まるタグをpushすることで実行されます。
ローカル環境からは実行しないでください。

### テスト環境向けビルド

```bash
pnpm build
```

### テスト環境へのデプロイ

```bash
pnpm deploy-app
```

## テスト

ユニットテストを実行します。

```bash
pnpm test
```

## コード品質

コードの整形とリンティングを実行します。

```bash
yarn format
yarn lint
```

## その他の情報

- **コミットメッセージ**: コミットメッセージは日本語で記述してください。
