import { dbConnect } from '../../../utils/mongoose';
import Product from '../../../models/product';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // 🔒 Extract API Key from Headers
        const authKey = req.headers.get("x-api-key");
        const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
        
        // ❌ Reject Unauthorized Requests
        if (!authKey || authKey !== SERVER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        const {
            category,
            status,
            productName,
            strikeoutPrice,
            originalPrice,
            img1,
            img2,
            img3,
            img4,
            description,
            material,
        } = data;

        // ✅ Validate Required Fields (img3 & img4 are optional now)
        if (
            !productName ||
            !strikeoutPrice ||
            !originalPrice ||
            !img1 ||
            !img2 ||
            !description ||
            !material
        ) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // ✅ Create New Product
        const newProduct = new Product({
            category,
            status,
            productName,
            strikeoutPrice,
            originalPrice,
            img1,
            img2,
            img3: img3 || null,  // optional
            img4: img4 || null,  // optional
            description,
            material,
        });

        await newProduct.save();

        return NextResponse.json({ message: "Product added successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
