import { 
  MediaItem, 
  QueryConcepts, 
  SearchResultGrouped, 
  SearchResultItem, 
  MemoryEvent, 
  SearchContextState, 
  SearchContextStep, 
  ContextFilterType,
  SearchRelevanceWeights
} from '../types';

// Semantic synonym dictionary for client-side / local embedding simulation
const SEMANTIC_CLUSTERS: Record<string, string[]> = {
  motorcycle: ['bike', 'two-wheeler', 'honda', 'cb350', 'scooter', 'rider', 'helmet', 'exhaust', 'engine', 'spares'],
  honda: ['motorcycle', 'cb350', 'bike', 'hness', 'honda parts', 'abc motors'],
  battery: ['exide', '12v', '9ah', 'power', 'accumulator', 'replacement', 'charging', 'maintenance', 'spark'],
  receipt: ['invoice', 'bill', 'tax invoice', 'payment', 'cash memo', 'paid', 'total', '₹', 'order', 'upi'],
  document: ['passport', 'insurance', 'policy', 'ticket', 'boarding pass', 'id', 'identity', 'contract', 'certificate'],
  wifi: ['router', 'password', 'ssid', 'network', 'internet', '5g', 'credentials', 'wpa3'],
  dog: ['pet', 'retriever', 'puppy', 'animal', 'canine', 'golden retriever'],
  beach: ['ocean', 'sea', 'sand', 'waves', 'sunset', 'goa', 'anjuna', 'coastal', 'vacation', 'holiday'],
  food: ['biryani', 'pizza', 'restaurant', 'dining', 'lunch', 'dinner', 'dish', 'meal', 'cafe', 'mutton', 'cheese', 'menu'],
  travel: ['trip', 'flight', 'goa', 'araku', 'hills', 'valley', 'boarding pass', 'hotel', 'resort', 'waterfall', 'mountains'],
  car: ['automobile', 'audi', 'rs5', 'sedan', 'vehicle', 'coupe', 'sports car'],
  laptop: ['macbook', 'computer', 'code', 'coding', 'workspace', 'desk', 'developer'],
  coffee: ['espresso', 'roastery', 'cafe', 'brew', 'cup']
};

export interface FollowUpClassification {
  isFollowUp: boolean;
  filterType: ContextFilterType;
  filterLabel: string;
  queryType: 'refinement' | 'new_root';
  targetFacet?: string;
  extractedValue?: string;
}

export class LocalAiEngine {
  private static instance: LocalAiEngine;

  private constructor() {}

  public static getInstance(): LocalAiEngine {
    if (!LocalAiEngine.instance) {
      LocalAiEngine.instance = new LocalAiEngine();
    }
    return LocalAiEngine.instance;
  }

  /**
   * Automatically interprets natural language queries into semantic concepts
   */
  public parseQuery(queryText: string): QueryConcepts {
    const raw = queryText.toLowerCase().trim();
    const words = raw.replace(/[^\w\s₹$]/g, ' ').split(/\s+/).filter(Boolean);

    const detectedObjects: string[] = [];
    const textIntent: string[] = [];
    const detectedColors: string[] = [];
    let detectedDocType: string | undefined;
    let detectedDateRange: string | undefined;
    let detectedLocation: string | undefined;
    const people: string[] = [];
    const actions: string[] = [];

    // Colors
    if (/\b(red|crimson|ruby|scarlet)\b/i.test(raw)) {
      detectedColors.push('Red');
      detectedObjects.push('Red');
    }
    if (/\b(blue|azure|cyan|navy)\b/i.test(raw)) {
      detectedColors.push('Blue');
      detectedObjects.push('Blue');
    }
    if (/\b(white|cream|ivory)\b/i.test(raw)) {
      detectedColors.push('White');
      detectedObjects.push('White');
    }
    if (/\b(black|dark|noir)\b/i.test(raw)) {
      detectedColors.push('Black');
      detectedObjects.push('Black');
    }
    if (/\b(golden|gold|yellow)\b/i.test(raw)) {
      detectedColors.push('Gold');
      detectedObjects.push('Gold');
    }
    if (/\b(green|emerald)\b/i.test(raw)) {
      detectedColors.push('Green');
      detectedObjects.push('Green');
    }

    // Document types
    if (/receipt|bill|invoice|tax invoice|paid|expense|purchase/i.test(raw)) {
      detectedDocType = 'Receipt / Invoice';
      textIntent.push('receipt', 'invoice', 'amount');
    } else if (/passport|id card|identity|citizenship/i.test(raw)) {
      detectedDocType = 'Identity Document';
      textIntent.push('passport', 'republic of india');
    } else if (/insurance|policy|certificate/i.test(raw)) {
      detectedDocType = 'Insurance Policy';
      textIntent.push('insurance', 'policy no');
    } else if (/wifi|password|ssid|router/i.test(raw)) {
      detectedDocType = 'WiFi / Network Credential';
      textIntent.push('wifi password', 'ssid');
    } else if (/ticket|boarding pass|flight/i.test(raw)) {
      detectedDocType = 'Travel Ticket / Boarding Pass';
      textIntent.push('boarding pass', 'flight');
    } else if (/tracking|courier|dhl|shipment/i.test(raw)) {
      detectedDocType = 'Shipment Tracking';
      textIntent.push('tracking number', 'dhl');
    }

    // Objects & entities
    if (/honda/i.test(raw)) detectedObjects.push('Honda');
    if (/motorcycle|bike|two.?wheeler/i.test(raw)) detectedObjects.push('Motorcycle');
    if (/battery/i.test(raw)) detectedObjects.push('Battery');
    if (/car|audi/i.test(raw)) detectedObjects.push('Car');
    if (/dog|pet|puppy/i.test(raw)) detectedObjects.push('Dog');
    if (/beach|ocean|sea/i.test(raw)) detectedObjects.push('Beach');
    if (/pizza/i.test(raw)) detectedObjects.push('Pizza');
    if (/biryani/i.test(raw)) detectedObjects.push('Biryani');
    if (/laptop|macbook/i.test(raw)) detectedObjects.push('Laptop');
    if (/coffee|espresso/i.test(raw)) detectedObjects.push('Coffee');
    if (/waterfall|mountain|hills/i.test(raw)) detectedObjects.push('Nature / Landscape');

    // Dates
    if (/last year|2025/i.test(raw)) detectedDateRange = '2025';
    else if (/this year|2026/i.test(raw)) detectedDateRange = '2026';
    else if (/last summer|summer/i.test(raw)) detectedDateRange = 'Summer';
    else if (/december|dec/i.test(raw)) detectedDateRange = 'December';
    else if (/august|aug/i.test(raw)) detectedDateRange = 'August';
    else if (/february|feb/i.test(raw)) detectedDateRange = 'February';
    else if (/june|jun/i.test(raw)) detectedDateRange = 'June';
    else if (/july|jul/i.test(raw)) detectedDateRange = 'July';
    else if (/today/i.test(raw)) detectedDateRange = 'Today';

    // Locations
    if (/hyderabad/i.test(raw)) detectedLocation = 'Hyderabad';
    else if (/goa/i.test(raw)) detectedLocation = 'Goa';
    else if (/araku/i.test(raw)) detectedLocation = 'Araku Valley';

    // Text intents
    words.forEach(w => {
      if (w.length > 2 && !['the', 'and', 'with', 'for', 'from', 'near', 'where', 'what', 'find', 'show', 'ones', 'only', 'just'].includes(w)) {
        if (!textIntent.includes(w)) textIntent.push(w);
      }
    });

    return {
      objects: detectedObjects.length ? detectedObjects : words.slice(0, 3),
      textIntent,
      documentType: detectedDocType,
      dateRange: detectedDateRange,
      location: detectedLocation,
      colors: detectedColors,
      people,
      actions,
      semanticMeaning: `Looking for media representing ${words.join(' ')} with multimodal verification across visual, OCR and metadata layers.`,
      searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
    };
  }

