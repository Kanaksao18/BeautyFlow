"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { User, Mail, Lock, Phone, Loader2, Sparkles } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
  role: z.enum(["CUSTOMER", "ARTIST"], {
    required_error: "Role selection is required",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/api/v1/auth/register", data);
      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
      <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">
          Create account
        </h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          Join the SaaS network connecting clients with beauty experts
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role selector tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              I want to join as a
            </label>
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setValue("role", "CUSTOMER")}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedRole === "CUSTOMER"
                    ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "ARTIST")}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedRole === "ARTIST"
                    ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Beauty Artist
              </button>
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                First Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="John"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="john.doe@example.com"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Phone className="h-4 w-4" />
              </span>
              <input
                {...register("phoneNumber")}
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
              />
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
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
