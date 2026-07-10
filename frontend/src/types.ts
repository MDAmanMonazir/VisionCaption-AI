export type CaptionStyle = 'formal' | 'sarcastic' | 'humorous-tech' | 'humorous';

export interface CaptionData {
  style: CaptionStyle;
  title: string;
  text: string;
  wordCount: number;
  charCount: number;
}

export interface UploadedItem {
  id: string;
  title: string;
  imageUrl: string; // Base64 or standard hotlinked URL
  timestamp: string; // ISO string or readable format
  relativeTime: string;
  confidence: number;
  captions: Record<CaptionStyle, CaptionData>;
  fileSize?: string;
  format?: string;
  isFallback?: boolean;
}

export interface UserSettings {
  analyticsEnabled: boolean;
  language: string;
  notificationsEnabled: boolean;
  userName: string;
  userEmail: string;
  tier: string;
  totalUploads: number;
  credits: number;
}

export type ScreenType = 'login' | 'landing' | 'dashboard' | 'upload' | 'processing' | 'results' | 'history' | 'settings';
