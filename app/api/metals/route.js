import MetalPrice from "../../models/metalPrice";
import { dbConnect } from "../../utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await MetalPrice.find().sort({ metal: 1 });

    return NextResponse.json({ data });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
