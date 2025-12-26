// api/currency/fetch

import { dbConnect } from "../../../utils/mongoose";
import Currency from "../../../models/currency";
import { NextResponse } from "next/server";

// ⏳ delay helper to avoid rate limit issues
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    // 🛑 Check API Authentication
    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 🌍 Currency List
    const currencyList = [
      { name: "Australian Dollar", code: "AUD" },
      { name: "Brazilian Real", code: "BRL" },
      { name: "Bulgarian Lev", code: "BGN" },
      { name: "Canadian Dollar", code: "CAD" },
      { name: "Chinese Yuan", code: "CNY" },
      { name: "Czech Koruna", code: "CZK" },
      { name: "Danish Krone", code: "DKK" },
      { name: "Euro", code: "EUR" },
      { name: "Hong Kong Dollar", code: "HKD" },
      { name: "Hungarian Forint", code: "HUF" },
      { name: "Icelandic Krona", code: "ISK" },
      { name: "Indonesian Rupiah", code: "IDR" },
      { name: "Israeli Shekel", code: "ILS" },
      { name: "Japanese Yen", code: "JPY" },
      { name: "Malaysian Ringgit", code: "MYR" },
      { name: "Mexican Peso", code: "MXN" },
      { name: "New Zealand Dollar", code: "NZD" },
      { name: "Norwegian Krone", code: "NOK" },
      { name: "Philippine Peso", code: "PHP" },
      { name: "Polish Zloty", code: "PLN" },
      { name: "Pound Sterling", code: "GBP" },
      { name: "Romanian Leu", code: "RON" },
      { name: "Russian Ruble", code: "RUB" },
      { name: "Singapore Dollar", code: "SGD" },
      { name: "South African Rand", code: "ZAR" },
      { name: "South Korean Won", code: "KRW" },
      { name: "Swedish Krona", code: "SEK" },
      { name: "Swiss Franc", code: "CHF" },
      { name: "Thai Baht", code: "THB" },
      { name: "Turkish Lira", code: "TRY" },
      { name: "US Dollar", code: "USD" },
    ];

    // 🔁 Loop and safely fetch + store
    for (let cur of currencyList) {
      try {
        const api = await fetch(
          `https://free.ratesdb.com/v1/rates?from=${cur.code}&to=INR`,
          { cache: "no-cache" }
        );

        // If empty or invalid response
        if (!api.ok) {
          console.log(`❌ Failed for ${cur.code} (${api.status})`);
          continue;
        }

        const res = await api.json();

        const rate = res?.data?.rates?.INR;
        if (!rate) {
          console.log(`⚠️ No INR rate for ${cur.code}`);
          continue;
        }

        // 💾 Save to DB
        await Currency.findOneAndUpdate(
          { code: cur.code },
          { name: cur.name, rateInINR: rate, updatedAt: new Date() },
          { upsert: true }
        );

        console.log(`✅ Updated ${cur.code} @ ₹${rate}`);

      } catch (error) {
        console.log(`⚡ Error fetching ${cur.code}:`, error);
        continue;
      }

      // ⏳ Wait 0.3 sec to avoid free API blocking
      await delay(300);
    }

    return NextResponse.json({ message: "Currency Updated Successfully" });

  } catch (err) {
    console.log("Currency Fetch Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
