import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, password } = await req.json();

  const storedUserId = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const storedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (userId === storedUserId && password === storedPassword) {
    const response = NextResponse.json({ success: true });

    // Set a secure, HTTP-only cookie
    response.cookies.set("auth-token", "admin-session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // maxAge: 60 * 60 * 4, // 4 hours
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
