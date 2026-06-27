"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { resetPassword } from "../../lib/api/auth";
import { showToast } from "../../lib/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    if (!password) {
      setError("Please enter a password");
      showToast.error("Validation error", "Please enter a password");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      showToast.error("Validation error", "Password must be at least 8 characters");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      showToast.error("Validation error", "Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      showToast.error("Validation error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswords()) return;

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      showToast.error("Invalid link", "Please request a new password reset.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      if (!result.success) {
        const msg = result.message || "Failed to reset password. Please try again.";
        setError(msg);
        showToast.error("Reset failed", msg);
        return;
      }
      setSuccess("Password has been reset successfully!");
      showToast.success("Password reset", "Your password has been reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const msg = err?.message || "Failed to reset password. Please try again.";
      setError(msg);
      showToast.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F0FA] px-4 py-8 sm:py-10">
      <div className="w-full max-w-[92vw] sm:max-w-sm md:max-w-md">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center sm:mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#5B3F8C] sm:h-12 sm:w-12">
            <BookOpen className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-base font-medium text-[#5B3F8C]">StudyBuddy</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E8E0F5] bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-lg font-semibold text-[#3A3047] sm:text-xl">Reset your password</h1>
            <p className="mt-1 text-sm text-gray-500">Create a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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
              <p className="mt-1.5 text-[11px] text-gray-400">Must be at least 8 characters long</p>
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B86BD]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] py-2.5 pl-9 pr-10 text-sm text-[#3A3047] outline-none transition focus:border-[#9B86BD] focus:bg-white focus:ring-2 focus:ring-[#9B86BD]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B86BD] transition hover:text-[#7B66A9]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-700">{success}</p>
                  <p className="mt-0.5 text-[11px] text-green-600">Redirecting to login...</p>
                </div>
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
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-5 space-y-2 text-center text-xs text-gray-400">
            <p>
              Remember your password?{" "}
              <a href="/login" className="font-medium text-[#5B3F8C] hover:underline">
                Sign in
              </a>
            </p>
            <p>
              Link expired?{" "}
              <a href="/forgot-password" className="text-[#9B86BD] hover:underline">
                Request a new one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}