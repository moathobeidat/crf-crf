"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { searchProducts } from "@/lib/services/search-service";
import type { SearchParams, SearchResponse } from "@/types/search-types";

export function useSearch(initialParams: SearchParams = {}) {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const initialSearchDone = useRef(false);
  const pendingRequest = useRef<AbortController | null>(null);

  const search = useCallback(async (searchParams: SearchParams) => {
    // Cancel any pending request
    if (pendingRequest.current) {
      pendingRequest.current.abort();
    }

    // Create a new abort controller for this request
    pendingRequest.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      console.log("Searching with params:", searchParams);
      const data = await searchProducts(searchParams);

      // Log the search results
      console.log("Search results:", {
        productsCount: data.products?.length || 0,
        paginationInfo: data.pagination,
      });

      setResults(data);
      return data;
    } catch (err) {
      // Only set error if it's not an abort error
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Search error:", err);
        setError(err);
      }
      return null;
    } finally {
      setIsLoading(false);
      pendingRequest.current = null;
    }
  }, []);

  // Search whenever params change, but avoid duplicate initial search
  useEffect(() => {
    if (Object.keys(params).length > 0) {
      // Skip the initial search if it's already been done
      if (!initialSearchDone.current) {
        initialSearchDone.current = true;
        search(params);
      } else {
        // For subsequent param changes, perform the search
        search(params);
      }
    }

    // Cleanup function to abort any pending request when component unmounts
    return () => {
      if (pendingRequest.current) {
        pendingRequest.current.abort();
      }
    };
  }, [params, search]);

  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    console.log("Updating search params:", newParams);
    setParams((prevParams) => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  // Helper functions for common actions
  const changePage = useCallback(
    (page: number) => {
      updateParams({ currentPage: page });
    },
    [updateParams]
  );

  const changeSort = useCallback(
    (sortBy: SearchParams["sortBy"]) => {
      updateParams({ sortBy, currentPage: 0 });
    },
    [updateParams]
  );

  const changePageSize = useCallback(
    (pageSize: number) => {
      updateParams({ pageSize, currentPage: 0 });
    },
    [updateParams]
  );

  const setPriceRange = useCallback(
    (minPrice?: number, maxPrice?: number) => {
      updateParams({ minPrice, maxPrice, currentPage: 0 });
    },
    [updateParams]
  );

  const setKeyword = useCallback(
    (keyword: string) => {
      updateParams({ keyword, currentPage: 0 });
    },
    [updateParams]
  );

  return {
    search,
    results,
    isLoading,
    error,
    params,
    updateParams,
    changePage,
    changeSort,
    changePageSize,
    setPriceRange,
    setKeyword,
  };
}
