// lib/services/product-service.ts

import type { ProductRequestBody, ProductResponse } from "@/types/product-types";

const API_BASE_URL = "/api/product";

export async function getProductDetails(productIds: string[]): Promise<ProductResponse> {
  const requestBody: ProductRequestBody = {
    id: productIds,
    includeVariants: true,
    assortments: [
      {
        pos: "global",
      },
    ],
  };

  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Product API error: ${response.status}`);
  }

  return response.json();
}

export async function getProductById(productId: string): Promise<ProductResponse> {
  return getProductDetails([productId]);
}
