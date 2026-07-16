"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LogOut, User as UserIcon, Calendar, Wallet, Heart, Star, Sparkles, Sliders } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadAuthFromStorage, clearAuth } =
    useAuthStore();

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 animate-spin flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-slate-400 text-sm animate-pulse">Loading secure space...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Nav */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
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
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-medium">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full p-2 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Callout Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-850 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[80px] pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hello, {user.firstName}!
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Welcome to your personal dashboard. Connect, discover and manage bookings.
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-500/10 relative z-10">
            Find Artists
          </button>
        </section>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                <UserIcon className="h-6 w-6" />
              </div>
              <span className="text-xs text-slate-500">Profile Details</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <p className="text-slate-500 text-xs mt-4">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bookings Summary Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-xs text-slate-500">Appointments</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">No upcoming bookings</h3>
              <p className="text-slate-400 text-sm">
                Schedule a session with your favorite artist.
              </p>
              <p className="text-xs text-violet-400 font-semibold mt-4 hover:underline cursor-pointer">
                View booking history
              </p>
            </div>
          </div>

          {/* Wallet Summary Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="text-xs text-slate-500">Balance</span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-1">₹0.00</h3>
              <p className="text-slate-400 text-sm">Your digital wallet is active</p>
              <p className="text-xs text-amber-400 font-semibold mt-4 hover:underline cursor-pointer">
                Top up wallet
              </p>
            </div>
          </div>
        </div>

        {/* Categories / Discover Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-rose-500" />
            Popular Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Hair Styling", count: "12 Artists", icon: Star },
              { name: "Bridal Makeup", count: "8 Artists", icon: Heart },
              { name: "Skin Care", count: "5 Specialists", icon: Sparkles },
              { name: "Nail Styling", count: "14 Artists", icon: Star },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/20 border border-slate-900/60 hover:border-slate-800/80 rounded-2xl p-5 hover:bg-slate-900/40 transition-all text-center cursor-pointer group"
              >
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-rose-400 transition-colors mb-3">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
                  {cat.name}
                </h4>
                <span className="text-xs text-slate-500">{cat.count}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
