// ========================
// Subdocument Interfaces
// ========================

import type mongoose from "mongoose";
import type { DifficultyLevel, QuizQuestionType, ResourceType } from "./enum";

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  type:QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface AIRevision {
  weakTopics: string[];
  revisionPlan: {
    next30Days: string[];
    spacedRevision: string[];
  };
}

// ========================
// Main Document Interface
// ========================

export interface StudyResourceDocument extends Document {
  user: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  type:ResourceType;
  title: string;
  source?: string;
  originalContent: string;
  summary?: string;
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
  aiRevision?: AIRevision;
  isAIProcessed: boolean;
  tags?: string[];
  difficultyLevel?:DifficultyLevel;
  scoreHistory?: { date: Date; score: number }[];
  aiModelUsed?: string;
}

export interface AIOutput  {
  title: string;
  summary: string;
  flashcards?: { front: string; back: string }[];
  quiz?: { question: string; options?: string[]; answer: string; type?: string }[];
  model: string;
};

export interface UserAnswer {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  type: QuizQuestionType;
  isCorrect?: boolean;
}

//TODO:check descriptive answer coorectness based on embeding
export interface QuizScores {
  mcq: number;
  trueFalse: number;
  fillBlank: number;
  descriptive: number;
  total: number;
}

export interface UserQuizAttemptDocument extends Document {
  user: mongoose.Types.ObjectId;
  quizResource: mongoose.Types.ObjectId;
  answers: UserAnswer[];
  scores: QuizScores;
}

