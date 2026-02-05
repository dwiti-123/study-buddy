"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import { showToast } from "@/lib/toast";

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
      showToast.error("Validation Error", "Please enter a password");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      showToast.error("Validation Error", "Password must be at least 8 characters long");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      showToast.error("Validation Error", "Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      showToast.error("Validation Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswords()) {
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      showToast.error("Invalid Link", "Invalid reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      if (!result.success) {
        const errorMsg = result.message || "Failed to reset password. Please try again.";
        setError(errorMsg);
        showToast.error("Reset Failed", errorMsg);
        return;
      }
      setSuccess("Password has been reset successfully!");
      showToast.success("Password Reset", "Your password has been reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to reset password. Please try again.";
      setError(errorMsg);
      showToast.error("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9F7FC] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        {/* Logo/Header */}
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
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Create a new password for your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#3A3047]">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#9B86BD]"
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
            <p className="text-xs text-gray-500 mt-2">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#3A3047]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#9B86BD]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-green-600 text-sm font-medium">{success}</p>
                <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
              </div>
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
                Resetting...
              </span>
            ) : (
              "Reset Password"
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
          If the reset link has expired, please{" "}
          <a href="/forgot-password" className="hover:underline text-[#9B86BD]">
            request a new one
          </a>
        </p>
      </div>
    </div>
  );
}