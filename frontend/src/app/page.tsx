import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, CreditCard, Star, Scissors, UserCheck, MessageSquare, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
              BeautyFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-rose-500/15"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center space-y-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-rose-400 font-semibold mb-2 animate-fade-in shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Now in beta version 1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none text-white">
          Empowering Beauty Artists.{" "}
          <span className="bg-gradient-to-r from-rose-400 via-violet-400 to-rose-400 bg-clip-text text-transparent block mt-2">
            Elevating Client Experiences.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          BeautyFlow is the complete SaaS solution for scheduling, client retention, wallets, reviews, and portfolio management powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 text-center"
          >
            Create Your Account
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 text-center"
          >
            Manage Bookings
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <section className="pt-20 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Full Business Suite Built for SaaS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "Calendar Engine",
                desc: "Customizable, real-time availability slots that avoid double bookings automatically.",
                icon: Calendar,
                color: "rose",
              },
              {
                title: "Wallet & Payments",
                desc: "Split commissions, instant refunds, advance payments, and integrated wallet cards.",
                icon: CreditCard,
                color: "violet",
              },
              {
                title: "Verified Reviews",
                desc: "Ensure reviews can only be submitted by verified customers after appointments.",
                icon: Star,
                color: "amber",
              },
              {
                title: "AI Recs (Coming Soon)",
                desc: "Generate Instagram captions and upload selfies to analyze faces and shapes.",
                icon: Scissors,
                color: "emerald",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all hover:bg-slate-900/60"
              >
                <div className={`p-3 w-fit rounded-2xl mb-4 bg-${feature.color}-500/10 border border-${feature.color}-500/20 text-${feature.color}-400`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust elements */}
        <footer className="pt-16 border-t border-slate-900/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 BeautyFlow SaaS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-300">Support</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
