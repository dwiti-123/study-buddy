"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api/auth";
import { showToast } from "@/lib/toast";
import {
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  ClipboardList,
  Brain,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" };
    let strength = 0;
    if (password.length >= 4) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name");
      showToast.error("Validation Error", "Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      showToast.error("Validation Error", "Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      showToast.error("Validation Error", "Password must be at least 4 characters long");
      return;
    }
    if (password.length > 12) {
      setError("Password cannot be longer than 12 characters");
      showToast.error("Validation Error", "Password cannot be longer than 12 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(name, email, password);
      if (!result.success) {
        setError(result.message);
        showToast.error("Registration Failed", result.message);
        return;
      }
      showToast.success("Account Created!", "Please log in with your credentials");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
      showToast.error("Registration Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        flex 
        w-full 
        h-screen 
        overflow-hidden 
        lg:overflow-hidden 
        lg:h-screen 
        lg:min-h-0 
        bg-[#F9F7FC]
      "
    >
      {/* Left Side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 lg:py-0 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
              }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#3A3047]">
              Join StudyBuddy
            </h1>
            <p className="text-gray-600">Start your learning journey today</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#3A3047]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#3A3047]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#3A3047]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            level <= passwordStrength.strength
                              ? passwordStrength.strength === 1
                                ? "#EF4444"
                                : passwordStrength.strength === 2
                                ? "#F97316"
                                : passwordStrength.strength === 3
                                ? "#EAB308"
                                : "#9B86BD"
                              : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full text-white py-3 rounded-xl transition font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
                boxShadow: "0 10px 25px -5px rgba(155, 134, 189, 0.3)",
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold hover:underline text-[#9B86BD]"
              >
                Sign in
              </a>
            </p>
          </form>

          <p className="text-center mt-6 text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="hover:underline text-[#9B86BD]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline text-[#9B86BD]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden h-screen"
        style={{
          background:
            "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 50%, #FFD89C 100%)",
        }}
      >
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl bg-white/10" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl bg-white/10" />

        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Everything You Need to Excel
          </h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">
            Join thousands of students who are studying smarter with AI-powered
            tools and personalized learning paths.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: Sparkles,
                title: "AI-Generated Flashcards",
                text: "Automatically create study cards from any topic or document",
              },
              {
                icon: ClipboardList,
                title: "Smart Quizzes",
                text: "Practice with adaptive quizzes that adjust to your skill level",
              },
              {
                icon: Brain,
                title: "AI Study Suggestions",
                text: "Get personalized recommendations on what to study next",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {title}
                  </h3>
                  <p className="text-white/80 text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-white/70 text-sm">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">1M+</div>
              <div className="text-white/70 text-sm">Study Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-white/70 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}