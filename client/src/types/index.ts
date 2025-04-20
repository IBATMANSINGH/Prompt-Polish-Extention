export interface OptimizationItem {
  id: string;
  type: "general" | "website";
  originalText: string;
  optimizedText: string;
  timestamp: string;
  style?: string;
  websiteType?: string;
  designStyle?: string;
}

export interface OptimizeGeneralRequest {
  text: string;
  type: "general";
  style?: string;
}

export interface OptimizeWebsiteRequest {
  text: string;
  type: "website";
  options: {
    websiteType: string;
    designStyle: string;
    features: string[];
  };
}

export type OptimizeRequest = OptimizeGeneralRequest | OptimizeWebsiteRequest;

export interface OptimizeResponse {
  optimizedText: string;
}
