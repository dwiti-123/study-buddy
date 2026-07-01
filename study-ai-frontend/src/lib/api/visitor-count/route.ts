import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Stored outside the repo's build output so it isn't wiped on redeploy
// in a typical long-running Node server. On serverless hosts (Vercel,
// Netlify, etc.) this file resets per instance — swap for a DB call there.
const COUNTER_FILE = path.join(process.cwd(), ".data", "visitor-count.json");

async function readCount(): Promise<number> {
  try {
    const raw = await fs.readFile(COUNTER_FILE, "utf-8");
    return JSON.parse(raw).count ?? 0;
  } catch {
    return 0;
  }
}

async function writeCount(count: number) {
  await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
  await fs.writeFile(COUNTER_FILE, JSON.stringify({ count }), "utf-8");
}

// GET: increments by 1 and returns the new total.
// The landing page calls this once per page load.
export async function GET() {
  const current = await readCount();
  const next = current + 1;
  await writeCount(next);
  return NextResponse.json({ count: next });
}