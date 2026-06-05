"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup and redirect to the form
    router.push('/form-1901');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bir-blue)] text-white flex flex-col justify-center items-center relative p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden my-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-bir-red)] via-[var(--color-bir-yellow)] to-[var(--color-bir-blue)]"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400">Start your digital Form 1901 registration</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="name">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <User size={20} />
              </div>
              <input 
                id="name"
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-bir-yellow)] focus:border-transparent transition-all"
                placeholder="Juan Dela Cruz"
                required
              />
            </div>
          </div>

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
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="confirm_password">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={20} />
              </div>
              <input 
                id="confirm_password"
                type="password" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-bir-yellow)] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[var(--color-bir-yellow)] text-[var(--color-bir-blue)] font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg mt-2"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-bir-yellow)] font-semibold hover:underline">
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
