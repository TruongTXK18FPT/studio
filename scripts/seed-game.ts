import { redis } from "@/lib/db";

async function main() {
  const sample = [
    { id: "q1", question: "Capital of Vietnam?", answers: ["Hanoi", "Saigon", "Hue", "Danang"], correctIndex: 0 },
    { id: "q2", question: "2+2= ?", answers: ["4", "3", "5", "22"], correctIndex: 0 },
    { id: "q3", question: "Color of sky?", answers: ["Blue", "Green", "Red", "Yellow"], correctIndex: 0 },
    { id: "q4", question: "Largest ocean?", answers: ["Pacific", "Atlantic", "Indian", "Arctic"], correctIndex: 0 },
    { id: "q5", question: "JS runtime in Chrome?", answers: ["V8", "SpiderMonkey", "Chakra", "Hermes"], correctIndex: 0 },
    { id: "q6", question: "HTTP 200 means?", answers: ["OK", "Created", "Accepted", "Error"], correctIndex: 0 },
    { id: "q7", question: "Binary of 2?", answers: ["10", "11", "01", "00"], correctIndex: 0 },
    { id: "q8", question: "Prime number?", answers: ["7", "8", "9", "10"], correctIndex: 0 },
    { id: "q9", question: "CSS units?", answers: ["px", "kg", "m", "l"], correctIndex: 0 },
    { id: "q10", question: "Next.js uses?", answers: ["React", "Vue", "Svelte", "Angular"], correctIndex: 0 },
  ];

  await redis.set("br:questions", sample);
  console.log("Seeded 10 sample questions.");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });


