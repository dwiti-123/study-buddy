"use client";

import { useState } from "react";
import {
  Youtube, FileText, BookOpen, Sparkles, Link2, CheckCircle2, AlertCircle, Library,
} from "lucide-react";
import { generateStudyResource } from "../../../lib/api/resources";
import { useRouter } from "next/navigation";
import { showToast } from "../../../lib/toast";

type ResourceType = "youtube" | "text" | "notes";

const resourceTypes: { id: ResourceType; label: string; icon: any; description: string }[] = [
  { id: "youtube", label: "YouTube", icon: Youtube, description: "Generate from any video" },
  { id: "text",    label: "Text",    icon: FileText, description: "Paste an article or chapter" },
  { id: "notes",   label: "Notes",   icon: BookOpen, description: "Turn your notes into cards" },
];

export default function StudyResourcePage() {
  const [type, setType]       = useState<ResourceType>("youtube");
  const [source, setSource]   = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (type === "youtube" && !source.trim()) { setError("Please enter a YouTube URL"); return; }
    if ((type === "text" || type === "notes") && !content.trim()) { setError("Please enter your content"); return; }

    setLoading(true);
    const toastId = showToast.loading("Generating study materials…");
    try {
      const payload = type === "youtube" ? { type, source } : { type, originalContent: content };
      const response = await generateStudyResource(payload);
      if (response.success === false) throw new Error(response.message || "Failed to generate resource");
      setSuccess("Study resource generated successfully!");
      showToast.dismiss(toastId);
      showToast.success("Resource generated!", "Redirecting…");
      setTimeout(() => router.push(`/resource/${response.resource._id}`), 1500);
    } catch (err: any) {
      const msg = err.message || "Failed to generate resource. Please try again.";
      setError(msg);
      showToast.dismiss(toastId);
      showToast.error("Generation failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 max-w-3xl mx-auto">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#3A3047] tracking-tight mb-0.5">
            Create study resource
          </h1>
          <p className="text-sm text-[#9B86BD]">
            Paste a link or content — get flashcards and a quiz instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/resource")}
          className="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8E0F5] bg-white text-sm font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] hover:border-[#C4B8D8] transition-colors"
        >
          <Library className="h-4 w-4" />
          <span className="hidden sm:inline">My Resources</span>
        </button>
      </div>

      <div className="md:grid md:grid-cols-[1fr_272px] md:gap-6 lg:gap-8">

        {/* Left: picker + input */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {resourceTypes.map((rt) => {
              const Icon = rt.icon;
              const selected = type === rt.id;
              return (
                <button key={rt.id} type="button" onClick={() => setType(rt.id)}
                  className={`flex flex-col items-center gap-2 px-2 py-3 sm:py-4 rounded-2xl border text-center transition-colors duration-150 ${
                    selected ? "bg-[#EEEDFE] border-[#9B86BD]" : "bg-white border-[#EDE8F5] hover:border-[#C4B8D8]"
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${selected ? "bg-[#5B3F8C]" : "bg-[#F0EBF8]"}`}>
                    <Icon className={`w-4 h-4 ${selected ? "text-white" : "text-[#9B86BD]"}`} />
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm font-medium leading-none mb-1 ${selected ? "text-[#5B3F8C]" : "text-[#3A3047]"}`}>{rt.label}</p>
                    <p className="hidden sm:block text-[10px] text-[#B0A0C8] leading-tight">{rt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8F5] px-5 py-5 sm:px-6 sm:py-6">
            {type === "youtube" && (
              <div>
                <label className="block text-xs font-medium text-[#7B66A9] mb-2">YouTube URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B8D8]" />
                  <input type="url" placeholder="https://www.youtube.com/watch?v=…" value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full border border-[#EDE8F5] rounded-2xl bg-[#FDFCFF] pl-10 pr-4 py-2.5 text-sm text-[#3A3047] placeholder-[#C4B8D8] outline-none focus:border-[#9B86BD] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#C4B8D8] mt-2">Works best with lectures and tutorials that have subtitles.</p>
              </div>
            )}
            {(type === "text" || type === "notes") && (
              <div>
                <label className="block text-xs font-medium text-[#7B66A9] mb-2">{type === "text" ? "Text content" : "Your notes"}</label>
                <textarea placeholder={type === "text" ? "Paste an article, chapter, or any text here…" : "Paste your handwritten or typed notes here…"}
                  value={content} onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-[#EDE8F5] rounded-2xl bg-[#FDFCFF] px-4 py-3 h-36 sm:h-44 text-sm text-[#3A3047] placeholder-[#C4B8D8] outline-none focus:border-[#9B86BD] transition-colors resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] text-[#C4B8D8]">{type === "text" ? "500+ words gives the richest output." : "Well-organised notes produce better flashcards."}</p>
                  <p className="text-[11px] text-[#C4B8D8] tabular-nums">{content.length} chars</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2.5 bg-[#FDF2F2] border border-[#F0CACA] rounded-2xl px-4 py-3 mt-4">
                <AlertCircle className="w-4 h-4 text-[#C05050] shrink-0 mt-0.5" />
                <p className="text-sm text-[#9B3333]">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2.5 bg-[#F0FAF4] border border-[#C6EDD5] rounded-2xl px-4 py-3 mt-4">
                <CheckCircle2 className="w-4 h-4 text-[#4D9E6F] shrink-0 mt-0.5" />
                <p className="text-sm text-[#2D7A52]">{success}</p>
              </div>
            )}
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#5B3F8C] text-white text-sm font-medium hover:bg-[#4A3275] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />Generating…</>
              ) : (
                <><Sparkles className="w-4 h-4" />Generate study resources</>
              )}
            </button>
          </div>
        </div>

        {/* Right: info cards */}
        <div className="space-y-4 mt-4 md:mt-0">
          <div className="bg-white rounded-3xl border border-[#EDE8F5] px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-xs text-[#B0A0C8] font-medium uppercase tracking-widest mb-4">What you'll get</p>
            <div className="space-y-4">
              {[
                { icon: BookOpen, title: "Smart flashcards", desc: "Key concepts and definitions" },
                { icon: FileText, title: "Concise summary",  desc: "The most important points" },
                { icon: Sparkles, title: "Practice quiz",    desc: "Auto-generated questions" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EEEDFE] flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[#5B3F8C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3A3047]">{item.title}</p>
                    <p className="text-xs text-[#B0A0C8] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-[#EDE8F5] px-5 py-5">
            <p className="text-xs text-[#B0A0C8] font-medium uppercase tracking-widest mb-4">Tips</p>
            <div className="space-y-3">
              {[
                { label: "Videos", tip: "Lectures with subtitles work best." },
                { label: "Text",   tip: "500+ words gives richer output." },
                { label: "Notes",  tip: "Organised notes → better cards." },
              ].map((t, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="font-medium text-[#5B3F8C] shrink-0 w-12">{t.label}</span>
                  <span className="text-[#9B86BD] text-xs leading-relaxed">{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}