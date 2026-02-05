import mongoose, { Schema, Document } from "mongoose";
import type { AIRevision, Flashcard, QuizQuestion, StudyResourceDocument } from "../types/props";
import { DifficultyLevel, QuizQuestionType, ResourceType } from "../types/enum";


// ========================
// Sub-Schemas
// ========================

export const flashcardSchema = new Schema<Flashcard>({
  front: { type: String, required: true },
  back: { type: String, required: true },
});

const quizQuestionSchema = new Schema<QuizQuestion>({
  type: {
    type: String,
    enum:[...Object.values( QuizQuestionType)],
    required: true,
  },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
});

const aiRevisionSchema = new Schema<AIRevision>({
  weakTopics: [{ type: String }],
  revisionPlan: {
    next30Days: [{ type: String }],
    spacedRevision: [{ type: String }],
  },
});

// ========================
// Main Schema
// ========================

export const studyResourceSchema = new Schema<StudyResourceDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, enum: Object.values(ResourceType), required: true },
    title: { type: String, required: true },
    source: { type: String },
    originalContent: { type: String, required: true },
    summary: { type: String },

    flashcards: [flashcardSchema],
    quiz: [quizQuestionSchema],
    aiRevision: aiRevisionSchema,

    isAIProcessed: { type: Boolean, default: false },
    tags: [{ type: String }],
    difficultyLevel: {
      type: String,
      enum: DifficultyLevel,
      default: "medium",
    },
    scoreHistory: [
      {
        date: { type: Date, default: Date.now },
        score: { type: Number },
      },
    ],
    aiModelUsed: { type: String },
  },
  { timestamps: true }
);

// ========================
// Export Model
// ========================

export const StudyResource = mongoose.model<StudyResourceDocument>(
  "StudyResource",
  studyResourceSchema
);
