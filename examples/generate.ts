// TypeScript / Bun / Node 22+ example for Koe (声)
// Run: HANZO_API_KEY=... bun run examples/generate.ts

import { writeFileSync } from "node:fs";

const apiKey = process.env.HANZO_API_KEY;
if (!apiKey) throw new Error("Set HANZO_API_KEY");

const prompt = process.argv[2] ?? "Describe the change. Hanzo Dev ships it to production.";

const res = await fetch("https://api.hanzo.ai/v1/audio/voice", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "koe",
    input: prompt, voice: "alloy",
  }),
});

if (!res.ok) {
  throw new Error(`koe failed (${res.status}): ${await res.text()}`);
}

const buf = Buffer.from(await res.arrayBuffer());
const outPath = "/tmp/koe.mp3";
writeFileSync(outPath, buf);
console.log(`Saved ${buf.byteLength} bytes to ${outPath}`);
