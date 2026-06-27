"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Sparkles, ClipboardList, Brain } from "lucide-react";
import { registerUser } from "../../lib/api/auth";
import { showToast } from "../../lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 4) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "#EF4444", "#F97316", "#EAB308", "#5B3F8C"];
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const pw = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      showToast.error("Validation error", "Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      showToast.error("Validation error", "Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      showToast.error("Validation error", "Password must be at least 4 characters");
      return;
    }
    if (password.length > 12) {
      setError("Password cannot be longer than 12 characters");
      showToast.error("Validation error", "Password too long");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(name, email, password);
      if (!result.success) {
        setError(result.message);
        showToast.error("Registration failed", result.message);
        return;
      }
      showToast.success("Account created!", "Please sign in with your credentials");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      const msg = err.message || "Registration failed. Please try again.";
      setError(msg);
      showToast.error("Registration error", msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-generated flashcards",
      text: "Automatically create study cards from any article, PDF, or video link",
    },
    {
      icon: ClipboardList,
      title: "Smart quizzes",
      text: "Practice with adaptive quizzes that adjust to your skill level",
    },
    {
      icon: Brain,
      title: "AI study suggestions",
      text: "Get personalised recommendations on what to study next",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F0FA] px-4 py-8 sm:py-10">
      <div className="flex w-full max-w-xs flex-col overflow-hidden rounded-2xl shadow-xl sm:max-w-md md:max-w-2xl md:flex-row lg:max-w-3xl">

        {/* ── Left panel — hidden on mobile, compact on tablet, full on desktop ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#5B3F8C] p-8 md:flex md:w-2/5 lg:w-1/2 lg:p-10">

          {/* Floating decorative cards — desktop only */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div
              className="absolute right-[-20px] top-[80px] w-36 rotate-[8deg] rounded-xl p-3 text-xs"
              style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)" }}
            >
              <p className="mb-1 text-[10px] text-white/50">Flashcard</p>
              <p className="font-medium text-white">What is photosynthesis?</p>
            </div>
            <div
              className="absolute right-4 top-[155px] w-36 rotate-[-4deg] rounded-xl p-3 text-xs"
              style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)" }}
            >
              <p className="mb-1 text-[10px] text-white/50">Quiz</p>
              <p className="text-white">B) Plants make food ✓</p>
            </div>
            <div
              className="absolute bottom-24 right-3 w-28 rotate-[5deg] rounded-xl p-3 text-xs"
              style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)" }}
            >
              <p className="mb-1 text-[10px] text-white/50">Progress</p>
              <p className="text-base font-medium text-white">Day 3 🔥</p>
            </div>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-medium tracking-tight text-white">StudyBuddy</span>
          </div>

          {/* Feature list */}
          <div className="relative z-10">
            <h2 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-white lg:text-[22px]">
              Everything you need<br />to study smarter.
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-white/60 lg:mb-7">
              Paste any link. Get flashcards and quizzes in seconds.
            </p>

            <div className="flex flex-col gap-4 lg:gap-5">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs leading-relaxed text-white/55">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            className="relative z-10 grid grid-cols-3 gap-4 pt-4 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[["50K+", "Students"], ["1M+", "Sessions"], ["98%", "Success"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-base font-semibold text-white lg:text-lg">{val}</p>
                <p className="text-[10px] text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex w-full flex-col justify-center bg-white p-6 sm:p-8 md:w-3/5 md:p-8 lg:w-1/2 lg:p-10">

          {/* Mobile header */}
          <div className="mb-5 md:hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3F8C]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-medium text-[#5B3F8C]">StudyBuddy</span>
            </div>

            {/* Mobile feature pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { icon: Sparkles, label: "Flashcards" },
                { icon: ClipboardList, label: "Quizzes" },
                { icon: Brain, label: "AI tips" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-[#5B3F8C]"
                  style={{ background: "#EEEDFE" }}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Tablet/desktop logo */}
          <div className="mb-5 hidden items-center gap-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEDFE]">
              <BookOpen className="h-5 w-5 text-[#5B3F8C]" />
            </div>
            <span className="text-sm font-medium text-[#5B3F8C]">StudyBuddy</span>
          </div>

          {/* Form header */}
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-[#3A3047]">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">Start your learning journey today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Full name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] py-2.5 pl-9 pr-4 text-sm text-[#3A3047] outline-none transition focus:border-[#9B86BD] focus:bg-white focus:ring-2 focus:ring-[#9B86BD]/10"
                />
              </div>
            </div>

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
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (4–12 chars)"
                  className="w-full rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] py-2.5 pl-9 pr-10 text-sm text-[#3A3047] outline-none transition focus:border-[#9B86BD] focus:bg-white focus:ring-2 focus:ring-[#9B86BD]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B86BD] transition hover:text-[#7B66A9]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="mb-1 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: level <= pw.strength ? pw.color : "#E8E0F5" }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">{pw.label} password</p>
                </div>
              )}
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
                  Creating your account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-[11px] text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            or
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-[#5B3F8C] hover:underline">
              Sign in
            </a>
          </p>

          {/* Mobile stats */}
          <div className="mt-5 flex items-center justify-center gap-4 text-center md:hidden">
            {[["50K+", "Students"], ["1M+", "Sessions"], ["98%", "Success"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-sm font-semibold text-[#5B3F8C]">{val}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="mt-4 text-center text-[11px] text-gray-400 md:mt-6">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-[#9B86BD] hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-[#9B86BD] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}