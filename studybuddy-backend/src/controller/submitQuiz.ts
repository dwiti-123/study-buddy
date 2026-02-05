import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserQuizAttempt } from "../model/userAttemptQuiz";
import { StudyResource } from "../model/studyResources";
import { QuizQuestionType } from "../types/enum";
import { analyzeWeakTopicsWithAI } from "../util/analyzeWeakTopicsWithAI";


export const submitQuiz = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { quizResourceId, answers } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const resource = await StudyResource.findOne({
    _id: quizResourceId,
    user: userId,
  });

  if (!resource) {
    res.status(404).json({ success: false, message: "Resource not found" });
    return;
  }

  // Limit max 3 attempts
  const attemptCount = await UserQuizAttempt.countDocuments({
    user: userId,
    quizResource: quizResourceId,
  });

  if (attemptCount >= 3) {
    res.status(403).json({
      success: false,
      message: "Maximum quiz attempts (3) reached",
    });
    return;
  }

  // Process answers
  const scores = { mcq: 0, trueFalse: 0, fillBlank: 0, descriptive: 0, total: 0 };
  const incorrectAnswers: any[] = [];
  const unansweredQuestions: any[] = [];

  const processedAnswers = (answers || []).map((ans: any) => {
    const isCorrect =
      ans.type === "descriptive"
        ? false // skip descriptive evaluation for now
        : ans.selectedAnswer?.trim().toLowerCase() === ans.correctAnswer?.trim().toLowerCase();

    // Track incorrect answers (not just the question)
    if (!isCorrect) {
      incorrectAnswers.push({
        question: ans.question,
        selectedAnswer: ans.selectedAnswer || "Not answered",
        correctAnswer: ans.correctAnswer,
        type: ans.type,
      });
    }

    // Track unanswered questions
    if (!ans.selectedAnswer || ans.selectedAnswer.trim() === "") {
      unansweredQuestions.push({
        question: ans.question,
        type: ans.type,
      });
    }

    if (isCorrect) {
      if (ans.type === QuizQuestionType.MCQ) scores.mcq++;
      else if (ans.type === QuizQuestionType.TRUE_FALSE) scores.trueFalse++;
      else if (ans.type === QuizQuestionType.FILL_BLANK) scores.fillBlank++;
      else if (ans.type === QuizQuestionType.DESCRIPTIVE) scores.descriptive++;
    }

    return { ...ans, isCorrect };
  });

  scores.total = scores.mcq + scores.trueFalse + scores.fillBlank + scores.descriptive;

  // Create new attempt
  const attempt = await UserQuizAttempt.create({
    user: userId,
    quizResource: quizResourceId,
    answers: processedAnswers,
    scores,
  });

  // Update scoreHistory
  resource.scoreHistory = resource.scoreHistory ?? [];
  resource.scoreHistory.push({
    score: scores.total,
    date: new Date(),
  });

  // Generate AI analysis for weak topics using video summary + incorrect/unanswered questions
  let weakTopics: string[] = [];
  let revisionPlan: any = {};

  if (incorrectAnswers.length > 0 || unansweredQuestions.length > 0) {
    try {
      const videoSummary = resource.summary || "No summary available";
      
      const aiAnalysis = await analyzeWeakTopicsWithAI({
        videoSummary,
        incorrectAnswers,
        unansweredQuestions,
        totalQuestions: answers.length,
        correctAnswers: scores.total,
      });

      weakTopics = aiAnalysis.weakTopics || [];
      revisionPlan = aiAnalysis.revisionPlan || {};

      resource.aiRevision = {
        weakTopics,
        revisionPlan,
      };
    } catch (err) {
      console.error("AI analysis failed:", err);
      // Fall back to basic weak topics if AI fails
      weakTopics = incorrectAnswers.map((a) => a.question);
    }
  }

  await resource.save();

  res.status(201).json({
    success: true,
    message: "Quiz submitted successfully",
    attempt,
    weakTopics,
    revisionPlan,
    stats: {
      totalQuestions: answers.length,
      correctAnswers: scores.total,
      incorrectAnswers: incorrectAnswers.length,
      unansweredQuestions: unansweredQuestions.length,
      scoreBreakdown: scores,
    },
  });
});