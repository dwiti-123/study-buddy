"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (!result.success) {
        setError(result.message || "Failed to send reset link. Please try again.");
        return;
      }
      setSuccess("Password reset link has been sent to your email address. Please check your inbox.");
      setEmail("");
    } catch (error: any) {
      setError(error?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F7FC] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-[#9B86BD] hover:text-[#7A6B9E] font-medium text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          {/* Logo/Header */}
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
              }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#3A3047]">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#3A3047]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#9B86BD]"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-white py-3 rounded-xl font-medium shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
              boxShadow: "0 10px 25px -5px rgba(155, 134, 189, 0.3)",
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Get Reset Password Link"
            )}
          </Button>

          {/* Back to Login Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="font-semibold hover:underline text-[#9B86BD]"
            >
              Sign in
            </a>
          </p>
        </form>

        <p className="text-center mt-6 text-xs text-gray-500">
          If you don't receive an email within a few minutes, please check your spam folder
        </p>
      </div>
    </div>
  );
}