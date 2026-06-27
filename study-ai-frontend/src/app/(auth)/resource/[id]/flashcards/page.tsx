// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   ChevronLeft,
//   ChevronRight,
//   RefreshCw,
//   RotateCw,
//   Sparkles,
//   Trophy,
//   Target,
//   Flame,
// } from "lucide-react";
// import { getResourceById } from "../../../../../lib/api/resources";

// export default function FlashcardsPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [flashcards, setFlashcards] = useState<any[]>([]);
//   const [current, setCurrent] = useState(0);
//   const [flipped, setFlipped] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [cardsStudied, setCardsStudied] = useState<Set<number>>(new Set());

//   const handleNext = useCallback(() => {
//     setFlipped(false);
//     setCardsStudied((prev) => new Set(prev).add(current));
//     setCurrent((prev) => (prev + 1) % flashcards.length);
//   }, [current, flashcards.length]);

//   const handlePrev = useCallback(() => {
//     setFlipped(false);
//     setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
//   }, [flashcards.length]);

//   const handleFlip = useCallback(() => setFlipped((f) => !f), []);
//   const handleRestart = useCallback(() => {
//     setFlipped(false);
//     setCurrent(0);
//     setCardsStudied(new Set());
//   }, []);

//   useEffect(() => {
//     (async () => {
//       if (typeof id !== "string") return;
//       setLoading(true);
//       const data = await getResourceById(id);
//       if (data.success && data.resource.flashcards) {
//         setFlashcards(data.resource.flashcards);
//       }
//       setLoading(false);
//     })();
//   }, [id]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") handleNext();
//       if (e.key === "ArrowLeft") handlePrev();
//       if (e.key === " " || e.key === "Spacebar") {
//         e.preventDefault();
//         handleFlip();
//       }
//       if (e.key.toLowerCase() === "r") handleRestart();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handleNext, handlePrev, handleFlip, handleRestart]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9F7FC]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#C8B8DB] border-t-[#9B86BD] rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-[#9B86BD] font-light">Loading flashcards...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!flashcards.length) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9F7FC]">
//         <div className="text-center max-w-md space-y-4">
//           <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB]">
//             <Sparkles className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-[#3A3047]">No Flashcards Available</h2>
//           <p className="text-[#6B5B7F] font-light">
//             This resource doesn't have any flashcards yet. Generate some to get started!
//           </p>
//           <button
//             type="button"
//             onClick={() => router.push(`/resource/${id}`)}
//             className="px-6 py-3 text-white rounded-xl font-medium transition inline-flex items-center gap-2 bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] hover:shadow-lg hover:shadow-[rgba(155,134,189,0.3)]"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Resource
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentCard = flashcards[current];
//   const progress = ((cardsStudied.size / flashcards.length) * 100).toFixed(0);

// return (
//   <div className="min-h-screen bg-[#F4F0FA] px-4 py-8">
//     <div className="mx-auto max-w-5xl">

//       {/* Header */}
//       <div className="mb-8 flex items-center justify-between">
//         <button
//           type="button"
//           onClick={() => router.push(`/resource/${id}`)}
//           className="flex items-center gap-2 rounded-xl border border-[#E8E0F5] bg-white px-4 py-2 text-sm font-medium text-[#5B3F8C] transition hover:bg-[#FAF7FD]"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </button>

//         <div className="flex items-center gap-3 rounded-xl border border-[#E8E0F5] bg-white px-4 py-2">
//           <Flame className="h-4 w-4 text-[#9B86BD]" />
//           <span className="text-sm font-medium text-[#3A3047]">
//             {cardsStudied.size} / {flashcards.length} studied
//           </span>
//         </div>
//       </div>

//       {/* Hero */}
//       <div className="mb-10 text-center">
//         <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8E0F5] bg-white px-4 py-1.5 text-xs font-medium text-[#7B66A9]">
//           <Sparkles className="h-3.5 w-3.5" />
//           AI Generated Flashcards
//         </div>

//         <h1 className="text-3xl font-semibold tracking-tight text-[#3A3047] md:text-4xl">
//           Study Flashcards
//         </h1>

//         <p className="mt-2 text-sm text-[#7B7280]">
//           Click the card to reveal the answer
//         </p>
//       </div>

//       {/* Progress */}
//       <div className="mb-10">
//         <div className="mb-2 flex items-center justify-between">
//           <span className="text-sm font-medium text-[#6B5B7F]">
//             Progress
//           </span>
//           <span className="text-sm font-semibold text-[#5B3F8C]">
//             {progress}%
//           </span>
//         </div>

