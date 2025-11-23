import { dbConnect } from "../../utils/mongoose";
import Currency from "../../models/currency";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await Currency.find().sort({ name: 1 });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
