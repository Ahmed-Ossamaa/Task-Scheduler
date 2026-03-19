'use client';

import { Navbar } from '@/components/layout/navbar';
import {
  MARQUEE_ITEMS,
  STATS,
  FEATURES,
  TASKS,
  DONE_TASKS,
} from '@/constants/landing-constatnts';
import { AccentDot, BtnGhost, BtnPrimary } from '@/components/ui/landing-ui';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* NAV  */}
      <Navbar />

      <main className="pt-16">
        {' '}
        {/*  Hero section */}
        <section className="max-w-300uto px-6 md:px-12 pt-24 pb-20 border-b border-border">
          {/* tag */}
          <div className="inline-flex items-center gap-2 mb-10 bg-primary/10 px-3.5 py-1.5 rounded-sm">
            <AccentDot />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              Project Management, Reimagined
            </span>
          </div>

          {/* headline */}
          <h1 className="text-5xl md:text-[clamp(52px,8vw,108px)] leading-[0.92] tracking-tighter text-foreground max-w-205 mb-12">
            Work smarter.
            <br />
            Ship <em className="not-italic text-primary">faster.</em>
            <br />
            Together.
          </h1>

          {/* bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end border-t border-border pt-10">
            <p className="text-[15px] leading-[1.8] text-muted-foreground max-w-95">
              The focused way to plan projects, track tasks, and hit deadlines.
              Built for teams who want to get things done — not manage their
              tools.
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end items-center">
              <BtnGhost href="/login">Log in</BtnGhost>
              <BtnPrimary href="/register">Get Started Free →</BtnPrimary>
            </div>
          </div>
        </section>
        {/*  Marquee  */}
        <div className="overflow-hidden border-b border-border bg-muted/30 py-3">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground px-9 inline-flex items-center gap-2.5"
              >
                <AccentDot />
                {item}
              </span>
            ))}
          </div>
        </div>
        {/* STATS  */}
        <div className="border-b border-border">
          <div className="max-w-300 mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`py-12 border-b md:border-b-0 border-border ${i < STATS.length - 1 ? 'md:border-r' : ''} ${i !== 0 ? 'md:pl-12' : ''}`}
              >
                <div className="text-5xl md:text-6xl text-foreground leading-none mb-2 tracking-tighter">
                  {stat.num.replace(/[k+×%]/g, '')}
                  <span className="text-primary">
                    {stat.num.match(/[k+×%]+/)?.[0] ?? ''}
                  </span>
                </div>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* FEATURES  */}
        <div className=" mx-auto px-6 md:px-12">
          {/* header */}
          <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between py-14 pb-10 border-b border-border gap-4">
            <h2 className="text-3xl md:text-4xl text-foreground tracking-tight">
              Everything your team needs.
            </h2>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              3 Core Pillars
            </span>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`p-10 pb-12 border-b md:border-b-0 border-border group ${i < FEATURES.length - 1 ? 'md:border-r' : ''}`}
              >
                <div className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground mb-8">
                  {f.num}
                </div>
                <div className="w-11 h-11 border border-border flex items-center justify-center mb-6 bg-background rounded-sm transition-colors group-hover:border-primary/50">
                  {f.icon}
                </div>
                <h3 className="text-2xl text-foreground leading-[1.2] tracking-tight mb-3">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-[1.8] text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* TASK PREVIEW (its just mock , maybe i'll change it later) */}
        <div className="border-b border-border bg-muted/20 py-16">
          <div className="max-w-300 mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
            {/* left copy */}
            <div className="md:col-span-1">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-5">
                Live Preview
              </div>
              <h2 className="text-3xl md:text-4xl text-foreground leading-[1.1] tracking-tight">
                Your team&apos;s work,
                <br />
                at a glance.
              </h2>
              <p className="text-[13px] text-muted-foreground leading-[1.8] mt-4">
                Every task, every deadline, every status — without a single
                status meeting.
              </p>
            </div>

            {/* right board */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground pb-2.5 border-b border-border mb-1">
                In Progress — {TASKS.length} tasks
              </div>

              {TASKS.map((t, i) => (
                <div
                  key={i}
                  className={`bg-card border border-border px-4 py-3.5 flex items-center justify-between rounded-sm border-l-[3px] transition-colors hover:border-primary/30 ${t.status === 'active' ? 'border-l-primary' : t.status === 'late' ? 'border-l-destructive' : 'border-l-transparent'}`}
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground mb-1">
                      {t.cat}
                    </div>
                    <div className="text-[15px] text-foreground leading-[1.3] font-medium tracking-tight">
                      {t.name}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div
                      className={`text-[10px] font-bold ${t.status === 'active' ? 'text-primary' : t.status === 'late' ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {t.due}
                    </div>
                    <div
                      className={`w-1.75h-[7px] rounded-full ${t.status === 'active' ? 'bg-primary' : t.status === 'late' ? 'bg-destructive' : 'bg-muted-foreground'}`}
                    />
                  </div>
                </div>
              ))}

              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground pt-4 pb-2.5 border-b border-border mb-1 mt-2">
                Completed this week — 12 tasks
              </div>

              {DONE_TASKS.map((t, i) => (
                <div
                  key={i}
                  className="bg-card border border-border border-l-transparent border-l-[3px] px-4 py-3.5 flex items-center justify-between rounded-sm opacity-50"
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground mb-1">
                      {t.cat}
                    </div>
                    <div className="text-[15px] text-foreground leading-[1.3] font-medium tracking-tight line-through decoration-muted-foreground/30">
                      {t.name}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">
                    {t.due}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/*CTA 2 */}
        <div className="max-w-300 mx-auto px-6 md:px-12 py-20 md:py-24 border-b border-border flex flex-col md:flex-row items-center justify-between gap-12">
          <h2 className="text-4xl md:text-[clamp(36px,5vw,64px)] leading-none text-foreground tracking-tighter text-center md:text-left">
            Ready to finally
            <br className="hidden md:block" />
            ship on <em className="not-italic text-primary">time?</em>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <BtnGhost href="/login">Log in</BtnGhost>
            <BtnPrimary href="/register">
              Start Free — No Card Needed →
            </BtnPrimary>
          </div>
        </div>
      </main>
    </div>
  );
}
