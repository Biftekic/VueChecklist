# Vue Cleaning Checklist App - Project Requirements

## Project Overview
A mobile-first Vue.js application for creating, managing, and distributing professional cleaning checklists. The app allows users to create detailed cleaning checklists from industry-specific templates, customize them, and export to PDF or sync with CRM via GraphQL.

## Core Requirements

### 1. User Management
- **Single user type**: Admin/Creator only
- No complex user roles or permissions
- Simple authentication for app access

### 2. Template System
- **Industry-based organization**: Office, Residential, Medical, Hospitality, Restaurant, Retail, Airbnb, etc.
- **Template customization**: Users can edit and improve original templates
- **Industry-specific room lists**: Each template has relevant rooms + custom room addition
- **Workflow**: Template → Select Areas → Basic Info → Select Tasks → Save as Checklist

### 3. Data Storage
- **Local storage first**: All data stored locally on device
- **GraphQL sync**: Sync to server when online (auto + manual options)
- **Full offline mode**: Complete functionality without internet
- **No version control**: Simple overwrite for template updates

### 4. Checklist Creation Flow
1. Choose industry type (Office, Residential, etc.)
2. Enter property details:
   - Size/area
   - Number of floors
   - Room count
3. Set difficulty modifiers:
   - **Difficulty**: Light / Average / Heavy
   - **Expectations**: Very Reasonable / Reasonable / Average / Demanding / Very Demanding
   - **Challenges**: Very Easy / Easy / Average / Hard / Very Hard
4. Select rooms from industry list or add custom
5. For each room:
   - Search bar with fuzzy search for filtering tasks
   - Checkbox list to include/exclude tasks
6. Save with client information

### 5. Client Information
Each checklist stores:
- Name
- Address
- Phone
- Email
- Cleaning frequency

### 6. Task Structure
Each task includes:
- Task name
- Time estimate (base time)
- Frequency tag ([DAILY], [WEEKLY], [MONTHLY], [QUARTERLY])
- Cleaning steps (numbered list)
- Chemicals needed
- Tools & equipment required
- Safety notes
- Quality standards
- Detailed checklist items

### 7. Time Calculation
- **Automatic calculation**: Sum of all selected task times
- **Dynamic modifiers**: Based on difficulty, expectations, and challenges
- **Time ranges**: Display as "XX-XX minutes" format
- **Total time**: Show at checklist level and room level

### 8. Chemical & Equipment Management
- Each checklist includes master supply list
- Chemicals categorized by type
- Tools & equipment with color-coding info
- Industry-specific requirements

### 9. Export Features
- **PDF Export**: Full details including tasks, times, chemicals, equipment, client info
- **GraphQL Sync**: Send complete checklist data to CRM
- **Print-friendly**: Optimized layout for printing

### 10. UI/UX Requirements
- **Mobile-first design**: Primary focus on mobile devices
- **Style**: Clean & minimal with Material Design principles
- **No desktop version needed**: Mobile responsive only
- **Beautiful UI is top priority**: Aesthetics over features for MVP

## Technical Stack

### Frontend
- **Framework**: Vue 3 with Composition API
- **UI Library**: Vuetify 3 (Material Design components)
- **State Management**: Pinia
- **Router**: Vue Router 4
- **Build Tool**: Vite

### Data & Storage
- **Local Storage**: IndexedDB (via Dexie.js)
- **Offline Support**: Service Worker for PWA
- **Data Sync**: Apollo Client for GraphQL

### Mobile
- **PWA**: Progressive Web App for mobile experience
- **Responsive**: Mobile-first responsive design
- **Touch optimized**: Swipe gestures and touch-friendly UI

## Data Models

### Template
```javascript
{
  id: string,
  name: string,
  industry: string, // office, residential, medical, etc.
  rooms: [
    {
      id: string,
      name: string,
      isCustom: boolean,
      tasks: [taskId]
    }
  ],
  chemicals: [
    {
      id: string,
      name: string,
      type: string,
      description: string
    }
  ],
  equipment: [
    {
      id: string,
      name: string,
      colorCode: string,
      description: string
    }
  ]
}
```

### Task
```javascript
{
  id: string,
  name: string,
  baseTime: { min: number, max: number },
  frequency: string, // DAILY, WEEKLY, MONTHLY, QUARTERLY
  steps: string[],
  chemicals: string[],
  tools: string[],
  safety: string,
  standards: string,
  checklistItems: string[]
}
```

### Checklist
```javascript
{
  id: string,
  templateId: string,
  name: string,
  client: {
    name: string,
    address: string,
    phone: string,
    email: string,
    frequency: string
  },
  modifiers: {
    difficulty: string, // light, average, heavy
    expectations: string, // very_reasonable to very_demanding
    challenges: string // very_easy to very_hard
  },
  rooms: [
    {
      id: string,
      name: string,
      tasks: [taskId],
      customTasks: [], // for user-added tasks
      totalTime: { min: number, max: number }
    }
  ],
  totalTime: { min: number, max: number },
  createdAt: date,
  updatedAt: date,
  syncStatus: string // pending, synced, error
}
```

## Key Features Summary

### MVP (Phase 1)
1. ✅ Beautiful mobile UI with Material Design
2. ✅ Industry template selection
3. ✅ Room and task selection with fuzzy search
4. ✅ Time auto-calculation with modifiers
5. ✅ Client information management
6. ✅ Local storage with offline mode
7. ✅ PDF export
8. ✅ Fuzzy search throughout app (tasks, templates, checklists, rooms, chemicals)

### Phase 2
1. GraphQL sync with CRM
2. Template editing and improvement
3. Custom room and task creation
4. Advanced search and filtering

### Phase 3
1. Multi-language support (Slovenian)
2. Analytics and reporting
3. Team collaboration features
4. Template sharing

## Performance Requirements
- App loads in <3 seconds
- Smooth scrolling and animations (60fps)
- Instant fuzzy search filtering (<100ms)
- Offline-first architecture
- Minimal data usage for sync

## Design Principles
1. **Mobile-first**: Every interaction optimized for touch
2. **Clean & minimal**: Reduce cognitive load
3. **Material Design**: Consistent, familiar patterns
4. **Progressive disclosure**: Show complexity only when needed
5. **Offline-first**: Full functionality without internet

## Success Metrics
- User can create a checklist in <5 minutes
- Beautiful, professional PDF output
- 100% offline functionality
- Seamless sync when online
- Intuitive without training

---

*Last Updated: [Current Date]*
*Version: 1.0*