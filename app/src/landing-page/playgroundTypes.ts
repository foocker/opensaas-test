export enum BananaModel {
  TEXT = 'text',
  IMAGE = 'image',
}

export enum ModelQuality {
  FLASH = 'flash',
  PRO = 'pro',
}

// Mapping for actual API model names
export const MODEL_MAP: Record<BananaModel, Record<ModelQuality, string>> = {
  [BananaModel.TEXT]: {
    [ModelQuality.FLASH]: 'google/gemini-2.5-flash',
    [ModelQuality.PRO]: 'google/gemini-3-pro-preview',
  },
  [BananaModel.IMAGE]: {
    [ModelQuality.FLASH]: 'google/gemini-2.5-flash-image-preview',
    [ModelQuality.PRO]: 'google/gemini-3-pro-image-preview',
  },
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';

export type OutputSize = '1K' | '2K' | '4K';

export type Lang = 'en' | 'zh';
