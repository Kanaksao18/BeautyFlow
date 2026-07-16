"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { ShieldAlert, KeyRound, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/api/v1/auth/verify-email", data);
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">
        Verify your email
      </h2>
      <p className="text-slate-400 text-sm text-center mb-8">
        We have logged a 6-digit OTP code to the backend console. Enter it below to activate your account.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-2 items-center">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Account activated! Redirecting to login...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email field (disabled input but bound to form) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Email Address
          </label>
          <input
            type="email"
            value={emailParam}
            disabled
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-400 outline-none cursor-not-allowed text-sm"
          />
        </div>

        {/* OTP field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Verification OTP
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <KeyRound className="h-5 w-5" />
            </span>
            <input
              {...register("otp")}
              type="text"
              placeholder="123456"
              maxLength={6}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none tracking-widest font-bold text-center focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-lg"
            />
          </div>
          {errors.otp && (
            <p className="text-xs text-rose-400 mt-1">{errors.otp.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg shadow-rose-500/10"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Verify & Activate"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Back to{" "}
        <Link
          href="/auth/login"
          className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
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

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
