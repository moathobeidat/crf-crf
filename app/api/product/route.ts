// app/api/product/route.ts

import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiUrl = `${process.env.API_BASE_URL}product/availability/mafuae/en`;

    console.log("Product API Request:", {
      url: apiUrl,
      body: JSON.stringify(body).substring(0, 100) + "...",
      headers: {
        Authorization: process.env.API_ACCESS_TOKEN ? "Bearer [Set]" : "Bearer [Missing]",
      },
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.error("Product API error response:", {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Product API success, items:", data.products?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product details",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