//         <div className="h-2 overflow-hidden rounded-full bg-white border border-[#E8E0F5]">
//           <div
//             className="h-full rounded-full bg-[#9B86BD] transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       {/* Flashcard */}
//       <div
//         className="relative mx-auto mb-10 w-full max-w-3xl"
//         style={{ perspective: "1200px" }}
//       >

//         {/* Floating cards decoration */}
//         <div className="pointer-events-none absolute -right-8 -top-6 hidden md:block">
//           <div className="rotate-[8deg] rounded-xl border border-[#E8E0F5] bg-white px-4 py-3 shadow-sm">
//             <p className="text-[10px] text-[#9B86BD]">Study Tip</p>
//             <p className="mt-1 text-xs text-[#3A3047]">
//               Review daily for better retention
//             </p>
//           </div>
//         </div>

//         <div className="pointer-events-none absolute -left-8 bottom-10 hidden md:block">
//           <div className="rotate-[-6deg] rounded-xl border border-[#E8E0F5] bg-[#FAF7FD] px-4 py-3 shadow-sm">
//             <p className="text-[10px] text-[#9B86BD]">Card</p>
//             <p className="mt-1 text-sm font-medium text-[#3A3047]">
//               {current + 1}/{flashcards.length}
//             </p>
//           </div>
//         </div>

//         {/* Flip container */}
//         <div
//           onClick={handleFlip}
//           className="relative cursor-pointer transition-transform duration-500"
//           style={{
//             transformStyle: "preserve-3d",
//             transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
//           }}
//         >

//           {/* FRONT */}
//           <div
//             className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-[#E8E0F5] bg-white px-8 py-12 shadow-[0_10px_40px_rgba(91,63,140,0.06)]"
//             style={{ backfaceVisibility: "hidden" }}
//           >

//             {/* subtle glow */}
//             <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#F3EEFB]" />

//             <div className="relative z-10 max-w-2xl text-center">
//               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEFB]">
//                 <Sparkles className="h-6 w-6 text-[#5B3F8C]" />
//               </div>

//               <p className="text-2xl font-semibold leading-relaxed text-[#3A3047] md:text-3xl">
//                 {currentCard.front}
//               </p>

//               <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#FAF7FD] px-4 py-2 text-xs text-[#7B66A9]">
//                 <RotateCw className="h-3.5 w-3.5" />
//                 Click to reveal answer
//               </div>
//             </div>
//           </div>

//           {/* BACK */}
//           <div
//             className="absolute left-0 top-0 flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-[#E8E0F5] bg-[#FFFDF8] px-8 py-12 shadow-[0_10px_40px_rgba(91,63,140,0.06)]"
//             style={{
//               backfaceVisibility: "hidden",
//               transform: "rotateY(180deg)",
//             }}
//           >

//             <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[#FFF3DA]" />

//             <div className="relative z-10 max-w-2xl text-center">
//               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3DA]">
//                 <Target className="h-6 w-6 text-[#C28A2E]" />
//               </div>

//               <p className="text-xl font-medium leading-relaxed text-[#3A3047] md:text-2xl">
//                 {currentCard.back}
//               </p>

//               <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-[#B0894F] border border-[#F3E2BF]">
//                 <RotateCw className="h-3.5 w-3.5" />
//                 Click to see question
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="mb-8 flex items-center justify-center gap-3">

//         <button
//           onClick={handlePrev}
//           className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E8E0F5] bg-white text-[#5B3F8C] transition hover:bg-[#FAF7FD]"
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </button>

//         <button
//           onClick={handleRestart}
//           className="flex items-center gap-2 rounded-2xl border border-[#E8E0F5] bg-white px-5 py-3 text-sm font-medium text-[#5B3F8C] transition hover:bg-[#FAF7FD]"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Restart
//         </button>

//         <button
//           onClick={handleNext}
//           className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B3F8C] text-white transition hover:bg-[#4A3275]"
//         >
//           <ChevronRight className="h-5 w-5" />
//         </button>
//       </div>

//       {/* Footer info */}
//       <div className="text-center">
//         <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E0F5] bg-white px-5 py-2 text-sm text-[#6B5B7F]">
//           <span className="font-semibold text-[#3A3047]">
//             Card {current + 1}
//           </span>
//           <span>of</span>
//           <span className="font-semibold text-[#3A3047]">
//             {flashcards.length}
//           </span>
//         </div>
//       </div>

//       {/* Completion */}
//       {cardsStudied.size === flashcards.length && (
//         <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-[#E8E0F5] bg-white p-8 text-center shadow-sm">

//           <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3DA]">
//             <Trophy className="h-8 w-8 text-[#D89A32]" />
//           </div>

