import { Innertube } from "youtubei.js";
import fs from "fs";

export async function downloadAudio(url: string): Promise<string> {
  const filePath = `./audio-${Date.now()}.mp3`;

  const youtube = await Innertube.create({
    cookie: process.env.YOUTUBE_COOKIE ?? "",
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }),
  });

  const info = await youtube.getInfo(url);

  const stream = await info.download({
    type: "audio",
    quality: "best",
  });

  const fileStream = fs.createWriteStream(filePath);
  const reader = stream.getReader();

  await new Promise<void>((resolve, reject) => {
    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fileStream.write(value);
        }
        fileStream.end();
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      } catch (err) {
        fileStream.destroy();
        reject(err);
      }
    };
    pump();
  });

  return filePath;
}