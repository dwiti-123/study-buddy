// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getResourceById } from "../../../../lib/api/resources";
// import { BookOpen, ArrowLeft, Sparkles, FileText } from "lucide-react";

// export default function ResourceDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params?.id as string;
//   const [resource, setResource] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         const data = await getResourceById(id);
//         if (data.success) setResource(data.resource);
//       } catch (err) {
//         console.error("Error fetching resource:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#F9F7FC] flex items-center justify-center">
//         <div className="space-y-4 text-center">
//           <div className="w-8 h-8 border-3 border-[#C8B8DB] border-t-[#9B86BD] rounded-full animate-spin mx-auto" />
//           <p className="text-[#9B86BD] text-sm font-light tracking-wide">Loading resource...</p>
//         </div>
//       </div>
//     );

//   if (!resource)
//     return (
//       <div className="min-h-screen bg-[#F9F7FC] flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <FileText className="w-12 h-12 text-[#C8B8DB] mx-auto" />
//           <p className="text-[#9B86BD] font-light">Resource not found.</p>
//           <button
//             onClick={() => router.push("/studyresource")}
//             className="text-[#9B86BD] hover:text-[#7A6FA0] text-sm font-medium"
//           >
//             Back to resources
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F9F7FC]">
//       {/* Header */}
//       <div className="border-b border-[#E8DFF5] bg-white/50 backdrop-blur-sm sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-6 py-6">
//           <button
//             onClick={() => router.push("/studyresource")}
//             className="flex items-center gap-2 text-[#9B86BD] hover:text-[#7A6FA0] transition font-medium text-sm mb-4"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Resources
//           </button>
//           <div>
//             <p className="text-xs font-semibold text-[#9B86BD] uppercase tracking-widest mb-2">
//               {resource.type}
//             </p>
//             <h1 className="text-4xl font-bold text-[#3A3047]">{resource.title}</h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-6 py-12">
//         {/* Summary Section */}
//         <section className="mb-12">
//           <div className="bg-white border border-[#E8DFF5] rounded-2xl shadow-sm p-8 hover:shadow-md transition">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] flex items-center justify-center">
//                 <BookOpen className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-[#3A3047]">Overview</h2>
//             </div>
//             <p className="text-[#6B5B7F] leading-relaxed whitespace-pre-line font-light text-lg">
//               {resource.summary}
//             </p>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="space-y-6">
//           <div className="text-center space-y-2 mb-8">
//             <h2 className="text-2xl font-bold text-[#3A3047]">
//               Ready to learn?
//             </h2>
//             <p className="text-[#9B86BD] font-light">
//               Choose your preferred learning method
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Flashcards Button */}
//             <button
//               onClick={() => router.push(`/resource/${id}/flashcards`)}
//               className="group relative bg-white border border-[#E8DFF5] rounded-2xl p-8 text-left hover:border-[#9B86BD] transition duration-300 hover:shadow-xl hover:shadow-[rgba(155,134,189,0.15)]"
//             >
//               <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] flex items-center justify-center group-hover:scale-110 transition">
//                 <BookOpen className="w-6 h-6 text-white" />
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-xl font-bold text-[#3A3047] mb-2">
//                   Flashcards
//                 </h3>
//                 <p className="text-sm text-[#9B86BD] font-semibold uppercase tracking-widest">
//                   Interactive Learning
//                 </p>
//               </div>

//               <p className="text-[#6B5B7F] text-sm leading-relaxed font-light mb-6">
//                 Master concepts with interactive flashcards. Flip cards to reveal answers and reinforce your learning.
//               </p>

//               <div className="flex items-center gap-2 text-[#9B86BD] font-medium text-sm group-hover:gap-3 transition">
//                 Start Studying
//                 <span>→</span>
//               </div>
//             </button>

//             {/* Quiz Button */}
//             <button
//               onClick={() => router.push(`/resource/${id}/quiz`)}
//               className="group relative bg-white border border-[#E8DFF5] rounded-2xl p-8 text-left hover:border-[#9B86BD] transition duration-300 hover:shadow-xl hover:shadow-[rgba(155,134,189,0.15)]"
//             >
//               <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] flex items-center justify-center group-hover:scale-110 transition">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-xl font-bold text-[#3A3047] mb-2">
//                   Quiz
//                 </h3>
//                 <p className="text-sm text-[#9B86BD] font-semibold uppercase tracking-widest">
//                   Test Your Knowledge
//                 </p>
//               </div>

//               <p className="text-[#6B5B7F] text-sm leading-relaxed font-light mb-6">
//                 Challenge yourself with a comprehensive quiz. Track your progress and identify areas to improve.
//               </p>

//               <div className="flex items-center gap-2 text-[#9B86BD] font-medium text-sm group-hover:gap-3 transition">
//                 Take Quiz
//                 <span>→</span>
//               </div>
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResourceById } from "../../../../lib/api/resources";
import { BookOpen, ArrowLeft, Sparkles, FileText } from "lucide-react";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getResourceById(id);
        if (data.success) setResource(data.resource);
      } catch (err) {
        console.error("Error fetching resource:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Loading ──────────────────────────────────────────────────────────── */
  if (loading)
    return (
      <div className="min-h-screen bg-[#F4F0FA] flex flex-col items-center justify-center gap-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E0F5]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#5B3F8C] animate-spin border-transparent" />
        </div>
        <p className="text-sm text-[#9B86BD] tracking-wide">Loading resource…</p>
      </div>
    );

  /* ── Not found ────────────────────────────────────────────────────────── */
  if (!resource)
    return (
      <div className="min-h-screen bg-[#F4F0FA] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-[#5B3F8C]" />
          </div>
          <h2 className="text-xl font-semibold text-[#3A3047] mb-2">
            Resource not found
          </h2>
          <p className="text-sm text-[#9B86BD] leading-relaxed mb-8">
            This resource may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => router.push("/studyresource")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C3489] text-white text-sm font-medium hover:bg-[#26215C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to resources
          </button>
        </div>
      </div>
    );

  /* ── Main ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F4F0FA]">

      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 bg-[#F4F0FA]/90 backdrop-blur-sm border-b border-[#EDE8F5]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/studyresource")}
            className="flex items-center gap-1.5 text-sm text-[#7B66A9] hover:text-[#3C3489] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {resource.type && (
            <span className="text-xs font-medium text-[#9B86BD] uppercase tracking-widest">
              {resource.type}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold text-[#3A3047] leading-snug tracking-tight">
            {resource.title}
          </h1>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-3xl border border-[#EDE8F5] px-8 py-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-[#EEEDFE] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#5B3F8C]" />
            </div>
            <h2 className="text-base font-medium text-[#3A3047]">Overview</h2>
          </div>
          <p className="text-sm text-[#6B5B7F] leading-relaxed whitespace-pre-line">
            {resource.summary}
          </p>
        </div>

        {/* CTA section */}
        <div>
          <p className="text-xs text-[#B0A0C8] font-medium uppercase tracking-widest mb-4 px-1">
            Start learning
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Flashcards */}
            <button
              onClick={() => router.push(`/resource/${id}/flashcards`)}
              className="group bg-white rounded-3xl border border-[#EDE8F5] px-6 py-6 text-left hover:border-[#C4B8D8] transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mb-5 group-hover:bg-[#DDD9F8] transition-colors">
                <BookOpen className="w-5 h-5 text-[#5B3F8C]" />
              </div>

              <h3 className="text-base font-semibold text-[#3A3047] mb-1">
                Flashcards
              </h3>
              <p className="text-xs text-[#9B86BD] mb-5 leading-relaxed">
                Flip through cards to reinforce concepts at your own pace.
              </p>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B3F8C] group-hover:gap-2.5 transition-all">
                Start studying
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
            </button>

            {/* Quiz */}
            <button
              onClick={() => router.push(`/resource/${id}/quiz`)}
              className="group bg-white rounded-3xl border border-[#EDE8F5] px-6 py-6 text-left hover:border-[#C4B8D8] transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mb-5 group-hover:bg-[#DDD9F8] transition-colors">
                <Sparkles className="w-5 h-5 text-[#5B3F8C]" />
              </div>

              <h3 className="text-base font-semibold text-[#3A3047] mb-1">
                Quiz
              </h3>
              <p className="text-xs text-[#9B86BD] mb-5 leading-relaxed">
                Test your knowledge and get AI-powered feedback on weak areas.
              </p>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B3F8C] group-hover:gap-2.5 transition-all">
                Take quiz
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}