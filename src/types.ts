export type MediaType = 'photo' | 'screenshot' | 'document' | 'receipt';

export interface BoundingBox {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0-100%
  category: 'vehicle' | 'object' | 'person' | 'text' | 'document' | 'food' | 'animal' | 'nature';
}

export interface DocumentMetadata {
  documentType: 'receipt' | 'invoice' | 'id_card' | 'ticket' | 'contract' | 'menu' | 'insurance' | 'wifi_credential' | 'other';
  title?: string;
  vendor?: string;
  amount?: string;
  currency?: string;
  date?: string;
  invoiceNumber?: string;
  productName?: string;
  importantEntities?: Record<string, string>;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  type: MediaType;
  timestamp: string; // ISO date string
  location?: {
    name: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  camera?: {
    make: string;
    model: string;
    iso?: number;
    aperture?: string;
    focalLength?: string;
  };
  ocrText: string;
  detectedObjects: string[];
  semanticTags: string[];
  boundingBoxes?: BoundingBox[];
  documentMetadata?: DocumentMetadata;
  qualityScore: number; // 0 - 100
  isFavorite?: boolean;
  isBlurry?: boolean;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  fileSize: string;
  dimensions: { width: number; height: number };
  aiDescription?: string;
  album?: string;
}

export interface QueryConcepts {
  objects: string[];
  textIntent: string[];
  documentType?: string;
  dateRange?: string;
  location?: string;
  colors?: string[];
  people?: string[];
  actions?: string[];
  semanticMeaning?: string;
  searchSources: ('Visual AI' | 'OCR' | 'Metadata' | 'Semantic Search')[];
}

export type ContextFilterType = 
  | 'initial' 
  | 'color' 
  | 'category' 
  | 'document_type' 
  | 'date' 
  | 'location' 
  | 'object' 
  | 'text' 
  | 'entity'
  | 'refinement';

export interface SearchRelevanceWeights {
  ocrWeight: number;      // e.g. 0 to 100%
  visualWeight: number;   // e.g. 0 to 100%
  semanticWeight: number; // e.g. 0 to 100%
  metadataWeight: number; // e.g. 0 to 100%
  dominantEngine: 'OCR' | 'Visual AI' | 'Semantic' | 'Metadata' | 'Balanced';
  rationale: string;
  contributingSignals: {
    layer: 'OCR' | 'Visual AI' | 'Semantic' | 'Metadata';
    label: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface SearchContextStep {
  id: string;
  query: string;
  timestamp: number;
  concepts: QueryConcepts;
  filterLabel: string; // e.g. "Honda" or "+ Color: Red" or "+ Documents"
  filterType: ContextFilterType;
  matchedItemIds: string[];
  totalMatches: number;
  weights?: SearchRelevanceWeights;
}

export interface SearchContextState {
  isEnabled: boolean; // whether contextual chaining is active
  steps: SearchContextStep[];
  activeStepId: string | null;
  mergedConcepts: QueryConcepts;
  activeFilterTags: string[];
}

export interface SearchResultItem {
  item: MediaItem;
  overallScore: number;
  ocrScore: number;
  visualScore: number;
  semanticScore: number;
  metadataScore: number;
  matchedHighlights: {
    matchedOcrSnippet?: string;
    matchedObjects?: string[];
    matchedTags?: string[];
    reason?: string;
  };
}

export interface SearchResultGrouped {
  bestMatches: SearchResultItem[];
  textMatches: SearchResultItem[];
  visualMatches: SearchResultItem[];
  documentMatches: SearchResultItem[];
  relatedMemories: SearchResultItem[];
  totalSearched: number;
  explanation: {
    searchedCount: number;
    detectedConcepts: string[];
    matchedCriteria: string[];
  };
  weights?: SearchRelevanceWeights;
  contextInfo?: {
    isRefinement: boolean;
    stepIndex: number;
    parentQuery?: string;
    parentMatchCount?: number;
    refinedMatchCount: number;
    refinementDescription?: string;
  };
}

export interface MemoryEvent {
  id: string;
  title: string;
  dateRange: string;
  startDate: string;
  location: string;
  itemIds: string[];
  coverItemId: string;
  theme: 'trip' | 'maintenance' | 'celebration' | 'dining' | 'lifestyle' | 'work';
  description: string;
  tags: string[];
}

export interface LifeRecap {
  period: 'today' | 'week' | 'month' | 'year';
  title: string;
  subtitle: string;
  dateStr: string;
  stats: {
    totalPhotos: number;
    screenshots: number;
    trips: number;
    restaurants: number;
    topSubject: string;
  };
  highlights: string[]; // item IDs
  narrative: string;
  themeColor: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'Person' | 'Place' | 'Object' | 'Event' | 'Document' | 'Date' | 'Brand';
  color: string;
  count: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'luma';
  timestamp: string;
  text: string;
  referencedItemIds?: string[];
  detectedIntent?: string;
  suggestedFollowUps?: string[];
}

export interface AppSettings {
  aiMode: 'local' | 'cloud_gemini';
  reindexWifiOnly: boolean;
  reindexChargingOnly: boolean;
  runInBackground: boolean;
  isAppLocked: boolean;
  lockType: 'pin' | 'biometric';
  pinCode?: string;
  gridSize: 'compact' | 'standard' | 'large';
  sortOrder: 'newest' | 'oldest';
  hapticFeedback: boolean;
  reducedMotion: boolean;
  autoExtractDocuments: boolean;
  hasCompletedOnboarding: boolean;
}

export interface IndexingStatus {
  total: number;
  indexed: number;
  isPaused: boolean;
  currentTask: string;
  speedPerSec: number;
  isIndexing: boolean;
}
