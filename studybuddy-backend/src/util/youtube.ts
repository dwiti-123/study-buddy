import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

export const getYouTubeTranscript = async (url: string): Promise<string> => {
  try {
    // Try fetching English transcript first
    const englishTranscript = await YoutubeTranscript.fetchTranscript(url, {
      lang: "en",
    });

    if (englishTranscript && englishTranscript.length > 0) {
      return englishTranscript.map(item => item.text).join(" ");
    }

    // Fallback: fetch default language if English not found
    const defaultTranscript = await YoutubeTranscript.fetchTranscript(url);
    return defaultTranscript.map(item => item.text).join(" ");
  } catch (error) {
    console.error("Failed to fetch transcript:", error);
    throw new Error("Transcript not available");
  }
};

