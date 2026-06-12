"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/form-1901');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2b4c8a] via-[#0a0f1c] to-[#05080f]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/bir-logo.png" alt="BIR" className="w-9 h-9 object-contain" />
            <div className="flex flex-col leading-tight -space-y-0.5">
              <span className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">Bureau of</span>
              <span className="text-xs sm:text-lg text-[var(--color-accent-primary)] font-bold">Internal Revenue</span>
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
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-accent-primary)]">Create account</h1>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">Get started with your <span className="text-[var(--color-accent-primary)] font-semibold">business registration</span></p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-sm sm:text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-sm sm:text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-sm sm:text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirm_password" className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)] pointer-events-none" />
                  <input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-lg text-sm sm:text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 focus:border-[var(--color-accent-primary)] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--color-accent-primary)] text-black font-bold py-2.5 sm:py-3.5 rounded-lg text-sm sm:text-base hover:bg-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/20 mt-4 sm:mt-6"
              >
                Create account
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

            {/* Login Link */}
            <p className="text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--color-accent-primary)] font-semibold hover:underline">
                Log in
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
