"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllResources } from "../../../lib/api/resources";
import {
  BookOpen, Sparkles, Plus, FileText, Youtube,
  AlignLeft, Search, ChevronLeft, ChevronRight, X,
} from "lucide-react";

const typeIcon: Record<string, any> = {
  youtube: Youtube,
  text: AlignLeft,
  notes: FileText,
};

// Items per page — driven by CSS grid cols, but we control count here
// 4 on md (2-col), 6 on xl (3-col)
const PAGE_SIZE_DEFAULT = 6;

export default function ResourceListPage() {
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");
  const [page, setPage]           = useState(1);

  // Detect viewport to set page size (4 for md, 6 for xl+)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setPageSize(6);       // xl → 3 cols, show 6
      else if (window.innerWidth >= 768) setPageSize(4);   // md → 2 cols, show 4
      else setPageSize(4);                                  // mobile → 1 col, show 4
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [query]);

  // Frontend filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.summary?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q)
    );
  }, [resources, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F4F0FA] flex flex-col items-center justify-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E0F5]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#5B3F8C] animate-spin border-transparent" />
        </div>
        <p className="text-sm text-[#9B86BD]">Loading resources…</p>
      </div>
    );

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 max-w-5xl mx-auto">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#3A3047] tracking-tight mb-0.5">
            My Resources
          </h1>
          <p className="text-sm text-[#9B86BD]">
            {filtered.length > 0
              ? `${filtered.length} ${filtered.length === 1 ? "resource" : "resources"}${query ? " found" : ""}`
              : query ? "No results" : "No resources yet"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/studyresource")}
          className="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B3F8C] text-white text-sm font-medium hover:bg-[#4A3275] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Resource</span>
        </button>
      </div>

      {/* ── Search ── */}
      {resources.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8D8]" />
          <input
            type="text"
            placeholder="Search by title, type or topic…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-[#EDE8F5] rounded-2xl pl-10 pr-10 py-2.5 text-sm text-[#3A3047] placeholder-[#C4B8D8] outline-none focus:border-[#9B86BD] transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4B8D8] hover:text-[#9B86BD]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {paginated.map((res) => {
              const Icon = typeIcon[res.type] ?? FileText;
              return (
                <div
                  key={res._id}
                  onClick={() => router.push(`/resource/${res._id}`)}
                  className="group bg-white rounded-3xl border border-[#EDE8F5] p-5 cursor-pointer hover:border-[#C4B8D8] hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#EEEDFE] flex items-center justify-center shrink-0 group-hover:bg-[#DDD9F8] transition-colors">
                      <Icon className="w-4 h-4 text-[#5B3F8C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {res.type && (
                        <p className="text-[10px] font-medium text-[#B0A0C8] uppercase tracking-widest mb-0.5">
                          {res.type}
                        </p>
                      )}
                      <h2 className="text-sm font-semibold text-[#3A3047] leading-snug line-clamp-2">
                        {res.title}
                      </h2>
                    </div>
                  </div>

                  {/* Summary */}
                  {res.summary && (
                    <p className="text-xs text-[#9B86BD] leading-relaxed line-clamp-3 flex-1 mb-4">
                      {res.summary}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-[#EDE8F5] mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/resource/${res._id}/flashcards`); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#5B3F8C] text-white text-xs font-medium hover:bg-[#4A3275] transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Flashcards
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/resource/${res._id}/quiz`); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E8E0F5] text-[#5B3F8C] text-xs font-medium hover:bg-[#FAF7FD] hover:border-[#C4B8D8] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Quiz
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#E8E0F5] bg-white text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#5B3F8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                    n === safePage
                      ? "bg-[#5B3F8C] text-white"
                      : "border border-[#E8E0F5] bg-white text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#5B3F8C]"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#E8E0F5] bg-white text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#5B3F8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* ── Empty / no results ── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mx-auto mb-6">
            {query ? <Search className="w-7 h-7 text-[#5B3F8C]" /> : <BookOpen className="w-7 h-7 text-[#5B3F8C]" />}
          </div>
          <h2 className="text-xl font-semibold text-[#3A3047] mb-2">
            {query ? "No results found" : "No resources yet"}
          </h2>
          <p className="text-sm text-[#9B86BD] leading-relaxed mb-8 max-w-xs">
            {query
              ? `No resources match "${query}". Try a different search.`
              : "Paste a link to an article, PDF, or video and we'll generate flashcards and a quiz for you."}
          </p>
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E8E0F5] bg-white text-sm font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] transition-colors"
            >
              <X className="w-4 h-4" />
              Clear search
            </button>
          ) : (
            <button
              onClick={() => router.push("/studyresource")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B3F8C] text-white text-sm font-medium hover:bg-[#4A3275] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first resource
            </button>
          )}
        </div>
      )}
    </div>
  );
}