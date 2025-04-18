// app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Base URL for the external API
  const baseUrl = `${process.env.API_BASE_URL}search/keyword`;

  // Forward all query parameters
  const apiUrl = `${baseUrl}?${searchParams.toString()}&random=${Math.floor(
    Math.random() * 1e8
  )}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        appid: "Reactweb",
        storeid: "mafuae",
        lang: "en",
        userid: `${process.env.USER_ID}`,
        "x-retail-api-key": `${process.env.API_RETAIL_API_KEY}`,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=0, must-revalidate",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
