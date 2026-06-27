"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Dna,
    ScrollText,
    MonitorDot,
    TrendingUp,
    Atom,
    Paperclip,
    Check,
    X,
    ArrowLeft,
    ArrowRight,
    Pin,
    RefreshCw,
    BarChart2,
    Layers,
    ClipboardCheck,
    FileText,
    Sparkles,
    Timer,
} from "lucide-react";

/* ─── demo data ─────────────────────────────────────────────────────────── */

const PROMPTS = [
    {
        id: "biology",
        label: "Biology lecture",
        icon: <Dna size={15} />,
        url: "https://youtube.com/watch?v=biology-lecture",
        display: "YouTube · Cell Biology 101 — Mitosis & Meiosis",
        subject: "Cell Biology 101",
        flashcards: [
            {
                q: "What is mitosis?",
                a: "Mitosis is a type of cell division resulting in two daughter cells with the same number of chromosomes as the parent cell. It's used for growth, repair, and asexual reproduction.",
            },
            {
                q: "What are the four stages of mitosis?",
                a: "Prophase, Metaphase, Anaphase, and Telophase — often remembered as PMAT. Each stage has distinct chromosomal movements leading to two identical nuclei.",
            },
            {
                q: "How does mitosis differ from meiosis?",
                a: "Mitosis produces 2 identical diploid cells for somatic growth. Meiosis produces 4 genetically unique haploid cells used in sexual reproduction.",
            },
        ],
        quiz: [
            {
                q: "Which stage of mitosis do chromosomes align at the cell's equator?",
                options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
                correct: 1,
            },
            {
                q: "Mitosis results in how many daughter cells?",
                options: ["1", "2", "4", "8"],
                correct: 1,
            },
        ],
        summary:
            "This lecture covers the mechanics of mitosis — the process by which a single cell divides into two genetically identical cells. Key topics include the four mitotic phases (PMAT), the role of the spindle apparatus, and how mitosis differs from meiosis in purpose and outcome.",
    },
    {
        id: "history",
        label: "History article",
        icon: <ScrollText size={15} />,
        url: "https://en.wikipedia.org/wiki/French_Revolution",
        display: "Article · Wikipedia — The French Revolution",
        subject: "The French Revolution",
        flashcards: [
            {
                q: "When did the French Revolution begin?",
                a: "The French Revolution began in 1789 with the convening of the Estates-General and the storming of the Bastille on 14 July, marking the end of absolute monarchy in France.",
            },
            {
                q: "What was the 'Reign of Terror'?",
                a: "A period from 1793–1794 led by Robespierre and the Committee of Public Safety, during which thousands perceived as enemies of the revolution were executed by guillotine.",
            },
            {
                q: "What were the three estates in pre-revolutionary France?",
                a: "The First Estate (clergy), the Second Estate (nobility), and the Third Estate (commoners). The Third Estate comprised 97% of the population yet paid the most taxes.",
            },
        ],
        quiz: [
            {
                q: "The storming of which landmark marked the start of the French Revolution?",
                options: ["Versailles", "The Louvre", "The Bastille", "Notre-Dame"],
                correct: 2,
            },
            {
                q: "Who led the Reign of Terror?",
                options: ["Napoleon", "Robespierre", "Louis XVI", "Voltaire"],
                correct: 1,
            },
        ],
        summary:
            "The French Revolution (1789–1799) was a period of radical political and social transformation in France. Driven by Enlightenment ideals, financial crisis, and social inequality, it abolished the monarchy, established a republic, and culminated in Napoleon's rise to power — reshaping Europe permanently.",
    },
    {
        id: "cs",
        label: "CS notes",
        icon: <MonitorDot size={15} />,
        url: "",
        display: "Notes · Big O Notation & Algorithm Complexity",
        subject: "Algorithm Complexity",
        flashcards: [
            {
                q: "What does O(n) time complexity mean?",
                a: "Linear time — the runtime grows proportionally with input size n. Doubling the input doubles the execution time. Example: a single loop iterating over n elements.",
            },
            {
                q: "What is O(log n) complexity?",
                a: "Logarithmic time — the runtime grows very slowly as input increases. Each step halves the problem size. Binary search is the classic example.",
            },
            {
                q: "Why does O(1) space complexity matter?",
                a: "O(1) means constant space — the algorithm uses the same amount of memory regardless of input size. It's ideal for memory-constrained environments.",
            },
        ],
        quiz: [
            {
                q: "Which algorithm has O(log n) average-case time complexity?",
                options: ["Bubble sort", "Linear search", "Binary search", "Merge sort"],
                correct: 2,
            },
            {
                q: "What is the time complexity of accessing an element in an array by index?",
                options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                correct: 3,
            },
        ],
        summary:
            "Big O notation describes how an algorithm's runtime or space requirements scale with input size. This reference covers the most common complexities — O(1), O(log n), O(n), O(n log n), and O(n²) — with practical examples and tips for recognising them in code.",
    },
    {
        id: "econ",
        label: "Economics PDF",
        icon: <TrendingUp size={15} />,
        url: "",
        display: "PDF · Supply, Demand & Market Equilibrium",
        subject: "Supply & Demand",
        flashcards: [
            {
                q: "What is the law of demand?",
                a: "As the price of a good increases, the quantity demanded decreases, ceteris paribus (all else equal). This inverse relationship is shown by a downward-sloping demand curve.",
            },
            {
                q: "What shifts the supply curve to the right?",
                a: "An increase in supply — caused by lower production costs, better technology, more suppliers, or favourable government policy. Prices fall and quantity rises at equilibrium.",
            },
            {
                q: "What is market equilibrium?",
                a: "The point where quantity supplied equals quantity demanded at a given price. At equilibrium there is no tendency for price to change unless an external factor shifts supply or demand.",
            },
        ],
        quiz: [
            {
                q: "A rise in price typically causes quantity demanded to…",
                options: ["Increase", "Stay the same", "Decrease", "Double"],
                correct: 2,
            },
            {
                q: "When supply increases and demand stays constant, the equilibrium price…",
                options: ["Rises", "Falls", "Stays the same", "Becomes zero"],
                correct: 1,
            },
        ],
        summary:
            "Supply and demand form the foundation of market economics. This chapter explains how the demand curve slopes downward, how supply shifts with production costs, and how the market finds equilibrium where both curves intersect — plus what causes prices to rise or fall.",
    },
    {
        id: "physics",
        label: "Physics video",
        icon: <Atom size={15} />,
        url: "https://youtube.com/watch?v=physics-quantum",
        display: "YouTube · Quantum Mechanics — Wave-Particle Duality",
        subject: "Quantum Mechanics",
        flashcards: [
            {
                q: "What is wave-particle duality?",
                a: "The principle that quantum entities like electrons exhibit both wave-like and particle-like behaviour depending on how they are observed. Demonstrated by the double-slit experiment.",
            },
            {
                q: "What did the double-slit experiment reveal?",
                a: "When electrons pass through two slits unobserved, they create an interference pattern (wave behaviour). When observed, they act as particles. Observation collapses the wave function.",
            },
            {
                q: "What is Heisenberg's Uncertainty Principle?",
                a: "It is impossible to simultaneously know both the exact position and exact momentum of a particle. The more precisely one is known, the less precisely the other can be determined.",
            },
        ],
        quiz: [
            {
                q: "Wave-particle duality was demonstrated by which experiment?",
                options: [
                    "Schrödinger's cat",
                    "The double-slit experiment",
                    "The photoelectric effect",
                    "Rutherford's gold foil",
                ],
                correct: 1,
            },
            {
                q: "Heisenberg's principle states that we cannot simultaneously know…",
                options: [
                    "Mass and velocity",
                    "Position and momentum",
                    "Charge and spin",
                    "Energy and frequency",
                ],
                correct: 1,
            },
        ],
        summary:
            "Wave-particle duality is one of quantum mechanics' most striking features: matter and light behave as waves in some experiments and as particles in others. This video explores the double-slit experiment, Heisenberg's Uncertainty Principle, and what 'observation' really means at the quantum scale.",
    },
];

