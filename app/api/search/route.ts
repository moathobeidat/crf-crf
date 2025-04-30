// app/api/search/route.ts

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Base URL for the external API
  const baseUrl = `${process.env.API_BASE_URL}search/keyword`;

  // Forward all query parameters
  const apiUrl = `${baseUrl}?${searchParams.toString()}&random=${Math.floor(Math.random() * 1e8)}`;

  console.log("Search API Request:", {
    url: apiUrl,
    headers: {
      appid: "Android",
      storeid: "mafuae",
      lang: "en",
      userid: process.env.USER_ID ? "Set" : "Missing",
      "x-retail-api-key": process.env.API_RETAIL_API_KEY ? "Set" : "Missing",
    },
  });

  try {
    console.log("Fetching from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        appid: "Android",
        storeid: "mafuae",
        lang: "en",
        userid: `${process.env.USER_ID}`,
        "x-retail-api-key": `${process.env.API_RETAIL_API_KEY}`,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=0, must-revalidate",
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      console.error("Search API error response:", {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log the response structure
    console.log("Search API response structure:", {
      hasMetaAndData: !!(data.meta && data.data),
      statusCode: data.meta?.statusCode,
      productsCount: data.data?.products?.length || 0,
    });

    // Return the raw response - our client code will handle the structure
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch search results",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
