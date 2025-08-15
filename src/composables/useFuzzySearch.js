import Fuse from 'fuse.js'
import { ref, computed, watch } from 'vue'

export function useFuzzySearch(items, keys, options = {}) {
  const searchQuery = ref('')
  const searchResults = ref([])
  
  // Default Fuse options optimized for our use case
  const defaultOptions = {
    keys: keys || ['name', 'description'],
    threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    // Allow typos and partial matches
    distance: 100,
    location: 0,
    // Include matched indices for highlighting
    includeMatches: true,
    // Fuzzy matching options
    ignoreLocation: true,
    useExtendedSearch: false
  }
  
  const fuseOptions = { ...defaultOptions, ...options }
  
  // Create Fuse instance
  const fuse = computed(() => {
    const itemsArray = Array.isArray(items.value) ? items.value : items
    return new Fuse(itemsArray, fuseOptions)
  })
  
  // Perform search
  const search = (query = searchQuery.value) => {
    if (!query || query.length < 2) {
      const itemsArray = Array.isArray(items.value) ? items.value : items
      searchResults.value = itemsArray
      return itemsArray
    }
    
    const results = fuse.value.search(query)
    const mappedResults = results.map(result => ({
      ...result.item,
      _score: result.score,
      _matches: result.matches
    }))
    
    searchResults.value = mappedResults
    return mappedResults
  }
  
  // Auto-search when query changes
  watch(searchQuery, (newQuery) => {
    search(newQuery)
  })
  
  // Get highlighted text with matches
  const getHighlightedText = (text, matches) => {
    if (!matches || matches.length === 0) return text
    
    let result = text
    const highlights = []
    
    matches.forEach(match => {
      match.indices.forEach(([start, end]) => {
        highlights.push({ start, end: end + 1 })
      })
    })
    
    // Sort highlights by start position (descending) to avoid index shifting
    highlights.sort((a, b) => b.start - a.start)
    
    highlights.forEach(({ start, end }) => {
      result = result.slice(0, start) + 
               '<mark>' + result.slice(start, end) + '</mark>' + 
               result.slice(end)
    })
    
    return result
  }
  
  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    const itemsArray = Array.isArray(items.value) ? items.value : items
    searchResults.value = itemsArray
  }
  
  // Initialize with all items
  const itemsArray = Array.isArray(items.value) ? items.value : items
  searchResults.value = itemsArray
  
  return {
    searchQuery,
    searchResults,
    search,
    clearSearch,
    getHighlightedText
  }
}