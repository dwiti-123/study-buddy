"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllResources } from "@/lib/api/resources";
import { BookOpen, Sparkles, Plus } from "lucide-react";

export default function ResourceListPage() {
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllResources();
        if (data.success) setResources(data.resources);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F9F7FC] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-3 border-[#C8B8DB] border-t-[#9B86BD] rounded-full animate-spin mx-auto" />
          <p className="text-[#9B86BD] text-sm font-light tracking-wide">Loading resources...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9F7FC]">
      {/* Header Section */}
      <div className="border-b border-[#E8DFF5] bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <p className="text-[#9B86BD] text-xs font-semibold tracking-widest uppercase">
                Study Materials
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#3A3047] tracking-tight">
                All Resources
              </h1>
              <p className="text-[#6B5B7F] text-sm font-light max-w-md pt-1">
                Curated learning materials to enhance your knowledge
              </p>
            </div>
            <button
              onClick={() => router.push("/studyresource")}
              className="px-6 py-3 text-white rounded-xl font-medium text-sm transition duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
                boxShadow: "0 10px 25px -5px rgba(155, 134, 189, 0.3)",
              }}
            >
              <Plus className="w-5 h-5" />
              Create Resource
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {resources.map((res) => (
              <div
                key={res._id}
                onClick={() => router.push(`/resource/${res._id}`)}
                className="group bg-white border border-[#E8DFF5] rounded-2xl p-8 cursor-pointer transition duration-300 hover:border-[#9B86BD] hover:shadow-xl hover:shadow-[rgba(155,134,189,0.15)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#9B86BD] uppercase tracking-widest mb-2">
                      {res.type}
                    </p>
                    <h2 className="text-2xl font-bold text-[#3A3047] mb-3 group-hover:text-[#9B86BD] transition">
                      {res.title}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#E8DFF5] to-[#F3EEF9] flex items-center justify-center ml-4 opacity-0 group-hover:opacity-100 transition">
                    <Sparkles className="w-5 h-5 text-[#9B86BD]" />
                  </div>
                </div>

                <p className="text-[#6B5B7F] text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                  {res.summary || "No description available."}
                </p>

                <div className="flex gap-4 pt-6 border-t border-[#E8DFF5]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/resource/${res._id}/flashcards`);
                    }}
                    className="flex-1 px-5 py-3 text-white rounded-xl font-medium text-sm transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #9B86BD 0%, #C8B8DB 100%)",
                      boxShadow: "0 10px 25px -5px rgba(155, 134, 189, 0.3)",
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Flashcards
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/resource/${res._id}/quiz`);
                    }}
                    className="flex-1 px-5 py-3 text-[#9B86BD] rounded-xl font-medium text-sm transition duration-300 flex items-center justify-center gap-2 border-2 border-[#E8DFF5] hover:border-[#9B86BD] hover:bg-[#F9F7FC]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-[#C8B8DB] mx-auto mb-4" />
            <p className="text-[#9B86BD] font-light">No resources available.</p>
          </div>
        )}
      </div>
    </div>
  );
}