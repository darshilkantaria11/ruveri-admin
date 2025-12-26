

import MetalPrice from "../../../models/metalPrice";
import { dbConnect } from "../../../utils/mongoose";
import Currency from "../../../models/currency";
import { NextResponse } from "next/server";

const TROY_OUNCE_TO_GRAM = 31.1035;

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
const isCron = req.headers.get("x-vercel-cron") === "1";
const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!isCron && authKey !== SERVER_API_KEY) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}


    await dbConnect();

    // 🔹 Get USD → INR rate from Currency table
    const usd = await Currency.findOne({ code: "USD" });
    if (!usd) {
      return NextResponse.json(
        { error: "USD rate not found" },
        { status: 400 }
      );
    }

    const USD_TO_INR = usd.rateInINR;

    // 🔸 Fetch Gold & Silver prices
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU", { cache: "no-store" }),
      fetch("https://api.gold-api.com/price/XAG", { cache: "no-store" }),
    ]);

    if (!goldRes.ok || !silverRes.ok) {
      return NextResponse.json(
        { error: "Metal API failed" },
        { status: 500 }
      );
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    // 🔢 CALCULATIONS
    // Step 1: Troy oz → gram
    const goldPerGramUSD = goldData.price / TROY_OUNCE_TO_GRAM;
    const silverPerGramUSD = silverData.price / TROY_OUNCE_TO_GRAM;

    // Step 2: USD → INR
    const goldInINR = goldPerGramUSD * USD_TO_INR;
    const silverInINR = silverPerGramUSD * USD_TO_INR;

    // Step 3: Apply multipliers
    const finalGoldPrice = goldInINR * 1.0845;
    const finalSilverPrice = silverInINR * 1.14;

    // 💾 Save to DB
    await MetalPrice.findOneAndUpdate(
      { metal: "GOLD" },
      { priceInINR: finalGoldPrice, updatedAt: new Date() },
      { upsert: true }
    );

    await MetalPrice.findOneAndUpdate(
      { metal: "SILVER" },
      { priceInINR: finalSilverPrice, updatedAt: new Date() },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Metal prices updated successfully",
    });

  } catch (err) {
    console.error("Metal Fetch Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  return POST(req);
}
