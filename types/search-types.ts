// types/search-types.ts

export interface SearchParams {
  sortBy?: "relevance" | "price_asc" | "price_desc";
  currentPage?: number;
  pageSize?: number;
  maxPrice?: number;
  minPrice?: number;
  keyword?: string;
}

export interface Category {
  id: string;
  level: number;
  name: string;
  url: string;
  name_ar?: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Price {
  currency: string;
  price: number;
  formattedValue: string;
  minBuyingValue?: string;
  discount?: {
    value: number;
    formattedValue: string;
  };
}

export interface ImageLink {
  rel: string;
  href: string;
  type: string;
  kind: string;
  properties: {
    format: string;
    url: string;
    imageType: string;
  };
}

export interface Links {
  images: ImageLink[];
  productUrl: {
    href: string;
    rel: string;
    type: string;
    kind: string;
  };
  tracking: any[];
  defaultImages: string[];
}

export interface Offer {
  id: string;
  sellerName: string;
  shopId: string;
  type: string;
  purchaseIndicators: {
    SHIPPING: string[];
  };
  shippingIndicator: string;
}

export interface Stock {
  stockLevelStatus: string;
  value: number;
}

export interface Unit {
  unitOfMeasure: string;
  itemsPerUnit: number;
  incrementBy: number;
  max: number;
  min: number;
  unitItem: number;
  maxToOrder: number;
}

export interface Product {
  id: string;
  ean: string;
  category: Category[];
  name: string;
  type: string;
  preorder: boolean;
  brand: Brand;
  supplier: string;
  availability: {
    isAvailable: boolean;
    max: number;
  };
  price: Price;
  offers: Offer[];
  stock: Stock;
  unit: Unit;
  links: Links;
}

export interface FacetValue {
  code?: boolean | string;
  id: boolean | string;
  name: string;
  selected: boolean;
  url?: string;
}

export interface Facet {
  code: string;
  name: string;
  multiSelect: boolean;
  values: FacetValue[];
}

export interface Filter {
  name: string;
  code: string;
  id: boolean | string;
  selected: boolean;
  type: string;
}

export interface Pagination {
  pageSize: number;
  totalPages: number;
  totalResults: number;
  currentPage: number;
  sort: string;
  skip: number;
  top: number;
}

export interface SortOption {
  code: string;
  name: string;
  selected: boolean;
}

export interface SearchResponse {
  products: Product[];
  facets: Facet[];
  filters: Filter[];
  pagination: Pagination;
  sorts: SortOption[];
}
