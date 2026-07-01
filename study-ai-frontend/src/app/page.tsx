"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DemoSection from "@/components/demo-section";

export default function LandingPage() {
  const router = useRouter();
  const revealRefs = useRef<HTMLElement[]>([]);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const hasFetchedCount = useRef(false);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealRefs.current.forEach((el) => el && obs.observe(el));

    return () => obs.disconnect();
  }, []);

  // Fetch + increment the visitor count once per real page load
  useEffect(() => {
    if (hasFetchedCount.current) return;
    hasFetchedCount.current = true;

    fetch("/api/visitor-count")
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch(() => {
        // fail silently — badge just won't render
      });
  }, []);

  const goToSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <div className="lp-page">
      <nav className="lp-nav lp-nav-fixed">
        <div className="lp-wrap">
          <div className="lp-brand">
            <span className="lp-brand-mark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67 4.67 4 5.5 4H12V20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 5.5C20 4.67 19.33 4 18.5 4H12V20H18.5C19.33 20 20 19.33 20 18.5V5.5Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            StudyBuddy
          </div>
          <div className="lp-nav-links lp-nav-mobile-hide">
            <a href="#how">How it works</a>
            <a href="#demo">Try it</a>
            <a href="#sources">Sources</a>
            <a href="#faq">FAQ</a>
          </div>
          <Link href="/login" className="lp-nav-cta" onClick={goToSignIn}>
            Sign in
          </Link>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-blob lp-blob1"></div>
        <div className="lp-blob lp-blob2"></div>
        <div className="lp-wrap">
          <div>
            <span className="lp-eyebrow">
              <span className="lp-eyebrow-dot"></span>Trusted by  students
            </span>

            {visitorCount !== null && (
              <span className="lp-visitor-badge">
                You're visitor #{visitorCount.toLocaleString()}
              </span>
            )}

            <h1>
              Paste a link.
              <br />
              Get{" "}
              <span className="lp-underline-draw">
                <em>flashcards</em>
                <svg viewBox="0 0 200 14">
                  <path d="M2 10 C 50 4, 150 4, 198 10" />
                </svg>
              </span>
              <br />
              Start learning.
            </h1>
            <p className="lp-lede">
              Drop in an article, a PDF, or a lecture link — StudyBuddy
              quietly turns it into flashcards, a summary, and a quiz, so you
              spend your time learning instead of formatting notes.
            </p>
            <div className="lp-hero-ctas">
              <Link href="/studyresource" className="lp-btn-primary">
                Create your first resource
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a href="#how" className="lp-btn-ghost">
                See how it works
              </a>
            </div>
            <div className="lp-trust-row">
              <div className="lp-avatars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>
                Built for the night before the exam — and every day before
                that.
              </span>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-float-card chip-quiz">
              <span className="lp-chip-quiz-tag">Quiz</span>
              <div className="lp-chip-quiz-opt">B) Photosynthesis</div>
              <div className="lp-chip-quiz-opt correct">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                A) Cell division
              </div>
            </div>
            <div className="lp-float-card main">
              <span className="lp-card-tag">Flashcard · Biology 101</span>
              <div className="lp-card-q">
                What is mitosis, and why does it matter for growth?
              </div>
              <div className="lp-card-hint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9c-2.39 0-4.68-.94-6.36-2.64"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 8v4h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Tap to reveal
              </div>
            </div>
            <div className="lp-float-card chip-score">
              <div className="lp-score-num">8/10</div>
              <div className="lp-score-lbl">Last quiz score</div>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-strip">
        <div className="lp-wrap">
          <span>
             students learning smarter
          </span>
          <span>
            <strong>3 formats</strong> — YouTube, text, and notes
          </span>
          <span>
            <strong>Instant</strong> flashcards, summaries &amp; quizzes
          </span>
          <span>
            <strong>Spaced</strong> revision plans, built in
          </span>
        </div>
      </div>

      <section id="how" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-section-head lp-reveal" ref={addReveal}>
            <span className="lp-kicker">How it works</span>
            <h2>From raw material to recall, in three quiet steps.</h2>
            <p>
              No formatting, no copy-pasting into five different apps. Just
              the material you already have, and a little time to actually
              study it.
            </p>
          </div>

          <div className="lp-flow">
            <div className="lp-flow-card lp-reveal" ref={addReveal}>
              <span className="lp-flow-num">01</span>
              <div className="lp-flow-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 11a5 5 0 00-7.07 0l-1.41 1.41a5 5 0 007.07 7.07L14 18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Paste any material</h3>
              <p>
                A YouTube lecture, a long article, or notes you typed in a
                hurry. If it has content, StudyBuddy can read it.
              </p>
            </div>
            <div className="lp-flow-card lp-reveal" ref={addReveal}>
              <span className="lp-flow-num">02</span>
              <div className="lp-flow-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.1L12 16.3l-6.3 4.4 2.3-7.1-6-4.4h7.6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>AI structures it for you</h3>
              <p>
                Flashcards for key ideas, a clear summary for context, and a
                quiz to check what's actually sticking.
              </p>
            </div>
            <div className="lp-flow-card lp-reveal" ref={addReveal}>
              <span className="lp-flow-num">03</span>
              <div className="lp-flow-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 17l5-5 4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Study smarter, retain more</h3>
              <p>
                See exactly where you're weak, and get a simple revision plan
                instead of guessing what to review next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DemoSection />

      <section id="sources" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-showcase">
            <div>
              <span className="lp-kicker lp-reveal" ref={addReveal}>
                Three ways in
              </span>
              <h2 className="lp-showcase-heading lp-reveal" ref={addReveal}>
                Bring whatever you already have.
              </h2>
              <div className="lp-source-tabs">
                <div className="lp-source-tab active lp-reveal" ref={addReveal}>
                  <div className="lp-source-tab-top">
                    <span className="lp-source-tab-icon">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="5"
                          width="20"
                          height="14"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path d="M10 9.5l5 2.5-5 2.5v-5z" fill="currentColor" />
                      </svg>
                    </span>
                    <h4>YouTube</h4>
                  </div>
                  <p>
                    Works best with lectures and tutorials that have
                    subtitles.
                  </p>
                </div>
                <div className="lp-source-tab lp-reveal" ref={addReveal}>
                  <div className="lp-source-tab-top">
                    <span className="lp-source-tab-icon">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M8 13h8M8 17h8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <h4>Text</h4>
                  </div>
                  <p>
                    Paste an article or a chapter — 500+ words gives the
                    richest output.
                  </p>
                </div>
                <div className="lp-source-tab lp-reveal" ref={addReveal}>
                  <div className="lp-source-tab-top">
                    <span className="lp-source-tab-icon">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 19.5A2.5 2.5 0 016.5 17H20"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h4>Notes</h4>
                  </div>
                  <p>
                    Turn the notes you already took into cards you can
                    actually review.
                  </p>
                </div>
              </div>
            </div>

            <div className="lp-showcase-visual lp-reveal" ref={addReveal}>
              <div className="lp-mock-browser">
                <div className="lp-mock-bar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="lp-mock-body">
                  <span className="lp-mock-q-label">Question 3 of 8</span>
                  <div className="lp-mock-q">
                    Our Solar System is part of which galaxy?
                  </div>
                  <div className="lp-mock-opt sel">
                    <span className="lp-letter">A</span> The Milky Way
                  </div>
                  <div className="lp-mock-opt">
                    <span className="lp-letter">B</span> Andromeda
                  </div>
                  <div className="lp-mock-opt">
                    <span className="lp-letter">C</span> Triangulum
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <div className="lp-quote-section lp-reveal" ref={addReveal}>
            <span className="lp-quote-mark">&ldquo;</span>
            <blockquote>
              I stopped rewriting my lecture notes by hand at midnight. I
              paste the video link, and by the time I&apos;ve made tea, I
              have a quiz waiting.
            </blockquote>
            <div className="lp-quote-author">
              <strong>Final-year student</strong> · Computer Science
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-section-head center lp-reveal" ref={addReveal}>
            <span className="lp-kicker">Good to know</span>
            <h2>A few things people ask first.</h2>
          </div>
          <div className="lp-faq-list">
            <div className="lp-faq-item lp-reveal" ref={addReveal}>
              <h4>What happens to the content I paste in?</h4>
              <p>
                It's used only to generate your flashcards, summary, and
                quiz. Your resources stay private to your account.
              </p>
            </div>
            <div className="lp-faq-item lp-reveal" ref={addReveal}>
              <h4>What if the AI gets something wrong?</h4>
              <p>
                You can review every flashcard and quiz answer against the
                source material, and regenerate a resource any time it
                doesn't feel right.
              </p>
            </div>
            <div className="lp-faq-item lp-reveal" ref={addReveal}>
              <h4>Do I need a long video or article for this to work well?</h4>
              <p>
                Shorter material works, but videos with subtitles and text
                over 500 words tend to produce noticeably richer flashcards
                and quizzes.
              </p>
            </div>
            <div className="lp-faq-item lp-reveal" ref={addReveal}>
              <h4>Is there a limit to how many resources I can create?</h4>
              <p>
                You can create resources at your own pace — there's no daily
                cap while you're studying for something that matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-final-cta">
        <div className="lp-wrap">
          <h2 className="lp-reveal" ref={addReveal}>
            Your next study session starts with one link.
          </h2>
          <p className="lp-reveal" ref={addReveal}>
            No setup, no formatting — just paste, and see what comes back.
          </p>
          <div ref={addReveal}>
            <Link
              href="/login"
              className="lp-btn-primary lp-reveal"
              style={{ display: "inline-flex" }}
              ref={addReveal}
            >
              Create your first resource
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
      </section>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-brand">
            <span
              className="lp-brand-mark"
              style={{ width: 26, height: 26, borderRadius: 7 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5C4 4.67 4.67 4 5.5 4H12V20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 5.5C20 4.67 19.33 4 18.5 4H12V20H18.5C19.33 20 20 19.33 20 18.5V5.5Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            © 2026 StudyBuddy
          </div>
          <div className="lp-footer-links">
            <a href="#how">How it works</a>
            <a href="#sources">Sources</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}