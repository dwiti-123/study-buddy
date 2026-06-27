// src/util/youtube.ts

// @ts-ignore
import { YoutubeTranscript } from "youtube-transcript";

export const getYouTubeTranscript = async (
  url: string
): Promise<string | null> => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);

    if (!transcript?.length) {
      return null;
    }

    return transcript.map((item: any) => item.text).join(" ");
  } catch (err) {
    console.error("Transcript error:", err);
    return null;
  }
};