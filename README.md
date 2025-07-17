# www-livelist

アイドルのライブ情報を一覧表示するWebサイトです。

## プロジェクト概要

このプロジェクトは、[アイドルのライブ一覧を表示するサイト]を目的としています。

## 技術スタック

- **フロントエンド**: React, Vite
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **パッケージ管理**: yarn

## 開発環境のセットアップ

1.  リポジトリをクローンします。
    ```bash
    git clone https://github.com/momo-lab/www-livelist.git
    cd www-livelist
    ```
2.  依存関係をインストールします。
    ```bash
    yarn install
    ```
3.  開発サーバーを起動します。
    ```bash
    yarn dev
    ```
    開発サーバーは通常 `http://localhost:5173` で起動します。

## ビルドとデプロイ

### 本番環境向けビルド

```bash
yarn build --mode production
```

### 本番環境へのデプロイ

```bash
yarn deploy --mode production
```

### テスト環境向けビルド

```bash
yarn build
```

### テスト環境へのデプロイ

```bash
yarn deploy
```

## テスト

ユニットテストを実行します。

```bash
yarn test
```

## コード品質

コードの整形とリンティングを実行します。

```bash
yarn format
yarn lint
```

## その他の情報

- **コミットメッセージ**: コミットメッセージは日本語で記述してください。
