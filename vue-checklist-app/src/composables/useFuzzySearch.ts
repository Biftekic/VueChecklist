import { ref, computed, type Ref } from 'vue'

export interface FuzzySearchOptions {
  keys?: string[]
  threshold?: number
  includeScore?: boolean
  includeMatches?: boolean
  minMatchCharLength?: number
  shouldSort?: boolean
  findAllMatches?: boolean
  location?: number
  distance?: number
  ignoreLocation?: boolean
  ignoreFieldNorm?: boolean
}

export interface FuzzyMatch {
  indices: [number, number][]
  value: string
  key?: string
}

export interface FuzzyResult<T> {
  item: T
  score?: number
  matches?: FuzzyMatch[]
}

export interface SearchResult<T> {
  results: FuzzyResult<T>[]
  query: string
  totalResults: number
  searchTime: number
}

// Simple fuzzy search implementation
function calculateScore(query: string, text: string): number {
  if (!query || !text) return 0
  
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match gets highest score
  if (textLower === queryLower) return 1
  
  // Contains match
  if (textLower.includes(queryLower)) {
    return 0.8 * (queryLower.length / textLower.length)
  }
  
  // Character-by-character fuzzy matching
  let score = 0
  let queryIndex = 0
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 1
      queryIndex++
    }
  }
  
  // Normalize score based on query completion and text length
  const completionRatio = queryIndex / queryLower.length
  const lengthPenalty = queryLower.length / textLower.length
  
  return completionRatio * lengthPenalty * 0.6
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : ''
  }, obj)?.toString() || ''
}

function highlightMatches(text: string, query: string): string {
  if (!query) return text
  
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower)
    return text.substring(0, index) + 
           '<mark>' + text.substring(index, index + query.length) + '</mark>' + 
           text.substring(index + query.length)
  }
  
  return text
}

export function useFuzzySearch<T extends Record<string, any>>(
  items: Ref<T[]>,
  options: FuzzySearchOptions = {}
) {
  const query = ref('')
  const isSearching = ref(false)
  const lastSearchTime = ref(0)
  
  const defaultOptions: Required<FuzzySearchOptions> = {
    keys: ['name', 'title'],
    threshold: 0.3,
    includeScore: true,
    includeMatches: false,
    minMatchCharLength: 1,
    shouldSort: true,
    findAllMatches: false,
    location: 0,
    distance: 100,
    ignoreLocation: true,
    ignoreFieldNorm: false
  }
  
  const config = { ...defaultOptions, ...options }
  
  // Computed search results
  const results = computed<SearchResult<T>>(() => {
    const startTime = performance.now()
    
    if (!query.value || query.value.length < config.minMatchCharLength) {
      return {
        results: items.value.map(item => ({ item })),
        query: query.value,
        totalResults: items.value.length,
        searchTime: 0
      }
    }
    
    const fuzzyResults: FuzzyResult<T>[] = []
    
    items.value.forEach(item => {
      let bestScore = 0
      const matches: FuzzyMatch[] = []
      
      // Search through specified keys
      config.keys.forEach(key => {
        const value = getNestedValue(item, key)
        if (value) {
          const score = calculateScore(query.value, value)
          
          if (score > bestScore) {
            bestScore = score
          }
          
          if (config.includeMatches && score > config.threshold) {
            // Simple match highlighting
            const highlighted = highlightMatches(value, query.value)
            matches.push({
              indices: [], // Would need more complex logic for exact indices
              value: highlighted,
              key
            })
          }
        }
      })
      
      // Include item if score meets threshold
      if (bestScore >= config.threshold) {
        const result: FuzzyResult<T> = { item }
        
        if (config.includeScore) {
          result.score = bestScore
        }
        
        if (config.includeMatches && matches.length > 0) {
          result.matches = matches
        }
        
        fuzzyResults.push(result)
      }
    })
    
    // Sort by score if enabled
    if (config.shouldSort && config.includeScore) {
      fuzzyResults.sort((a, b) => (b.score || 0) - (a.score || 0))
    }
    
    const endTime = performance.now()
    lastSearchTime.value = endTime - startTime
    
    return {
      results: fuzzyResults,
      query: query.value,
      totalResults: fuzzyResults.length,
      searchTime: lastSearchTime.value
    }
  })
  
  // Search with debouncing
  const search = async (searchQuery: string, debounceMs: number = 300): Promise<SearchResult<T>> => {
    isSearching.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        query.value = searchQuery
        isSearching.value = false
        resolve(results.value)
      }, debounceMs)
    })
  }
  
  // Clear search
  const clearSearch = (): void => {
    query.value = ''
    isSearching.value = false
  }
  
  // Filter results by additional criteria
  const filter = (
    predicate: (item: T) => boolean
  ): FuzzyResult<T>[] => {
    return results.value.results.filter(result => predicate(result.item))
  }
  
  // Get highlighted text for a specific item and key
  const getHighlightedText = (item: T, key: string): string => {
    const value = getNestedValue(item, key)
    return highlightMatches(value, query.value)
  }
  
  // Group results by a field
  const groupBy = <K extends keyof T>(field: K): Record<string, FuzzyResult<T>[]> => {
    const groups: Record<string, FuzzyResult<T>[]> = {}
    
    results.value.results.forEach(result => {
      const groupKey = String(result.item[field])
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(result)
    })
    
    return groups
  }
  
  // Get search suggestions based on partial query
  const getSuggestions = (partial: string, limit: number = 5): string[] => {
    if (!partial) return []
    
    const suggestions = new Set<string>()
    const partialLower = partial.toLowerCase()
    
    items.value.forEach(item => {
      config.keys.forEach(key => {
        const value = getNestedValue(item, key)
        if (value && value.toLowerCase().includes(partialLower)) {
          // Extract words that start with the partial query
          const words = value.toLowerCase().split(/\s+/)
          words.forEach(word => {
            if (word.startsWith(partialLower) && word.length > partial.length) {
              suggestions.add(word)
            }
          })
        }
      })
    })
    
    return Array.from(suggestions).slice(0, limit)
  }
  
  // Search history
  const searchHistory = ref<string[]>([])
  const maxHistorySize = 10
  
  const addToHistory = (searchQuery: string): void => {
    if (!searchQuery || searchHistory.value.includes(searchQuery)) return
    
    searchHistory.value.unshift(searchQuery)
    if (searchHistory.value.length > maxHistorySize) {
      searchHistory.value = searchHistory.value.slice(0, maxHistorySize)
    }
  }
  
  const clearHistory = (): void => {
    searchHistory.value = []
  }
  
  // Statistics
  const statistics = computed(() => ({
    totalItems: items.value.length,
    filteredItems: results.value.totalResults,
    filterRatio: items.value.length > 0 ? results.value.totalResults / items.value.length : 0,
    averageScore: config.includeScore 
      ? results.value.results.reduce((sum, r) => sum + (r.score || 0), 0) / results.value.results.length 
      : 0,
    lastSearchTime: lastSearchTime.value,
    hasResults: results.value.totalResults > 0,
    isEmpty: !query.value,
    isFiltered: query.value.length >= config.minMatchCharLength
  }))
  
  return {
    // State
    query,
    isSearching,
    results,
    searchHistory,
    statistics,
    
    // Methods
    search,
    clearSearch,
    filter,
    getHighlightedText,
    groupBy,
    getSuggestions,
    addToHistory,
    clearHistory,
    
    // Configuration
    setThreshold: (threshold: number) => { config.threshold = threshold },
    setKeys: (keys: string[]) => { config.keys = keys },
    getConfig: () => ({ ...config })
  }
}

export default useFuzzySearch