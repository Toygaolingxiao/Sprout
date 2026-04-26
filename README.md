# 🌱 Sprout — 夫婦で育てる、新しい命の準備

**妊活・妊娠・産後・育児をふたりで管理するチェックリスト PWA**

> https://sprout-rose.vercel.app
>
> for commit 1.9.14

---

## 特徴

- 📋 **80+のチェック項目** — 妊活〜育児の4フェーズを網羅、根拠ある要点・注意事項付き
- 👫 **夫婦共有** — 家族グループで進捗をリアルタイム共有
- 🎯 **タスク優先度** — 高/中/低で優先順に整理
- ♀️♂️ **性別フィルター** — 女性向け/男性向けタスクをワンタップ切替
- ♻️ **テンプレート再適用** — 優先度（高/中/低）でデフォルト項目を復元
- 🧹 **一括整理** — 手動追加タスクをステージ単位/全ステージで削除
- 🏷️ **カテゴリ分類** — 手続き・買い物・健康・お金・その他
- 📱 **モバイルファースト** — ボトムナビ + レスポンシブ対応
- 🔒 **セキュア** — Supabase Auth + Row Level Security
- 💬 **LINEログイン対応** — LIFF経由のIDトークンでサインイン可能

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| **フロントエンド** | Next.js 16, React 19, TypeScript 5 |
| **スタイリング** | Tailwind CSS v4, shadcn/ui |
| **バックエンド** | Supabase (PostgreSQL, Auth, RLS) |
| **ホスティング** | Vercel |

## 画面構成

```
/dashboard        → ホーム（現在ステージのタスク + 全ステージ概要）
/checklists       → ステージ一覧
/checklists/:id   → チェックリスト詳細（カテゴリ/性別フィルター付き）
/family           → 家族メンバー管理・招待・プロフィール/日程設定
/settings         → 言語・外観・アカウント設定
```

## ドキュメント

- [利用マニュアル](docs/user-manual.md)
- [日中表現対照表（i18nリファレンス）](docs/i18n-reference.md)
- [事業化企画書](docs/business-plan.md)

## 使い方（最短）

1. 新規登録（メール/Google/LINE）でログイン
2. 設定画面でライフステージと日程を入力
3. 家族画面で招待リンクを発行し、パートナーに共有
4. パートナーがリンクから参加してチェックリストを共有
5. 日々のタスクを完了して進捗を確認

## セットアップ

### 1. クローン & インストール

```bash
git clone https://github.com/Toygaolingxiao/Sprout.git
cd Sprout
npm install
```

### 2. 環境変数

`.env.local` を作成:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LIFF_ID=your-liff-id
SUPABASE_LINE_PROVIDER=line
```

補足:
- `SUPABASE_LINE_PROVIDER` は Supabase 側の設定名です（標準なら `line`、Custom OIDCの場合は `custom:line` など）。

### 3. データベース

Supabase SQL Editor で以下を順番に実行:

1. `supabase/migrations/001_initial_schema.sql` — テーブル + RLS + トリガー
2. `supabase/migrations/002_add_gender_tips.sql` — 性別に応じたタスク補足情報
3. `supabase/migrations/002_grants.sql` — 権限設定
4. `supabase/migrations/003_fix_postgrest.sql` — PostgREST関連修正
5. `supabase/migrations/004_fix_test_user.sql` — テストユーザー関連修正
6. `supabase/migrations/005_ensure_profile_fn.sql` — プロフィール作成関数の整備
7. `supabase/migrations/006_all_in_one_fix.sql` — 主要修正の統合
8. `supabase/migrations/007_add_expected_due_date.sql` — 出産予定日カラム追加
9. `supabase/migrations/008_add_expected_pregnancy_date.sql` — 妊娠予定時期カラム追加

### 4. 開発サーバー

```bash
npm run dev
```

http://localhost:3000 でアクセス。

### 4.1 シードデータ投入（必要時）

初回セットアップ直後やテンプレート更新後に、ログイン状態で以下を実行してください。

```bash
curl -X POST http://localhost:3000/api/seed
```

### 5. 本番デプロイ

Vercel にGitHub連携でデプロイ。環境変数3つを設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` → `https://your-app.vercel.app`

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: 本番URL
- Redirect URLs: `https://your-app.vercel.app/**`

### 5.2 LIFF + LINEログイン設定

1. LINE Developers の LIFF設定
	- LIFF ID: `your-liff-id`
	- Endpoint URL: `https://sprout-rose.vercel.app/`
	- Scope: `openid profile`（IDトークン取得に必須）
2. Supabase Auth で LINEプロバイダー（または Custom OIDC）を有効化
3. `SUPABASE_LINE_PROVIDER` をプロバイダー名に合わせる
	- 例: `line`
	- 例: `custom:line`
4. 本番URLと `/auth/callback` を許可URLに追加
5. デプロイ後、LIFF内でログイン画面の「LINEでログイン」から接続確認

注意:
- `https://liff.line.me/...` から開く場合、LINE側の仕様で最初にLINE認証画面が表示されます。
- メール/Googleでの登録・ログイン導線を優先したい場合は、`https://sprout-rose.vercel.app/` を直接開いてください。

### 5.1 自動リリース（VerUp + commit + push + deploy）

機能更新後は次のコマンドで一括実行できます。

```bash
npm run release:auto -- --type patch --notes "項目1|項目2|項目3"
```

主なオプション:
- `--type minor` / `--type major`
- `--skip-build`（ビルド省略）
- `--skip-deploy`（deployトリガー省略）
- `--dry-run`（処理確認）

## プロジェクト構成

```
src/
├── app/
│   ├── (auth)/          # ログイン・サインアップ
│   ├── (main)/          # 認証後の画面
│   │   ├── dashboard/   # ホーム
│   │   ├── checklists/  # チェックリスト
│   │   ├── family/      # 家族管理
│   │   └── settings/    # 設定
│   └── api/             # APIエンドポイント
├── components/
│   ├── checklists/      # タスク表示・フィルター
│   ├── layout/          # ヘッダー・ナビ
│   └── ui/              # shadcn/ui コンポーネント
├── data/seed/           # ステージ・カテゴリ・テンプレートデータ
├── lib/
│   ├── actions/         # Server Actions (auth, tasks, profile, family)
│   └── supabase/        # Supabase クライアント
└── types/               # TypeScript型定義
```

## ライセンス

MIT
