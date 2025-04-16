// types/product-types.ts

export interface ProductRequestBody {
  id: string[];
  includeVariants?: boolean;
  assortments: {
    pos: string;
  }[];
}

export interface Attribute {
  productType: string;
  brandName: string;
  brandCode: string;
  marketingText?: string;
  freeInstallation: boolean;
  genuineStock: boolean;
  ean: string;
  soldByWeight: boolean;
  minOrderQuantity: number;
  productCategoriesHearchi: string;
  storeId: string;
  productTypeDM51: string;
  weight: number;
  status: string;
  department: string;
  section: string;
  family: string;
  subFamily: string;
  categoriesHierarchy: {
    level: number;
    id: string;
    name: string;
    url: string;
    name_ar?: string;
  }[];
  marketplaceProduct: boolean;
  gicaVatPer: string;
}

export interface MediaItem {
  imageType: string;
  format: string;
  url: string;
}

export interface GalleryItem {
  imageType: string;
  url: string;
  mimeType: string;
  altText: string;
}

export interface Category {
  level: number;
  id: string;
  name: string;
  url: string;
}

export interface SeoAttributes {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface CutOffTime {
  cutoff_time: number;
  cutoff_promise: string;
  cutoff_period: boolean;
  cutoff_deliveryDate: string;
  cutoff_hrs: number;
  cutoff_mins: number;
}

export interface DeliveryPromise {
  type: string;
  promise: string;
  promise_en: string;
  cutOffTime: CutOffTime;
  minDeliveryDate: string;
  maxDeliveryDate: string;
}

export interface DeliveryInformation {
  deliveryPromises: DeliveryPromise[];
}

export interface StoreData {
  _id: string;
  sourceId: string;
  site: string;
  quantity: number;
  pos: string;
  modifiedAt: string;
  source: string;
  sku: string;
  status: string;
  soc: string;
  inStockStatus: string;
  stockLevel: number;
  productId: string;
  siteId: string;
  isAvailable: boolean;
}

export interface Store {
  id: string;
  quantity: {
    minToOrder: number;
    maxToOrder: number;
    increments: number;
    units: string;
    stockIndicator: {
      status: string;
      value: number;
    };
  };
  price: {
    currencyISO: string;
    value: number;
    original: {
      value: string;
    };
  };
  purchaseIndicator: string;
  deliveryFees: {
    freeDeliveryThreshold: number;
    amount: number;
  };
  deliveryProposition: string;
  storeData: StoreData;
}

export interface Offer {
  offerId: string;
  offerSku: string;
  shop: string;
  shopId: string;
  isFBC: boolean;
  purchaseIndicators: {
    BUYING: string[];
    SHIPPING: string[];
    DELIVERY: string[];
  };
  ctaUrl: string;
  hasWarranty: boolean;
  shippingThresholdPrice: number;
  shippingChargeBeforeThreshold: number;
  shippingChargeAfterThreshold: number;
  freeInstallation: boolean;
  shippingCountry: string;
  stores: Store[];
  deliveryInformation: DeliveryInformation;
  preOrder: boolean;
  dcOffer: boolean;
  leadTimeToShip: number;
}

export interface Proposition {
  id: string;
  deliveryProposition: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  url: string;
  attributes: Attribute;
  badges: Record<string, any>;
  dimensions: Record<string, any>;
  media: MediaItem[];
  gallery: GalleryItem[];
  categories: Category[];
  marketplaceCategories: Category[];
  seoAttributes: SeoAttributes;
  offers: Offer[];
  propositions: Proposition[];
}

export interface ProductResponse {
  products: ProductDetail[];
}
