import { dbConnect } from '../../../../utils/mongoose';
import Product from '../../../../models/product';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
    // Unwrap params because it's now a Promise
    const { params } = context;
    const resolvedParams = await params; // <-- unwrap the promise
    const id = resolvedParams?.id;

    if (!id) {
        return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    const authKey = req.headers.get("x-api-key");

    // Secure API Key Verification
    if (!authKey || authKey !== process.env.NEXT_PUBLIC_API_KEY) { 
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
