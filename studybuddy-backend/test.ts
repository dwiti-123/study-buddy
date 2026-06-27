// @ts-ignore
import { YoutubeTranscript } from "youtube-transcript";

async function test() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(
      "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    );

    console.log("SUCCESS");
    console.log(transcript.length);
  } catch (err) {
    console.error("FAILED");
    console.error(err);
  }
}

test();