/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MediaItem, 
  MemoryEvent, 
  LifeRecap, 
  AppSettings, 
  IndexingStatus, 
  SearchResultGrouped, 
  QueryConcepts,
  SearchContextState
} from './types';
import { storage } from './services/storageService';
import { localAi } from './services/localAiEngine';
import { Navigation, NavTab } from './components/Navigation';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { CollectionsView } from './components/CollectionsView';
import { MemoriesView } from './components/MemoriesView';
import { AiChatView } from './components/AiChatView';
import { ImageDetailModal } from './components/ImageDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { AppLockScreen } from './components/AppLockScreen';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { UploadModal } from './components/UploadModal';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [memoryEvents, setMemoryEvents] = useState<MemoryEvent[]>([]);
  const [lifeRecaps, setLifeRecaps] = useState<LifeRecap[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [isLocked, setIsLocked] = useState(false);

  // Search state & Context Memory
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeConcepts, setActiveConcepts] = useState<QueryConcepts | null>(null);
  const [searchContext, setSearchContext] = useState<SearchContextState>({
    isEnabled: true,
    steps: [],
    activeStepId: null,
    mergedConcepts: {
      objects: [],
      textIntent: [],
      searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
    },
    activeFilterTags: []
  });

  const [searchResults, setSearchResults] = useState<SearchResultGrouped>({
    bestMatches: [],
    textMatches: [],
    visualMatches: [],
    documentMatches: [],
    relatedMemories: [],
    totalSearched: 0,
    explanation: {
      searchedCount: 0,
      detectedConcepts: [],
      matchedCriteria: []
    }
  });

  // Modal states
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Indexing status
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus>({
    total: 12,
    indexed: 12,
    isIndexing: false,
    stage: 'ready'
  });

  // Load initial data
  useEffect(() => {
    const loadedGallery = storage.getGalleryItems();
    const loadedEvents = storage.getMemoryEvents();
    const loadedRecaps = storage.getLifeRecaps();
    const loadedSettings = storage.getSettings();

    setGallery(loadedGallery);
    setMemoryEvents(loadedEvents);
    setLifeRecaps(loadedRecaps);
    setSettings(loadedSettings);
    setIndexingStatus({
      total: loadedGallery.length,
      indexed: loadedGallery.length,
      isIndexing: false,
      stage: 'ready'
    });

    if (loadedSettings.isAppLocked) {
      setIsLocked(true);
    }

    if (!loadedSettings.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }

    // Run initial default search with context initialization
    const initialContext: SearchContextState = {
      isEnabled: true,
      steps: [],
      activeStepId: null,
      mergedConcepts: {
        objects: ['Honda', 'Motorcycle'],
        textIntent: ['Honda', 'Motorcycle'],
        searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
      },
      activeFilterTags: []
    };

    const { results, newContext } = localAi.searchWithContext(
      'Honda motorcycle',
      loadedGallery,
      initialContext,
      loadedEvents
    );

    setSearchResults(results);
    setSearchContext(newContext);
  }, []);

  // Search handler with state-managed Search Context memory
  const handleSearchSubmit = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setCurrentTab('search');

    // Run local contextual neural search
    const { results, newContext } = localAi.searchWithContext(
      trimmed,
      gallery,
      searchContext,
      memoryEvents
    );

    setSearchResults(results);
    setSearchContext(newContext);
    setActiveConcepts(newContext.mergedConcepts);
    setSearchQuery('');
    storage.addSearchHistory(trimmed);

    // Deep multimodal query classification via server AI if available
    try {
      const res = await fetch('/api/search/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: trimmed,
          previousQueries: newContext.steps.map(s => s.query),
          contextFilters: newContext.activeFilterTags
        })
      });
      if (res.ok) {
        const cloudConcepts = await res.json();
        setActiveConcepts(prev => ({
          ...(prev || newContext.mergedConcepts),
          ...cloudConcepts
        }));
      }
    } catch {
      // Local concepts already set
    } finally {
      setIsSearching(false);
    }
  };

  // Remove a specific step/filter from the search context chain
  const handleRemoveContextStep = (stepId: string) => {
    const { results, newContext } = localAi.removeContextStep(
      stepId,
      gallery,
      searchContext,
      memoryEvents
    );
    setSearchResults(results);
    setSearchContext(newContext);
    setActiveConcepts(newContext.mergedConcepts);
  };

  // Rollback or jump to an earlier step in the search context
  const handleJumpToContextStep = (stepId: string) => {
    const { results, newContext } = localAi.jumpToContextStep(
      stepId,
      gallery,
      searchContext,
      memoryEvents
    );
    setSearchResults(results);
    setSearchContext(newContext);
    setActiveConcepts(newContext.mergedConcepts);
  };

  // Reset entire search context
  const handleClearSearchContext = () => {
    const emptyContext: SearchContextState = {
      isEnabled: searchContext.isEnabled,
      steps: [],
      activeStepId: null,
      mergedConcepts: {
        objects: [],
        textIntent: [],
        searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
      },
      activeFilterTags: []
    };
    setSearchContext(emptyContext);
    setSearchQuery('');
    setActiveConcepts(null);
    setSearchResults({
      bestMatches: [],
      textMatches: [],
      visualMatches: [],
      documentMatches: [],
      relatedMemories: [],
      totalSearched: gallery.length,
      explanation: {
        searchedCount: gallery.length,
        detectedConcepts: [],
        matchedCriteria: []
      }
    });
  };

  // Toggle Context engine ON/OFF
  const handleToggleContextMode = () => {
    setSearchContext(prev => ({
      ...prev,
      isEnabled: !prev.isEnabled
    }));
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const updated = storage.toggleFavorite(id);
    setGallery(updated);
    if (selectedMediaItem && selectedMediaItem.id === id) {
      setSelectedMediaItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  // Delete media item
  const handleDeleteMediaItem = (id: string) => {
    const updated = storage.removeMediaItems([id]);
    setGallery(updated);
    if (selectedMediaItem?.id === id) {
      setSelectedMediaItem(null);
    }
  };

  // Delete multiple items (from cleanup)
  const handleDeleteMultipleItems = (ids: string[]) => {
    const updated = storage.removeMediaItems(ids);
    setGallery(updated);
  };

  // Add newly uploaded item
  const handleAddMediaItem = (newItem: MediaItem) => {
    const updated = storage.addMediaItem(newItem);
    setGallery(updated);
    setIndexingStatus(prev => ({
      ...prev,
      total: updated.length,
      indexed: updated.length
    }));
  };

  // Reindex gallery
  const handleReindex = () => {
    setIndexingStatus({
      total: gallery.length,
      indexed: 0,
      isIndexing: true,
      stage: 'scanning'
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= gallery.length) {
        current = gallery.length;
        clearInterval(interval);
        setIndexingStatus({
          total: gallery.length,
          indexed: gallery.length,
          isIndexing: false,
          stage: 'ready'
        });
      } else {
        setIndexingStatus(prev => ({
          ...prev,
          indexed: current,
          isIndexing: true
        }));
      }
    }, 200);
  };

  // Reset seed data
  const handleResetSeedData = () => {
    storage.resetToFactorySeed();
    const freshGallery = storage.getGalleryItems();
    const freshEvents = storage.getMemoryEvents();
    const freshRecaps = storage.getLifeRecaps();
    const freshSettings = storage.getSettings();

    setGallery(freshGallery);
    setMemoryEvents(freshEvents);
    setLifeRecaps(freshRecaps);
    setSettings(freshSettings);
    setIndexingStatus({
      total: freshGallery.length,
      indexed: freshGallery.length,
      isIndexing: false,
      stage: 'ready'
    });
  };

  // Update app settings
  const handleUpdateSettings = (updates: Partial<AppSettings>) => {
    const updated = storage.updateSettings(updates);
    setSettings(updated);
  };

  // Complete onboarding
  const handleCompleteOnboarding = () => {
    handleUpdateSettings({ hasCompletedOnboarding: true });
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* App Lock Screen */}
      {isLocked && (
        <AppLockScreen
          pinCode={settings.pinCode || '1234'}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Main App Container */}
      {!isLocked && (
        <div className="flex flex-col min-h-screen max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto relative">
          {/* Header */}
          <Header
            settings={settings}
            indexingStatus={indexingStatus}
            onOpenSettings={() => setShowSettings(true)}
            onOpenUpload={() => setShowUpload(true)}
          />

          {/* Main View Router */}
          <main className="flex-1">
            {currentTab === 'home' && (
              <HomeView
                gallery={gallery}
                memoryEvents={memoryEvents}
                settings={settings}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                onOpenVoiceSearch={() => setShowVoiceSearch(true)}
                onOpenImageSearch={() => setShowUpload(true)}
                onSelectMediaItem={setSelectedMediaItem}
                onSelectMemoryEvent={(event) => {
                  handleSearchSubmit(event.title);
                }}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentTab === 'search' && (
              <SearchView
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                searchResults={searchResults}
                activeConcepts={activeConcepts}
                searchContext={searchContext}
                onRemoveContextStep={handleRemoveContextStep}
                onJumpToContextStep={handleJumpToContextStep}
                onClearContext={handleClearSearchContext}
                onToggleContextMode={handleToggleContextMode}
                isSearching={isSearching}
                onOpenVoiceSearch={() => setShowVoiceSearch(true)}
                onOpenImageSearch={() => setShowUpload(true)}
                onSelectMediaItem={setSelectedMediaItem}
              />
            )}

            {currentTab === 'collections' && (
              <CollectionsView
                gallery={gallery}
                onSelectMediaItem={setSelectedMediaItem}
                onDeleteMediaItems={handleDeleteMultipleItems}
              />
            )}

            {currentTab === 'memories' && (
              <MemoriesView
                gallery={gallery}
                memoryEvents={memoryEvents}
                lifeRecaps={lifeRecaps}
                onSelectMediaItem={setSelectedMediaItem}
                onSelectMemoryEvent={(event) => {
                  handleSearchSubmit(event.title);
                }}
                onFilterByKeyword={(kw) => {
                  handleSearchSubmit(kw);
                }}
              />
            )}

            {currentTab === 'ai' && (
              <AiChatView
                gallery={gallery}
                settings={settings}
                onSelectMediaItem={setSelectedMediaItem}
              />
            )}
          </main>

          {/* Bottom Floating Glass Navigation */}
          <Navigation
            currentTab={currentTab}
            onTabChange={setCurrentTab}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      <ImageDetailModal
        item={selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteMediaItem}
        onSearchConcept={handleSearchSubmit}
        allGalleryItems={gallery}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        indexingStatus={indexingStatus}
        onReindex={handleReindex}
        onResetSeedData={handleResetSeedData}
      />

      <VoiceSearchModal
        isOpen={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
        onTranscriptReady={handleSearchSubmit}
      />

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onImageIndexed={handleAddMediaItem}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}

