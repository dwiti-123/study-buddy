"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, BookOpen, Users } from "lucide-react";
import { loginUser } from "../../lib/api/auth";
import { showToast } from "../../lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (!result.success) {
        setError(result.message);
        showToast.error("Login failed", result.message);
        return;
      }
      showToast.success("Welcome back!", "Login successful");
      router.push("/studyresource");
    } catch {
      setError("Login failed. Please check your credentials.");
      showToast.error("Login error", "Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F0FA] px-4 py-8 sm:py-10">
      <div className="flex w-full max-w-xs flex-col overflow-hidden rounded-2xl shadow-xl sm:max-w-md md:max-w-2xl md:flex-row lg:max-w-3xl">

        {/* ── Left panel — hidden on mobile, compact on tablet, full on desktop ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#5B3F8C] p-8 md:flex md:w-2/5 lg:w-1/2 lg:p-10">

          {/* Floating decorative flashcards — only on lg+ */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div
              className="absolute right-[-20px] top-[90px] w-36 rotate-[8deg] rounded-xl p-3 text-xs"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <p className="mb-1 text-[10px] text-white/50">Flashcard</p>
              <p className="font-medium text-white">What is mitosis?</p>
            </div>

            <div
              className="absolute right-4 top-[165px] w-36 rotate-[-4deg] rounded-xl p-3 text-xs"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <p className="mb-1 text-[10px] text-white/50">Quiz</p>
              <p className="text-white">A) Cell division ✓</p>
            </div>

            <div
              className="absolute bottom-24 right-3 w-28 rotate-[5deg] rounded-xl p-3 text-xs"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <p className="mb-1 text-[10px] text-white/50">Score</p>
              <p className="text-base font-medium text-white">8 / 10</p>
            </div>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-medium tracking-tight text-white">
              StudyBuddy
            </span>
          </div>

          {/* Copy + steps */}
          <div className="relative z-10">
            <h2 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-white lg:text-[22px]">
              Paste a link.<br />
              Get flashcards.<br />
              Start learning.
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-white/60 lg:mb-6">
              Drop any article, PDF, or video link — we'll turn it into
              flashcards and quizzes instantly.
            </p>

            <div className="flex flex-col gap-2.5 lg:gap-3">
              {[
                "Paste any material link",
                "AI generates flashcards + quiz",
                "Study smarter, retain more",
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-white/75"
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {i + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div
            className="relative z-10 flex items-center gap-2 pt-4 text-[11px] text-white/45"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Users className="h-3 w-3" />
            2,400+ students learning smarter
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex w-full flex-col justify-center bg-white p-6 sm:p-8 md:w-3/5 md:p-8 lg:w-1/2 lg:p-10">

          {/* Mobile header — logo + brand + tagline */}
          <div className="mb-6 md:hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3F8C]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-medium text-[#5B3F8C]">StudyBuddy</span>
            </div>
            {/* Mobile mini steps banner */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["Paste link", "Get flashcards", "Study smart"].map((s, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-[#5B3F8C]"
                  style={{ background: "#EEEDFE" }}
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ background: "#5B3F8C" }}
                  >
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Tablet/desktop logo on right panel */}
          <div className="mb-5 hidden items-center gap-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEDFE]">
              <BookOpen className="h-5 w-5 text-[#5B3F8C]" />
            </div>
            <span className="text-sm font-medium text-[#5B3F8C]">StudyBuddy</span>
          </div>

          {/* Form header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#3A3047]">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] py-2.5 pl-9 pr-4 text-sm text-[#3A3047] outline-none transition focus:border-[#9B86BD] focus:bg-white focus:ring-2 focus:ring-[#9B86BD]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">
                  Password
                </label>
                {/* <a
                  href="/forgotpassword"
                  className="text-xs text-[#9B86BD] hover:underline"
                >
                  Forgot password?
                </a> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] py-2.5 pl-9 pr-10 text-sm text-[#3A3047] outline-none transition focus:border-[#9B86BD] focus:bg-white focus:ring-2 focus:ring-[#9B86BD]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B86BD] transition hover:text-[#7B66A9]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3F8C] py-2.5 text-sm font-medium text-white transition hover:bg-[#4A3275] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            or
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#5B3F8C] hover:underline"
            >
              Create account
            </a>
          </p>

          {/* Social proof — mobile only */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 md:hidden">
            <Users className="h-3 w-3" />
            2,400+ students learning smarter
          </div>

          {/* Terms */}
          <p className="mt-4 text-center text-[11px] text-gray-400 md:mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-[#9B86BD] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#9B86BD] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
        
      </div>
    </div>
  );
}