"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import {
  LogOut,
  User as UserIcon,
  Calendar,
  Wallet,
  Heart,
  Star,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadAuthFromStorage, clearAuth } =
    useAuthStore();

  // Tabs for Artist View: 'overview' | 'profile' | 'portfolio'
  const [activeTab, setActiveTab] = useState("overview");

  // Artist Profile States
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  // Profile Edit Form States
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [startingPrice, setStartingPrice] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Portfolio Upload Form States
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load Artist Profile if role is ARTIST
  const fetchArtistProfile = async () => {
    if (!user || user.role !== "ARTIST") return;
    setFetchingProfile(true);
    try {
      const response = await api.get("/api/v1/artists/profile");
      const profile = response.data.data;
      setArtistProfile(profile);
      setBio(profile.bio || "");
      setSpecialty(profile.specialty || "");
      setStartingPrice(profile.startingPrice || 0);
      setExperienceYears(profile.experienceYears || 0);
      setAvatarUrl(profile.avatarUrl || "");
    } catch (err) {
      console.error("Failed to fetch artist profile", err);
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ARTIST") {
      fetchArtistProfile();
    }
  }, [user]);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  // Update Profile Submit
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    try {
      const response = await api.put("/api/v1/artists/profile", {
        bio,
        specialty,
        startingPrice,
        experienceYears,
        avatarUrl
      });
      setArtistProfile(response.data.data);
      setUpdateSuccess(true);
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Failed to update profile details");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Portfolio File Upload
  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a photo or video to upload");
      return;
    }
    
    // File size check: 20MB limit
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (uploadFile.size > MAX_FILE_SIZE) {
      setUploadError("File size exceeds premium limits (max 20MB allowed)");
      return;
    }

    if (!uploadTitle.trim()) {
      setUploadError("Please enter a title for your creation");
      return;
    }

    setUploadProgress(true);
    setUploadSuccess(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("description", uploadDesc);
    formData.append("file", uploadFile);

    try {
      const response = await api.post("/api/v1/artists/portfolio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setArtistProfile(response.data.data);
      setUploadSuccess(true);
      setUploadTitle("");
      setUploadDesc("");
      setUploadFile(null);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || "Failed to upload portfolio item");
    } finally {
      setUploadProgress(false);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolioItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      const response = await api.delete(`/api/v1/artists/portfolio/${itemId}`);
      setArtistProfile(response.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
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
              <span className="text-slate-300 font-medium">{user.role}</span>
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Callout Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-850 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[80px] pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-fade-in">
              Hello, {user.firstName}!
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Welcome to your personal dashboard. Connect, discover and manage your Beauty business.
            </p>
          </div>
          {user.role !== "ARTIST" ? (
            <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-500/10 relative z-10">
              Find Artists
            </button>
          ) : (
            <div className="flex gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-850 z-10">
              {["overview", "profile", "portfolio"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-tr from-rose-500 to-violet-600 text-white shadow-md shadow-rose-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* CUSTOMER / GENERIC DASHBOARD */}
        {user.role !== "ARTIST" && (
          <div className="space-y-8">
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
                  { name: "Nail Styling", count: "14 Artists", icon: Star }
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
          </div>
        )}

        {/* ARTIST DEDICATED DASHBOARD PANELS */}
        {user.role === "ARTIST" && (
          <div className="space-y-8">
            {fetchingProfile ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/60 transition-all p-6 rounded-3xl space-y-4 shadow-lg shadow-black/30">
                        <div className="text-rose-400 text-xs uppercase tracking-wider font-semibold">Specialty</div>
                        <h3 className="text-xl font-bold text-slate-100">{artistProfile?.specialty || "Not configured"}</h3>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/60 transition-all p-6 rounded-3xl space-y-4 shadow-lg shadow-black/30">
                        <div className="text-violet-400 text-xs uppercase tracking-wider font-semibold">Starting Price</div>
                        <h3 className="text-xl font-bold text-slate-100">₹{artistProfile?.startingPrice || "0.00"}</h3>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/60 transition-all p-6 rounded-3xl space-y-4 shadow-lg shadow-black/30">
                        <div className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Experience</div>
                        <h3 className="text-xl font-bold text-slate-100">{artistProfile?.experienceYears || "0"} Years</h3>
                      </div>
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700/60 transition-all p-6 rounded-3xl space-y-4 shadow-lg shadow-black/30">
                        <div className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">Rating</div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                          <h3 className="text-xl font-bold text-slate-100">{artistProfile?.rating || "5.0"}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl space-y-4 shadow-lg shadow-black/20">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-rose-500" />
                        Professional Bio
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                        {artistProfile?.bio || "No professional biography has been written yet. Navigate to 'Profile' to configure your business bio!"}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: PROFILE EDITOR */}
                {activeTab === "profile" && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl max-w-2xl mx-auto space-y-6 animate-fade-in shadow-xl shadow-black/30">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Edit Professional Profile</h3>
                      <p className="text-slate-400 text-xs">Update your professional specialty, pricing, biography, and stats.</p>
                    </div>

                    {updateSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Profile details updated successfully!
                      </div>
                    )}
                    {updateError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {updateError}
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Specialty</label>
                          <input
                            type="text"
                            placeholder="e.g. Makeup Artist"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Starting Rate (INR)</label>
                          <input
                            type="number"
                            min="0"
                            value={startingPrice}
                            onChange={(e) => setStartingPrice(Number(e.target.value))}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Experience</label>
                          <select
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all cursor-pointer"
                          >
                            <option value={0} className="bg-slate-950 text-slate-400">Select Experience...</option>
                            {[...Array(20)].map((_, i) => (
                              <option key={i+1} value={i+1} className="bg-slate-950 text-slate-100">{i+1} {i+1 === 1 ? "Year" : "Years"}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Avatar Photo URL</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Professional Biography</label>
                          <span className={`text-[10px] font-bold ${bio.length >= 450 ? "text-amber-500 animate-pulse" : "text-slate-500"}`}>
                            {bio.length}/500 characters
                          </span>
                        </div>
                        <textarea
                          placeholder="Tell potential clients about your experience, certifications, and artistic approach..."
                          rows={4}
                          maxLength={500}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="w-full py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1 shadow-md shadow-rose-500/10"
                      >
                        {updatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 3: PORTFOLIO MANAGER */}
                {activeTab === "portfolio" && (
                  <div className="space-y-10 animate-fade-in">
                    
                    {/* Add Portfolio Media Panel */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl max-w-2xl mx-auto space-y-6 shadow-xl shadow-black/30">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Add Portfolio Media</h3>
                        <p className="text-slate-400 text-xs">Upload images or videos of your client creations.</p>
                      </div>

                      {uploadSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Portfolio item successfully uploaded and added to database!
                        </div>
                      )}
                      {uploadError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {uploadError}
                        </div>
                      )}

                      <form onSubmit={handlePortfolioUpload} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Creation Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Elegant Bridal Makeup Session"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Description</label>
                          <textarea
                            placeholder="Explain the styles, brands, or techniques used in this look..."
                            rows={3}
                            value={uploadDesc}
                            onChange={(e) => setUploadDesc(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 outline-none text-sm focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/20 transition-all resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Select Media File</label>
                          <div className="border border-dashed border-slate-800 hover:border-rose-500/40 rounded-2xl bg-slate-950/60 p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative group">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setUploadFile(e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <UploadCloud className="h-8 w-8 text-slate-500 group-hover:text-rose-500/70 transition-colors" />
                            {uploadFile ? (
                              <span className="text-sm font-semibold text-rose-400">{uploadFile.name}</span>
                            ) : (
                              <>
                                <span className="text-slate-400 text-sm">Drag and drop file here, or click to browse</span>
                                <span className="text-slate-600 text-xs">Supports PNG, JPG, JPEG, or MP4 files up to 20MB</span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={uploadProgress}
                          className="w-full py-3 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1 shadow-md shadow-rose-500/10"
                        >
                          {uploadProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Media Item"}
                        </button>
                      </form>
                    </div>

                    {/* Active Portfolio Item Grid */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
                        <ImageIcon className="h-5 w-5 text-rose-500" />
                        My Portfolio Creations ({artistProfile?.portfolioItems?.length || 0})
                      </h3>

                      {!artistProfile?.portfolioItems?.length ? (
                        <div className="bg-slate-900/10 border border-slate-900/50 p-12 rounded-3xl text-center text-slate-500">
                          No creations added yet. Upload your first look above!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {artistProfile.portfolioItems.map((item: any) => {
                            const mediaUrl = item.mediaUrl.startsWith("http")
                                ? item.mediaUrl
                                : `${api.defaults.baseURL}${item.mediaUrl}`;

                            return (
                              <div
                                key={item.id}
                                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden group hover:border-slate-700/60 transition-all flex flex-col justify-between shadow-lg shadow-black/20"
                              >
                                <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                                  {item.mediaType === "VIDEO" ? (
                                    <video src={mediaUrl} controls className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                                  )}
                                  <div className="absolute top-2 right-2 p-1.5 bg-slate-950/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 cursor-pointer transition-colors border border-slate-800" title="Delete" onClick={() => handleDeletePortfolioItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                  <div className="absolute bottom-2 left-2 p-1 bg-slate-950/60 backdrop-blur-sm rounded text-[10px] uppercase font-bold text-slate-300 border border-slate-800/40 flex items-center gap-1">
                                    {item.mediaType === "VIDEO" ? (
                                      <>
                                        <VideoIcon className="h-3 w-3 text-violet-400" />
                                        Video
                                      </>
                                    ) : (
                                      <>
                                        <ImageIcon className="h-3 w-3 text-rose-400" />
                                        Image
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="p-5 space-y-2">
                                  <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
                                  <p className="text-xs text-slate-500 line-clamp-2">{item.description || "No description provided."}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
