import { NextResponse } from "next/server";

let cachedToken = null;
let tokenGeneratedAt = null;

export async function GET(req) {
  const authHeader = req.headers.get("x-api-key");
  if (authHeader !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  if (cachedToken && tokenGeneratedAt && now - tokenGeneratedAt < 9 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ token: cachedToken });
  }

  // 🧩 Add these lines for debugging
  console.log("Shiprocket Email:", process.env.SHIPROCKET_EMAIL);
  console.log("Password exists:", !!process.env.SHIPROCKET_PASSWORD);

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: "qI6n$hN#kmse8C!K",
    }),
  });

  const data = await res.json();

  // 🧩 Optional: Log the full response if token fails
  if (!data.token) {
    console.error("Shiprocket login failed response:", data);
    return NextResponse.json({ error: "Failed to generate token", detail: data }, { status: 500 });
  }

  cachedToken = data.token;
  tokenGeneratedAt = now;

  return NextResponse.json({ token: data.token });
}
