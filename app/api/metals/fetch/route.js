import MetalPrice from "../../../models/metalPrice";
import { dbConnect } from "../../../utils/mongoose";
import Currency from "../../../models/currency";
import { NextResponse } from "next/server";

const TROY_OUNCE_TO_GRAM = 31.1035;

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 🔹 USD → INR
    const usd = await Currency.findOne({ code: "USD" });
    if (!usd) {
      return NextResponse.json({ error: "USD rate missing" }, { status: 400 });
    }

    const USD_TO_INR = usd.rateInINR;

    // 🔸 Fetch metals
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU", { cache: "no-store" }),
      fetch("https://api.gold-api.com/price/XAG", { cache: "no-store" }),
    ]);

    if (!goldRes.ok || !silverRes.ok) {
      return NextResponse.json({ error: "Metal API failed" }, { status: 500 });
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const goldINR =
      (goldData.price / TROY_OUNCE_TO_GRAM) * USD_TO_INR * 1.0845;
    const silverINR =
      (silverData.price / TROY_OUNCE_TO_GRAM) * USD_TO_INR * 1.14;

    await MetalPrice.findOneAndUpdate(
      { metal: "GOLD" },
      { priceInINR: goldINR, updatedAt: new Date() },
      { upsert: true }
    );

    await MetalPrice.findOneAndUpdate(
      { metal: "SILVER" },
      { priceInINR: silverINR, updatedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ message: "Metal prices updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  return POST(req);
}
