// Common room types that can be used across different industries
export interface CommonRoom {
  id: string
  name: string
  category: string
  icon?: string
}

export const COMMON_ROOMS: CommonRoom[] = [
  // Living Areas
  { id: 'living-room', name: 'Living Room', category: 'Living Areas', icon: 'mdi-sofa' },
  { id: 'family-room', name: 'Family Room', category: 'Living Areas', icon: 'mdi-sofa-outline' },
  { id: 'den', name: 'Den', category: 'Living Areas', icon: 'mdi-bookshelf' },
  { id: 'dining-room', name: 'Dining Room', category: 'Living Areas', icon: 'mdi-silverware-fork-knife' },
  { id: 'foyer', name: 'Foyer/Entryway', category: 'Living Areas', icon: 'mdi-door-open' },
  { id: 'hallway', name: 'Hallway', category: 'Living Areas', icon: 'mdi-road-variant' },
  { id: 'stairs', name: 'Stairs', category: 'Living Areas', icon: 'mdi-stairs' },
  
  // Bedrooms
  { id: 'master-bedroom', name: 'Master Bedroom', category: 'Bedrooms', icon: 'mdi-bed-king' },
  { id: 'bedroom', name: 'Bedroom', category: 'Bedrooms', icon: 'mdi-bed' },
  { id: 'guest-bedroom', name: 'Guest Bedroom', category: 'Bedrooms', icon: 'mdi-bed-single' },
  { id: 'kids-room', name: "Kids' Room", category: 'Bedrooms', icon: 'mdi-teddy-bear' },
  { id: 'nursery', name: 'Nursery', category: 'Bedrooms', icon: 'mdi-baby-carriage' },
  
  // Bathrooms
  { id: 'master-bathroom', name: 'Master Bathroom', category: 'Bathrooms', icon: 'mdi-shower' },
  { id: 'bathroom', name: 'Bathroom', category: 'Bathrooms', icon: 'mdi-toilet' },
  { id: 'half-bath', name: 'Half Bath/Powder Room', category: 'Bathrooms', icon: 'mdi-sink' },
  { id: 'guest-bathroom', name: 'Guest Bathroom', category: 'Bathrooms', icon: 'mdi-shower-head' },
  
  // Kitchen Areas
  { id: 'kitchen', name: 'Kitchen', category: 'Kitchen', icon: 'mdi-stove' },
  { id: 'pantry', name: 'Pantry', category: 'Kitchen', icon: 'mdi-cupboard' },
  { id: 'breakfast-nook', name: 'Breakfast Nook', category: 'Kitchen', icon: 'mdi-coffee' },
  { id: 'butler-pantry', name: "Butler's Pantry", category: 'Kitchen', icon: 'mdi-cupboard-outline' },
  
  // Office Spaces
  { id: 'office', name: 'Office', category: 'Office', icon: 'mdi-desk' },
  { id: 'home-office', name: 'Home Office', category: 'Office', icon: 'mdi-laptop' },
  { id: 'study', name: 'Study', category: 'Office', icon: 'mdi-bookshelf' },
  { id: 'library', name: 'Library', category: 'Office', icon: 'mdi-book-open-variant' },
  { id: 'conference-room', name: 'Conference Room', category: 'Office', icon: 'mdi-presentation' },
  { id: 'meeting-room', name: 'Meeting Room', category: 'Office', icon: 'mdi-account-group' },
  { id: 'reception', name: 'Reception', category: 'Office', icon: 'mdi-desk-lamp' },
  { id: 'lobby', name: 'Lobby', category: 'Office', icon: 'mdi-door' },
  { id: 'waiting-room', name: 'Waiting Room', category: 'Office', icon: 'mdi-chair-rolling' },
  { id: 'break-room', name: 'Break Room', category: 'Office', icon: 'mdi-coffee' },
  
  // Utility Rooms
  { id: 'laundry-room', name: 'Laundry Room', category: 'Utility', icon: 'mdi-washing-machine' },
  { id: 'mudroom', name: 'Mudroom', category: 'Utility', icon: 'mdi-shoe-formal' },
  { id: 'utility-room', name: 'Utility Room', category: 'Utility', icon: 'mdi-tools' },
  { id: 'storage-room', name: 'Storage Room', category: 'Utility', icon: 'mdi-archive' },
  { id: 'closet', name: 'Closet', category: 'Utility', icon: 'mdi-hanger' },
  { id: 'walk-in-closet', name: 'Walk-in Closet', category: 'Utility', icon: 'mdi-wardrobe' },
  
  // Basement/Attic
  { id: 'basement', name: 'Basement', category: 'Lower Level', icon: 'mdi-home-floor-b' },
  { id: 'attic', name: 'Attic', category: 'Upper Level', icon: 'mdi-home-roof' },
  { id: 'crawl-space', name: 'Crawl Space', category: 'Lower Level', icon: 'mdi-home-floor-negative-1' },
  
  // Garage
  { id: 'garage', name: 'Garage', category: 'Garage', icon: 'mdi-garage' },
  { id: 'carport', name: 'Carport', category: 'Garage', icon: 'mdi-garage-open' },
  { id: 'workshop', name: 'Workshop', category: 'Garage', icon: 'mdi-hammer-wrench' },
  
  // Recreation
  { id: 'game-room', name: 'Game Room', category: 'Recreation', icon: 'mdi-gamepad-variant' },
  { id: 'media-room', name: 'Media Room', category: 'Recreation', icon: 'mdi-television' },
  { id: 'theater-room', name: 'Theater Room', category: 'Recreation', icon: 'mdi-theater' },
  { id: 'gym', name: 'Gym/Exercise Room', category: 'Recreation', icon: 'mdi-dumbbell' },
  { id: 'playroom', name: 'Playroom', category: 'Recreation', icon: 'mdi-castle' },
  { id: 'craft-room', name: 'Craft Room', category: 'Recreation', icon: 'mdi-palette' },
  { id: 'music-room', name: 'Music Room', category: 'Recreation', icon: 'mdi-music' },
  
  // Outdoor
  { id: 'patio', name: 'Patio', category: 'Outdoor', icon: 'mdi-table-chair' },
  { id: 'deck', name: 'Deck', category: 'Outdoor', icon: 'mdi-balcony' },
  { id: 'porch', name: 'Porch', category: 'Outdoor', icon: 'mdi-home-variant' },
  { id: 'sunroom', name: 'Sunroom', category: 'Outdoor', icon: 'mdi-weather-sunny' },
  { id: 'balcony', name: 'Balcony', category: 'Outdoor', icon: 'mdi-balcony' },
  { id: 'pool-area', name: 'Pool Area', category: 'Outdoor', icon: 'mdi-pool' },
  
  // Commercial Specific
  { id: 'classroom', name: 'Classroom', category: 'Education', icon: 'mdi-school' },
  { id: 'cafeteria', name: 'Cafeteria', category: 'Education', icon: 'mdi-food' },
  { id: 'gymnasium', name: 'Gymnasium', category: 'Education', icon: 'mdi-basketball' },
  { id: 'auditorium', name: 'Auditorium', category: 'Education', icon: 'mdi-stadium' },
  { id: 'laboratory', name: 'Laboratory', category: 'Education', icon: 'mdi-flask' },
  { id: 'server-room', name: 'Server Room', category: 'Technology', icon: 'mdi-server' },
  { id: 'retail-floor', name: 'Retail Floor', category: 'Retail', icon: 'mdi-store' },
  { id: 'stock-room', name: 'Stock Room', category: 'Retail', icon: 'mdi-package-variant' },
  { id: 'fitting-room', name: 'Fitting Room', category: 'Retail', icon: 'mdi-tshirt-crew' },
  { id: 'checkout-area', name: 'Checkout Area', category: 'Retail', icon: 'mdi-cash-register' },
  { id: 'exam-room', name: 'Exam Room', category: 'Medical', icon: 'mdi-stethoscope' },
  { id: 'patient-room', name: 'Patient Room', category: 'Medical', icon: 'mdi-bed-empty' },
  { id: 'operating-room', name: 'Operating Room', category: 'Medical', icon: 'mdi-hospital' },
  { id: 'recovery-room', name: 'Recovery Room', category: 'Medical', icon: 'mdi-bed-clock' }
]

// Get rooms by category
export function getRoomsByCategory(category: string): CommonRoom[] {
  return COMMON_ROOMS.filter(room => room.category === category)
}

// Get all unique categories
export function getRoomCategories(): string[] {
  return [...new Set(COMMON_ROOMS.map(room => room.category))]
}

// Search rooms by name
export function searchRooms(query: string): CommonRoom[] {
  const lowercaseQuery = query.toLowerCase()
  return COMMON_ROOMS.filter(room => 
    room.name.toLowerCase().includes(lowercaseQuery) ||
    room.category.toLowerCase().includes(lowercaseQuery)
  )
}