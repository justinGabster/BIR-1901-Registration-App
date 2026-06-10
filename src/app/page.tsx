'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-primary)] selection:text-black relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img 
          src="/office-bg.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)]/80 via-[var(--color-background)]/70 to-[var(--color-background)]/90"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-accent-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent-secondary)]/3 rounded-full blur-3xl"></div>
      </div>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between sm:max-w-2xl">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/bir-logo.png" alt="BIR" className="w-9 h-9 object-contain" />
            <div className="flex flex-col leading-tight -space-y-0.5">
              <span className="text-xs text-[var(--color-text-secondary)]">Bureau of</span>
              <span className="text-sm sm:text-lg text-[var(--color-accent-primary)] font-bold">Internal Revenue</span>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="hidden sm:block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-[var(--color-accent-primary)] text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile First */}
      <main className="pt-16 pb-20">
        <div className="max-w-md mx-auto px-6 sm:max-w-2xl sm:px-8 lg:max-w-4xl">
          {/* Hero Content */}
          <section className="space-y-8 py-8 sm:py-12">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                <span className="text-[var(--color-accent-primary)]">Register your</span> business
                <br />
                <span className="text-[var(--color-accent-primary)]">instantly online</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                Complete your <span className="text-[var(--color-accent-primary)] font-semibold">BIR Form 1901</span> registration in minutes. <span className="text-[var(--color-accent-primary)]">No paperwork. No queues.</span> Just digital efficiency.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row pt-4">
              <Link href="/signup" className="flex items-center justify-center gap-2 bg-[var(--color-accent-primary)] text-black font-bold py-3.5 px-8 rounded-lg hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/20">
                Start Registration <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-2 border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold py-3.5 px-8 rounded-lg hover:bg-[var(--color-surface-light)] active:scale-95 transition-all">
                Continue Draft
              </Link>
            </div>
          </section>

          {/* Features Grid - Modern Cards */}
          <section className="space-y-4 py-12 border-t border-[var(--color-border)]">
            <h2 className="text-2xl font-bold">Why choose BIR Form 1901?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Zap, title: 'Lightning Fast', desc: 'Process completed in minutes' },
                { icon: Lock, title: 'Secure & Safe', desc: 'Bank-level encryption' },
                { icon: CheckCircle2, title: 'Official Status', desc: 'Direct BIR submission' },
                { icon: ArrowRight, title: 'Simple Process', desc: '7 easy steps to complete' },
              ].map((feature, i) => (
                <div key={i} className="p-4 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent-primary)]/50 transition-all group">
                  <div className="flex items-start gap-3">
                    <feature.icon className="w-5 h-5 text-[var(--color-accent-primary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{feature.title}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="grid gap-6 py-12 sm:grid-cols-3 border-t border-[var(--color-border)]">
            {[
              { stat: '50K+', label: 'Registered businesses' },
              { stat: '99.9%', label: 'Approval rate' },
              { stat: '< 2min', label: 'Average time' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-[var(--color-accent-primary)]">{item.stat}</div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">{item.label}</p>
              </div>
            ))}
      </section>
    </div>
  </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--color-surface)]/80 backdrop-blur-lg border-t border-[var(--color-border)] px-6 py-3 z-40">
        <Link href="/login" className="block text-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          Already registered? Log in
        </Link>
      </div>
    </div>
  );
}
