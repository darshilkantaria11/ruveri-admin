import { dbConnect } from "../../../../utils/mongoose";
import Product from "../../../../models/product";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  // Unwrap params before accessing
  const { params } = context;
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    // 🔒 Extract API Key from Headers
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    // ❌ Reject Unauthorized Requests
    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const {
      productName,
      makingCharges,
      metalPrice,
      grossWeight,
      netWeight,
      metal,
      purity,
      color,
      gender,
      img1,
      img2,
      img3,
      img4,
      description,
      category,
      status,
    } = await req.json();

    // 🛑 Validate Required Fields (img3 & img4 are optional)
    if (
      !productName ||
      !makingCharges ||
      !metalPrice ||
      !grossWeight ||
      !netWeight ||
      !metal ||
      !purity ||
      !color ||
      !gender ||
      !img1 ||
      !img2 ||
      !description ||
      !category ||
      !status
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔁 Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        makingCharges,
        metalPrice,
        grossWeight,
        netWeight,
        metal,
        purity,
        color,
        gender,
        img1,
        img2,
        img3: img3 || null,
        img4: img4 || null,
        description,
        category,
        status,
      },
      { new: true }
    );

    // ⚠️ If no product found
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
