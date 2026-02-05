import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type WeakTopicsInput = {
  videoSummary: string;
  incorrectAnswers: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    type: string;
  }>;
  unansweredQuestions: Array<{
    question: string;
    type: string;
  }>;
  totalQuestions: number;
  correctAnswers: number;
};

type AIWeakTopicsOutput = {
  weakTopics: string[];
  revisionPlan: {
    next30Days: string[];
    spacedRevision: string[];
  };
};

/**
 * Analyze weak topics using AI based on:
 * 1. Video/study material summary
 * 2. Incorrect answers (what user answered vs correct answer)
 * 3. Unanswered questions (knowledge gaps)
 * 4. Overall quiz performance
 */
export const analyzeWeakTopicsWithAI = async (
  input: WeakTopicsInput
): Promise<AIWeakTopicsOutput> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // Format incorrect answers for better analysis
  const incorrectAnswersText = input.incorrectAnswers
    .map(
      (ans, idx) =>
        `Q${idx + 1}: "${ans.question}"\n` +
        `  - User answered: "${ans.selectedAnswer}"\n` +
        `  - Correct answer: "${ans.correctAnswer}"\n` +
        `  - Question type: ${ans.type}`
    )
    .join("\n\n");

  // Format unanswered questions
  const unansweredText = input.unansweredQuestions
    .map(
      (q, idx) =>
        `Q${idx + 1}: "${q.question}" (Type: ${q.type})`
    )
    .join("\n");

  const prompt = `
You are an expert educational analyst. Analyze the following quiz attempt and identify weak topics where the student needs improvement.

STUDY MATERIAL SUMMARY:
${input.videoSummary.slice(0, 2000)}

QUIZ PERFORMANCE:
- Total Questions: ${input.totalQuestions}
- Correct Answers: ${input.correctAnswers}
- Incorrect Answers: ${input.incorrectAnswers.length}
- Unanswered Questions: ${input.unansweredQuestions.length}

INCORRECT ANSWERS (What student got wrong):
${incorrectAnswersText || "None"}

UNANSWERED QUESTIONS (Knowledge gaps):
${unansweredText || "None"}

Based on this data:
1. Identify the MAIN WEAK TOPICS (not individual questions, but broader concepts/subjects)
2. Group related mistakes together
3. Provide a structured 30-day revision plan
4. Create a spaced repetition schedule

Respond ONLY in valid JSON format:
{
  "weakTopics": [
    "Topic Name 1 - Reason why student struggled (based on answers)",
    "Topic Name 2 - Reason why student struggled (based on answers)"
  ],
  "revisionPlan": {
    "next30Days": [
      "Week 1: Focus on [Topic] - Review [specific concepts] for 30 mins daily",
      "Week 2: Practice [Topic] - Do practice problems on [specific area]",
      "Week 3: Combination - Mix questions from Week 1 & 2 topics",
      "Week 4: Final revision - Take mock test covering all weak topics"
    ],
    "spacedRevision": [
      "After 1 day: Review incorrect answers and understand correct solutions",
      "After 3 days: Solve practice problems on weak topics",
      "After 7 days: Retake the quiz to check improvement",
      "After 14 days: Final comprehensive review and assessment"
    ]
  }
}

Make sure:
- Weak topics are GENERAL TOPICS, not individual questions
- Plan is specific and actionable
- Consider the student's performance level
- Group related mistakes
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean up markdown code blocks
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.substring(7);
    }
    if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    const parsed: AIWeakTopicsOutput = JSON.parse(text);

    // Validation
    if (!Array.isArray(parsed.weakTopics)) {
      parsed.weakTopics = [];
    }
    if (!parsed.revisionPlan) {
      parsed.revisionPlan = {
        next30Days: [],
        spacedRevision: [],
      };
    }

    return parsed;
  } catch (err: any) {
    console.error("AI weak topics analysis error:", err.message);

    // Return fallback structure if AI fails
    return {
      weakTopics: [
        "Unable to analyze weak topics - Please review your incorrect answers manually",
      ],
      revisionPlan: {
        next30Days: [
          "Week 1: Review fundamental concepts",
          "Week 2: Practice related problems",
          "Week 3: Mixed practice",
          "Week 4: Final assessment",
        ],
        spacedRevision: [
          "After 1 day: Review incorrect answers",
          "After 3 days: Practice problems",
          "After 7 days: Retake quiz",
          "After 14 days: Final review",
        ],
      },
    };
  }
};