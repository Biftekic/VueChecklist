# VueChecklist - Professional Cleaning Checklist App

A mobile-first Vue.js application for creating and managing professional cleaning checklists with offline support and beautiful Material Design UI.

## 🚀 Features

- 📱 **Mobile-First Design** - Optimized for smartphones and tablets
- 🎨 **Material Design UI** - Beautiful, clean interface with Vuetify 3
- 🏢 **Industry Templates** - Pre-built templates for Office, Residential, Medical, Hospitality, and more
- 🔍 **Fuzzy Search** - Find tasks quickly with typo-tolerant search
- ⏱️ **Smart Time Calculation** - Dynamic time estimates based on difficulty and expectations
- 💾 **Offline Support** - Works without internet, syncs when online
- 📄 **PDF Export** - Generate professional PDF checklists
- 🔄 **GraphQL Sync** - Sync with CRM systems (coming soon)

## 📸 Screenshots

*Coming soon*

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **UI Library**: Vuetify 3 (Material Design)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **Database**: IndexedDB with Dexie.js
- **Search**: Fuse.js for fuzzy search
- **Styling**: SCSS with mobile-first approach

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Biftekic/VueChecklist.git
cd VueChecklist/vue-checklist-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🏗️ Project Structure

```
vue-checklist-app/
├── src/
│   ├── assets/          # Static assets and styles
│   ├── components/      # Reusable Vue components
│   │   ├── checklist/   # Checklist-specific components
│   │   ├── common/      # Common UI components
│   │   └── ...
│   ├── composables/     # Vue composables (fuzzy search, etc.)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── plugins/         # Plugin configurations (Vuetify)
│   ├── router/          # Vue Router configuration
│   ├── services/        # Services (DB, API, PDF)
│   ├── stores/          # Pinia stores
│   └── utils/           # Utility functions
├── public/              # Public assets
└── package.json         # Project dependencies
```

## 🎯 Usage

### Creating a Checklist

1. **Select Industry**: Choose from Office, Residential, Medical, etc.
2. **Property Details**: Enter size, floors, and difficulty modifiers
3. **Room Selection**: Pick which rooms to clean
4. **Task Selection**: Choose tasks for each room with search
5. **Client Info**: Add client details and frequency
6. **Review & Save**: Review and save your checklist

### Key Features

#### Difficulty Modifiers
Adjust time estimates based on:
- **Difficulty**: Light / Average / Heavy
- **Expectations**: Very Reasonable to Very Demanding
- **Challenges**: Very Easy to Very Hard

#### Fuzzy Search
Find tasks quickly even with typos:
- "vacum" finds "vacuum"
- "wind" finds "window cleaning"
- Search across task names, chemicals, and tools

## 🚦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📱 Progressive Web App

The app is PWA-ready with:
- Offline functionality
- Install to home screen
- Service worker for caching
- Background sync capabilities

## 🔄 Data Sync

The app stores data locally using IndexedDB and can sync with a GraphQL backend when online.

### Local Storage
- Templates
- Checklists
- Tasks
- Client information

### Sync Features
- Auto-sync when online
- Manual sync option
- Conflict resolution
- Queue management

## 🎨 Customization

### Industry Colors
Each industry has its own color theme:
- Office: Blue (#2196F3)
- Residential: Green (#4CAF50)
- Medical: Red (#F44336)
- Hospitality: Purple (#9C27B0)
- Restaurant: Orange (#FF9800)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Vue.js and Vuetify
- Inspired by professional cleaning industry needs
- Template data from CChecklist system

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for the professional cleaning industry**