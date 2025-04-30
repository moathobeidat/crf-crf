// lib/services/search-service.ts

import type { SearchParams, SearchResponse } from "@/types/search-types";

// Use the real API endpoint
const API_BASE_URL = "/api/search";

export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  // Build query string from params
  const queryParams = new URLSearchParams();

  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.currentPage !== undefined)
    queryParams.append("currentPage", params.currentPage.toString());
  if (params.pageSize !== undefined) queryParams.append("pageSize", params.pageSize.toString());
  if (params.minPrice !== undefined) queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append("maxPrice", params.maxPrice.toString());

  const url = `${API_BASE_URL}?${queryParams.toString()}&random=${Math.floor(Math.random() * 1e8)}`;

  console.log("Fetching products from:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=0, must-revalidate",
      },
    });

    if (!response.ok) {
      console.error(`Search API error: ${response.status}`);
      throw new Error(`Search API error: ${response.status}`);
    }

    const rawData = await response.json();

    // Log the response structure
    console.log("API Response Structure:", {
      hasMetaAndData: !!(rawData.meta && rawData.data),
      statusCode: rawData.meta?.statusCode,
      dataKeys: rawData.data ? Object.keys(rawData.data) : null,
      productsLength: rawData.data?.products?.length || 0,
    });

    // Handle the new API response structure
    if (rawData.meta && rawData.data) {
      // New API structure with meta and data fields
      if (rawData.meta.statusCode === 200) {
        // Map the new structure to the expected SearchResponse format
        const searchResponse: SearchResponse = {
          products: rawData.data.products || [],
          facets: rawData.data.facets || [],
          filters: rawData.data.filters || [],
          pagination: rawData.data.pagination || {
            pageSize: params.pageSize || 32,
            totalPages: 1,
            totalResults: rawData.data.products?.length || 0,
            currentPage: params.currentPage || 0,
            sort: params.sortBy || "relevance",
            skip: 0,
            top: params.pageSize || 32,
          },
          sorts: rawData.data.sorts || [],
        };
        return searchResponse;
      } else {
        throw new Error(`API error: ${rawData.meta.message || "Unknown error"}`);
      }
    } else {
      // Old API structure or unexpected format
      return rawData as SearchResponse;
    }
  } catch (error) {
    console.error("Search API error:", error);
    throw error;
  }
}
