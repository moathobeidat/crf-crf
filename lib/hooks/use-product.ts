// lib/hooks/use-product.ts

import { useState, useCallback } from "react";
import {
  getProductById,
  getProductDetails,
} from "@/lib/services/product-service";
import { ProductDetail, ProductResponse } from "@/types/product-types";

export function useProduct() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductById(productId);
      const productData = response.products[0] || null;
      setProduct(productData);
      return productData;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMultipleProducts = useCallback(async (productIds: string[]) => {
    if (!productIds.length) return [];

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProductDetails(productIds);
      setProducts(response.products);
      return response.products;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    product,
    products,
    isLoading,
    error,
    fetchProduct,
    fetchMultipleProducts,
  };
}
