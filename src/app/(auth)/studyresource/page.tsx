"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  FileText,
  BookOpen,
  Sparkles,
  Link2,
  Wand2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { generateStudyResource } from "@/lib/api/resources";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { logoutUser } from "@/lib/api/auth";
import { LogOut } from "lucide-react";

type ResourceType = "youtube" | "text" | "notes";

export default function StudyResourcePage() {
  const [type, setType] = useState<ResourceType>("youtube");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        showToast.success("Logged Out", "You have been logged out successfully");
        router.push("/login");
      } else {
        showToast.error("Logout Failed", result.message || "Failed to logout");
      }
    } catch (err: any) {
      showToast.error("Error", err.message || "An error occurred during logout");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (type === "youtube" && !source.trim()) {
      setError("Please enter a YouTube URL");
      showToast.error("Validation Error", "Please enter a YouTube URL");
      return;
    }
    if ((type === "text" || type === "notes") && !content.trim()) {
      setError("Please enter your content");
      showToast.error("Validation Error", "Please enter your content");
      return;
    }

    setLoading(true);
    const toastId = showToast.loading("Generating study materials...");

    try {
      // Build the payload dynamically
      const payload =
        type === "youtube"
          ? { type, source }
          : { type, originalContent: content };

      // Call the backend
      const response = await generateStudyResource(payload);

      if (response.success === false) {
        throw new Error(response.message || "Failed to generate resource");
      }

      setSuccess("Study resource generated successfully! 🎉");
      showToast.dismiss(toastId);
      showToast.success(
        "Resource Generated!",
        "Redirecting to your resource..."
      );

      setTimeout(() => {
        router.push(`/resource/${response.resource._id}`);
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err.message || "Failed to generate resource. Please try again.";
      setError(errorMsg);
      showToast.dismiss(toastId);
      showToast.error("Generation Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resourceTypes: {
    id: ResourceType;
    label: string;
    icon: any;
    description: string;
    color: string;
  }[] = [
    {
      id: "youtube",
      label: "YouTube Video",
      icon: Youtube,
      description: "Generate notes from any video",
      color: "#9B86BD",
    },
    {
      id: "text",
      label: "Text Content",
      icon: FileText,
      description: "Convert text into study materials",
      color: "#C8B8DB",
    },
    {
      id: "notes",
      label: "Your Notes",
      icon: BookOpen,
      description: "Transform notes into flashcards",
      color: "#FFD89C",
    },
  ];

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 bg-linear-to-br from-[#F9F7FC] to-[#FAF8FD]">
      <div className="max-w-6xl mx-auto">
        {/* Logout Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition duration-200 border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10 px-2">
          <div
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 shadow-md"
            style={{
              background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
            }}
          >
            <Wand2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-[#3A3047]">
            AI Study Resource Generator
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Transform any content into powerful study materials. Get flashcards,
            summaries, and quizzes in seconds.
          </p>
        </div>

        {/* Resource Type Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center text-[#3A3047]">
            Choose Your Source
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resourceTypes.map((rt) => {
              const Icon = rt.icon;
              const isSelected = type === rt.id;
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => {
                    setType(rt.id);
                    showToast.info(`Selected ${rt.label}`, rt.description);
                  }}
                  className="relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg text-center"
                  style={{
                    borderColor: isSelected ? rt.color : "#E5E7EB",
                    backgroundColor: isSelected ? `${rt.color}15` : "white",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: rt.color }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto"
                    style={{
                      backgroundColor: isSelected ? rt.color : "#F3F4F6",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isSelected ? "white" : rt.color }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-base sm:text-lg mb-1"
                    style={{ color: isSelected ? rt.color : "#3A3047" }}
                  >
                    {rt.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {rt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#9B86BD20" }}
            >
              <Sparkles className="w-5 h-5 text-[#9B86BD]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#3A3047]">
              {type === "youtube"
                ? "Enter Video URL"
                : type === "text"
                ? "Paste Your Text"
                : "Add Your Notes"}
            </h2>
          </div>

          <div className="space-y-5">
            {type === "youtube" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-[#3A3047]">
                  YouTube Video URL
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9B86BD] transition"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Works with any YouTube video - lectures, tutorials, etc.
                </p>
              </div>
            )}

            {(type === "text" || type === "notes") && (
              <div>
                <label className="block text-sm font-medium mb-2 text-[#3A3047]">
                  {type === "text" ? "Your Text Content" : "Your Study Notes"}
                </label>
                <textarea
                  placeholder={
                    type === "text"
                      ? "Paste any text content here - articles, chapters..."
                      : "Paste your handwritten or typed notes here..."
                  }
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 h-40 sm:h-48 focus:outline-none focus:ring-2 focus:ring-[#9B86BD] transition resize-none"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-1 sm:gap-0">
                  <p className="text-xs text-gray-500">
                    💡 More content = better materials!
                  </p>
                  <p className="text-xs text-gray-400 text-right">
                    {content.length} characters
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full text-white py-3 sm:py-4 rounded-xl font-semibold shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
                boxShadow: "0 10px 25px -5px rgba(155, 134, 189, 0.3)",
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating study materials...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Study Resources
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="mt-10 bg-white rounded-3xl shadow-md p-6 sm:p-8 border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-center text-[#3A3047]">
            What You'll Get ✨
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Smart Flashcards",
                desc: "AI-generated cards with key concepts and definitions",
                bg: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
              },
              {
                icon: FileText,
                title: "Concise Summaries",
                desc: "Quick overviews highlighting the most important points",
                bg: "linear-gradient(135deg, #C8B8DB 0%, #FFD89C 100%)",
              },
              {
                icon: Sparkles,
                title: "Practice Quizzes",
                desc: "Test your knowledge with auto-generated questions",
                bg: "linear-gradient(135deg, #FFD89C 0%, #9B86BD 100%)",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-[#3A3047]">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div
          className="mt-8 p-6 rounded-2xl border-2"
          style={{
            backgroundColor: "#FFD89C20",
            borderColor: "#FFD89C",
          }}
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-[#3A3047]">
            <Sparkles className="w-5 h-5 text-[#9B86BD]" />
            Pro Tips for Best Results
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>📹</span>
              <span>
                <strong>Videos:</strong> Educational content works best —
                lectures, tutorials, explanations (all with subtitle will give
                best result)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>📝</span>
              <span>
                <strong>Text:</strong> Longer content (500+ words) gives richer
                summaries
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>✍️</span>
              <span>
                <strong>Notes:</strong> Well-organized notes produce better
                flashcards
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}