# Vue Cleaning Checklist App - Architecture Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Mobile PWA App                       │
├─────────────────────────────────────────────────────────┤
│                    Vue 3 + Vuetify 3                     │
├─────────────────────────────────────────────────────────┤
│                        Pinia Store                       │
├─────────────────────────────────────────────────────────┤
│     IndexedDB          │        Service Worker          │
│   (Local Storage)      │      (Offline Support)         │
├────────────────────────┴─────────────────────────────────┤
│                    Apollo Client                         │
│                  (GraphQL Sync)                          │
└─────────────────────────────────────────────────────────┘
                            ↓
                    External CRM Server
```

## Project Structure

```
vue-checklist/
├── public/
│   ├── manifest.json           # PWA manifest
│   └── service-worker.js       # Offline functionality
│
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.scss      # Global styles
│   │   │   └── variables.scss # Theme variables
│   │   └── templates/          # Industry template data
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue
│   │   │   ├── SearchBar.vue
│   │   │   └── LoadingSpinner.vue
│   │   ├── checklist/
│   │   │   ├── ChecklistCard.vue
│   │   │   ├── ChecklistForm.vue
│   │   │   └── ChecklistPreview.vue
│   │   ├── template/
│   │   │   ├── TemplateSelector.vue
│   │   │   ├── IndustryCard.vue
│   │   │   └── TemplateEditor.vue
│   │   ├── room/
│   │   │   ├── RoomList.vue
│   │   │   ├── RoomSelector.vue
│   │   │   └── CustomRoomDialog.vue
│   │   ├── task/
│   │   │   ├── TaskList.vue
│   │   │   ├── TaskItem.vue
│   │   │   ├── TaskSearch.vue
│   │   │   └── TaskDetails.vue
│   │   └── client/
│   │       ├── ClientForm.vue
│   │       └── ClientInfo.vue
│   │
│   ├── composables/
│   │   ├── useTimeCalculator.js   # Time calculation logic
│   │   ├── useOfflineSync.js      # Offline/online sync
│   │   ├── usePdfExport.js        # PDF generation
│   │   └── useFuzzySearch.js      # Fuzzy search for all searches
│   │
│   ├── layouts/
│   │   └── MainLayout.vue         # App shell layout
│   │
│   ├── pages/
│   │   ├── HomePage.vue           # Dashboard/landing
│   │   ├── TemplatesPage.vue      # Template selection
│   │   ├── CreateChecklistPage.vue # Main creation flow
│   │   ├── ChecklistsPage.vue     # Saved checklists
│   │   ├── ChecklistDetailPage.vue # View/edit checklist
│   │   └── SettingsPage.vue       # App settings
│   │
│   ├── router/
│   │   └── index.js               # Vue Router config
│   │
│   ├── stores/
│   │   ├── app.js                 # App state
│   │   ├── templates.js           # Templates store
│   │   ├── checklists.js          # Checklists store
│   │   ├── tasks.js               # Tasks store
│   │   └── sync.js                # Sync queue store
│   │
│   ├── services/
│   │   ├── db/
│   │   │   ├── index.js          # Dexie DB setup
│   │   │   ├── migrations.js     # DB migrations
│   │   │   └── schemas.js        # Table schemas
│   │   ├── api/
│   │   │   ├── apollo.js         # Apollo Client setup
│   │   │   ├── mutations.js      # GraphQL mutations
│   │   │   └── queries.js        # GraphQL queries
│   │   └── pdf/
│   │       └── generator.js      # PDF generation logic
│   │
│   ├── utils/
│   │   ├── timeModifiers.js      # Time calculation modifiers
│   │   ├── validators.js         # Form validation
│   │   └── formatters.js         # Data formatters
│   │
│   ├── data/
│   │   ├── industries.json       # Industry types
│   │   ├── chemicals.json        # Chemical database
│   │   ├── equipment.json        # Equipment database
│   │   └── templates/            # Template JSON files
│   │       ├── office.json
│   │       ├── residential.json
│   │       └── ...
│   │
│   ├── App.vue                   # Root component
│   └── main.js                   # App entry point
│
├── .env                          # Environment variables
├── .env.example
├── vite.config.js               # Vite configuration
├── package.json
└── README.md
```

## Component Architecture

### Page Flow
```
HomePage
    ↓
TemplatesPage (Select Industry)
    ↓