/* ─── types ──────────────────────────────────────────────────────────────── */

type Tab = "flashcards" | "quiz" | "summary";
type Prompt = (typeof PROMPTS)[number];

/* ─── tiny helpers ───────────────────────────────────────────────────────── */

function useTypewriter(text: string, speed = 18) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        let i = 0;
        const id = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(id);
    }, [text, speed]);

    return { displayed, done };
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

function FlashcardDeck({ cards }: { cards: Prompt["flashcards"] }) {
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        setIdx(0);
        setFlipped(false);
    }, [cards]);

    const card = cards[idx];

    return (
        <div className="demo-fc-wrap">
            <div className="demo-fc-dots">
                {cards.map((_, i) => (
                    <button
                        key={i}
                        className={`demo-fc-dot${i === idx ? " active" : ""}`}
                        onClick={() => {
                            setIdx(i);
                            setFlipped(false);
                        }}
                        aria-label={`Card ${i + 1}`}
                    />
                ))}
            </div>

            <div
                className={`demo-fc-card${flipped ? " flipped" : ""}`}
                onClick={() => setFlipped((f) => !f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
                aria-label={flipped ? "Showing answer. Click to see question." : "Showing question. Click to reveal answer."}
            >
                <div className="demo-fc-inner">
                    <div className="demo-fc-front">
                        <span className="demo-fc-side-label">Question</span>
                        <p className="demo-fc-text">{card.q}</p>
                        <span className="demo-fc-hint">Click to reveal answer</span>
                    </div>
                    <div className="demo-fc-back">
                        <span className="demo-fc-side-label answer">Answer</span>
                        <p className="demo-fc-text">{card.a}</p>
                    </div>
                </div>
            </div>

            <div className="demo-fc-nav">
                <button
                    className="demo-fc-nav-btn"
                    onClick={() => {
                        setIdx((i) => Math.max(0, i - 1));
                        setFlipped(false);
                    }}
                    disabled={idx === 0}
                >
                    <ArrowLeft size={14} /> Prev
                </button>
                <span className="demo-fc-count">
                    {idx + 1} / {cards.length}
                </span>
                <button
                    className="demo-fc-nav-btn"
                    onClick={() => {
                        setIdx((i) => Math.min(cards.length - 1, i + 1));
                        setFlipped(false);
                    }}
                    disabled={idx === cards.length - 1}
                >
                    Next <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}

function MiniQuiz({ questions }: { questions: Prompt["quiz"] }) {
    const [answers, setAnswers] = useState<Record<number, number>>({});

    useEffect(() => setAnswers({}), [questions]);

    return (
        <div className="demo-quiz-wrap">
            {questions.map((q, qi) => (
                <div key={qi} className="demo-quiz-q">
                    <p className="demo-quiz-text">
                        <span className="demo-quiz-num">Q{qi + 1}.</span> {q.q}
                    </p>
                    <div className="demo-quiz-opts">
                        {q.options.map((opt, oi) => {
                            const chosen = answers[qi];
                            const isChosen = chosen === oi;
                            const isCorrect = oi === q.correct;
                            const answered = chosen !== undefined;

                            let state = "";
                            if (answered && isCorrect) state = " correct";
                            else if (answered && isChosen) state = " wrong";

                            return (
                                <button
                                    key={oi}
                                    className={`demo-quiz-opt${state}`}
                                    onClick={() =>
                                        !answered && setAnswers((a) => ({ ...a, [qi]: oi }))
                                    }
                                    disabled={answered}
                                >
                                    <span className="demo-quiz-letter">
                                        {String.fromCharCode(65 + oi)}
                                    </span>
                                    {opt}
                                    {answered && isCorrect && (
                                        <span className="demo-quiz-badge correct"><Check size={12} /></span>
                                    )}
                                    {answered && isChosen && !isCorrect && (
                                        <span className="demo-quiz-badge wrong"><X size={12} /></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function SummaryPanel({ text }: { text: string }) {
    const { displayed, done } = useTypewriter(text, 14);

    return (
        <div className="demo-summary-wrap">
            <p className="demo-summary-text">
                {displayed}
                {!done && <span className="demo-cursor" aria-hidden="true" />}
            </p>
            {done && (
                <div className="demo-summary-chips">
                    <span className="demo-chip"><Pin size={12} /> Key concepts highlighted</span>
                    <span className="demo-chip"><RefreshCw size={12} /> Spaced review scheduled</span>
                    <span className="demo-chip"><BarChart2 size={12} /> Progress tracked</span>
                </div>
            )}
        </div>
    );
}

/* ─── main export ────────────────────────────────────────────────────────── */

export default function DemoSection() {
    const [activePrompt, setActivePrompt] = useState<Prompt>(PROMPTS[0]);
    const [tab, setTab] = useState<Tab>("flashcards");
    const [generating, setGenerating] = useState(false);
    const [outputVisible, setOutputVisible] = useState(true);
    const [justDone, setJustDone] = useState(false);

    const [typedText, setTypedText] = useState(PROMPTS[0].display);
    const [progress, setProgress] = useState(100);
    const [stepIndex, setStepIndex] = useState(-1);

    const outputRef = useRef<HTMLDivElement>(null);

    const GENERATION_STEPS = [
        "Fetching content...",
        "Extracting transcript...",
        "Finding key concepts...",
        "Creating flashcards...",
        "Building quiz...",
        "Generating summary...",
    ];

    useEffect(() => {
        setOutputVisible(true);
    }, []);

    useEffect(() => {
        if (!outputVisible || generating) return;

        setTab("flashcards");

        const t1 = setTimeout(() => setTab("quiz"), 2500);
        const t2 = setTimeout(() => setTab("summary"), 5000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [activePrompt, outputVisible, generating]);

    function selectPrompt(prompt: Prompt, force = false) {
        if (prompt.id === activePrompt.id && !force) return;

        setGenerating(true);
        setOutputVisible(false);
        setProgress(0);
        setStepIndex(0);
        setTypedText("");
        setJustDone(false);

        let char = 0;

        const typing = setInterval(() => {
            char++;
            setTypedText(prompt.display.slice(0, char));

            if (char >= prompt.display.length) {
                clearInterval(typing);

                let step = 0;

                const pipeline = setInterval(() => {
                    step++;
                    setStepIndex(step);
                    setProgress(Math.min((step / GENERATION_STEPS.length) * 100, 100));

                    if (step >= GENERATION_STEPS.length) {
                        clearInterval(pipeline);

                        setTimeout(() => {
                            setActivePrompt(prompt);
                            setTab("flashcards");
                            setGenerating(false);
                            setOutputVisible(true);
                            setJustDone(true);
                            setTimeout(() => setJustDone(false), 1400);

                            setTimeout(() => {
                                outputRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "nearest",
                                });
                            }, 100);
                        }, 500);
                    }
                }, 700);
            }
        }, 20);
    }

    return (
        <section id="demo" className="lp-section lp-demo-section">
            <div className="lp-wrap">
                {/* ── header ── */}
                <div className="lp-section-head center lp-reveal" style={{ marginBottom: 48 }}>
                    <span className="lp-kicker">Try it yourself</span>
                    <h2>See what StudyBuddy does with real content.</h2>
                    <p>
                        Pick any example below and watch the output appear instantly — flashcards,
                        a quiz, and a summary, all from one link or paste.
                    </p>
                </div>

                {/* ── prompt picker ── */}
                <div className="demo-prompt-row">
                    {PROMPTS.map((p) => (
                        <button
                            key={p.id}
                            className={`demo-prompt-chip${p.id === activePrompt.id ? " active" : ""}`}
                            onClick={() => selectPrompt(p)}
                        >
                            <span className="demo-chip-icon">{p.icon}</span>
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* ── mock input bar ── */}
                <div className="demo-input-bar">
                    <div className="demo-input-icon">
                        <Paperclip size={16} />
                    </div>
                    {generating && (
                        <div className="demo-loading-panel">
                            <div className="demo-progress">
                                <div
                                    className="demo-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="demo-loading-steps">
                                {GENERATION_STEPS.map((step, i) => (
                                    <div
                                        key={step}
                                        className={`demo-loading-step ${i <= stepIndex ? "done" : ""}`}
                                    >
                                        {i <= stepIndex
                                            ? <Check size={11} />
                                            : <span style={{ display: "inline-block", width: 11 }}>&#x25CB;</span>
                                        } {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        className="demo-real-input"
                        value={typedText}
                        readOnly
                        placeholder="Paste YouTube URL, article link, PDF, or notes..."
                    />

                    <button
                        className="demo-generate-btn"
                        disabled={generating}
                        onClick={() => selectPrompt(activePrompt, true)}
                        aria-label={generating ? "Generating study materials" : "Generate study materials"}
                    >
                        {generating ? (
                            <>
                                <span className="demo-spinner" />
                                Generating...
                            </>
                        ) : justDone ? (
                            <><Check size={14} /> Done</>
                        ) : (
                            <><Sparkles size={14} /> Generate</>
                        )}
                    </button>
                </div>

                {/* ── output panel ── */}
                <div
                    ref={outputRef}
                    className={`demo-output${outputVisible && !generating ? " visible" : ""}`}
                >
                    {/* output header */}
                    <div className="demo-output-header sticky">
                        <div className="demo-output-subject">
                            <div className="demo-output-dot" />
                            <span>{activePrompt.subject}</span>
                        </div>
                        <div className="demo-output-tabs">
                            {(["flashcards", "quiz", "summary"] as Tab[]).map((t) => (
                                <button
                                    key={t}
                                    className={`demo-output-tab${tab === t ? " active" : ""}`}
                                    onClick={() => setTab(t)}
                                >
                                    {t === "flashcards" && <><Layers size={13} /> Flashcards</>}
                                    {t === "quiz" && <><ClipboardCheck size={13} /> Quiz</>}
                                    {t === "summary" && <><FileText size={13} /> Summary</>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* output body */}
                    <div className="demo-output-body">
                        {tab === "flashcards" && (
                            <FlashcardDeck key={activePrompt.id} cards={activePrompt.flashcards} />
                        )}
                        {tab === "quiz" && (
                            <MiniQuiz key={activePrompt.id} questions={activePrompt.quiz} />
                        )}
                        {tab === "summary" && (
                            <SummaryPanel key={activePrompt.id} text={activePrompt.summary} />
                        )}
                    </div>

                    <div className="demo-stats">
                        <span><Check size={12} /> 12 Flashcards</span>
                        <span><Check size={12} /> 8 Quiz Questions</span>
                        <span><Check size={12} /> Summary Generated</span>
                        <span><Timer size={12} /> Saves 14 mins</span>
                    </div>

                    {/* output footer */}
                    <div className="demo-output-footer">
                        <span className="demo-footer-note">
                            <Sparkles size={12} /> This is a preview — real output is generated fresh from your material
                        </span>
                        <Link href="/register" className="demo-footer-cta">
                            Create your free account
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M5 12h14M13 6l6 6-6 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}