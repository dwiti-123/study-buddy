import { z } from "zod";
import { ResourceType } from "../types/enum";

export const generateResourceSchema = z.object({
  type: z.nativeEnum(ResourceType),
  content: z.string().min(5, "Content or link is required"),
});