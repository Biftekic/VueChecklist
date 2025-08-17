/**
 * Material Design Icons configuration with tree-shaking
 * Only import the icons we actually use to reduce bundle size
 */

// Import only the icons we need
import {
  mdiHome,
  mdiListBox,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiCheck,
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDown,
  mdiChevronUp,
  mdiMenu,
  mdiDotsVertical,
  mdiMagnify,
  mdiFilter,
  mdiSort,
  mdiCog,
  mdiContentSave,
  mdiContentCopy,
  mdiDownload,
  mdiUpload,
  mdiFileDocument,
  mdiPrinter,
  mdiCalendar,
  mdiClock,
  mdiAccount,
  mdiAccountGroup,
  mdiMapMarker,
  mdiPhone,
  mdiEmail,
  mdiAlert,
  mdiAlertCircle,
  mdiInformation,
  mdiCheckCircle,
  mdiCloseCircle,
  mdiWifiOff,
  mdiSync,
  mdiRefresh,
  mdiLoading,
  mdiDrag,
  mdiFormatListBulleted,
  mdiFormatListChecks,
  mdiClipboardList,
  mdiClipboardCheck,
  mdiPackageVariant,
  mdiWarehouse,
  mdiTruck,
  mdiChartBar,
  mdiChartLine,
  mdiTrendingUp,
  mdiEye,
  mdiEyeOff,
  mdiLock,
  mdiLockOpen,
  mdiShield,
  mdiShieldCheck,
  mdiBroom,
  mdiSpray,
  mdiWaterOutline,
  mdiVacuum,
  mdiSofa,
  mdiBed,
  mdiSilverware,
  mdiToilet,
  mdiShower,
  mdiWindowOpen,
  mdiDoor,
  mdiCeilingLight,
  mdiThermometer,
  mdiWeatherSunny,
  mdiWeatherCloudy,
  mdiHelp,
  mdiHistory,
  mdiUndo,
  mdiRedo,
  mdiExport,
  mdiImport,
  mdiDatabaseSync,
  mdiCloudSync,
  mdiViewDashboard,
  mdiViewList,
  mdiViewGrid,
  mdiFullscreen,
  mdiFullscreenExit,
  mdiArrowLeft,
  mdiArrowRight,
  mdiArrowUp,
  mdiArrowDown,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiPlay,
  mdiPause,
  mdiStop,
  mdiStar,
  mdiStarOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiBookmark,
  mdiBookmarkOutline,
  mdiFlag,
  mdiFlagOutline,
  mdiBell,
  mdiBellOutline,
  mdiMessage,
  mdiMessageOutline,
  mdiComment,
  mdiCommentOutline
} from '@mdi/js'

// Export as an object for easy access
export const icons = {
  // Navigation
  home: mdiHome,
  list: mdiListBox,
  menu: mdiMenu,
  dotsVertical: mdiDotsVertical,
  chevronLeft: mdiChevronLeft,
  chevronRight: mdiChevronRight,
  chevronDown: mdiChevronDown,
  chevronUp: mdiChevronUp,
  arrowLeft: mdiArrowLeft,
  arrowRight: mdiArrowRight,
  arrowUp: mdiArrowUp,
  arrowDown: mdiArrowDown,
  
  // Actions
  plus: mdiPlus,
  pencil: mdiPencil,
  delete: mdiDelete,
  check: mdiCheck,
  close: mdiClose,
  save: mdiContentSave,
  copy: mdiContentCopy,
  download: mdiDownload,
  upload: mdiUpload,
  print: mdiPrinter,
  refresh: mdiRefresh,
  sync: mdiSync,
  undo: mdiUndo,
  redo: mdiRedo,
  
  // Search & Filter
  search: mdiMagnify,
  filter: mdiFilter,
  sort: mdiSort,
  
  // Settings & Configuration
  settings: mdiCog,
  lock: mdiLock,
  lockOpen: mdiLockOpen,
  shield: mdiShield,
  shieldCheck: mdiShieldCheck,
  
  // Status & Alerts
  alert: mdiAlert,
  alertCircle: mdiAlertCircle,
  information: mdiInformation,
  checkCircle: mdiCheckCircle,
  closeCircle: mdiCloseCircle,
  wifiOff: mdiWifiOff,
  loading: mdiLoading,
  
  // User & Accounts
  account: mdiAccount,
  accountGroup: mdiAccountGroup,
  
  // Communication
  phone: mdiPhone,
  email: mdiEmail,
  message: mdiMessage,
  messageOutline: mdiMessageOutline,
  comment: mdiComment,
  commentOutline: mdiCommentOutline,
  bell: mdiBell,
  bellOutline: mdiBellOutline,
  
  // Documents & Files
  fileDocument: mdiFileDocument,
  clipboardList: mdiClipboardList,
  clipboardCheck: mdiClipboardCheck,
  formatListBulleted: mdiFormatListBulleted,
  formatListChecks: mdiFormatListChecks,
  
  // Date & Time
  calendar: mdiCalendar,
  clock: mdiClock,
  history: mdiHistory,
  
  // Location
  mapMarker: mdiMapMarker,
  
  // Inventory & Logistics
  packageVariant: mdiPackageVariant,
  warehouse: mdiWarehouse,
  truck: mdiTruck,
  
  // Charts & Data
  chartBar: mdiChartBar,
  chartLine: mdiChartLine,
  trendingUp: mdiTrendingUp,
  
  // View Modes
  viewDashboard: mdiViewDashboard,
  viewList: mdiViewList,
  viewGrid: mdiViewGrid,
  eye: mdiEye,
  eyeOff: mdiEyeOff,
  fullscreen: mdiFullscreen,
  fullscreenExit: mdiFullscreenExit,
  
  // Cleaning Specific
  broom: mdiBroom,
  spray: mdiSpray,
  water: mdiWaterOutline,
  vacuum: mdiVacuum,
  
  // Room Specific
  sofa: mdiSofa,
  bed: mdiBed,
  silverware: mdiSilverware,
  toilet: mdiToilet,
  shower: mdiShower,
  window: mdiWindowOpen,
  door: mdiDoor,
  ceilingLight: mdiCeilingLight,
  
  // Weather & Environment
  thermometer: mdiThermometer,
  weatherSunny: mdiWeatherSunny,
  weatherCloudy: mdiWeatherCloudy,
  
  // Utility
  help: mdiHelp,
  drag: mdiDrag,
  export: mdiExport,
  import: mdiImport,
  databaseSync: mdiDatabaseSync,
  cloudSync: mdiCloudSync,
  
  // Media Controls
  skipNext: mdiSkipNext,
  skipPrevious: mdiSkipPrevious,
  play: mdiPlay,
  pause: mdiPause,
  stop: mdiStop,
  
  // Favorites & Bookmarks
  star: mdiStar,
  starOutline: mdiStarOutline,
  heart: mdiHeart,
  heartOutline: mdiHeartOutline,
  bookmark: mdiBookmark,
  bookmarkOutline: mdiBookmarkOutline,
  flag: mdiFlag,
  flagOutline: mdiFlagOutline
}

// Type for icon keys
export type IconKey = keyof typeof icons

// Helper function to get icon by key
export function getIcon(key: IconKey): string {
  return icons[key] || ''
}