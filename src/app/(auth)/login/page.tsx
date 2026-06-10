"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/form-1901');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/bir-logo.png" alt="BIR" className="w-9 h-9 object-contain" />
            <div className="flex flex-col leading-tight -space-y-0.5">
              <span className="text-xs text-[var(--color-text-secondary)]">Bureau of</span>
              <span className="text-sm sm:text-lg text-[var(--color-accent-primary)] font-bold">Internal Revenue</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col min-h-screen pt-16 pb-20">
        <div className="max-w-md mx-auto w-full px-6 flex-1 flex flex-col justify-center">
          {/* Form Card */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-[var(--color-accent-primary)]">Welcome back</h1>
              <p className="text-[var(--color-text-secondary)]">Log in to your <span className="text-[var(--color-accent-primary)] font-semibold">registration account</span></p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-[var(--color-accent-primary)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--color-accent-primary)] text-black font-bold py-3.5 rounded-lg hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/20 mt-6"
              >
                Log in
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[var(--color-background)] text-[var(--color-text-secondary)]">or</span>
              </div>
            </div>

            {/* Sign up Link */}
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[var(--color-accent-primary)] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <Link href="/" className="fixed top-4 left-6 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors sm:hidden">
        <ArrowLeft size={20} />
      </Link>
    </div>
  );
}
