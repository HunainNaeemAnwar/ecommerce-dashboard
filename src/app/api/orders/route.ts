import { NextRequest, NextResponse } from "next/server";

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_API_TOKEN = process.env.SANITY_TOKEN;

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  throw new Error("Sanity environment variables are missing!");
}

// Fetch orders based on filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(
      req.url,
      `http://${req.headers.get("host")}`
    );
    const filter = searchParams.get("filter") || "all";

    const query = `*[_type == "order"] | order(status != 'Delivered', status asc)`;

    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) throw new Error(`Sanity API error: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data.result || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status: newStatus } = body; // ✅ `orderId` body se lo

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Missing orderId or newStatus" },
        { status: 400 }
      );
    }

    const mutation = {
      mutations: [
        {
          patch: {
            id: orderId,
            set: { status: newStatus },
          },
        },
      ],
    };

    const res = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
        },
        body: JSON.stringify(mutation),
      }
    );

    if (!res.ok) throw new Error(`Sanity mutation error: ${res.status}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
