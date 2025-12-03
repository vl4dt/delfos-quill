
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface BrandCheckResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  brandName: string;
  productType: ProductType;
  context: string;
  type: 'check' | 'generate';
}

export enum ProductType {
  ALL = 'All Platforms',
  WEB_APP = 'Web App',
  MOBILE_APP = 'Mobile App',
  DESKTOP_APP = 'Desktop App',
  CHROME_EXTENSION = 'Chrome Extension',
  SAAS = 'SaaS Platform',
  ECOMMERCE = 'E-commerce Brand',
  GAME = 'Video Game',
  AGENCY = 'Agency',
  OTHER = 'Other'
}