import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bir-blue)] text-white font-sans selection:bg-[var(--color-bir-yellow)] selection:text-[var(--color-bir-blue)]">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-bir-yellow)] rounded-full flex items-center justify-center">
            <span className="text-[var(--color-bir-blue)] font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Bureau of Internal Revenue</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Log in</Link>
          <Link href="/signup" className="bg-[var(--color-bir-yellow)] text-[var(--color-bir-blue)] px-5 py-2.5 rounded-full font-semibold hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(253,185,19,0.4)]">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[var(--color-bir-yellow)] animate-pulse"></span>
            <span className="text-sm font-medium text-gray-200">Modernized Digital Form</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Register your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-bir-yellow)] to-yellow-200">
              Business
            </span>
            <br/> with ease.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
            Experience the new, streamlined BIR Form 1901. Apply for registration of self-employed and mixed income individuals, estates, and trusts digitally.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-[var(--color-bir-yellow)] text-[var(--color-bir-blue)] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(253,185,19,0.3)]">
              Start Application <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
              Continue Draft
            </Link>
          </div>
        </div>
        
        {/* Decorative Graphic */}
        <div className="md:w-1/2 mt-16 md:mt-0 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--color-bir-blue)] via-[var(--color-bir-red)]/20 to-[var(--color-bir-yellow)]/20 blur-[100px] -z-10 rounded-full"></div>
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bir-red)]/20 flex items-center justify-center text-[var(--color-bir-red)]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Form 1901</h3>
                  <p className="text-sm text-gray-400">Application for Registration</p>
                </div>
              </div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Secure & Encrypted', desc: 'Your data is protected by industry standards.' },
                { icon: CheckCircle, title: 'Fast Processing', desc: 'Automated verification speeds up your application.' },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <feature.icon className="text-[var(--color-bir-yellow)] mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-bir-red)] opacity-5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-bir-yellow)] opacity-5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
}
