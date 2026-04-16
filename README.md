# 🌱 Sprout — 夫婦で育てる、新しい命の準備

**妊活・妊娠・産後・育児をふたりで管理するチェックリスト PWA**

> https://sprout-rose.vercel.app
>
> for commit 1.4.1

---

## 特徴

- 📋 **80+のチェック項目** — 妊活〜育児の4フェーズを網羅、根拠ある要点・注意事項付き
- 👫 **夫婦共有** — 家族グループで進捗をリアルタイム共有
- ♀️♂️ **性別フィルター** — 女性向け/男性向けタスクをワンタップ切替
- 🏷️ **カテゴリ分類** — 手続き・買い物・健康・お金・その他
- 📱 **モバイルファースト** — ボトムナビ + レスポンシブ対応
- 🔒 **セキュア** — Supabase Auth + Row Level Security

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
/family           → 家族メンバー管理・招待
/settings         → プロフィール設定
```

## ドキュメント

- [利用マニュアル](docs/user-manual.md)
- [日中表現対照表（i18nリファレンス）](docs/i18n-reference.md)
- [事業化企画書](docs/business-plan.md)

## 使い方（最短）

1. 新規登録（メール/Google）でログイン
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
```

### 3. データベース

Supabase SQL Editor で以下を順番に実行:

1. `supabase/migrations/001_initial_schema.sql` — テーブル + RLS + トリガー
2. `supabase/migrations/006_all_in_one_fix.sql` — GRANT権限 + プロフィール自動作成
3. `supabase/migrations/009_fix_signup_trigger.sql` — signupトリガー修正（本番必須）

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
