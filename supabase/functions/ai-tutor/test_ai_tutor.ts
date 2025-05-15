// Deno test script for ai-tutor edge function
// Run with: deno test --allow-net test_ai_tutor.ts

import { assertEquals, assert } from "https://deno.land/std@0.203.0/testing/asserts.ts";

const ENDPOINT = "http://localhost:54321/functions/v1/ai-tutor"; // Change if needed
const AUTH = "Bearer test-token-123";

const validPayload = {
  message: "Can you help me with my math homework?",
  userProfile: { name: "Test Student", gamification: { learningStyle: "visual" } },
  trackId: "track-1",
  studentId: "student-1",
  learningHistory: { homework: [], quizzes: [], lessons: [] }
};

Deno.test("ai-tutor: valid request returns 200 and response", async () => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": AUTH },
    body: JSON.stringify(validPayload)
  });
  assertEquals(res.status, 200);
  const data = await res.json();
  assert(data.success === true);
  assert(typeof data.response === "string");
});

Deno.test("ai-tutor: missing message field returns 400", async () => {
  const { message, ...badPayload } = validPayload;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": AUTH },
    body: JSON.stringify(badPayload)
  });
  assertEquals(res.status, 400);
  const data = await res.json();
  assert(data.success === false);
  assert(data.error.includes("message"));
});

Deno.test("ai-tutor: invalid JSON returns 400", async () => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": AUTH },
    body: "not a json string"
  });
  assertEquals(res.status, 400);
  const data = await res.json();
  assert(data.success === false);
  assert(data.error.includes("Invalid JSON"));
});

Deno.test("ai-tutor: rate limit returns 429 after 10 requests", async () => {
  let lastStatus = 200;
  for (let i = 0; i < 12; i++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": AUTH },
      body: JSON.stringify(validPayload)
    });
    lastStatus = res.status;
    if (i < 10) {
      assertEquals(res.status, 200);
    }
  }
  assertEquals(lastStatus, 429);
}); 