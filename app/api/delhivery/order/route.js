// app/api/delhivery/order/route.js

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      orderId,
      name,
      number,
      email,
      address,
      city,
      state,
      pincode,
      amount,
      method,
      items
    } = payload;

    console.log('Received order for Delhivery:', { orderId, name, city, state, pincode });

    // Validate mandatory fields
    const mandatoryFields = { name, number, address, pincode, city, state };
    const missingFields = Object.entries(mandatoryFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing mandatory fields',
          missingFields,
          receivedData: { orderId, name, number, address, city, state, pincode }
        }),
        { status: 400 }
      );
    }

    // Calculate total weight (300gm per quantity)
    const totalWeight = items.reduce((total, item) => {
      return total + (item.quantity * 0.3); // 300gm = 0.3kg per item
    }, 0);

    // Prepare products description for invoice
    const productsDesc = items.map(item => 
      `${item.productName || 'Product'} x ${item.quantity}`
    ).join(', ');

    // Build complete shipment data structure
    const dataObject = {
      client: process.env.DELHIVERY_CLIENT_NAME,
      pickup_location: {
        name: process.env.DELHIVERY_PICKUP_NAME,
        address: process.env.DELHIVERY_PICKUP_ADDRESS,
        city: process.env.DELHIVERY_PICKUP_CITY,
        state: process.env.DELHIVERY_PICKUP_STATE,
        pin: process.env.DELHIVERY_PICKUP_PINCODE,
        phone: process.env.DELHIVERY_PICKUP_PHONE,
        country: "India",
      },
      shipments: [
        {
          // Basic mandatory fields
          order: orderId.toString(),
          phone: number.toString(),
          name: name.trim(),
          add: address,
          city: city,
          state: state,
          pin: pincode.toString(),
          country: "India",
          
          // Payment information
          cod_amount: method === "COD" ? parseFloat(amount).toFixed(2) : "0",
          total_amount: parseFloat(amount).toFixed(2),
          payment_mode: method === "COD" ? "COD" : "Prepaid",
          
          // Product information
          product: productsDesc,
          products_desc: productsDesc.substring(0, 499),
          quantity: items.reduce((total, item) => total + item.quantity, 0).toString(),
          weight: totalWeight.toFixed(2), // Total weight in kg
          
          // Additional required fields for invoice printing
          address_type: "home",
          seller_name: process.env.DELHIVERY_SELLER_NAME || "Your Store Name",
          seller_inv: `INV-${orderId}`,
          shipping_mode: "Surface",
          fragile_shipment: false,
          shipment_length: "15",
          shipment_width: "15", 
          shipment_height: "10",
          
          // GST and tax information (CRITICAL for invoice)
          seller_gst_tin: process.env.DELHIVERY_GST_TIN,
          hsn_code: "9997",
          invoice_reference: `INV-${orderId}`,
          
          // Return address
          return_name: process.env.DELHIVERY_CLIENT_NAME,
          return_add: process.env.DELHIVERY_PICKUP_ADDRESS,
          return_city: process.env.DELHIVERY_PICKUP_CITY,
          return_state: process.env.DELHIVERY_PICKUP_STATE,
          return_pin: process.env.DELHIVERY_PICKUP_PINCODE,
          return_phone: process.env.DELHIVERY_PICKUP_PHONE,
          return_country: "India"
        }
      ]
    };

    console.log('Sending to Delhivery:', JSON.stringify(dataObject, null, 2));

    const bodyString = `format=json&data=${JSON.stringify(dataObject)}`;

    const delhiveryRes = await fetch(
      process.env.DELHIVERY_ENV === "production"
        ? "https://track.delhivery.com/api/cmu/create.json"
        : "https://staging-express.delhivery.com/api/cmu/create.json",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: bodyString,
      }
    );

    // Handle empty response
    if (!delhiveryRes.ok) {
      const errorText = await delhiveryRes.text();
      console.error('Delhivery API error status:', delhiveryRes.status);
      console.error('Delhivery API error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Delhivery API returned ${delhiveryRes.status}: ${errorText || 'No response body'}`,
          details: errorText
        }),
        { status: delhiveryRes.status }
      );
    }

    const result = await delhiveryRes.json();
    console.log('Delhivery API success response:', result);

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          waybill: result.packages?.[0]?.waybill,
          response: result 
        }), 
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          error: result.rmk || 'Unknown error from Delhivery',
          details: result 
        }),
        { status: 400 }
      );
    }

  } catch (err) {
    console.error("Error in /api/delhivery/order:", err);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: err.message 
      }),
      { status: 500 }
    );
  }
}