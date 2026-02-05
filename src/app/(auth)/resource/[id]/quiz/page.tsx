"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResourceById } from "@/lib/api/resources";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Brain,
  BarChart3,
  AlertTriangle,
  Calendar,
  Eye,
} from "lucide-react";
import { submitQuizAttempt } from "@/lib/api/quiz";

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

  // 🔥 NEW (FROM BACKEND)
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
    return <p className="p-6 text-center">Loading quiz...</p>;
  }

  const questions = resource.quiz ?? [];
  const currentQ = questions[current];

  /* ---------- Answer Handling ---------- */
  const handleAnswer = (ans: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ._id]: ans }));
  };

  /* ---------- SUBMIT QUIZ (BACKEND) ---------- */
const submitQuiz = async () => {
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
  }
};

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      submitQuiz();
    }
  };

  const accuracy =
    questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;

  /* =======================
     RESULTS VIEW
  ======================= */

  if (showResults) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F9F7FC] to-[#FAF8FD] px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#3A3047]">
              {resource.title}
            </h1>
            <Button variant="outline" onClick={() => router.push("/resources")}>
              <Home className="w-4 h-4 mr-2" />
              All Resources
            </Button>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Quiz Completed 🎉</h2>
              <p className="text-gray-600">
                Score: <b>{score}</b> / {questions.length}
              </p>
            </div>
            <ProgressRing percentage={accuracy} />
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {/* Performance */}
            <CollapsibleButton
              icon={<BarChart3 className="w-4 h-4" />}
              label="Performance Breakdown"
              onClick={() => toggle("breakdown")}
            />

            {openSection === "breakdown" && (
              <motion.div className="grid grid-cols-2 gap-4">
                <Stat label="Correct" value={score} variant="green" />
                <Stat
                  label="Incorrect"
                  value={questions.length - score}
                  variant="red"
                />
              </motion.div>
            )}

            {/* Weak Topics (BACKEND) */}
            <CollapsibleButton
              icon={<AlertTriangle className="w-4 h-4" />}
              label="AI-Detected Weak Topics"
              onClick={() => toggle("weak")}
            />

            {openSection === "weak" && (
              <motion.div>
                {weakTopics.length === 0 ? (
                  <p className="text-green-600">🎉 No weak topics detected</p>
                ) : (
                  <ul className="space-y-2">
                    {weakTopics.map((t, i) => (
                      <li
                        key={i}
                        className="bg-red-50 border border-red-200 p-3 rounded-xl"
                      >
                        {i + 1}. {t}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            {/* AI PLAN */}
            <CollapsibleButton
              icon={<Calendar className="w-4 h-4" />}
              label="AI Revision Plan"
              onClick={() => toggle("plan")}
            />

            {openSection === "plan" && (
              <motion.div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Next 30 Days</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {revisionPlan.next30Days?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Spaced Revision</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {revisionPlan.spacedRevision?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Review */}
            <CollapsibleButton
              icon={<Eye className="w-4 h-4" />}
              label="Review Answers"
              onClick={() => toggle("review")}
            />

            {openSection === "review" && (
              <motion.div className="space-y-4 max-h-80 overflow-y-auto">
                {questions.map((q: any, i: number) => {
                  const userAns = answers[q._id] || "—";
                  const correct =
                    userAns.trim().toLowerCase() ===
                    q.correctAnswer?.trim().toLowerCase();

                  return (
                    <div key={q._id} className="border rounded-xl p-4">
                      <p className="font-semibold">
                        {i + 1}. {q.question}
                      </p>
                      <p className="text-sm">
                        Your answer:{" "}
                        <span
                          className={
                            correct ? "text-green-600" : "text-red-600"
                          }
                        >
                          {userAns}
                        </span>
                      </p>
                      {!correct && (
                        <p className="text-sm text-green-700">
                          Correct answer: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="bg-[#9B86BD] text-white flex-1"
              onClick={() => {
                setShowResults(false);
                setCurrent(0);
                setAnswers({});
                setScore(0);
                setWeakTopics([]);
                setRevisionPlan({});
              }}
            >
              Retake Quiz
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push(`/resource/${id}/flashcards`)}
            >
              <Brain className="w-4 h-4 mr-2" />
              Flashcards
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     QUESTION VIEW
  ======================= */

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F9F7FC] to-[#FAF8FD] px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-bold mb-4">
          Question {current + 1} / {questions.length}
        </h2>

        <h3 className="mb-4 font-semibold">{currentQ.question}</h3>

        {currentQ.options?.length ? (
          <div className="space-y-3">
            {currentQ.options.map((opt: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(opt)}
                className={`w-full p-3 rounded-xl border ${
                  answers[currentQ._id] === opt
                    ? "bg-[#9B86BD] text-white"
                    : "bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <>
            <label htmlFor={`answer-${currentQ._id}`} className="sr-only">
              Your answer
            </label>
            <textarea
              id={`answer-${currentQ._id}`}
              placeholder="Type your answer"
              value={answers[currentQ._id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full border rounded-xl p-3 h-28"
            />
          </>
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            {current === questions.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   HELPERS
======================= */

function CollapsibleButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" className="w-full justify-between" onClick={onClick}>
      <span className="flex items-center gap-2">{icon}{label}</span>
    </Button>
  );
}

function Stat({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "green" | "red";
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      variant === "green"
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-red-50 border-red-200 text-red-700"
    }`}>
      <p className="text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function ProgressRing({ percentage }: { percentage: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percentage / 100);

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle cx="48" cy="48" r={r} stroke="#eee" strokeWidth="8" fill="none" />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="#9B86BD"
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-bold">
        {percentage}%
      </span>
    </div>
  );
}