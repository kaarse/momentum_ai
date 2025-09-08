export interface FormatSelections {
  instagramPost: boolean;
  instagramStory: boolean;
  facebookAd: boolean;
  linkedInBanner: boolean;
  twitterHeader: boolean;
  youtubeThumbnail: boolean;
  websiteHero: boolean;
  flyerA5: boolean;
  posterA3: boolean;
  postcard: boolean;
  businessCard: boolean;
  whatsappShare: boolean;
}

export interface FormData {
  businessType: string;
  imageDescription: string;
  businessName: string;
  offer: string;
  colors: string;
  callToAction: string;
  width: string;
  height: string;
  seasonalAdaptation: string;
  mockupRequests: string;
  formatSelections: FormatSelections;
  generateCustomerAd: boolean;
  generate3dRender: boolean;
  neonGlowMode: boolean;
  targetLanguages: string;
  generateQrCode: boolean;
  qrCodeUrl: string;
}

export interface GeneratedAsset {
  image: string;
  title?: string;
  description?: string;
}

export interface GeneratedPoster extends GeneratedAsset {}
export interface GeneratedSocial extends GeneratedAsset {
    format: string;
}
export interface GeneratedMockup extends GeneratedAsset {}
export interface GeneratedCustomerAd extends GeneratedAsset {}
export interface GeneratedMultilingual extends GeneratedAsset {}
export interface Generated3dRender extends GeneratedAsset {}
export interface GeneratedQrCode extends GeneratedAsset {}


export interface GeneratedMarketingKit {
  posters: GeneratedPoster[];
  socialMedia: GeneratedSocial[];
  mockups: GeneratedMockup[];
  customerAds: GeneratedCustomerAd[];
  multilingualVersions: GeneratedMultilingual[];
  renders: Generated3dRender[];
  qrCode: GeneratedQrCode | null;
}