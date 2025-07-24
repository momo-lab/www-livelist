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
    `.env.sample` をコピーして `.env` ファイルを作成し、
    開発時およびローカルでのデプロイテスト時に必要な環境変数を設定してください。
    環境変数の説明は[開発・デプロイ共通の環境変数](#開発デプロイ共通の環境変数)を参照してください。
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
pnpm format
pnpm lint
```

## 環境変数とGitHub Secrets

GitHub Actionsのデプロイおよび通知機能で利用される環境変数は、
以下のGitHub Secretsとしてリポジトリに設定する必要があります。

### 開発・デプロイ共通の環境変数

これらの環境変数は、開発環境の `.env` ファイルにも設定しますが、
GitHub Actionsでも利用するため、Secretsにも設定が必要です。

| 環境変数名      | 説明                                                        |
| :-------------- | :---------------------------------------------------------- |
| `VITE_BASE_URL` | Viteビルド時のベースURL（例: `/` または `/your-app-path/`） |
| `VITE_GA4_ID`   | Google Analytics 4の測定ID（`G-` から始まるID）             |
| `REMOTE_USER`   | デプロイ先サーバーへのSSH接続ユーザー名                     |
| `REMOTE_HOST`   | デプロイ先サーバーのホスト名                                |
| `REMOTE_DIR`    | デプロイ先サーバーのディレクトリパス                        |

### GitHub Actions専用の機密情報

これらの環境変数は、GitHub Actionsでのみ利用されるため、Secretsにのみ設定が必要です。

| 環境変数名                  | 説明                                                      |
| :-------------------------- | :-------------------------------------------------------- |
| `SSH_PRIVATE_KEY`           | デプロイ先サーバーへのSSH接続に使用する秘密鍵（改行含む） |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging APIのチャネルアクセストークン              |
| `LINE_USER_ID`              | LINE通知の送信先となるユーザーIDまたはグループID          |

## その他の情報

- **コミットメッセージ**: コミットメッセージは日本語で記述してください。
