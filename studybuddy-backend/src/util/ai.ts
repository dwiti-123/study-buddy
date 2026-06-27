// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
// export const generateAIStudyContent = async (content: string) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

//   // Add the response schema in the prompt to make it even more likely to follow the format.
//  const prompt = `
// You are a helpful study assistant.
// Given the following study material, generate:

// 1. A concise and clear title.
// 2. A summary in 3-4 short paragraphs.
// 3. 5 flashcards with front and back.
// 4. 5 quiz questions of each type: MCQ, True/False, Fill in the Blank, Descriptive.

// Respond ONLY in valid raw JSON format with the following exact keys:

// {
//   "title": "string",
//   "summary": "string",
//   "flashcards": [
//     { "front": "string", "back": "string" }
//   ],
//   "quiz": [
//     { "question": "string", "options": ["string"], "answer": "string", "type": "mcq|true_false|fill_blank|descriptive" }
//   ]
// }

// Content:
// ${content.slice(0, 8000)}
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     let text = result.response.text();

//     // 1. Trim whitespace and newlines from the start and end of the response.
//     text = text.trim();

//     // 2. Remove the starting and ending markdown code block markers if they exist.
//     // This is the most critical fix for your error.
//     if (text.startsWith('```json')) {
//       text = text.substring(7); // Remove '```json'
//     }
//     if (text.endsWith('```')) {
//       text = text.substring(0, text.length - 3); // Remove '```'
//     }
    
//     // 3. Trim again in case there was whitespace after the markers.
//     text = text.trim();
    
//     const parsed = JSON.parse(text);

//     return {
//       ...parsed,
//       // You should update this to reflect the actual model used: "gemini-2.5-flash-lite"
//       model: "gemini-2.5-flash-lite", 
//     };
//   } catch (err: any) {
//     console.error("Gemini API error (JSON parsing or API call failed):", err.message);
//     throw new Error("Failed to generate AI study content");
//   }
// };
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
export const generateAIStudyContent = async (content: string) => {
  const prompt = `
You are a helpful study assistant.
Given the following study material, generate:

1. A concise and clear title.
2. A summary in 3-4 short paragraphs.
3. 5 flashcards with front and back.
4. 5 quiz questions of each type: MCQ, True/False, Fill in the Blank, Descriptive.

IMPORTANT for MCQ questions: All 4 options must be completely different from each other.
No two options should have the same meaning or be duplicates.
The correct answer must be one of the 4 options, written exactly the same way.

IMPORTANT for Fill in the Blank questions: The "question" field MUST contain "____"
(four underscores) to mark the blank. Example: "The capital of France is ____."
The "answer" field should contain only the word/phrase that fills the blank.


Respond ONLY in valid raw JSON format with the following exact keys:

{
  "title": "string",
  "summary": "string",
  "flashcards": [
    { "front": "string", "back": "string" }
  ],
  "quiz": [
    { "question": "string", "options": ["string"], "answer": "string", "type": "mcq|true_false|fill_blank|descriptive" }
  ]
}

Content:
${content.slice(0, 8000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    let text = response.text ?? "";
    text = text.trim();
    if (text.startsWith("```json")) text = text.substring(7);
    if (text.startsWith("```")) text = text.substring(3);
    if (text.endsWith("```")) text = text.substring(0, text.length - 3);
    text = text.trim();

    const parsed = JSON.parse(text);
    return { ...parsed, model: "gemini-2.5-flash" };
  } catch (err: any) {
    console.error("Gemini API error:", err.message);
    throw new Error("Failed to generate AI study content");
  }
};