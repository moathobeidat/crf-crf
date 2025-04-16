// lib/hooks/use-search.ts

import { useState, useEffect, useCallback } from "react";
import { searchProducts } from "@/lib/services/search-service";
import { SearchParams, SearchResponse } from "@/types/search-types";

export function useSearch(initialParams: SearchParams = {}) {
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (searchParams: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await searchProducts(searchParams);
      setResults(data);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search whenever params change
  useEffect(() => {
    if (Object.keys(params).length > 0) {
      search(params);
    }
  }, [params, search]);

  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
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
