"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Mail, Phone, KeyRound, Loader2, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [successRedirect, setSuccessRedirect] = useState(false);

  useEffect(() => {
    if (emailVerified && phoneVerified) {
      setSuccessRedirect(true);
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [emailVerified, phoneVerified, router]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length !== 6) {
      setEmailError("OTP must be 6 digits");
      return;
    }
    setEmailLoading(true);
    setEmailError(null);
    try {
      await api.post("/api/v1/auth/verify-email", {
        email: emailParam,
        otp: emailOtp,
      });
      setEmailVerified(true);
    } catch (err: any) {
      setEmailError(err.response?.data?.message || "Invalid or expired Email OTP");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length !== 6) {
      setPhoneError("OTP must be 6 digits");
      return;
    }
    setPhoneLoading(true);
    setPhoneError(null);
    try {
      await api.post("/api/v1/auth/verify-phone", {
        email: emailParam,
        otp: phoneOtp,
      });
      setPhoneVerified(true);
    } catch (err: any) {
      setPhoneError(err.response?.data?.message || "Invalid or expired Phone OTP");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Verify your account
        </h2>
        <p className="text-slate-400 text-sm">
          Please verify both your email and phone number to activate your account.
        </p>
      </div>

      {successRedirect && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-3 items-center animate-pulse">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <div>
            <h4 className="font-bold">Verification complete!</h4>
            <p className="text-xs text-emerald-500/80">Redirecting to login dashboard...</p>
          </div>
        </div>
      )}

      {/* Verification channels */}
      <div className="space-y-6">
        
        {/* 1. Email OTP Block */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Mail className="h-4 w-4 text-rose-500" />
              1. Email Verification
            </span>
            {emailVerified ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-xs text-rose-400 font-medium">Pending code</span>
            )}
          </div>

          {!emailVerified && (
            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <p className="text-xs text-slate-500">
                OTP sent to <span className="text-slate-300 font-semibold">{emailParam}</span>
              </p>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Email Code"
                  maxLength={6}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none text-sm tracking-wider font-semibold focus:border-rose-500/50 transition-all"
                />
              </div>

              {emailError && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {emailError}
                </p>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-2 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
              >
                {emailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
              </button>
            </form>
          )}
        </div>

        {/* 2. Phone OTP Block */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Phone className="h-4 w-4 text-violet-500" />
              2. Phone SMS Verification
            </span>
            {phoneVerified ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-xs text-violet-400 font-medium">Pending code</span>
            )}
          </div>

          {!phoneVerified && (
            <form onSubmit={handleVerifyPhone} className="space-y-3">
              <p className="text-xs text-slate-500">
                OTP sent to your registered mobile number via Twilio SMS
              </p>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="SMS Code"
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none text-sm tracking-wider font-semibold focus:border-violet-500/50 transition-all"
                />
              </div>

              {phoneError && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {phoneError}
                </p>
              )}

              <button
                type="submit"
                disabled={phoneLoading}
                className="w-full py-2 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
              >
                {phoneLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Phone SMS"}
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="text-center text-sm text-slate-400">
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
