// import fs from "fs";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function transcribeAudio(audioPath: string) {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//   });

//   const audioBuffer = fs.readFileSync(audioPath);

//   const result = await model.generateContent([
//     {
//       inlineData: {
//         mimeType: "audio/mpeg",
//         data: audioBuffer.toString("base64"),
//       },
//     },
//     "Transcribe this audio. Return only the exact spoken text.",
//   ]);

//   return result.response.text();
// }
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function transcribeAudio(audioPath: string) {
  const audioBuffer = fs.readFileSync(audioPath);

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "audio/mpeg",
              data: audioBuffer.toString("base64"),
            },
          },
          { text: "Transcribe this audio. Return only the exact spoken text." },
        ],
      },
    ],
  });

  return response.text;
}