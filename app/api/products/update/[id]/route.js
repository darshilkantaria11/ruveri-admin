import { dbConnect } from "../../../../utils/mongoose";
import Product from "../../../../models/product";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const {
      productName,
      strikeoutPrice,
      originalPrice,
      img1,
      img2,
      img3,
      img4,
      description,
      material,
      category,
      status,
    } = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        strikeoutPrice,
        originalPrice,
        img1,
        img2,
        img3,
        img4,
        description,
        material,
        category,
        status,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
