import { MediaItem, MemoryEvent, LifeRecap, AppSettings, IndexingStatus } from '../types';
import { SEED_GALLERY, SEED_MEMORY_EVENTS, SEED_LIFE_RECAPS } from '../data/seedGallery';

const STORAGE_KEYS = {
  GALLERY_ITEMS: 'lumafind_gallery_items',
  MEMORY_EVENTS: 'lumafind_memory_events',
  LIFE_RECAPS: 'lumafind_life_recaps',
  APP_SETTINGS: 'lumafind_app_settings',
  SEARCH_HISTORY: 'lumafind_search_history',
  FAVORITES: 'lumafind_favorites',
  TRASH: 'lumafind_trash'
};

const DEFAULT_SETTINGS: AppSettings = {
  aiMode: 'local',
  reindexWifiOnly: false,
  reindexChargingOnly: false,
  runInBackground: true,
  isAppLocked: false,
  lockType: 'biometric',
  pinCode: '1234',
  gridSize: 'standard',
  sortOrder: 'newest',
  hapticFeedback: true,
  reducedMotion: false,
  autoExtractDocuments: true,
  hasCompletedOnboarding: false
};

export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.initializeDefaults();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private initializeDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY_ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY_ITEMS, JSON.stringify(SEED_GALLERY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEMORY_EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.MEMORY_EVENTS, JSON.stringify(SEED_MEMORY_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIFE_RECAPS)) {
      localStorage.setItem(STORAGE_KEYS.LIFE_RECAPS, JSON.stringify(SEED_LIFE_RECAPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APP_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  public getGalleryItems(): MediaItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY_ITEMS);
      return data ? JSON.parse(data) : SEED_GALLERY;
    } catch {
      return SEED_GALLERY;
    }
  }

  public saveGalleryItems(items: MediaItem[]) {
    localStorage.setItem(STORAGE_KEYS.GALLERY_ITEMS, JSON.stringify(items));
  }

  public addMediaItem(item: MediaItem) {
    const items = this.getGalleryItems();
    const updated = [item, ...items];
    this.saveGalleryItems(updated);
    return updated;
  }

  public removeMediaItems(itemIds: string[]) {
    const items = this.getGalleryItems();
    const updated = items.filter(item => !itemIds.includes(item.id));
    this.saveGalleryItems(updated);
    return updated;
  }

  public toggleFavorite(itemId: string): MediaItem[] {
    const items = this.getGalleryItems();
    const updated = items.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    this.saveGalleryItems(updated);
    return updated;
  }

  public getMemoryEvents(): MemoryEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY_EVENTS);
      return data ? JSON.parse(data) : SEED_MEMORY_EVENTS;
    } catch {
      return SEED_MEMORY_EVENTS;
    }
  }

  public getLifeRecaps(): LifeRecap[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIFE_RECAPS);
      return data ? JSON.parse(data) : SEED_LIFE_RECAPS;
    } catch {
      return SEED_LIFE_RECAPS;
    }
  }

  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  public getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [
        'Honda motorcycle battery receipt',
        'Screenshot with WiFi password',
        'Beach photos with dog in Goa',
        'Biryani restaurant in Hyderabad',
        'Vehicle insurance document'
      ];
    } catch {
      return [];
    }
  }

  public addSearchHistory(query: string) {
    if (!query.trim()) return;
    const history = this.getSearchHistory().filter(q => q.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...history].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  }

  public clearSearchHistory() {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
  }

  public resetToFactorySeed() {
    localStorage.setItem(STORAGE_KEYS.GALLERY_ITEMS, JSON.stringify(SEED_GALLERY));
    localStorage.setItem(STORAGE_KEYS.MEMORY_EVENTS, JSON.stringify(SEED_MEMORY_EVENTS));
    localStorage.setItem(STORAGE_KEYS.LIFE_RECAPS, JSON.stringify(SEED_LIFE_RECAPS));
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
}

export const storage = StorageService.getInstance();
