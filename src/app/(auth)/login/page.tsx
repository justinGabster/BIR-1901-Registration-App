"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to the form
    router.push('/form-1901');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bir-blue)] text-white flex flex-col justify-center items-center relative p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-bir-yellow)] via-[var(--color-bir-red)] to-[var(--color-bir-blue)]"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-bir-yellow)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(253,185,19,0.5)]">
            <span className="text-[var(--color-bir-blue)] font-extrabold text-3xl">B</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400">Log in to continue your Form 1901 draft</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={20} />
              </div>
              <input 
                id="email"
                type="email" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-bir-yellow)] focus:border-transparent transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
              <a href="#" className="text-sm text-[var(--color-bir-yellow)] hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={20} />
              </div>
              <input 
                id="password"
                type="password" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-bir-yellow)] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[var(--color-bir-yellow)] text-[var(--color-bir-blue)] font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Log In
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[var(--color-bir-yellow)] font-semibold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-bir-blue)] opacity-50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-bir-red)] opacity-10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
