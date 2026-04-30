'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import {
  CheckCircle2,
  Users,
  CalendarDays,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

/* ─────────────────────────── component ────────────────────── */

export function LandingPage() {
  const { t, locale, setLocale } = useTranslation();
  const router = useRouter();

  function changeLocale(nextLocale: Locale) {
    if (locale === nextLocale) return;
    setLocale(nextLocale);
    router.refresh();
  }

  const STAGES = [
    { emoji: '🌱', label: t('stage.prenatal_care'), desc: t('lp.stage1Desc') },
    { emoji: '🤰', label: t('stage.pregnancy'), desc: t('lp.stage2Desc') },
    { emoji: '👶', label: t('stage.postpartum'), desc: t('lp.stage3Desc') },
    { emoji: '🍼', label: t('stage.childcare'), desc: t('lp.stage4Desc') },
  ];

  const FEATURES = [
    { icon: CheckCircle2, title: t('lp.feature1Title'), desc: t('lp.feature1Desc') },
    { icon: Users, title: t('lp.feature2Title'), desc: t('lp.feature2Desc') },
    { icon: CalendarDays, title: t('lp.feature3Title'), desc: t('lp.feature3Desc') },
    { icon: Shield, title: t('lp.feature4Title'), desc: t('lp.feature4Desc') },
  ];

  const STEPS = [
    { num: '1', title: t('lp.step1Title'), desc: t('lp.step1Desc') },
    { num: '2', title: t('lp.step2Title'), desc: t('lp.step2Desc') },
    { num: '3', title: t('lp.step3Title'), desc: t('lp.step3Desc') },
  ];

  const TESTIMONIALS = [
    { text: t('lp.testimonial1'), author: t('lp.testimonial1Author'), detail: t('lp.testimonial1Detail') },
    { text: t('lp.testimonial2'), author: t('lp.testimonial2Author'), detail: t('lp.testimonial2Detail') },
    { text: t('lp.testimonial3'), author: t('lp.testimonial3Author'), detail: t('lp.testimonial3Detail') },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <nav className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14" aria-label={t('lp.mainNav')}>
          <Link href="/" className="text-lg font-bold tracking-tight" aria-label="Sprout home">🌱 Sprout</Link>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border/60 bg-background/60 p-0.5">
              <button
                type="button"
                onClick={() => changeLocale('ja')}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  locale === 'ja' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('lp.langJa')}
              </button>
              <button
                type="button"
                onClick={() => changeLocale('zh')}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  locale === 'zh' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('lp.langZh')}
              </button>
              <button
                type="button"
                onClick={() => changeLocale('en')}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  locale === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('lp.langEn')}
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {t('lp.login')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className={buttonVariants({ size: 'sm' })}
            >
              <Sparkles className="size-3.5" />
              {t('lp.startFree')}
            </button>
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
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-28 text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            {t('lp.badge')}
          </div>
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {t('lp.heroTitle1')}
            <br />
            <span className="text-primary">{t('lp.heroTitle2')}</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('lp.heroDesc')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className={buttonVariants({ size: 'lg', className: 'text-base px-6 h-11' })}>
                {t('lp.startFree')}
                <ChevronRight className="size-4" />
            </Link>
            <a href="#features" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'text-base px-6 h-11' })}>
              {t('lp.viewFeatures')}
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t('lp.freeNote')}
          </p>
        </div>
      </section>

      {/* ── Stages ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-3">
            {t('lp.stagesTitle')}
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            {t('lp.stagesDesc')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {STAGES.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-3 sm:p-5 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="mt-2 font-bold text-base sm:text-lg">{s.label}</h3>
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
            {t('lp.featuresTitle')}
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            {t('lp.featuresDesc')}
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
            {t('lp.stepsTitle')}
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
            {t('lp.testimonialsTitle')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-xl border border-border bg-card p-3 sm:p-5"
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
            {t('lp.ctaTitle')}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t('lp.ctaDesc')}
          </p>
          <div className="mt-8">
            <Link href="/signup" className={buttonVariants({ size: 'lg', className: 'text-base px-8 h-12' })}>
                {t('lp.ctaButton')}
                <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Sprout. All rights reserved.</span>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/terms" className="hover:text-foreground transition-colors py-2">
              {t('lp.terms')}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors py-2">
              {t('lp.privacy')}
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors py-2">
              {t('lp.login')}
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors py-2">
              {t('lp.signup')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
