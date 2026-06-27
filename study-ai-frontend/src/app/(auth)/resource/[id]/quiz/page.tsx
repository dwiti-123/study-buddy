
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResourceById } from "../../../../../lib/api/resources";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Brain,
  BarChart3,
  AlertTriangle,
  Calendar,
  Eye,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { submitQuizAttempt } from "../../../../../lib/api/quiz";

/* =======================
   TYPES
======================= */
type RevisionPlan = {
  next30Days?: string[];
  spacedRevision?: string[];
};

/* =======================
   MAIN QUIZ PAGE
======================= */
export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [resource, setResource] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan>({});

  const [openSection, setOpenSection] = useState<
    "breakdown" | "weak" | "plan" | "review" | null
  >(null);

  const toggle = (key: typeof openSection) =>
    setOpenSection((prev) => (prev === key ? null : key));

  /* ---------- Fetch Resource ---------- */
  useEffect(() => {
    (async () => {
      const data = await getResourceById(id as string);
      if (data?.success) setResource(data.resource);
    })();
  }, [id]);

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F0FA] gap-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E8E0F5]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#5B3F8C] animate-spin border-transparent" />
        </div>
        <p className="text-sm text-[#9B86BD] tracking-wide">Loading quiz…</p>
      </div>
    );
  }

  const questions = resource.quiz ?? [];
  const currentQ = questions[current];
  const accuracy =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  /* ---------- Answer Handling ---------- */
  const handleAnswer = (ans: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ._id]: ans }));
  };

  /* ---------- Submit Quiz ---------- */
  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        quizResourceId: id as string,
        answers: questions.map((q: any) => ({
          question: q.question,
          type: q.type,
          selectedAnswer: answers[q._id] || "",
          correctAnswer: q.correctAnswer,
        })),
      };

      const data = await submitQuizAttempt(payload);

      if (data.success) {
        setWeakTopics(data.weakTopics || []);
        setRevisionPlan(data.revisionPlan || {});
        setScore(data.attempt.scores.total);
        setShowResults(true);
      }
    } catch (error: any) {
      alert(error.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      submitQuiz();
    }
  };

  /* =======================
     RESULTS VIEW
  ======================= */
  if (showResults) {
    const correct = score;
    const incorrect = questions.length - score;

    return (
      <div className="min-h-screen bg-[#F4F0FA] px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => router.push("/resources")}
              className="flex items-center gap-1.5 text-sm text-[#7B66A9] hover:text-[#3C3489] transition-colors"
            >
              <Home className="h-4 w-4" />
              All resources
            </button>
            <span className="text-sm text-[#9B86BD]">{resource.title}</span>
          </div>

          {/* Score card */}
          <div className="bg-white rounded-3xl border border-[#EDE8F5] p-8 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#B0A0C8] mb-1">Quiz complete</p>
                <h1 className="text-2xl font-semibold text-[#3A3047] mb-1">
                  {accuracy >= 80
                    ? "Great work"
                    : accuracy >= 50
                      ? "Good effort"
                      : "Keep practising"}
                </h1>
                <p className="text-sm text-[#9B86BD]">
                  {score} of {questions.length} correct
                </p>
              </div>
              <ProgressRing percentage={accuracy} />
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F0FAF4] border border-[#C6EDD5] px-4 py-3">
                <p className="text-xs text-[#4D9E6F] mb-1">Correct</p>
                <p className="text-xl font-semibold text-[#2D7A52]">
                  {correct}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FDF2F2] border border-[#F0CACA] px-4 py-3">
                <p className="text-xs text-[#C05050] mb-1">Incorrect</p>
                <p className="text-xl font-semibold text-[#9B3333]">
                  {incorrect}
                </p>
              </div>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="space-y-2 mb-4">
            {/* Performance Breakdown */}
            <AccordionSection
              icon={<BarChart3 className="h-4 w-4" />}
              label="Performance breakdown"
              open={openSection === "breakdown"}
              onToggle={() => toggle("breakdown")}
            >
              <div className="space-y-2">
                {questions.map((q: any, i: number) => {
                  const userAns = answers[q._id] || "";
                  const isCorrect =
                    userAns.trim().toLowerCase() ===
                    q.correctAnswer?.trim().toLowerCase();
                  return (
                    <div
                      key={q._id}
                      className="flex items-center gap-3 text-sm"
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-[#4D9E6F] shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#C05050] shrink-0" />
                      )}
                      <span className="text-[#3A3047] line-clamp-1">
                        Q{i + 1}. {q.question}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>

            {/* Weak Topics */}
            <AccordionSection
              icon={<AlertTriangle className="h-4 w-4" />}
              label="AI-detected weak topics"
              open={openSection === "weak"}
              onToggle={() => toggle("weak")}
            >
              {weakTopics.length === 0 ? (
                <p className="text-sm text-[#4D9E6F]">
                  No weak topics detected — solid performance!
                </p>
              ) : (
                <ul className="space-y-2">
                  {weakTopics.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[#9B3333] bg-[#FDF2F2] border border-[#F0CACA] rounded-xl px-3 py-2"
                    >
                      <span className="text-[#C05050] font-medium shrink-0">
                        {i + 1}.
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </AccordionSection>

            {/* AI Revision Plan */}
            <AccordionSection
              icon={<Calendar className="h-4 w-4" />}
              label="AI revision plan"
              open={openSection === "plan"}
              onToggle={() => toggle("plan")}
            >
              <div className="space-y-5">
                {revisionPlan.next30Days &&
                  revisionPlan.next30Days.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#7B66A9] mb-2 uppercase tracking-wide">
                        Next 30 days
                      </p>
                      <ul className="space-y-1.5">
                        {revisionPlan.next30Days.map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-[#3A3047]"
                          >
                            <span className="text-[#C4B8D8] shrink-0">—</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {revisionPlan.spacedRevision &&
                  revisionPlan.spacedRevision.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#7B66A9] mb-2 uppercase tracking-wide">
                        Spaced revision
                      </p>
                      <ul className="space-y-1.5">
                        {revisionPlan.spacedRevision.map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-[#3A3047]"
                          >
                            <span className="text-[#C4B8D8] shrink-0">—</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </AccordionSection>

            {/* Review Answers */}
            <AccordionSection
              icon={<Eye className="h-4 w-4" />}
              label="Review answers"
              open={openSection === "review"}
              onToggle={() => toggle("review")}
            >
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {questions.map((q: any, i: number) => {
                  const userAns = answers[q._id] || "—";
                  const correct =
                    userAns.trim().toLowerCase() ===
                    q.correctAnswer?.trim().toLowerCase();

                  return (
                    <div
                      key={q._id}
                      className="rounded-2xl border border-[#EDE8F5] bg-[#FDFCFF] px-4 py-3"
                    >
                      <p className="text-sm font-medium text-[#3A3047] mb-2">
                        {i + 1}. {q.question}
                      </p>
                      <div className="flex flex-col gap-1 text-xs">
                        <span
                          className={
                            correct ? "text-[#4D9E6F]" : "text-[#C05050]"
                          }
                        >
                          Your answer: {userAns}
                        </span>
                        {!correct && (
                          <span className="text-[#4D9E6F]">
                            Correct: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setCurrent(0);
                setAnswers({});
                setScore(0);
                setWeakTopics([]);
                setRevisionPlan({});
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#3C3489] text-sm font-medium text-white hover:bg-[#26215C] transition-colors"
            >
              Retake quiz
            </button>
            <button
              type="button"
              onClick={() => router.push(`/resource/${id}/flashcards`)}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E0F5] text-sm font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Flashcards
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     QUESTION VIEW
  ======================= */
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F4F0FA] px-4 py-8">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => router.push("/resources")}
            className="flex items-center gap-1.5 text-sm font-medium text-[#7B66A9] hover:text-[#5B3F8C] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            My Resources
          </button>

          <span className="text-sm text-[#9B86BD] tabular-nums">
            {current + 1}
            <span className="text-[#C4B8D8]"> / {questions.length}</span>
          </span>

          <button
            type="button"
            onClick={() => router.push("/studyresource")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E0F5] bg-white text-xs font-medium text-[#5B3F8C] hover:bg-[#FAF7FD] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Resource</span>
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#B0A0C8]">
              {answeredCount} of {questions.length} answered
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

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-3xl border border-[#EDE8F5] px-8 py-8 mb-6">
              <p className="text-xs text-[#B0A0C8] mb-4 font-medium uppercase tracking-wide">
                Question {current + 1}
              </p>
              <h2 className="text-lg font-medium text-[#3A3047] leading-relaxed mb-8">
                {currentQ.question}
              </h2>

              {/* MCQ options */}
              {currentQ.options?.length ? (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt: string, i: number) => {
                    const selected = answers[currentQ._id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswer(opt)}
                        className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all duration-150 ${
                          selected
                            ? "bg-[#EEEDFE] border-[#9B86BD] text-[#3C3489] font-medium"
                            : "bg-[#FDFCFF] border-[#EDE8F5] text-[#3A3047] hover:border-[#C4B8D8] hover:bg-[#FAF7FD]"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-3 font-medium ${
                            selected
                              ? "bg-[#5B3F8C] text-white"
                              : "bg-[#F0EBF8] text-[#9B86BD]"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Free-text */
                <textarea
                  id={`answer-${currentQ._id}`}
                  placeholder="Type your answer…"
                  value={answers[currentQ._id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full border border-[#EDE8F5] rounded-2xl bg-[#FDFCFF] px-4 py-3 h-32 text-sm text-[#3A3047] placeholder-[#C4B8D8] outline-none focus:border-[#9B86BD] transition-colors resize-none"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="h-11 w-11 flex items-center justify-center rounded-2xl border border-[#E8E0F5] bg-white text-[#7B66A9] hover:border-[#C4B8D8] hover:text-[#3C3489] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous question"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Dot indicators */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {questions.slice(0, 12).map((_: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to question ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-[#5B3F8C]"
                    : answers[questions[i]._id]
                      ? "w-1.5 h-1.5 bg-[#C4B8D8]"
                      : "w-1.5 h-1.5 bg-[#E8E0F5]"
                }`}
              />
            ))}
            {questions.length > 12 && (
              <span className="text-[11px] text-[#C4B8D8] ml-1">
                +{questions.length - 12}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="h-11 flex items-center gap-2 px-5 rounded-2xl bg-[#3C3489] text-white text-sm font-medium hover:bg-[#26215C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Submitting…
              </>
            ) : current === questions.length - 1 ? (
              "Finish"
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   HELPERS
======================= */

function AccordionSection({
  icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE8F5] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[#3A3047] hover:bg-[#FAF7FD] transition-colors"
      >
        <span className="flex items-center gap-2.5 text-[#5B3F8C]">
          {icon}
          <span className="text-[#3A3047]">{label}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#C4B8D8] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[#EDE8F5]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressRing({ percentage }: { percentage: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percentage / 100);
  const color =
    percentage >= 80 ? "#4D9E6F" : percentage >= 50 ? "#5B3F8C" : "#C05050";

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="#EDE8F5"
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span className="text-xl font-semibold leading-none">
          {percentage}%
        </span>
        <span className="text-[10px] text-[#B0A0C8] mt-0.5">accuracy</span>
      </span>
    </div>
  );
}
