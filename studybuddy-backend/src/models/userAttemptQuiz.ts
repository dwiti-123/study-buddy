import mongoose, { Schema } from "mongoose";
import type { QuizScores, UserAnswer, UserQuizAttemptDocument } from "../types/props";
import { QuizQuestionType } from "../types/enum";


const userAnswerSchema = new Schema<UserAnswer>({
  questionId: String,
  question: String,
  selectedAnswer: String,
  correctAnswer: String,
  type: { type: String, enum:QuizQuestionType, required: true },
  isCorrect: { type: Boolean, default: false },
});

const scoresSchema = new Schema<QuizScores>({
  mcq: { type: Number, default: 0 },
  trueFalse: { type: Number, default: 0 },
  fillBlank: { type: Number, default: 0 },
  descriptive: { type: Number, default: 0 },//TODO:check descriptive answer string mtaching using embedeing
  total: { type: Number, default: 0 },
});

const userQuizAttemptSchema = new Schema<UserQuizAttemptDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizResource: { type: Schema.Types.ObjectId, ref: "StudyResource", required: true },
    answers: [userAnswerSchema],
    scores: scoresSchema,
  },
  { timestamps: true }
);

export const UserQuizAttempt = mongoose.model<UserQuizAttemptDocument>(
  "UserQuizAttempt",
  userQuizAttemptSchema
);