CreateChecklistPage
    ├── Step 1: Property Details & Modifiers
    ├── Step 2: Room Selection
    ├── Step 3: Task Selection (per room)
    ├── Step 4: Client Information
    └── Step 5: Review & Save
    
ChecklistDetailPage
    ├── View Mode
    ├── Edit Mode
    └── Export Options (PDF/Sync)
```

### State Management (Pinia)

```javascript
// stores/templates.js
{
  templates: Map<id, Template>,
  industries: string[],
  activeTemplate: Template | null,
  
  actions: {
    loadTemplates(),
    selectTemplate(id),
    updateTemplate(id, data),
    createCustomTemplate(data)
  }
}

// stores/checklists.js
{
  checklists: Map<id, Checklist>,
  activeChecklist: Checklist | null,
  filters: {
    search: string,
    industry: string,
    dateRange: [Date, Date]
  },
  
  actions: {
    createChecklist(data),
    updateChecklist(id, data),
    deleteChecklist(id),
    exportToPdf(id),
    syncToServer(id)
  }
}

// stores/sync.js
{
  queue: SyncItem[],
  syncStatus: 'idle' | 'syncing' | 'error',
  lastSync: Date,
  
  actions: {
    addToQueue(item),
    processQueue(),
    retryFailed(),
    clearQueue()
  }
}
```

## Database Schema (IndexedDB)

### Tables

```javascript
// Templates Table
{
  id: { primaryKey: true, auto: true },
  name: { type: String, indexed: true },
  industry: { type: String, indexed: true },
  rooms: { type: Array },
  chemicals: { type: Array },
  equipment: { type: Array },
  isCustom: { type: Boolean },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}

// Tasks Table
{
  id: { primaryKey: true, auto: true },
  templateId: { type: Number, indexed: true },
  name: { type: String, indexed: true },
  baseTime: { type: Object },
  frequency: { type: String, indexed: true },
  steps: { type: Array },
  chemicals: { type: Array },
  tools: { type: Array },
  safety: { type: String },
  standards: { type: String },
  checklistItems: { type: Array }
}

// Checklists Table
{
  id: { primaryKey: true, auto: true },
  name: { type: String, indexed: true },
  templateId: { type: Number },
  client: { type: Object },
  modifiers: { type: Object },
  rooms: { type: Array },
  totalTime: { type: Object },
  syncStatus: { type: String, indexed: true },
  createdAt: { type: Date, indexed: true },
  updatedAt: { type: Date }
}

// SyncQueue Table
{
  id: { primaryKey: true, auto: true },
  type: { type: String }, // 'checklist', 'template'
  action: { type: String }, // 'create', 'update', 'delete'
  entityId: { type: Number },
  data: { type: Object },
  attempts: { type: Number },
  lastAttempt: { type: Date },
  status: { type: String } // 'pending', 'failed', 'completed'
}
```

## Time Calculation Algorithm

```javascript
function calculateTaskTime(baseTime, modifiers) {
  const { difficulty, expectations, challenges } = modifiers;
  
  // Modifier multipliers
  const difficultyMultipliers = {
    light: 0.8,
    average: 1.0,
    heavy: 1.5
  };
  
  const expectationMultipliers = {
    very_reasonable: 0.9,
    reasonable: 0.95,
    average: 1.0,
    demanding: 1.2,
    very_demanding: 1.4
  };
  
  const challengeMultipliers = {
    very_easy: 0.85,
    easy: 0.9,
    average: 1.0,
    hard: 1.3,
    very_hard: 1.6
  };
  
  const totalMultiplier = 
    difficultyMultipliers[difficulty] *
    expectationMultipliers[expectations] *
    challengeMultipliers[challenges];
  
  return {
    min: Math.round(baseTime.min * totalMultiplier),
    max: Math.round(baseTime.max * totalMultiplier)
  };
}
```

## GraphQL Schema

```graphql
type Checklist {
  id: ID!
  name: String!
  industry: String!
  client: Client!
  modifiers: Modifiers!
  rooms: [Room!]!
  totalTime: TimeRange!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Client {
  name: String!
  address: String!
  phone: String!
  email: String!
  frequency: String!
}

type Modifiers {
  difficulty: Difficulty!
  expectations: Expectations!
  challenges: Challenges!
}

type Room {
  id: ID!
  name: String!
  tasks: [Task!]!
  totalTime: TimeRange!
}

type Task {
  id: ID!
  name: String!
  time: TimeRange!
  frequency: Frequency!
  steps: [String!]!
  chemicals: [String!]!
  tools: [String!]!
  safety: String
  standards: String
  checklistItems: [String!]!
}

type TimeRange {
  min: Int!
  max: Int!
}

enum Difficulty {
  LIGHT
  AVERAGE
  HEAVY
}

enum Expectations {
  VERY_REASONABLE
  REASONABLE
  AVERAGE
  DEMANDING
  VERY_DEMANDING
}

enum Challenges {
  VERY_EASY
  EASY
  AVERAGE
  HARD
  VERY_HARD
}

enum Frequency {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
}

type Mutation {
  createChecklist(input: ChecklistInput!): Checklist!
  updateChecklist(id: ID!, input: ChecklistInput!): Checklist!
  deleteChecklist(id: ID!): Boolean!
}

type Query {
  checklists: [Checklist!]!
  checklist(id: ID!): Checklist
}
```

## Offline Strategy

### Service Worker
```javascript
// Precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/templates/office.json',
        '/assets/templates/residential.json',
        // ... other templates
      ]);
    })
  );
});

