# 🌱 Sprout — 夫婦で育てる、新しい命の準備

**妊活・妊娠・産後・育児をふたりで管理するチェックリスト PWA**

> https://sprout-rose.vercel.app
>
> for commit 1.10.6

---

## 特徴

- 📋 **80+のチェック項目** — 妊活〜育児の4フェーズを網羅、根拠ある要点・注意事項付き
- 👫 **夫婦共有** — 家族グループで進捗をリアルタイム共有、招待参加と退出に対応
- 🎯 **タスク優先度** — 高/中/低で優先順に整理
- ♀️♂️ **性別フィルター** — 女性向け/男性向けタスクをワンタップ切替
- ♻️ **テンプレート再適用** — 優先度（高/中/低）でデフォルト項目を復元
- 🧹 **一括整理** — 手動追加タスクをステージ単位で削除（全ステージ一括は Pro）
- 💎 **プラン区分** — Free / Pro の機能判定基盤を実装
- 📤 **Proエクスポート** — タスク一覧を CSV で出力可能
- 🛍️ **低侵襲マネタイズ** — チェックリスト画面に広告リンク枠を追加
- 🔐 **アカウント安全運用** — ログアウトと削除を分離、確認入力付きで誤操作を抑制
- 🔗 **外部連携管理** — 設定画面で Google/LINE の連携状態確認・連携解除
- 🌐 **3言語対応** — 日本語 / 简体中文 / English を設定画面から切替可能
- ⚡ **体感速度改善** — 主要導線の prefetch、並列読取、キャッシュで初動を高速化
- 📱 **モバイルファースト** — ボトムナビ + レスポンシブ対応
- 🔒 **セキュア** — Supabase Auth + Row Level Security + SECURITY DEFINER RPC

## 1.9.x 主な更新ハイライト

- 1.9.25-1.9.34: Google/LINE 連携管理、LIFF優先ログイン、原因別エラー表示を強化
- 1.9.35-1.9.36: アカウント削除機能（`delete_my_account`）と参照整合性対応を実装
- 1.9.37-1.9.43: 認証エラーの多言語化、Googleログイン成功時の誤エラー表示を修正
- 1.9.44: Next.js 16 実行時警告の原因だった render 中 `revalidatePath` 呼び出しを解消
- 1.9.45-1.9.47: 設定画面の情報設計刷新、危険操作分離、家族退出機能（`leave_my_family`）を追加
- 1.9.21-1.9.47: middleware最適化、prefetch、request-scope cache、並列データ取得で表示速度を改善

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
/family           → 家族メンバー管理・招待・退出・病院検索
/settings         → プロフィール/日程・言語・外観・連携・アカウント管理
```

## ドキュメント

- [利用マニュアル](docs/user-manual.md)
- [利用マニュアル（简体中文）](docs/user-manual.zh-CN.md)
- [User Manual (English)](docs/user-manual.en.md)
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
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
AMAZON_ASSOCIATE_TAG=yourtag-22
BILLING_ENABLED=0
```

補足:
- `SUPABASE_LINE_PROVIDER` は Supabase 側の設定名です（標準なら `line`、Custom OIDCの場合は `custom:line` など）。
- `SUPABASE_SERVICE_ROLE_KEY` は Stripe Webhook から課金状態を反映するために使います。
- `STRIPE_PRICE_PRO_MONTHLY` は Stripe Product の月額価格 ID を設定してください。
- `AMAZON_ASSOCIATE_TAG` は任意です。未設定時は通常リンクとして遷移します。
- `BILLING_ENABLED=1` で課金UI/課金アクションを有効化します。Stripeを使わない期間は `0` を推奨します。

### 3. データベース

Supabase SQL Editor で `supabase/migrations/` の SQL を**ファイル名順**に適用してください。

現行のファイル（2026-04-30 時点）:

1. `001_initial_schema.sql`
2. `002_add_gender_tips.sql`
3. `002_grants.sql`
4. `003_fix_postgrest.sql`
5. `004_fix_test_user.sql`
6. `005_ensure_profile_fn.sql`
7. `006_all_in_one_fix.sql`
8. `007_add_expected_due_date.sql`
9. `008_add_expected_pregnancy_date.sql`
10. `009_fix_signup_trigger.sql`
11. `010_add_baby_gender.sql`
12. `011_add_task_priority.sql`
13. `012_add_user_gender.sql`
14. `013_task_query_performance_indexes.sql`
15. `014_add_delete_my_account.sql`
16. `015_fix_delete_my_account_constraints.sql`
17. `016_cleanup_orphan_families.sql`
18. `017_schedule_orphan_family_cleanup.sql`
19. `018_add_leave_my_family.sql`
20. `019_add_subscription_tier.sql`
21. `020_add_stripe_subscription_columns.sql`

注意:
- 既存環境で `001_initial_schema.sql` を再実行しないでください（既存 enum/type 衝突の原因になります）。
- 既存環境は「未適用の migration のみ」を順次適用してください。

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
- `--type` 省略時は `patch`（例: `1.9.47 -> 1.9.48`）
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
