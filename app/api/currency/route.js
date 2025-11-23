import { dbConnect } from "../../utils/mongoose";
import Currency from "../../models/currency";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // 🔐 Read API key from headers
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    // 🚫 Unauthorized Access
    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📌 DB Connect + Fetch Sorted List
    await dbConnect();
    const data = await Currency.find().sort({ name: 1 });

    return NextResponse.json({ data });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
