import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { StudyResource } from "../model/studyResources";
import { QuizQuestionType, ResourceType } from "../types/enum";
import { getYouTubeTranscript } from "../util/youtube";
import { generateAIStudyContent } from "../util/ai";
import type { AIOutput } from "../types/props";

export const generateStudyResource = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { type, source, originalContent } = req.body;

    if (!type || !Object.values(ResourceType).includes(type)) {
      res.status(400).json({success:false, message: "Invalid resource type" });
      return;
    }

    if (type === ResourceType.YOUTUBE && !source) {
      res.status(400).json({success:false, message: "YouTube link is required" });
      return;
    }

    if (type !== ResourceType.YOUTUBE && !originalContent) {
      res.status(400).json({success:false, message: "Content is required" });
      return;
    }

    let content = originalContent;
    if (type === ResourceType.YOUTUBE) {
      try {
        content = await getYouTubeTranscript(source);
      } catch (err) {
        res.status(500).json({success:false, message: "Failed to fetch YouTube transcript" });
        return;
      }
    }

    const aiOutput: AIOutput = await generateAIStudyContent(content);

    const mappedQuiz = (aiOutput.quiz ?? []).map((q) => ({
      question: q.question,
      options: q.options || [],
      correctAnswer: q.answer,
      type: (q.type as QuizQuestionType) || QuizQuestionType.MCQ,
    }));

    const mappedFlashcards = (aiOutput.flashcards || []).map((f) => ({
      front: f.front,
      back: f.back,
    }));
    const newResource = await StudyResource.create({
      user: userId,
      createdBy: userId,
      updatedBy: userId,
      type,
      source,
      originalContent: content,
      summary: aiOutput.summary,
      title: aiOutput.title,
      flashcards: mappedFlashcards,
      quiz: mappedQuiz,
      isAIProcessed: true,
      aiModelUsed: aiOutput.model,
    });
    res.status(201).json({
      sucess:true,
      message: "Study resource created successfully",
      resource: newResource,
    });
  }
);

export const getUserStudyResources = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    return;
  }

  const resources = await StudyResource.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: resources.length,
    resources,
  });
});

// @desc Get single study resource by ID
// @route GET /api/resources/:id
// @access Private
export const getStudyResourceById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  const resource = await StudyResource.findOne({ _id: id, user: userId });

  if (!resource) {
    res.status(404).json({ success: false, message: "Resource not found" });
    return;
  }

  res.status(200).json({
    success: true,
    resource,
  });
});