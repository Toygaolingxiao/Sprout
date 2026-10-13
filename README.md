# Sprout

**Version:** 1.10.33

夫婦で、妊活から育児までの準備を共有するチェックリストアプリです。

Sprout 是给伴侣一起使用的备孕、怀孕、产后和育儿清单。任务按阶段整理，进度在家庭组里共享。

Sprout is a shared checklist for couples preparing for pregnancy, birth, and childcare. Partners join one family group and work through the same list.

线上应用：https://sprout-rose.vercel.app

## 能做什么

- 四个阶段：妊活、妊娠、产后、育儿，预设任务带有要点和注意事项
- 家庭邀请、加入和退出，进度互相可见
- 优先级、性别筛选、模板恢复、按阶段清理手动任务
- 日语、简体中文、英语
- Free / Pro 区分。Pro 可导出 CSV，并整理全部阶段的手动任务
- 免费方案在同意后展示广告。付费界面由 `BILLING_ENABLED` 控制，默认关闭
- 邮件、Google、LINE 登录，以及账号退出、删除、解除外部绑定
- 任务变动写入家庭动态。配置推送密钥后，伴侣完成任务会通知到这台设备
- 可安装的 PWA。离线时显示离线页，不缓存登录后的个人页面

## 技术

| 层 | 选择 |
|---|---|
| 应用 | Next.js 16、React 19、TypeScript |
| 界面 | Tailwind CSS v4、shadcn/ui |
| 数据与登录 | Supabase（PostgreSQL、Auth、Row Level Security） |
| 托管 | Vercel |

## 页面

```
/                 落地页
/dashboard        当前阶段的任务和家庭动态
/checklists       阶段列表
/checklists/:id   清单详情
/family           邀请、成员、退出
/settings         资料、语言、通知、账号
/terms            利用规约
/privacy          隐私政策
/tokusho          特定商取引法表示
```

## 文档

- [利用手册](docs/user-manual.md)
- [利用手册（简体中文）](docs/user-manual.zh-CN.md)
- [User Manual](docs/user-manual.en.md)
- [日中文对照](docs/i18n-reference.md)

## 本地运行

```bash
git clone https://github.com/Toygaolingxiao/Sprout.git
cd Sprout
npm install
```

复制 `.env.local.example` 为 `.env.local`，至少填入：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

其他变量按需填写，说明见 `.env.local.example`。

- `SEED_SECRET` 和 `SUPABASE_SERVICE_ROLE_KEY` 只给运维者用来重灌预设模板。普通登录用户不能改模板。
- `NEXT_PUBLIC_LIFF_ID` 不写进仓库。需要 LINE 登录时再配置。
- `SENTRY_DSN` 为空时不发送错误报告。
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`、`VAPID_PRIVATE_KEY` 为空时，设置页会说明推送尚未启用。
- `LEGAL_SELLER_NAME`、`LEGAL_ADDRESS`、`LEGAL_PHONE` 等是特定商取引法页面上的销售者信息。未填写时页面显示「未刊登」，不会写入虚构地址。
- `BILLING_ENABLED=1` 才打开付费操作。

在 Supabase SQL Editor 里按文件名顺序执行 `supabase/migrations/`。已有数据库只执行尚未应用的文件。不要在已有环境重跑 `001_initial_schema.sql`。

当前迁移到 `023_push_subscription_uniqueness.sql`。其中 `022` 去掉普通用户对全局模板的写入权限，`023` 让推送订阅可以按终端更新。

```bash
npm run dev
```

打开 http://localhost:3000 。

重灌预设模板：

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer $SEED_SECRET"
```

## 部署

把仓库连到 Vercel，并设置与 `.env.local` 相同的环境变量。`NEXT_PUBLIC_SITE_URL` 使用正式域名。

Supabase Authentication 的 Site URL 和 Redirect URLs 要包含正式域名，以及 `/auth/callback`。

LINE 登录需要在 LINE Developers 创建自己的 LIFF，把 Endpoint URL 指到正式站点，再把 LIFF ID 写入 `NEXT_PUBLIC_LIFF_ID`。`SUPABASE_LINE_PROVIDER` 与 Supabase 里的提供方名称一致，常见值是 `line`。

广告使用独立域名，并确认 `https://<正式域名>/ads.txt` 可以访问。

版本发布：

```bash
npm run release:auto -- --type patch --notes "項目1|項目2|項目3"
```

## 目录

```
src/app            页面与 API
src/components     界面
src/lib/actions    任务、家庭、账号
src/data/seed      阶段、分类、预设任务
supabase/migrations
public/sw.js       离线页与推送
e2e                Playwright
```

## 许可证

[MIT](LICENSE)
