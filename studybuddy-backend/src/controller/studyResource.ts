import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { StudyResource } from "../models/studyResources";
import { QuizQuestionType, ResourceType } from "../types/enum";
import { getYouTubeTranscript } from "../util/youtube";
import { generateAIStudyContent } from "../util/ai";
import type { AIOutput } from "../types/props";
import { transcribeAudio } from "../util/transcaribeaudio";
import { downloadAudio } from "../util/youtubeAudio";
import fs from "fs";
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
  } catch {
    console.log("Transcript unavailable. Falling back to audio...");
    let audioPath: string | null = null;
    try {
      audioPath = await downloadAudio(source);
      content = await transcribeAudio(audioPath);
    } catch (audioErr) {
      res.status(422).json({
        success: false,
        message:
          "Could not extract content from this video. It may be private, deleted, or region-locked.",
      });
      return;
    } finally {
      if (audioPath && fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }
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
  const { search, page = 1, limit = 6 } = req.query;

  const filter: any = { user: userId };

  // Add search filter if provided
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];
  }

  const total = await StudyResource.countDocuments(filter);
  const resources = await StudyResource.find(filter)
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);

  res.status(200).json({
    success: true,
    count: total,
    totalPages: Math.ceil(total / +limit),
    currentPage: +page,
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