//           <h3 className="text-2xl font-semibold text-[#3A3047]">
//             Deck Completed 🎉
//           </h3>

//           <p className="mt-3 text-sm leading-relaxed text-[#7B7280]">
//             You've reviewed all {flashcards.length} flashcards.
//             Ready to test your knowledge?
//           </p>

//           <div className="mt-6 flex gap-3">
//             <button
//               onClick={handleRestart}
//               className="flex-1 rounded-xl bg-[#5B3F8C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4A3275]"
//             >
//               Study Again
//             </button>

//             <button
//               onClick={() => router.push(`/resource/${id}/quiz`)}
//               className="flex-1 rounded-xl border border-[#D8CDED] bg-[#FAF7FD] px-5 py-3 text-sm font-medium text-[#5B3F8C] transition hover:bg-[#F4F0FA]"
//             >
//               Take Quiz
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );

// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  RotateCw,
  Sparkles,
  Trophy,
  Target,
  BookOpen,
  Plus,
} from "lucide-react";
import { getResourceById } from "../../../../../lib/api/resources";

export default function FlashcardsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardsStudied, setCardsStudied] = useState<Set<number>>(new Set());
  // Tracks direction for slide animation: "next" | "prev" | null
  const [slideDir, setSlideDir] = useState<"next" | "prev" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateAndGo = useCallback(
    (dir: "next" | "prev", cb: () => void) => {
      if (isAnimating) return;
      setFlipped(false);
      setSlideDir(dir);
      setIsAnimating(true);
      // let flip reset, then move card
      setTimeout(() => {
        cb();
        setSlideDir(null);
        setIsAnimating(false);
      }, 260);
    },
    [isAnimating],
  );

  const handleNext = useCallback(() => {
    animateAndGo("next", () => {
      setCardsStudied((prev) => new Set(prev).add(current));
      setCurrent((prev) => (prev + 1) % flashcards.length);
    });
  }, [animateAndGo, current, flashcards.length]);

  const handlePrev = useCallback(() => {
    animateAndGo("prev", () => {
      setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    });
  }, [animateAndGo, flashcards.length]);

  const handleFlip = useCallback(() => {
    if (!isAnimating) setFlipped((f) => !f);
  }, [isAnimating]);

  const handleRestart = useCallback(() => {
    setFlipped(false);
    setCurrent(0);
    setCardsStudied(new Set());
  }, []);

  useEffect(() => {
    (async () => {
      if (typeof id !== "string") return;
      setLoading(true);
      const data = await getResourceById(id);
      if (data.success && data.resource.flashcards) {
        setFlashcards(data.resource.flashcards);
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleFlip();
      }
      if (e.key.toLowerCase() === "r") handleRestart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleFlip, handleRestart]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F0FA] gap-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E0F5]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#5B3F8C] animate-spin border-transparent" />
        </div>
        <p className="text-sm text-[#9B86BD] tracking-wide">
          Loading your flashcards…
        </p>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!flashcards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0FA] p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-[#5B3F8C]" />
          </div>
          <h2 className="text-xl font-semibold text-[#3A3047] mb-2">
            No flashcards yet
          </h2>
          <p className="text-sm text-[#9B86BD] leading-relaxed mb-8">
            This resource doesn't have any flashcards. Head back and generate
            some to get started.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/resource/${id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C3489] text-white text-sm font-medium hover:bg-[#26215C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to resource
          </button>
        </div>
      </div>
    );
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const currentCard = flashcards[current];
  const studiedCount = cardsStudied.size;
  const totalCount = flashcards.length;
  // A card counts as studied once you navigate away from it (handleNext marks it).
  // We also count the current card if it's been flipped — gives honest live feedback.
  const effectiveStudied = flipped
    ? new Set([...cardsStudied, current]).size
    : studiedCount;
  const progressPct = Math.round((effectiveStudied / totalCount) * 100);
  const isDone = studiedCount === totalCount;

  // ── Card slide animation class ────────────────────────────────────────────
  const slideClass =
    slideDir === "next"
      ? "animate-slide-out-left"
      : slideDir === "prev"
        ? "animate-slide-out-right"
        : "";

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes slideOutLeft {
          to { opacity: 0; transform: translateX(-24px) rotateY(0deg); }
        }
        @keyframes slideOutRight {
          to { opacity: 0; transform: translateX(24px) rotateY(0deg); }
        }
        .animate-slide-out-left  { animation: slideOutLeft  0.24s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.24s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-[#F4F0FA]">
        <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col min-h-screen">
          {/* ── Top nav ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-10">
            <button
              type="button"
              onClick={() => router.push("/resource")}
              className="flex items-center gap-1.5 text-sm font-medium text-[#7B66A9] hover:text-[#5B3F8C] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              My Resources
            </button>

            <p className="hidden md:block text-xs text-[#C4B8D8] select-none">
              Space to flip · ← → to navigate
            </p>

            <button
              type="button"
              onClick={() => router.push("/studyresource")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E0F5] bg-white text-xs font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Create Resource</span>
            </button>
          </div>

          {/* ── Progress bar ────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#B0A0C8]">
                {effectiveStudied} of {totalCount} reviewed
              </span>
              <span className="text-xs font-medium text-[#5B3F8C] tabular-nums">
                {progressPct}%
              </span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#EDE8F5]">
              <div
                className="h-full bg-[#5B3F8C] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ── Flashcard ───────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            <div className="w-full" style={{ perspective: "1400px" }}>
              <div
                onClick={handleFlip}
                className={`relative cursor-pointer select-none transition-transform duration-500 ${slideClass}`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transitionDuration: "420ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                role="button"
                tabIndex={0}
                aria-label={
                  flipped ? "Click to see question" : "Click to reveal answer"
                }
                onKeyDown={(e) => e.key === "Enter" && handleFlip()}
              >
                {/* FRONT */}
                <div
                  className="w-full min-h-[320px] md:min-h-[360px] bg-white rounded-3xl border border-[#EDE8F5] flex flex-col items-center justify-center px-8 py-10 text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EEEDFE] flex items-center justify-center mb-6">
                    <Sparkles className="h-5 w-5 text-[#5B3F8C]" />
                  </div>

                  <p className="text-lg md:text-xl font-medium text-[#3A3047] leading-relaxed max-w-md">
                    {currentCard.front}
                  </p>

                  <div className="mt-8 flex items-center gap-1.5 text-xs text-[#C4B8D8]">
                    <RotateCw className="h-3 w-3" />
                    tap to reveal
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 w-full min-h-[320px] md:min-h-[360px] bg-[#FDFCFF] rounded-3xl border border-[#EDE8F5] flex flex-col items-center justify-center px-8 py-10 text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF4E6] flex items-center justify-center mb-6">
                    <Target className="h-5 w-5 text-[#C28A2E]" />
                  </div>

                  <p className="text-base md:text-lg font-medium text-[#3A3047] leading-relaxed max-w-md">
                    {currentCard.back}
                  </p>

                  <div className="mt-8 flex items-center gap-1.5 text-xs text-[#C4B8D8]">
                    <RotateCw className="h-3 w-3" />
                    tap to see question
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Controls ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Previous card"
              className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#E8E0F5] bg-white text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#3C3489] transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 h-11 px-5 rounded-2xl border border-[#E8E0F5] bg-white text-sm font-medium text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#3C3489] transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Restart
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Next card"
              className="h-11 w-11 flex items-center justify-center rounded-2xl bg-[#3C3489] text-white hover:bg-[#26215C] transition-colors disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* ── Dot indicators (max 10 shown) ────────────────────────────── */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {flashcards.slice(0, 10).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (i === current || isAnimating) return;
                  animateAndGo(i > current ? "next" : "prev", () =>
                    setCurrent(i),
                  );
                }}
                aria-label={`Go to card ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-[#5B3F8C]"
                    : cardsStudied.has(i)
                      ? "w-1.5 h-1.5 bg-[#C4B8D8]"
                      : "w-1.5 h-1.5 bg-[#E8E0F5]"
                }`}
              />
            ))}
            {totalCount > 10 && (
              <span className="text-[11px] text-[#C4B8D8] ml-1">
                +{totalCount - 10}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Completion overlay ─────────────────────────────────────────────── */}
      {isDone && (
        <div className="fixed inset-0 bg-[#F4F0FA]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#EDE8F5] p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF4E6] flex items-center justify-center mx-auto mb-5">
              <Trophy className="h-7 w-7 text-[#D89A32]" />
            </div>

            <h3 className="text-xl font-semibold text-[#3A3047] mb-2">
              Deck complete
            </h3>
            <p className="text-sm text-[#9B86BD] leading-relaxed mb-7">
              You've reviewed all {totalCount} cards. Ready to test yourself?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-xl border border-[#E8E0F5] text-sm font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] transition-colors"
              >
                Study again
              </button>
              <button
                type="button"
                onClick={() => router.push(`/resource/${id}/quiz`)}
                className="flex-1 py-2.5 rounded-xl bg-[#3C3489] text-sm font-medium text-white hover:bg-[#26215C] transition-colors"
              >
                Take quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