  /**
   * Classifies if an incoming query is a follow-up refinement within current Search Context
   */
  public classifyQueryInContext(queryText: string, currentContext: SearchContextState): FollowUpClassification {
    const raw = queryText.toLowerCase().trim();

    // If context is empty or disabled, it's a new root search
    if (!currentContext.isEnabled || currentContext.steps.length === 0) {
      return {
        isFollowUp: false,
        filterType: 'initial',
        filterLabel: queryText,
        queryType: 'new_root'
      };
    }

    // 1. Color refinement (e.g. "red ones", "the red one", "only red", "blue ones", "white")
    if (/\b(red|crimson|ruby|scarlet)\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'color',
        filterLabel: '+ Color: Red',
        queryType: 'refinement',
        targetFacet: 'color',
        extractedValue: 'Red'
      };
    }
    if (/\b(blue|azure|cyan|navy)\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'color',
        filterLabel: '+ Color: Blue',
        queryType: 'refinement',
        targetFacet: 'color',
        extractedValue: 'Blue'
      };
    }
    if (/\b(white|cream|ivory)\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'color',
        filterLabel: '+ Color: White',
        queryType: 'refinement',
        targetFacet: 'color',
        extractedValue: 'White'
      };
    }
    if (/\b(black|dark|noir)\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'color',
        filterLabel: '+ Color: Black',
        queryType: 'refinement',
        targetFacet: 'color',
        extractedValue: 'Black'
      };
    }
    if (/\b(golden|gold|yellow)\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'color',
        filterLabel: '+ Color: Gold',
        queryType: 'refinement',
        targetFacet: 'color',
        extractedValue: 'Gold'
      };
    }

    // 2. Document/Media Type refinement (e.g. "receipts", "only invoices", "just screenshots", "photos only")
    if (/receipt|invoice|bill|tax invoice|expense/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'document_type',
        filterLabel: '+ Type: Receipts',
        queryType: 'refinement',
        targetFacet: 'type',
        extractedValue: 'receipt'
      };
    }
    if (/screenshot|screen capture/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'category',
        filterLabel: '+ Type: Screenshots',
        queryType: 'refinement',
        targetFacet: 'type',
        extractedValue: 'screenshot'
      };
    }
    if (/photo|photos only|camera/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'category',
        filterLabel: '+ Type: Photos',
        queryType: 'refinement',
        targetFacet: 'type',
        extractedValue: 'photo'
      };
    }
    if (/document|passport|insurance|policy|ticket|boarding pass/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'document_type',
        filterLabel: '+ Documents',
        queryType: 'refinement',
        targetFacet: 'type',
        extractedValue: 'document'
      };
    }

    // 3. Temporal / Date refinement (e.g. "from 2025", "from last year", "in August", "this year")
    if (/last year|2025/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'date',
        filterLabel: '+ Date: 2025',
        queryType: 'refinement',
        targetFacet: 'date',
        extractedValue: '2025'
      };
    }
    if (/this year|2026/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'date',
        filterLabel: '+ Date: 2026',
        queryType: 'refinement',
        targetFacet: 'date',
        extractedValue: '2026'
      };
    }
    if (/august|aug/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'date',
        filterLabel: '+ Month: August',
        queryType: 'refinement',
        targetFacet: 'date',
        extractedValue: 'August'
      };
    }
    if (/june|jun/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'date',
        filterLabel: '+ Month: June',
        queryType: 'refinement',
        targetFacet: 'date',
        extractedValue: 'June'
      };
    }
    if (/february|feb/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'date',
        filterLabel: '+ Month: February',
        queryType: 'refinement',
        targetFacet: 'date',
        extractedValue: 'February'
      };
    }

    // 4. Location refinement (e.g. "in Goa", "in Hyderabad", "in Araku", "at the beach")
    if (/goa/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'location',
        filterLabel: '+ Location: Goa',
        queryType: 'refinement',
        targetFacet: 'location',
        extractedValue: 'Goa'
      };
    }
    if (/hyderabad/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'location',
        filterLabel: '+ Location: Hyderabad',
        queryType: 'refinement',
        targetFacet: 'location',
        extractedValue: 'Hyderabad'
      };
    }
    if (/araku/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'location',
        filterLabel: '+ Location: Araku Valley',
        queryType: 'refinement',
        targetFacet: 'location',
        extractedValue: 'Araku Valley'
      };
    }

    // 5. Explicit refinement keywords (e.g. "only...", "with...", "without...", "...ones")
    if (/^(only|just|the|with|without|from|in|at|under|over|that are|which)\b/i.test(raw) || /\bones\b/i.test(raw)) {
      return {
        isFollowUp: true,
        filterType: 'refinement',
        filterLabel: `+ ${queryText}`,
        queryType: 'refinement'
      };
    }

    // 6. Short sub-queries (1-2 words) when in context mode are treated as refinement by default
    const wordCount = raw.split(/\s+/).length;
    if (wordCount <= 2) {
      return {
        isFollowUp: true,
        filterType: 'refinement',
        filterLabel: `+ "${queryText}"`,
        queryType: 'refinement'
      };
    }

    // Otherwise, treat as new root search
    return {
      isFollowUp: false,
      filterType: 'initial',
      filterLabel: queryText,
      queryType: 'new_root'
    };
  }

  /**
   * Multimodal search across the user's media library with 5-layer scoring
   */
  public searchGallery(
    query: string, 
    gallery: MediaItem[], 
    memoryEvents: MemoryEvent[] = [],
    candidateSubsetIds?: string[]
  ): SearchResultGrouped {
    const rawQuery = query.toLowerCase().trim();
    if (!rawQuery) {
      return {
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
      };
    }

    const concepts = this.parseQuery(query);
    const tokens = rawQuery.replace(/[^\w\s₹$]/g, ' ').split(/\s+/).filter(Boolean);

    // Expand search terms with semantic synonyms
    const expandedTerms = new Set<string>(tokens);
    tokens.forEach(t => {
      Object.entries(SEMANTIC_CLUSTERS).forEach(([key, cluster]) => {
        if (key === t || cluster.includes(t)) {
          cluster.forEach(syn => expandedTerms.add(syn.toLowerCase()));
          expandedTerms.add(key);
        }
      });
    });

    const subsetSet = candidateSubsetIds ? new Set(candidateSubsetIds) : null;

    const scoredItems: SearchResultItem[] = gallery.map(item => {
      // If we are filtering within a candidate subset and this item isn't in it, give penalty
      const isCandidate = subsetSet ? subsetSet.has(item.id) : true;

      let ocrScore = 0;
      let visualScore = 0;
      let semanticScore = 0;
      let metadataScore = 0;
      let matchedOcrSnippet: string | undefined;
      const matchedObjects: string[] = [];
      const matchedTags: string[] = [];

      // 1. OCR Scoring
      const itemOcrLower = (item.ocrText || '').toLowerCase();
      if (itemOcrLower) {
        // Exact substring
        if (itemOcrLower.includes(rawQuery)) {
          ocrScore += 50;
        }
        // Token matches
        let ocrMatchCount = 0;
        tokens.forEach(token => {
          if (itemOcrLower.includes(token)) {
            ocrScore += 18;
            ocrMatchCount++;
          }
        });
        // Semantic term matches in OCR
        expandedTerms.forEach(term => {
          if (itemOcrLower.includes(term) && !tokens.includes(term)) {
            ocrScore += 8;
          }
        });

        // Snippet extraction
        if (ocrMatchCount > 0 || ocrScore > 0) {
          const lines = item.ocrText.split('\n');
          const matchedLine = lines.find(l => 
            tokens.some(t => l.toLowerCase().includes(t)) || 
            Array.from(expandedTerms).some(t => l.toLowerCase().includes(t))
          );
          matchedOcrSnippet = matchedLine ? matchedLine.trim() : lines[0];
        }
      }

      // 2. Visual AI Object Scoring & Color Attribute Scoring
      const objectsLower = item.detectedObjects.map(o => o.toLowerCase());
      const itemTagsLower = item.semanticTags.map(t => t.toLowerCase());
      const itemTitleLower = item.title.toLowerCase();
      const itemDescLower = (item.aiDescription || '').toLowerCase();

      item.detectedObjects.forEach(obj => {
        const objLower = obj.toLowerCase();
        tokens.forEach(token => {
          if (objLower.includes(token)) {
            visualScore += 25;
            if (!matchedObjects.includes(obj)) matchedObjects.push(obj);
          }
        });
        expandedTerms.forEach(term => {
          if (objLower.includes(term)) {
            visualScore += 12;
            if (!matchedObjects.includes(obj)) matchedObjects.push(obj);
          }
        });
      });

      // Bounding box labels
      if (item.boundingBoxes) {
        item.boundingBoxes.forEach(bb => {
          const bLabel = bb.label.toLowerCase();
          tokens.forEach(token => {
            if (bLabel.includes(token)) {
              visualScore += 15;
              if (!matchedObjects.includes(bb.label)) matchedObjects.push(bb.label);
            }
          });
        });
      }

      // Special Color Detection match boost
      if (concepts.colors && concepts.colors.length > 0) {
        concepts.colors.forEach(color => {
          const cLower = color.toLowerCase();
          const matchesColor = 
            objectsLower.some(o => o.includes(cLower)) ||
            itemTagsLower.some(t => t.includes(cLower)) ||
            itemTitleLower.includes(cLower) ||
            itemDescLower.includes(cLower);

          if (matchesColor) {
            visualScore += 35;
            semanticScore += 25;
            if (!matchedObjects.includes(`${color} Color`)) matchedObjects.push(`${color} Color`);
          }
        });
      }

      // 3. Semantic & Category Scoring
      item.semanticTags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        tokens.forEach(token => {
          if (tagLower.includes(token)) {
            semanticScore += 15;
            if (!matchedTags.includes(tag)) matchedTags.push(tag);
          }
        });
        expandedTerms.forEach(term => {
          if (tagLower.includes(term)) {
            semanticScore += 8;
            if (!matchedTags.includes(tag)) matchedTags.push(tag);
          }
        });
      });

      if (item.aiDescription) {
        tokens.forEach(t => {
          if (itemDescLower.includes(t)) semanticScore += 10;
        });
      }

      // Document Type matching boost
      if (concepts.documentType) {
        if (item.type === 'receipt' && /receipt|invoice/i.test(concepts.documentType)) {
          semanticScore += 35;
        } else if (item.type === 'screenshot' && /screenshot|credential|tracking/i.test(concepts.documentType)) {
          semanticScore += 30;
        } else if (item.type === 'document' && /document|passport|insurance|ticket/i.test(concepts.documentType)) {
          semanticScore += 35;
        }
      }

      // 4. Metadata Scoring (Location, Date, Camera, Title)
      if (item.title.toLowerCase().includes(rawQuery)) {
        metadataScore += 25;
      }
      tokens.forEach(t => {
        if (item.title.toLowerCase().includes(t)) metadataScore += 10;
      });

      if (item.location) {
        const locLower = `${item.location.name} ${item.location.city || ''} ${item.location.country || ''}`.toLowerCase();
        tokens.forEach(t => {
          if (locLower.includes(t)) metadataScore += 20;
        });
        if (concepts.location && locLower.includes(concepts.location.toLowerCase())) {
          metadataScore += 35;
        }
      }

      if (concepts.dateRange) {
        const dateLower = item.timestamp.toLowerCase();
        if (concepts.dateRange === '2025' && dateLower.startsWith('2025')) metadataScore += 30;
        if (concepts.dateRange === '2026' && dateLower.startsWith('2026')) metadataScore += 30;
        if (concepts.dateRange === 'August' && dateLower.includes('-08-')) metadataScore += 25;
        if (concepts.dateRange === 'July' && dateLower.includes('-07-')) metadataScore += 25;
        if (concepts.dateRange === 'June' && dateLower.includes('-06-')) metadataScore += 25;
        if (concepts.dateRange === 'February' && dateLower.includes('-02-')) metadataScore += 25;
        if (concepts.dateRange === 'December' && dateLower.includes('-12-')) metadataScore += 25;
      }

      // Weighted overall calculation
      let overallScore = Math.min(
        100,
        Math.round(ocrScore * 0.35 + visualScore * 0.30 + semanticScore * 0.20 + metadataScore * 0.15)
      );

      // Candidate subset priority: if filtering within a previous search context, heavily boost candidate items
      if (subsetSet) {
        if (isCandidate) {
          overallScore = Math.min(100, overallScore + 30);
        } else {
          overallScore = 0; // Exclude non-candidates when refining
        }
      }

      let reason = '';
      if (ocrScore > 30) reason = `Matched OCR Text: "${matchedOcrSnippet || 'Text recognized'}"`;
      else if (concepts.colors && concepts.colors.length > 0 && visualScore > 20) reason = `Matched Color: ${concepts.colors.join(', ')}`;
      else if (matchedObjects.length > 0) reason = `Detected Objects: ${matchedObjects.slice(0, 2).join(', ')}`;
      else if (matchedTags.length > 0) reason = `Semantic Match: ${matchedTags.slice(0, 2).join(', ')}`;
      else if (metadataScore > 20) reason = `Matched Metadata: ${item.location?.city || item.title}`;

      return {
        item,
        overallScore,
        ocrScore,
        visualScore,
        semanticScore,
        metadataScore,
        matchedHighlights: {
          matchedOcrSnippet,
          matchedObjects,
          matchedTags,
          reason
        }
      };
    });

    // Filter and Sort
    const qualifiedItems = scoredItems
      .filter(si => si.overallScore > 10)
      .sort((a, b) => b.overallScore - a.overallScore);

    // Grouping
    const bestMatches = qualifiedItems.slice(0, 8);
    const textMatches = qualifiedItems.filter(si => si.ocrScore >= 20);
    const visualMatches = qualifiedItems.filter(si => si.visualScore >= 15);
    const documentMatches = qualifiedItems.filter(si => 
      (si.item.type === 'receipt' || si.item.type === 'document' || si.item.documentMetadata) && si.overallScore >= 12
    );

    // Related memories
    const relatedMemories: SearchResultItem[] = [];
    const matchedItemIds = new Set(qualifiedItems.map(q => q.item.id));
    memoryEvents.forEach(mem => {
      const sharesItems = mem.itemIds.some(id => matchedItemIds.has(id));
      const textMatch = tokens.some(t => mem.title.toLowerCase().includes(t) || mem.tags.some(tag => tag.toLowerCase().includes(t)));
      if (sharesItems || textMatch) {
        const cover = gallery.find(g => g.id === mem.coverItemId);
        if (cover && !bestMatches.some(b => b.item.id === cover.id)) {
          relatedMemories.push({
            item: cover,
            overallScore: 75,
            ocrScore: 10,
            visualScore: 30,
            semanticScore: 40,
            metadataScore: 30,
            matchedHighlights: {
              reason: `Memory Event: ${mem.title}`
            }
          });
        }
      }
    });

    // Generate smart explanation
    const matchedCriteria: string[] = [];
    if (textMatches.length > 0) matchedCriteria.push(`${textMatches.length} text & OCR matches`);
    if (visualMatches.length > 0) matchedCriteria.push(`${visualMatches.length} visual AI objects`);
    if (documentMatches.length > 0) matchedCriteria.push(`${documentMatches.length} receipts & documents`);
    if (concepts.colors && concepts.colors.length > 0) matchedCriteria.push(`Color: ${concepts.colors.join(', ')}`);
    if (concepts.dateRange) matchedCriteria.push(`Filtered by ${concepts.dateRange}`);
    if (concepts.location) matchedCriteria.push(`Location ${concepts.location}`);

    // Compute dynamic neural relevance weights for this query/concepts
    const weights = this.calculateRelevanceWeights(query, concepts);

    return {
      bestMatches,
      textMatches,
      visualMatches,
      documentMatches,
      relatedMemories,
      totalSearched: candidateSubsetIds ? candidateSubsetIds.length : gallery.length,
      weights,
      explanation: {
        searchedCount: candidateSubsetIds ? candidateSubsetIds.length : gallery.length,
        detectedConcepts: [
          ...concepts.objects,
          ...(concepts.colors ? concepts.colors : []),
          ...(concepts.documentType ? [concepts.documentType] : []),
          ...(concepts.dateRange ? [concepts.dateRange] : [])
        ],
        matchedCriteria
      }
    };
  }

  /**
   * Calculates dynamic relevance weightings across OCR, Visual AI, Semantic, and Metadata
   * based on the active search step and query characteristics
   */
  public calculateRelevanceWeights(
    queryText: string,
    concepts: QueryConcepts,
    step?: SearchContextStep,
    customWeightsOverride?: { ocr?: number; visual?: number; semantic?: number; metadata?: number }
  ): SearchRelevanceWeights {
    if (customWeightsOverride && (customWeightsOverride.ocr !== undefined || customWeightsOverride.visual !== undefined)) {
      const rawOcr = customWeightsOverride.ocr ?? 35;
      const rawVisual = customWeightsOverride.visual ?? 35;
      const rawSemantic = customWeightsOverride.semantic ?? 20;
      const rawMeta = customWeightsOverride.metadata ?? 10;
      const total = rawOcr + rawVisual + rawSemantic + rawMeta || 100;
      const ocrWeight = Math.round((rawOcr / total) * 100);
      const visualWeight = Math.round((rawVisual / total) * 100);
      const semanticWeight = Math.round((rawSemantic / total) * 100);
      const metadataWeight = 100 - (ocrWeight + visualWeight + semanticWeight);

      let dominantEngine: 'OCR' | 'Visual AI' | 'Semantic' | 'Metadata' | 'Balanced' = 'Balanced';
      const maxVal = Math.max(ocrWeight, visualWeight, semanticWeight, metadataWeight);
      if (maxVal === ocrWeight && ocrWeight > 35) dominantEngine = 'OCR';
      else if (maxVal === visualWeight && visualWeight > 35) dominantEngine = 'Visual AI';
      else if (maxVal === semanticWeight && semanticWeight > 35) dominantEngine = 'Semantic';
      else if (maxVal === metadataWeight && metadataWeight > 35) dominantEngine = 'Metadata';

      return {
        ocrWeight,
        visualWeight,
        semanticWeight,
        metadataWeight,
        dominantEngine,
        rationale: `Manual Custom Override (${dominantEngine} prioritized)`,
        contributingSignals: [
          { layer: 'OCR', label: 'OCR Target Weight', impact: ocrWeight > 35 ? 'high' : 'medium', description: `Allocated ${ocrWeight}% neural weight to text extraction` },
          { layer: 'Visual AI', label: 'Visual AI Target Weight', impact: visualWeight > 35 ? 'high' : 'medium', description: `Allocated ${visualWeight}% neural weight to image embeddings` },
          { layer: 'Semantic', label: 'Semantic Target Weight', impact: semanticWeight > 35 ? 'high' : 'medium', description: `Allocated ${semanticWeight}% neural weight to conceptual matching` },
          { layer: 'Metadata', label: 'Metadata Target Weight', impact: metadataWeight > 20 ? 'high' : 'low', description: `Allocated ${metadataWeight}% neural weight to location/date` }
        ]
      };
    }

    const raw = (queryText || '').toLowerCase().trim();
    const contributingSignals: {
      layer: 'OCR' | 'Visual AI' | 'Semantic' | 'Metadata';
      label: string;
      impact: 'high' | 'medium' | 'low';
      description: string;
    }[] = [];

    let ocrPoints = 25;
    let visualPoints = 30;
    let semanticPoints = 25;
    let metadataPoints = 15;

    // 1. Evaluate OCR Signals
    const isDocumentOrCode = /receipt|invoice|bill|tax|password|wifi|ticket|policy|passport|code|token|amount|total|order|tracking|license|id|card/i.test(raw);
    const hasNumbersOrSymbols = /\d+|₹|\$|%|#|@/.test(raw);
    const hasQuotedText = /"[^"]+"/.test(raw);

    if (isDocumentOrCode) {
      ocrPoints += 38;
      semanticPoints += 15;
      contributingSignals.push({
        layer: 'OCR',
        label: 'Document & OCR Phrase Intent',
        impact: 'high',
        description: 'Query references structured document keywords (receipt, bill, password, id, ticket), boosting OCR recognition layer.'
      });
    }
    if (hasNumbersOrSymbols) {
      ocrPoints += 24;
      contributingSignals.push({
        layer: 'OCR',
        label: 'Alphanumeric & Currency Tokens',
        impact: 'medium',
        description: 'Numerical codes, prices, or currency characters detected, prioritizing exact OCR text matching.'
      });
    }
    if (hasQuotedText) {
      ocrPoints += 30;
      contributingSignals.push({
        layer: 'OCR',
        label: 'Exact Phrase Match Intent',
        impact: 'high',
        description: 'Quoted query specifies strict lexical OCR pattern matching.'
      });
    }

    // 2. Evaluate Visual AI Signals
    const hasColorFilter = (concepts.colors && concepts.colors.length > 0) || /\b(red|blue|green|yellow|black|white|gold|silver|purple|orange|pink|dark|bright)\b/i.test(raw);
    const hasVisualObjects = concepts.objects.some(o => /car|bike|motorcycle|dog|puppy|cat|beach|mountain|sunset|tree|flower|food|dish|person|face|laptop|phone|shoe|bag|jacket/i.test(o));
    const isVisualRefinement = step?.filterType === 'color' || step?.filterType === 'object';

    if (hasColorFilter) {
      visualPoints += 38;
      contributingSignals.push({
        layer: 'Visual AI',
        label: 'Chromatic Palette Discriminator',
        impact: 'high',
        description: `Color filter activated (${concepts.colors?.join(', ') || 'color tone'}), prioritizing visual chromatic segmentation.`
      });
    }
    if (hasVisualObjects) {
      visualPoints += 28;
      contributingSignals.push({
        layer: 'Visual AI',
        label: 'Physical Object Detection',
        impact: 'high',
        description: `Detected physical target entities (${concepts.objects.slice(0, 2).join(', ')}), boosting visual bounding box confidence.`
      });
    }
    if (isVisualRefinement) {
      visualPoints += 22;
      contributingSignals.push({
        layer: 'Visual AI',
        label: 'Visual Follow-up Refinement',
        impact: 'high',
        description: 'Step specifically refines physical or visual attributes of the current candidate pool.'
      });
    }

    // 3. Evaluate Semantic Signals
    const hasSemanticConcepts = /trip|vacation|holiday|birthday|celebration|maintenance|repair|outing|dinner|lunch|breakfast|work|gym|workout|nature|adventure|shopping|memories/i.test(raw);
    const hasActionWords = (concepts.actions && concepts.actions.length > 0) || /riding|driving|swimming|cooking|eating|hiking|celebrating|relaxing/i.test(raw);

    if (hasSemanticConcepts) {
      semanticPoints += 35;
      contributingSignals.push({
        layer: 'Semantic',
        label: 'Thematic Life Event Semantics',
        impact: 'high',
        description: 'Abstract life event or theme detected, elevating semantic vector embeddings and memory clustering.'
      });
    }
    if (hasActionWords) {
      semanticPoints += 20;
      contributingSignals.push({
        layer: 'Semantic',
        label: 'Action & Scene Semantics',
        impact: 'medium',
        description: `Activity action verbs (${concepts.actions?.join(', ') || 'activity'}) mapped to contextual visual scenes.`
      });
    }
    if (concepts.documentType) {
      semanticPoints += 15;
      contributingSignals.push({
        layer: 'Semantic',
        label: 'Taxonomy Classification',
        impact: 'medium',
        description: `Categorized into document taxonomy "${concepts.documentType}".`
      });
    }

    // 4. Evaluate Metadata Signals
    const hasDateConstraint = !!concepts.dateRange || /\b(2024|2025|2026|today|yesterday|august|july|june|month|year|last week)\b/i.test(raw);
    const hasLocationConstraint = !!concepts.location || /\b(hyderabad|goa|araku|vizag|delhi|mumbai|bangalore|india)\b/i.test(raw);
    const isMetaRefinement = step?.filterType === 'date' || step?.filterType === 'location';

    if (hasDateConstraint) {
      metadataPoints += 30;
      contributingSignals.push({
        layer: 'Metadata',
        label: 'Temporal Chronology Bounding',
        impact: 'high',
        description: `Temporal filter applied for ${concepts.dateRange || 'date keyword'}.`
      });
    }
    if (hasLocationConstraint) {
      metadataPoints += 30;
      contributingSignals.push({
        layer: 'Metadata',
        label: 'Geospatial Geotag Matching',
        impact: 'high',
        description: `Geotag coordinates prioritized for "${concepts.location || 'location keyword'}".`
      });
    }
    if (isMetaRefinement) {
      metadataPoints += 20;
      contributingSignals.push({
        layer: 'Metadata',
        label: 'Metadata Facet Filter',
        impact: 'medium',
        description: 'Refinement explicitly narrows EXIF and geographic metadata.'
      });
    }

    // Normalize to 100%
    const totalPoints = ocrPoints + visualPoints + semanticPoints + metadataPoints;
    const ocrWeight = Math.round((ocrPoints / totalPoints) * 100);
    const visualWeight = Math.round((visualPoints / totalPoints) * 100);
    const semanticWeight = Math.round((semanticPoints / totalPoints) * 100);
    const metadataWeight = 100 - (ocrWeight + visualWeight + semanticWeight);

    let dominantEngine: 'OCR' | 'Visual AI' | 'Semantic' | 'Metadata' | 'Balanced' = 'Balanced';
    const highest = Math.max(ocrWeight, visualWeight, semanticWeight, metadataWeight);
    if (highest === ocrWeight && ocrWeight > 32) dominantEngine = 'OCR';
    else if (highest === visualWeight && visualWeight > 32) dominantEngine = 'Visual AI';
    else if (highest === semanticWeight && semanticWeight > 32) dominantEngine = 'Semantic';
    else if (highest === metadataWeight && metadataWeight > 30) dominantEngine = 'Metadata';

    let rationale = `Balanced multimodal evaluation for "${queryText || 'gallery search'}".`;
    if (dominantEngine === 'OCR') {
      rationale = `OCR text extraction heavily weighted (${ocrWeight}%) due to high density of document / alphanumeric tokens.`;
    } else if (dominantEngine === 'Visual AI') {
      rationale = `Visual AI embeddings heavily weighted (${visualWeight}%) targeting chromatic & object recognition features.`;
    } else if (dominantEngine === 'Semantic') {
      rationale = `Semantic intelligence prioritized (${semanticWeight}%) to match conceptual themes and event relationships.`;
    } else if (dominantEngine === 'Metadata') {
      rationale = `Metadata and spatiotemporal filters prioritized (${metadataWeight}%) for exact temporal/location narrowing.`;
    }

    return {
      ocrWeight,
      visualWeight,
      semanticWeight,
      metadataWeight,
      dominantEngine,
      rationale,
      contributingSignals
    };
  }

  /**
   * State-Managed Contextual Search Execution
   * Remembers previous queries and applies progressive follow-up filters
   */
  public searchWithContext(
    queryText: string,
    gallery: MediaItem[],
    currentContext: SearchContextState,
    memoryEvents: MemoryEvent[] = []
  ): { results: SearchResultGrouped; newContext: SearchContextState } {
    const trimmed = queryText.trim();
    if (!trimmed) {
      return {
        results: this.searchGallery('', gallery, memoryEvents),
        newContext: currentContext
      };
    }

    const classification = this.classifyQueryInContext(trimmed, currentContext);
    const stepConcepts = this.parseQuery(trimmed);

    // If follow-up refinement
    if (classification.isFollowUp && currentContext.steps.length > 0) {
      const parentStep = currentContext.steps[currentContext.steps.length - 1];
      const candidateIds = parentStep.matchedItemIds;

      // Search exclusively within previous result pool
      let refinedResults = this.searchGallery(trimmed, gallery, memoryEvents, candidateIds);

      // If narrowing inside candidateIds yielded zero matches (over-filtered), fallback to full gallery search with combined query
      if (refinedResults.bestMatches.length === 0) {
        const combinedQuery = `${parentStep.query} ${trimmed}`;
        refinedResults = this.searchGallery(combinedQuery, gallery, memoryEvents);
      }

      const matchedIds = refinedResults.bestMatches.map(bm => bm.item.id);
      const newStepId = `step-${Date.now()}`;

      const stepWeights = this.calculateRelevanceWeights(trimmed, stepConcepts, {
        id: newStepId,
        query: trimmed,
        timestamp: Date.now(),
        concepts: stepConcepts,
        filterLabel: classification.filterLabel,
        filterType: classification.filterType,
        matchedItemIds: matchedIds,
        totalMatches: matchedIds.length
      });

      const newStep: SearchContextStep = {
        id: newStepId,
        query: trimmed,
        timestamp: Date.now(),
        concepts: stepConcepts,
        filterLabel: classification.filterLabel,
        filterType: classification.filterType,
        matchedItemIds: matchedIds,
        totalMatches: matchedIds.length,
        weights: stepWeights
      };

      const updatedSteps = [...currentContext.steps, newStep];
      const mergedObjects = Array.from(new Set([...currentContext.mergedConcepts.objects, ...stepConcepts.objects]));
      const mergedText = Array.from(new Set([...currentContext.mergedConcepts.textIntent, ...stepConcepts.textIntent]));
      const mergedColors = Array.from(new Set([
        ...(currentContext.mergedConcepts.colors || []),
        ...(stepConcepts.colors || [])
      ]));

      const updatedContext: SearchContextState = {
        isEnabled: currentContext.isEnabled,
        steps: updatedSteps,
        activeStepId: newStepId,
        mergedConcepts: {
          ...currentContext.mergedConcepts,
          objects: mergedObjects,
          textIntent: mergedText,
          colors: mergedColors,
          documentType: stepConcepts.documentType || currentContext.mergedConcepts.documentType,
          dateRange: stepConcepts.dateRange || currentContext.mergedConcepts.dateRange,
          location: stepConcepts.location || currentContext.mergedConcepts.location
        },
        activeFilterTags: [...currentContext.activeFilterTags, classification.filterLabel]
      };

      refinedResults.weights = stepWeights;
      refinedResults.contextInfo = {
        isRefinement: true,
        stepIndex: updatedSteps.length - 1,
        parentQuery: parentStep.query,
        parentMatchCount: parentStep.totalMatches,
        refinedMatchCount: matchedIds.length,
        refinementDescription: `Filtered from ${parentStep.totalMatches} matches to ${matchedIds.length} using ${classification.filterLabel}`
      };

      return { results: refinedResults, newContext: updatedContext };
    }

    // New Root Search
    const initialResults = this.searchGallery(trimmed, gallery, memoryEvents);
    const matchedIds = initialResults.bestMatches.map(bm => bm.item.id);
    const newStepId = `step-${Date.now()}`;

    const stepWeights = this.calculateRelevanceWeights(trimmed, stepConcepts);

    const initialStep: SearchContextStep = {
      id: newStepId,
      query: trimmed,
      timestamp: Date.now(),
      concepts: stepConcepts,
      filterLabel: trimmed,
      filterType: 'initial',
      matchedItemIds: matchedIds,
      totalMatches: matchedIds.length,
      weights: stepWeights
    };

    const newContextState: SearchContextState = {
      isEnabled: currentContext.isEnabled,
      steps: [initialStep],
      activeStepId: newStepId,
      mergedConcepts: stepConcepts,
      activeFilterTags: [trimmed]
    };

    initialResults.weights = stepWeights;
    initialResults.contextInfo = {
      isRefinement: false,
      stepIndex: 0,
      refinedMatchCount: matchedIds.length
    };

    return { results: initialResults, newContext: newContextState };
  }

  /**
   * Removes a specific step from the Search Context Chain and recomputes results
   */
  public removeContextStep(
    stepId: string,
    gallery: MediaItem[],
    currentContext: SearchContextState,
    memoryEvents: MemoryEvent[] = []
  ): { results: SearchResultGrouped; newContext: SearchContextState } {
    const remainingSteps = currentContext.steps.filter(s => s.id !== stepId);

    if (remainingSteps.length === 0) {
      const emptyContext: SearchContextState = {
        isEnabled: currentContext.isEnabled,
        steps: [],
        activeStepId: null,
        mergedConcepts: {
          objects: [],
          textIntent: [],
          searchSources: ['Visual AI', 'OCR', 'Metadata', 'Semantic Search']
        },
        activeFilterTags: []
      };
      return {
        results: this.searchGallery('', gallery, memoryEvents),
        newContext: emptyContext
      };
    }

    // Replay steps from beginning
    let candidateIds: string[] | undefined = undefined;
    let finalResults: SearchResultGrouped = this.searchGallery(remainingSteps[0].query, gallery, memoryEvents);
    
    for (let i = 0; i < remainingSteps.length; i++) {
      const step = remainingSteps[i];
      if (i === 0) {
        finalResults = this.searchGallery(step.query, gallery, memoryEvents);
      } else {
        finalResults = this.searchGallery(step.query, gallery, memoryEvents, candidateIds);
      }
      step.matchedItemIds = finalResults.bestMatches.map(bm => bm.item.id);
      step.totalMatches = step.matchedItemIds.length;
      step.weights = this.calculateRelevanceWeights(step.query, step.concepts, step);
      candidateIds = step.matchedItemIds;
    }

    const lastStep = remainingSteps[remainingSteps.length - 1];
    finalResults.weights = lastStep.weights;
    const newContext: SearchContextState = {
      isEnabled: currentContext.isEnabled,
      steps: remainingSteps,
      activeStepId: lastStep.id,
      mergedConcepts: lastStep.concepts,
      activeFilterTags: remainingSteps.map(s => s.filterLabel)
    };

    finalResults.contextInfo = {
      isRefinement: remainingSteps.length > 1,
      stepIndex: remainingSteps.length - 1,
      parentQuery: remainingSteps.length > 1 ? remainingSteps[remainingSteps.length - 2].query : undefined,
      refinedMatchCount: lastStep.totalMatches,
      refinementDescription: `Active context chain has ${remainingSteps.length} step${remainingSteps.length > 1 ? 's' : ''}`
    };

    return { results: finalResults, newContext };
  }

  /**
   * Jump / roll back to a specific step in the Search Context Chain
   */
  public jumpToContextStep(
    stepId: string,
    gallery: MediaItem[],
    currentContext: SearchContextState,
    memoryEvents: MemoryEvent[] = []
  ): { results: SearchResultGrouped; newContext: SearchContextState } {
    const stepIndex = currentContext.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) {
      return {
        results: this.searchGallery('', gallery, memoryEvents),
        newContext: currentContext
      };
    }

    const slicedSteps = currentContext.steps.slice(0, stepIndex + 1);
    const targetStep = slicedSteps[slicedSteps.length - 1];

    let candidateIds: string[] | undefined = undefined;
    let finalResults: SearchResultGrouped = this.searchGallery(slicedSteps[0].query, gallery, memoryEvents);

    for (let i = 0; i < slicedSteps.length; i++) {
      const step = slicedSteps[i];
      if (i === 0) {
        finalResults = this.searchGallery(step.query, gallery, memoryEvents);
      } else {
        finalResults = this.searchGallery(step.query, gallery, memoryEvents, candidateIds);
      }
      step.matchedItemIds = finalResults.bestMatches.map(bm => bm.item.id);
      step.totalMatches = step.matchedItemIds.length;
      step.weights = this.calculateRelevanceWeights(step.query, step.concepts, step);
      candidateIds = finalResults.bestMatches.map(bm => bm.item.id);
    }

    finalResults.weights = targetStep.weights || this.calculateRelevanceWeights(targetStep.query, targetStep.concepts, targetStep);

    const updatedContext: SearchContextState = {
      isEnabled: currentContext.isEnabled,
      steps: slicedSteps,
      activeStepId: targetStep.id,
      mergedConcepts: targetStep.concepts,
      activeFilterTags: slicedSteps.map(s => s.filterLabel)
    };

    finalResults.contextInfo = {
      isRefinement: slicedSteps.length > 1,
      stepIndex: slicedSteps.length - 1,
      parentQuery: slicedSteps.length > 1 ? slicedSteps[slicedSteps.length - 2].query : undefined,
      refinedMatchCount: finalResults.bestMatches.length,
      refinementDescription: `Jumped to step: ${targetStep.filterLabel}`
    };

    return { results: finalResults, newContext: updatedContext };
  }

  /**
   * Generates dynamic contextual follow-up prompt chips based on active Search Context and matched items
   */
  public generateContextualSuggestions(
    currentResults: SearchResultGrouped,
    currentContext: SearchContextState
  ): string[] {
    const suggestions: string[] = [];
    const items = currentResults.bestMatches.map(bm => bm.item);

    if (items.length === 0) {
      return ['Honda motorcycle', 'WiFi password screenshot', 'Goa beach photos', 'Pizza receipt'];
    }

    const hasVehicle = items.some(i => i.detectedObjects.some(o => /motorcycle|bike|honda|car|audi/i.test(o)));
    const hasReceipt = items.some(i => i.type === 'receipt' || i.documentMetadata?.documentType === 'receipt');
    const hasDoc = items.some(i => i.type === 'document' || /insurance|passport|ticket/i.test(i.ocrText));
    const hasFood = items.some(i => i.detectedObjects.some(o => /food|biryani|pizza|dining/i.test(o)));
    const hasGoa = items.some(i => i.location?.city?.toLowerCase() === 'goa' || i.location?.name?.toLowerCase().includes('goa'));
    const hasHyderabad = items.some(i => i.location?.city?.toLowerCase() === 'hyderabad');
    const has2026 = items.some(i => i.timestamp.startsWith('2026'));
    const has2025 = items.some(i => i.timestamp.startsWith('2025'));

    // If vehicles present
    if (hasVehicle) {
      suggestions.push('Red ones');
      if (hasReceipt) suggestions.push('Only receipts & bills');
      if (!currentContext.activeFilterTags.some(t => /2026/i.test(t)) && has2026) suggestions.push('From 2026');
      if (hasDoc) suggestions.push('Insurance policy');
    }

    // If food present
    if (hasFood) {
      suggestions.push('Special biryani');
      suggestions.push('Margherita pizza');
      suggestions.push('Receipts only');
    }

    // If locations present
    if (hasGoa && !currentContext.activeFilterTags.some(t => /goa/i.test(t))) {
      suggestions.push('In Goa');
      suggestions.push('With golden retriever dog');
    }
    if (hasHyderabad && !currentContext.activeFilterTags.some(t => /hyderabad/i.test(t))) {
      suggestions.push('In Hyderabad');
    }

    // Temporal
    if (has2025 && !currentContext.activeFilterTags.some(t => /2025/i.test(t))) {
      suggestions.push('From last year (2025)');
    }

    // General refinements
    if (!suggestions.includes('Photos only')) suggestions.push('Photos only');
    if (!suggestions.includes('Screenshots')) suggestions.push('Screenshots only');

    return Array.from(new Set(suggestions)).slice(0, 5);
  }

  /**
   * Visual Recall: Answers questions like "Where did I park my bike?" or "What restaurant in Hyderabad?"
   */
  public async visualRecall(question: string, gallery: MediaItem[]): Promise<{
    answer: string;
    matchingItems: MediaItem[];
    keyEntities: Record<string, string>;
  }> {
    const qLower = question.toLowerCase();
    
    // Check if cloud API is available
    try {
      const response = await fetch('/api/ai/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, gallerySnapshot: gallery.slice(0, 15) })
      });
      if (response.ok) {
        const data = await response.json();
        const items = (data.matchingItemIds || [])
          .map((id: string) => gallery.find(g => g.id === id))
          .filter(Boolean) as MediaItem[];
        return {
          answer: data.answer,
          matchingItems: items.length ? items : gallery.slice(0, 3),
          keyEntities: data.keyEntities || {}
        };
      }
    } catch {
      // Fall through to local intelligent rule engine
    }

    // Local rule engine fallback
    if (/park|motorcycle|bike|vehicle/i.test(qLower)) {
      const items = gallery.filter(g => g.detectedObjects.some(o => /motorcycle|honda/i.test(o)));
      return {
        answer: `I found ${items.length} images of your Honda CB350. The latest record is from August 10, 2026 at Jubilee Hills Art District near the red brick wall, and on August 12 at ABC Motors Service Workshop.`,
        matchingItems: items,
        keyEntities: {
          'Last Location': 'Jubilee Hills Art District, Hyderabad',
          'Vehicle Model': 'Honda CB350 Hness DLX Pro',
          'Date Recorded': 'August 10, 2026'
        }
      };
    }

    if (/restaurant|biryani|food|eat|hyderabad/i.test(qLower)) {
      const items = gallery.filter(g => g.detectedObjects.some(o => /biryani|food|pizza/i.test(o)));
      return {
        answer: `You visited Paradise Food Court in Secunderabad on June 14, 2026 for authentic Hyderabadi Mutton Biryani (Table 14), and Terraza Woodfire Trattoria on August 1 for Margherita pizza.`,
        matchingItems: items,
        keyEntities: {
          'Restaurant Name': 'Paradise Food Court, Secunderabad',
          'Dish': 'Special Hyderabadi Mutton Biryani',
          'Date': 'June 14, 2026'
        }
      };
    }

    if (/wifi|password|internet|router/i.test(qLower)) {
      const items = gallery.filter(g => g.type === 'screenshot' && /wifi|password/i.test(g.ocrText));
      return {
        answer: `I found your Home Fiber screenshot saved on July 28, 2026. The 5GHz SSID is "Orion_Nebula_5G" and the password is "Quantum#Secret$9942".`,
        matchingItems: items,
        keyEntities: {
          'SSID': 'Orion_Nebula_5G',
          'WiFi Password': 'Quantum#Secret$9942',
          'Router IP': '192.168.1.1'
        }
      };
    }

    if (/battery|change|replace|last/i.test(qLower)) {
      const items = gallery.filter(g => g.detectedObjects.some(o => /battery/i.test(o)) || g.ocrText.includes('BATTERY'));
      return {
        answer: `You last replaced your Honda motorcycle battery on August 12, 2026 at ABC Motors. You purchased an Exide XLTZ9 12V 9Ah battery for ₹4,500 with a 48-month warranty.`,
        matchingItems: items,
        keyEntities: {
          'Date': 'August 12, 2026',
          'Vendor': 'ABC Motors, Hyderabad',
          'Battery Model': 'Exide XLTZ9 12V 9Ah',
          'Amount': '₹4,500',
          'Warranty': '48 Months'
        }
      };
    }

    // Generic search
    const results = this.searchGallery(question, gallery);
    return {
      answer: `I searched your visual memory and identified ${results.bestMatches.length} relevant moments matching "${question}".`,
      matchingItems: results.bestMatches.map(b => b.item),
      keyEntities: {}
    };
  }
}

export const localAi = LocalAiEngine.getInstance();
