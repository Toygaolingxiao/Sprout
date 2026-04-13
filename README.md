# Sprout 🌱

**Sprout** は、妊活・出産準備・産後ケア・そして育児という一連のライフイベントを、夫婦で円滑に管理するための共有型チェックリストPWAです。

### 🌟 Concept
新しい命が「芽吹く（Sprout）」までの道のりは、多くの準備と手続きが必要です。慌ただしい日々の中でも、大切なタスクを見落とさず、夫婦が同じ視座で未来へ進むための道標となることを目指しています。

### 🛠 Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend/DB:** Supabase (Auth & Database)
- **Deployment:** Vercel
- **UI Components:** shadcn/ui

### 🚀 Key Features
- **Lifecycle Checklists:** 妊活〜育児のフェーズ別タスク管理
- **Real-time Sync:** 夫婦間での即時データ同期
- **PWA Support:** スマホのホーム画面からアプリとして起動可能
- **Knowledge Base:** 自治体の手続きや注意事項のクイックリファレンス


# 指示: 家族用・出産準備＆子育てチェックリストPWAの開発計画策定

私はエンジニアで、妻と共有するための「妊活・出産・産後・子育て」を一貫してサポートするチェックリストWebアプリ（PWA）を個人開発します。
以下の条件に基づき、GitHubリポジトリの構成案と、リリースまでの開発ロードマップを提案してください。

### 1. 技術スタック
- フロントエンド: Next.js (App Router), TypeScript, Tailwind CSS
- UIライブラリ: shadcn/ui
- バックエンド/DB: Supabase (Auth, Database)
- ホスティング: Vercel
- 構成: PWA (Progressive Web App)

### 2. アプリの主要機能
- ライフステージ別チェックリスト（妊活、妊娠、産後、育児）
- パートナー（妻）とのリアルタイムデータ同期
- カテゴリ別の進捗可視化
- 重要な予定の管理（検診、予防接種など）
- 将来的な拡張性（教育資金シミュレーション、写真ログなど）

### 3. 出力してほしい内容

#### A. GitHubリポジトリ構成
- 推奨されるディレクトリ構造（Next.js 15+基準）
- 必要なIssueテンプレートの例（「新規チェックリスト追加」「バグ報告」など）

#### B. データベース設計（Supabase/PostgreSQL）
- 必要最小限のテーブル定義（Users, Checklists, Tasks, Profilesなど）
- RLS（行レベルセキュリティ）で「家族間のみ共有」を実現するポリシー案

#### C. 開発ロードマップ（フェーズ分け）
- Phase 1: MVP（最小機能。ログインと基本チェックリスト）
- Phase 2: 家族共有・同期機能の実装
- Phase 3: PWA化・通知機能・カレンダー連携
- Phase 4: UIのブラッシュアップと追加機能

#### D. 最初の「Create Next App」後に実行すべき具体的なセットアップ手順
