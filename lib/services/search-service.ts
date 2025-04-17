// lib/services/search-service.ts

import { SearchParams, SearchResponse } from "@/types/search-types";

const API_BASE_URL = "/api/search"; // This will be our Next.js API route

export async function searchProducts(
  params: SearchParams
): Promise<SearchResponse> {
  // Build query string from params
  const queryParams = new URLSearchParams();

  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.currentPage !== undefined)
    queryParams.append("currentPage", params.currentPage.toString());
  if (params.pageSize !== undefined)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.minPrice !== undefined)
    queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined)
    queryParams.append("maxPrice", params.maxPrice.toString());

  const url = `${API_BASE_URL}?${queryParams.toString()}&random=${Math.floor(
    Math.random() * 1e8
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Search API error: ${response.status}`);
  }

  return response.json();
}
