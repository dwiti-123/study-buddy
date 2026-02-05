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
  Flame,
} from "lucide-react";
import { getResourceById } from "@/lib/api/resources";

export default function FlashcardsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardsStudied, setCardsStudied] = useState<Set<number>>(new Set());

  const handleNext = useCallback(() => {
    setFlipped(false);
    setCardsStudied((prev) => new Set(prev).add(current));
    setCurrent((prev) => (prev + 1) % flashcards.length);
  }, [current, flashcards.length]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  }, [flashcards.length]);

  const handleFlip = useCallback(() => setFlipped((f) => !f), []);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7FC]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C8B8DB] border-t-[#9B86BD] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9B86BD] font-light">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9F7FC]">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#3A3047]">No Flashcards Available</h2>
          <p className="text-[#6B5B7F] font-light">
            This resource doesn't have any flashcards yet. Generate some to get started!
          </p>
          <button
            type="button"
            onClick={() => router.push(`/resource/${id}`)}
            className="px-6 py-3 text-white rounded-xl font-medium transition inline-flex items-center gap-2 bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] hover:shadow-lg hover:shadow-[rgba(155,134,189,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resource
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[current];
  const progress = ((cardsStudied.size / flashcards.length) * 100).toFixed(0);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#F9F7FC] to-[#FAF8FD]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => router.push(`/resource/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:shadow-md transition text-[#9B86BD] font-medium border border-[#E8DFF5]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-[#E8DFF5]">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="font-semibold text-[#3A3047]">
              {cardsStudied.size} / {flashcards.length} studied
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#3A3047]">Study Progress</span>
            <span className="text-sm font-bold text-[#9B86BD]">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-sm border border-[#E8DFF5]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#9B86BD] to-[#C8B8DB]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#3A3047]">
            Study Flashcards
          </h1>

          {/* Flashcard */}
          <div className="relative w-full max-w-2xl mb-10" style={{ perspective: "1000px" }}>
            <div
              onClick={handleFlip}
              className="relative w-full cursor-pointer transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="w-full p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-80 bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-6">
                  <Sparkles className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-white text-center leading-relaxed">
                  {currentCard.front}
                </p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/70 text-sm">
                  <RotateCw className="w-4 h-4" />
                  <span>Click to reveal answer</span>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute w-full p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-80 bg-gradient-to-br from-[#FFE5B4] to-[#FFF4D6]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  top: 0,
                  left: 0,
                }}
              >
                <div className="mb-6">
                  <Target className="w-8 h-8 text-[#9B86BD]" />
                </div>
                <p className="text-xl md:text-2xl font-medium text-center leading-relaxed text-[#3A3047]">
                  {currentCard.back}
                </p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-[#9B86BD]">
                  <RotateCw className="w-4 h-4" />
                  <span>Click to see question</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handlePrev}
              className="p-4 bg-white rounded-2xl hover:shadow-lg hover:border-[#9B86BD] transition border border-[#E8DFF5]"
              title="Previous card (← arrow)"
            >
              <ChevronLeft className="w-6 h-6 text-[#9B86BD]" />
            </button>
            <button
              onClick={handleRestart}
              className="p-4 bg-white rounded-2xl hover:shadow-lg hover:border-[#9B86BD] transition border border-[#E8DFF5]"
              title="Restart deck (R key)"
            >
              <RefreshCw className="w-6 h-6 text-[#9B86BD]" />
            </button>
            <button
              onClick={handleNext}
              className="p-4 bg-white rounded-2xl hover:shadow-lg hover:border-[#9B86BD] transition border border-[#E8DFF5]"
              title="Next card (→ arrow)"
            >
              <ChevronRight className="w-6 h-6 text-[#9B86BD]" />
            </button>
          </div>

          {/* Progress Info */}
          <div className="px-6 py-3 bg-white rounded-full shadow-md border border-[#E8DFF5]">
            <span className="text-sm font-semibold text-[#3A3047]">
              Card {current + 1} of {flashcards.length}
            </span>
          </div>

          {/* Completion Message */}
          {cardsStudied.size === flashcards.length && (
            <div className="mt-8 p-8 rounded-2xl text-center max-w-md border-2 border-[#FFE5B4] bg-[#FFF4D6]/50 space-y-4">
              <Trophy className="w-12 h-12 mx-auto text-[#FFB84D]" />
              <h3 className="text-2xl font-bold text-[#3A3047]">🎉 Deck Complete!</h3>
              <p className="text-[#6B5B7F] font-light">
                You've studied all {flashcards.length} flashcards. Excellent work!
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 px-6 py-3 text-white rounded-xl font-medium transition bg-gradient-to-br from-[#9B86BD] to-[#C8B8DB] hover:shadow-lg hover:shadow-[rgba(155,134,189,0.3)]"
                >
                  Study Again
                </button>
                <button
                  onClick={() => router.push(`/resource/${id}/quiz`)}
                  className="flex-1 px-6 py-3 text-[#9B86BD] rounded-xl font-medium transition border-2 border-[#9B86BD] hover:bg-[#F9F7FC]"
                >
                  Take Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}