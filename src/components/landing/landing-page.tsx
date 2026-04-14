'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Users,
  CalendarDays,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/* ─────────────────────────── data ─────────────────────────── */

const STAGES = [
  { emoji: '🌱', label: '妊活', desc: '基礎体温・葉酸サプリ・検査スケジュールなど' },
  { emoji: '🤰', label: '妊娠', desc: '母子手帳・出産準備品・両親学級・届出関連' },
  { emoji: '👶', label: '産後', desc: '出生届・児童手当・産後ケア・予防接種' },
  { emoji: '🍼', label: '育児', desc: '離乳食・保育園・健診・成長の記録' },
];

const FEATURES = [
  {
    icon: CheckCircle2,
    title: '80+のエビデンス付きチェックリスト',
    desc: '厚労省の情報をベースに、各タスクに具体的なtipsと根拠を収録。やるべきことを網羅。',
  },
  {
    icon: Users,
    title: '夫婦でリアルタイム共有',
    desc: '招待リンクひとつでパートナーと連携。誰が何を完了したかひと目でわかる。',
  },
  {
    icon: CalendarDays,
    title: '出産予定日から自動スケジュール',
    desc: '予定日を設定するだけで、各タスクの推奨時期を自動計算。期限が近いものから表示。',
  },
  {
    icon: Shield,
    title: 'プライベート＆安全',
    desc: '家族だけのプライベート空間。データは暗号化され、第三者には一切共有されません。',
  },
];

const STEPS = [
  { num: '1', title: 'アカウント作成', desc: 'メールまたはGoogleで30秒で登録' },
  { num: '2', title: 'ステージ選択', desc: '今の状況に合ったチェックリストが自動生成' },
  { num: '3', title: 'パートナー招待', desc: '招待リンクを送るだけで夫婦の共有スタート' },
];

const TESTIMONIALS = [
  {
    text: '出産準備で何をすればいいか分からなかったけど、リストがあるだけで安心感が全然違う。夫も自分のスマホで確認してくれるようになった。',
    author: 'A.K.さん',
    detail: '妊娠8ヶ月',
  },
  {
    text: '妊活中から使い始めて、今は産後ステージ。アプリを乗り換えなくていいのが本当にラク。',
    author: 'M.T.さん',
    detail: '産後3ヶ月',
  },
  {
    text: '児童手当の申請期限をうっかり忘れそうだったけど、スケジュール機能で助かった。',
    author: 'R.S.さん',
    detail: '育児中（第一子）',
  },
];

/* ─────────────────────────── component ────────────────────── */

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14" aria-label="メインナビゲーション">
          <span className="text-lg font-bold tracking-tight" aria-label="Sprout">🌱 Sprout</span>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">ログイン</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                <Sparkles className="size-3.5" />
                無料で始める
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main>
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, var(--theme-gradient-from), var(--theme-gradient-via), var(--theme-gradient-to))',
        }}
      >
        <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28 text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            妊活〜育児まで、夫婦の準備をひとつに
          </div>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            ふたりで育てる、
            <br />
            <span className="text-primary">新しい命の準備</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            出産準備で「何をすればいいか分からない」をゼロに。
            <br className="hidden sm:block" />
            80以上のチェックリストを夫婦で共有・管理できる無料アプリ。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="text-base px-6 h-11">
                無料で始める
                <ChevronRight className="size-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-base px-6 h-11">
                機能を見る
              </Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            登録無料 ・ クレジットカード不要 ・ PWA対応
          </p>
        </div>
      </section>

      {/* ── Stages ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            ライフステージに寄り添う4つのフェーズ
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            妊活から育児まで、ステージが変わってもアプリはそのまま。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAGES.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-5 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="mt-2 font-bold text-lg">{s.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 sm:py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            Sproutの主な機能
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            必要な情報を、必要なタイミングで、ふたりに届ける。
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 flex gap-4"
              >
                <div className="flex-shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <f.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-10">
            かんたん3ステップ
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {STEPS.map((s) => (
              <div key={s.num} className="flex-1 text-center">
                <div className="mx-auto size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {s.num}
                </div>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-10">
            ユーザーの声
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm text-foreground leading-relaxed">
                  「{t.text}」
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 sm:py-20 px-4"
        style={{
          background: 'linear-gradient(to top, var(--theme-gradient-from), var(--theme-gradient-via))',
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            今日から、ふたりの準備を始めよう
          </h2>
          <p className="mt-3 text-muted-foreground">
            登録は30秒。すぐにチェックリストが使えます。
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 h-12">
                無料アカウントを作成
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Sprout. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              ログイン
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              新規登録
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