// Network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/graphql')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Queue for sync when online
          return new Response(
            JSON.stringify({ offline: true }),
            { headers: { 'Content-Type': 'application/json' }}
          );
        })
    );
  }
});
```

### Sync Queue Management
```javascript
// Auto-sync when online
window.addEventListener('online', async () => {
  const syncStore = useSyncStore();
  await syncStore.processQueue();
});

// Manual sync trigger
async function manualSync() {
  const syncStore = useSyncStore();
  try {
    await syncStore.processQueue();
    showNotification('Sync completed successfully');
  } catch (error) {
    showNotification('Sync failed. Will retry later.');
  }
}
```

### Fuzzy Search Implementation (Used Everywhere)
```javascript
// composables/useFuzzySearch.js
import Fuse from 'fuse.js';

export function useFuzzySearch(items, keys) {
  const fuseOptions = {
    keys: keys || ['name', 'description'],
    threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    // Allow typos and partial matches
    distance: 100,
    location: 0,
  };

  const fuse = new Fuse(items, fuseOptions);

  const search = (query) => {
    if (!query || query.length < 2) {
      return items;
    }
    
    const results = fuse.search(query);
    return results.map(result => ({
      ...result.item,
      _score: result.score
    }));
  };

  return { search };
}

// Usage Examples:

// 1. Task Search
const tasks = ref([...]);
const searchQuery = ref('');
const { search } = useFuzzySearch(tasks.value, ['name', 'steps', 'chemicals']);

// 2. Template Search
const templates = ref([...]);
const { search: searchTemplates } = useFuzzySearch(templates.value, ['name', 'industry', 'description']);

// 3. Checklist Search
const checklists = ref([...]);
const { search: searchChecklists } = useFuzzySearch(checklists.value, ['client.name', 'client.address', 'name']);

// 4. Room Search
const rooms = ref([...]);
const { search: searchRooms } = useFuzzySearch(rooms.value, ['name']);

// 5. Chemical/Equipment Search
const chemicals = ref([...]);
const { search: searchChemicals } = useFuzzySearch(chemicals.value, ['name', 'type', 'description']);
```

## Mobile Optimization

### Touch Gestures
- Swipe to delete checklist items
- Pull-to-refresh for sync
- Pinch to zoom PDF preview
- Long-press for context menu

### Performance
- Virtual scrolling for long lists
- Lazy loading of room/task data
- Image optimization for template icons
- Code splitting by route

### PWA Features
- Add to home screen
- Offline functionality
- Background sync
- Push notifications (future)

## Security Considerations

1. **Local Storage Encryption**: Sensitive client data encrypted in IndexedDB
2. **GraphQL Authentication**: JWT tokens for server communication
3. **Input Validation**: Client and server-side validation
4. **XSS Prevention**: Vue's built-in protection + sanitization
5. **HTTPS Only**: Service worker requires HTTPS

## Development Workflow

### Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

### Environment Variables
```env
VITE_GRAPHQL_ENDPOINT=https://api.example.com/graphql
VITE_APP_NAME=Cleaning Checklist Pro
VITE_ENABLE_SYNC=true
VITE_OFFLINE_MODE=true
```

---

*Last Updated: [Current Date]*
*Version: 1.0*