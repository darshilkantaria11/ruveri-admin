import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
      console.warn("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, name, number, email, address, city, state, pincode, amount, items, method } = body;

    console.log("Incoming order data:", body);

    // 🔐 Get token from secure endpoint
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shiprocket/token`, {
      headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Failed to fetch token:", errorText);
      return NextResponse.json({ error: "Failed to get token", detail: errorText }, { status: 500 });
    }

    const { token } = await tokenRes.json();
    console.log("Fetched token:", token);

    const paymentMethod = method === "COD" ? "COD" : "Prepaid";

    // 🆕 Calculate total quantity for scaling
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

const orderPayload = {
  order_id: orderId,
  order_date: new Date().toISOString().split("T")[0],
  pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION, // ✅ required field
  channel_id: "", // optional
  billing_customer_name: name,
  billing_last_name: ".",
  billing_address: address.split("\n")[0] || address,
  billing_address_2: address.split("\n")[1] || "",
  billing_city: city,
  billing_state: state,
  billing_pincode: pincode,
  billing_country: "India",
  billing_email: email,
  billing_phone: number,
  shipping_is_billing: true,

  order_items: items.map((item) => {
    const basePrice = item.amount / item.quantity;
    return {
      name: item.productName,
      sku: item.productId,
      units: item.quantity,
      selling_price: basePrice,       // inclusive of GST
      discount: item.discount || 0,   // optional
      tax: item.tax || 3,            // ✅ specify GST % (set default 18 or per product)
      hsn: item.hsn || "7113",        // optional but useful for jewelry/accessories etc
    };
  }),

  payment_method: method === "COD" ? "COD" : "Prepaid",
  shipping_charges: 0,
  total_discount: 0,
  sub_total: amount,
  length: parseFloat(process.env.SHIPPING_LENGTH || 10),
  breadth: parseFloat(process.env.SHIPPING_WIDTH || 10),
  height: parseFloat(process.env.SHIPPING_HEIGHT || 10),
  weight: parseFloat(process.env.SHIPPING_WEIGHT || 0.5),

  order_type: "NON ESSENTIALS", // optional
  is_insurance_opt: false, // optional
};



    console.log("Sending order payload to Shiprocket:", JSON.stringify(orderPayload, null, 2));

    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    console.log("Shiprocket API response:", JSON.stringify(data, null, 2));

    if (data.status_code === 1) {
      return NextResponse.json({ success: true, shipment_id: data.shipment_id });
    } else {
      return NextResponse.json(
        {
          error: "Failed to place order",
          detail: data.message || "Unknown error",
          shiprocketResponse: data,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unexpected Error in /api/shiprocket/order:", err);
    return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
  }
}
