"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, loadAuthFromStorage } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/v1/auth/login", data);
      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(errMsg);

      // If account is registered but pending email verification
      if (errMsg.includes("verify your email")) {
        setTimeout(() => {
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent">
          BeautyFlow
        </span>
      </div>

      {/* Glassmorphic Form Card */}
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">
          Welcome back
        </h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          Enter your credentials to manage your bookings
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <Link
                href="/auth/forgot"
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="h-5 w-5" />
              </span>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
