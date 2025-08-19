// Cleaning templates organized by industry
export interface TaskItem {
  name: string
  estimatedTime: number
  chemicals: string[]
  tools: string[]
}

export interface RoomTemplate {
  name: string
  tasks: TaskItem[]
}

export interface CleaningTemplate {
  name: string
  icon: string
  color: string
  rooms: RoomTemplate[]
}

export interface IndustryInfo {
  value: string
  name: string
  icon: string
  color: string
}

export const cleaningTemplates: Record<string, CleaningTemplate> = {
  office: {
    name: 'Office Cleaning',
    icon: 'mdi-office-building',
    color: '#2196F3',
    rooms: [
      {
        name: 'Lobby/Reception',
        tasks: [
          { name: 'Vacuum carpet/mop floors', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Dust furniture and surfaces', estimatedTime: 10, chemicals: ['Multi-surface cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Clean glass doors and windows', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Sanitize door handles', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Office Spaces',
        tasks: [
          { name: 'Vacuum carpet/mop floors', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Dust desks and workstations', estimatedTime: 15, chemicals: ['Multi-surface cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Clean computer screens and keyboards', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Empty trash and recycling bins', estimatedTime: 10, chemicals: [], tools: ['Trash bags'] },
          { name: 'Sanitize phones and shared equipment', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Organize cables and power cords', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Conference Rooms',
        tasks: [
          { name: 'Clean tables and chairs', estimatedTime: 10, chemicals: ['Multi-surface cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean whiteboards and screens', estimatedTime: 5, chemicals: ['Whiteboard cleaner'], tools: ['Eraser', 'Cloth'] },
          { name: 'Sanitize remote controls and equipment', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Arrange chairs and organize room', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Kitchen/Break Room',
        tasks: [
          { name: 'Clean countertops and surfaces', estimatedTime: 10, chemicals: ['Kitchen cleaner'], tools: ['Cloth'] },
          { name: 'Clean microwave inside and out', estimatedTime: 5, chemicals: ['Degreaser'], tools: ['Sponge'] },
          { name: 'Clean refrigerator (exterior)', estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'] },
          { name: 'Clean coffee maker and water dispenser', estimatedTime: 10, chemicals: ['Descaler'], tools: ['Cloth'] },
          { name: 'Wash dishes or load dishwasher', estimatedTime: 10, chemicals: ['Dish soap'], tools: ['Sponge'] },
          { name: 'Mop floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Mop'] },
          { name: 'Empty trash and replace liners', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Restock supplies', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Restrooms',
        tasks: [
          { name: 'Clean and disinfect toilets', estimatedTime: 15, chemicals: ['Toilet bowl cleaner', 'Disinfectant'], tools: ['Toilet brush', 'Cloth'] },
          { name: 'Clean and disinfect sinks and counters', estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Clean mirrors', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Mop and disinfect floors', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Restock toilet paper and paper towels', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Refill soap dispensers', estimatedTime: 5, chemicals: ['Hand soap'], tools: [] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Clean and disinfect door handles', estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      }
    ]
  },
  
  residential: {
    name: 'Residential Cleaning',
    icon: 'mdi-home',
    color: '#4CAF50',
    rooms: [
      {
        name: 'Living Room',
        tasks: [
          { name: 'Vacuum carpet/rugs', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Dust furniture and surfaces', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] },
          { name: 'Clean windows and window sills', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'] },
          { name: 'Vacuum/clean sofa and cushions', estimatedTime: 10, chemicals: ['Fabric cleaner'], tools: ['Vacuum attachment'] },
          { name: 'Clean TV screen and electronics', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Organize magazines and books', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Clean light fixtures and ceiling fans', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Ladder'] }
        ]
      },
      {
        name: 'Kitchen',
        tasks: [
          { name: 'Clean countertops', estimatedTime: 10, chemicals: ['Kitchen cleaner'], tools: ['Cloth'] },
          { name: 'Clean stovetop and range hood', estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Sponge'] },
          { name: 'Clean oven (exterior)', estimatedTime: 5, chemicals: ['Oven cleaner'], tools: ['Cloth'] },
          { name: 'Clean microwave inside and out', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] },
          { name: 'Clean refrigerator (exterior)', estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'] },
          { name: 'Clean sink and faucet', estimatedTime: 5, chemicals: ['Sink cleaner'], tools: ['Sponge'] },
          { name: 'Wipe down cabinets', estimatedTime: 10, chemicals: ['Wood cleaner'], tools: ['Cloth'] },
          { name: 'Clean small appliances', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Sweep and mop floor', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Empty trash', estimatedTime: 3, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Bedrooms',
        tasks: [
          { name: 'Make beds/change linens', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Dust furniture and surfaces', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] },
          { name: 'Vacuum carpet/mop floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean mirrors', estimatedTime: 3, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Organize closet', estimatedTime: 15, chemicals: [], tools: [] },
          { name: 'Clean under bed', estimatedTime: 5, chemicals: [], tools: ['Vacuum'] },
          { name: 'Wipe down light switches and door handles', estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Bathrooms',
        tasks: [
          { name: 'Clean and disinfect toilet', estimatedTime: 10, chemicals: ['Toilet bowl cleaner', 'Disinfectant'], tools: ['Toilet brush', 'Cloth'] },
          { name: 'Clean shower/bathtub', estimatedTime: 15, chemicals: ['Tub cleaner', 'Mildew remover'], tools: ['Scrub brush', 'Sponge'] },
          { name: 'Clean sink and countertop', estimatedTime: 5, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Clean mirrors', estimatedTime: 3, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Sweep and mop floor', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Broom', 'Mop'] },
          { name: 'Replace towels', estimatedTime: 3, chemicals: [], tools: [] },
          { name: 'Empty trash', estimatedTime: 2, chemicals: [], tools: ['Trash bags'] },
          { name: 'Clean exhaust fan', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Dining Room',
        tasks: [
          { name: 'Clean dining table', estimatedTime: 5, chemicals: ['Wood polish'], tools: ['Cloth'] },
          { name: 'Clean chairs', estimatedTime: 10, chemicals: ['Upholstery cleaner'], tools: ['Cloth'] },
          { name: 'Dust china cabinet/buffet', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Vacuum/mop floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean light fixture', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] }
        ]
      }
    ]
  },
  
  medical: {
    name: 'Medical Facility',
    icon: 'mdi-hospital-box',
    color: '#F44336',
    rooms: [
      {
        name: 'Patient Rooms',
        tasks: [
          { name: 'Disinfect all surfaces', estimatedTime: 20, chemicals: ['Hospital-grade disinfectant'], tools: ['Microfiber cloth'] },
          { name: 'Clean and disinfect bed rails', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean and disinfect bathroom', estimatedTime: 15, chemicals: ['Hospital disinfectant'], tools: ['Mop', 'Cloth'] },
          { name: 'Mop floor with disinfectant', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Empty and disinfect trash bins', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Trash bags'] },
          { name: 'Replace linens', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean and disinfect equipment', estimatedTime: 15, chemicals: ['Medical equipment cleaner'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Operating Rooms',
        tasks: [
          { name: 'Terminal cleaning of all surfaces', estimatedTime: 45, chemicals: ['OR disinfectant'], tools: ['Sterile cloths'] },
          { name: 'Clean and disinfect OR lights', estimatedTime: 15, chemicals: ['Specialized cleaner'], tools: ['Sterile cloth'] },
          { name: 'Clean and disinfect walls', estimatedTime: 20, chemicals: ['Wall disinfectant'], tools: ['Mop system'] },
          { name: 'Disinfect floor (wet vacuum)', estimatedTime: 20, chemicals: ['OR floor disinfectant'], tools: ['Wet vacuum'] },
          { name: 'Clean and check ventilation grilles', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Waiting Areas',
        tasks: [
          { name: 'Disinfect seating', estimatedTime: 15, chemicals: ['Fabric disinfectant'], tools: ['Spray', 'Cloth'] },
          { name: 'Clean and disinfect tables', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean windows and doors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Disinfect door handles and railings', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Examination Rooms',
        tasks: [
          { name: 'Disinfect examination table', estimatedTime: 5, chemicals: ['Medical disinfectant'], tools: ['Cloth'] },
          { name: 'Clean and disinfect all surfaces', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean and disinfect equipment', estimatedTime: 10, chemicals: ['Equipment cleaner'], tools: ['Cloth'] },
          { name: 'Mop floor', estimatedTime: 5, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Restock medical supplies', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Empty biohazard containers', estimatedTime: 5, chemicals: [], tools: ['Biohazard bags'] }
        ]
      }
    ]
  },
  
  hospitality: {
    name: 'Hotel/Hospitality',
    icon: 'mdi-bed',
    color: '#9C27B0',
    rooms: [
      {
        name: 'Guest Rooms',
        tasks: [
          { name: 'Strip and remake beds', estimatedTime: 15, chemicals: [], tools: [] },
          { name: 'Dust all surfaces', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] },
          { name: 'Vacuum carpet/mop floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean bathroom completely', estimatedTime: 20, chemicals: ['Bathroom cleaner', 'Disinfectant'], tools: ['Various'] },
          { name: 'Restock minibar', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Clean windows and mirrors', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 3, chemicals: [], tools: ['Trash bags'] },
          { name: 'Replace towels and amenities', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Lobby',
        tasks: [
          { name: 'Vacuum/mop floors', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Dust and polish furniture', estimatedTime: 15, chemicals: ['Furniture polish'], tools: ['Cloth'] },
          { name: 'Clean glass doors and windows', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Clean and arrange seating areas', estimatedTime: 10, chemicals: ['Upholstery cleaner'], tools: ['Vacuum'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Clean front desk area', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Restaurant/Bar',
        tasks: [
          { name: 'Clean and sanitize tables', estimatedTime: 15, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Clean chairs/booths', estimatedTime: 10, chemicals: ['Upholstery cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean bar area', estimatedTime: 15, chemicals: ['Bar cleaner'], tools: ['Cloth'] },
          { name: 'Polish glassware', estimatedTime: 10, chemicals: ['Glass polish'], tools: ['Cloth'] },
          { name: 'Clean kitchen equipment', estimatedTime: 30, chemicals: ['Degreaser'], tools: ['Various'] }
        ]
      },
      {
        name: 'Conference Rooms',
        tasks: [
          { name: 'Clean tables and chairs', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Clean AV equipment', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Set up room layout', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean whiteboards/screens', estimatedTime: 5, chemicals: ['Whiteboard cleaner'], tools: ['Eraser'] }
        ]
      }
    ]
  },
  
  restaurant: {
    name: 'Restaurant',
    icon: 'mdi-silverware-fork-knife',
    color: '#FF9800',
    rooms: [
      {
        name: 'Dining Area',
        tasks: [
          { name: 'Wipe and sanitize tables', estimatedTime: 20, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Clean chairs and booths', estimatedTime: 15, chemicals: ['Upholstery cleaner'], tools: ['Cloth', 'Vacuum'] },
          { name: 'Sweep and mop floors', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Clean windows and doors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Dust decorations and fixtures', estimatedTime: 10, chemicals: ['Duster spray'], tools: ['Duster'] },
          { name: 'Clean and refill condiment stations', estimatedTime: 5, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Kitchen',
        tasks: [
          { name: 'Clean and degrease stove/grill', estimatedTime: 30, chemicals: ['Heavy degreaser'], tools: ['Scraper', 'Brush'] },
          { name: 'Clean fryers', estimatedTime: 45, chemicals: ['Fryer cleaner'], tools: ['Scrub brush'] },
          { name: 'Clean and sanitize prep surfaces', estimatedTime: 15, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Clean ovens', estimatedTime: 30, chemicals: ['Oven cleaner'], tools: ['Scraper', 'Cloth'] },
          { name: 'Clean and organize walk-in cooler', estimatedTime: 20, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Degrease hood vents', estimatedTime: 30, chemicals: ['Degreaser'], tools: ['Brush'] },
          { name: 'Mop kitchen floors', estimatedTime: 15, chemicals: ['Degreaser', 'Floor cleaner'], tools: ['Mop'] },
          { name: 'Clean dishwashing area', estimatedTime: 15, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Empty grease traps', estimatedTime: 10, chemicals: [], tools: ['Gloves'] }
        ]
      },
      {
        name: 'Bar Area',
        tasks: [
          { name: 'Clean bar top', estimatedTime: 10, chemicals: ['Bar cleaner'], tools: ['Cloth'] },
          { name: 'Clean and polish glassware', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Clean beer taps and lines', estimatedTime: 20, chemicals: ['Line cleaner'], tools: ['Brush'] },
          { name: 'Organize bottles and inventory', estimatedTime: 15, chemicals: [], tools: [] },
          { name: 'Clean bar mats', estimatedTime: 5, chemicals: ['Sanitizer'], tools: ['Brush'] },
          { name: 'Wipe down bar stools', estimatedTime: 10, chemicals: ['Leather cleaner'], tools: ['Cloth'] },
          { name: 'Clean sinks and drain boards', estimatedTime: 5, chemicals: ['Sanitizer'], tools: ['Brush'] }
        ]
      },
      {
        name: 'Restrooms',
        tasks: [
          { name: 'Clean and disinfect toilets', estimatedTime: 15, chemicals: ['Toilet cleaner', 'Disinfectant'], tools: ['Toilet brush'] },
          { name: 'Clean sinks and counters', estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Clean mirrors', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Mop and disinfect floors', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Restock supplies', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Empty trash and feminine hygiene bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      }
    ]
  },
  
  airbnb: {
    name: 'Airbnb/Vacation Rental',
    icon: 'mdi-key-variant',
    color: '#FF5252',
    rooms: [
      {
        name: 'Entryway',
        tasks: [
          { name: 'Clean door and door frame', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Disinfect door handles and locks', estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean entry mat', estimatedTime: 3, chemicals: [], tools: ['Vacuum'] },
          { name: 'Check and organize keys/lockbox', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean light switches', estimatedTime: 2, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Dust coat hooks/rack', estimatedTime: 3, chemicals: [], tools: ['Duster'] }
        ]
      },
      {
        name: 'Living Areas',
        tasks: [
          { name: 'Vacuum all carpets and rugs', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Dust all surfaces and decor', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] },
          { name: 'Clean TV screen and remote controls', estimatedTime: 5, chemicals: ['Electronic cleaner', 'Disinfectant'], tools: ['Microfiber cloth'] },
          { name: 'Vacuum sofa and under cushions', estimatedTime: 10, chemicals: [], tools: ['Vacuum attachment'] },
          { name: 'Clean windows inside and out', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'] },
          { name: 'Arrange furniture and decor', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Check and replace air fresheners', estimatedTime: 3, chemicals: [], tools: [] },
          { name: 'Clean and disinfect light switches', estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Kitchen',
        tasks: [
          { name: 'Clean inside refrigerator', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] },
          { name: 'Clean inside microwave', estimatedTime: 5, chemicals: ['Degreaser'], tools: ['Sponge'] },
          { name: 'Clean oven inside and out', estimatedTime: 20, chemicals: ['Oven cleaner'], tools: ['Sponge', 'Scraper'] },
          { name: 'Clean dishwasher (run empty cycle)', estimatedTime: 5, chemicals: ['Dishwasher cleaner'], tools: [] },
          { name: 'Clean all small appliances', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Wipe all cabinet fronts and handles', estimatedTime: 10, chemicals: ['Wood cleaner'], tools: ['Cloth'] },
          { name: 'Clean and organize inside cabinets', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Check and organize dishware/cookware', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean sink and faucet (descale)', estimatedTime: 5, chemicals: ['Descaler'], tools: ['Sponge'] },
          { name: 'Take out trash and clean bin', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Restock kitchen supplies', estimatedTime: 10, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Bedrooms',
        tasks: [
          { name: 'Strip all bedding and remake', estimatedTime: 15, chemicals: [], tools: [] },
          { name: 'Check mattress for stains', estimatedTime: 5, chemicals: ['Stain remover'], tools: ['Cloth'] },
          { name: 'Vacuum under bed and furniture', estimatedTime: 10, chemicals: [], tools: ['Vacuum'] },
          { name: 'Dust all furniture and surfaces', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] },
          { name: 'Clean inside closets and drawers', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Check and organize hangers', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Clean mirrors and windows', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Check alarm clock and lamps', estimatedTime: 3, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Bathrooms',
        tasks: [
          { name: 'Deep clean toilet inside and out', estimatedTime: 10, chemicals: ['Toilet cleaner', 'Disinfectant'], tools: ['Toilet brush', 'Cloth'] },
          { name: 'Scrub shower/tub and glass doors', estimatedTime: 20, chemicals: ['Tub cleaner', 'Lime remover'], tools: ['Scrub brush'] },
          { name: 'Clean shower curtain/liner', estimatedTime: 5, chemicals: ['Mildew remover'], tools: ['Cloth'] },
          { name: 'Clean and disinfect sink/counter', estimatedTime: 5, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Clean mirrors (streak-free)', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Microfiber cloth'] },
          { name: 'Clean inside medicine cabinet', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Wash bath mats', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Replace all towels', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Restock toiletries and supplies', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Check and clean exhaust fan', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Vacuum attachment'] },
          { name: 'Mop and disinfect floor', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Mop'] }
        ]
      },
      {
        name: 'Final Checks',
        tasks: [
          { name: 'Check all appliances work', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Test Wi-Fi and write password', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Check TV and streaming services', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Verify check-in instructions', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Take photos for listing', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Lock all windows', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Set thermostat appropriately', estimatedTime: 2, chemicals: [], tools: [] },
          { name: 'Leave welcome note/guide', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      }
    ]
  },
  
  moveinout: {
    name: 'Move In/Out Cleaning',
    icon: 'mdi-truck',
    color: '#795548',
    rooms: [
      {
        name: 'Kitchen Deep Clean',
        tasks: [
          { name: 'Clean inside all cabinets', estimatedTime: 30, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum'] },
          { name: 'Clean inside refrigerator/freezer', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] },
          { name: 'Clean oven inside (deep clean)', estimatedTime: 30, chemicals: ['Oven cleaner'], tools: ['Scraper', 'Sponge'] },
          { name: 'Clean dishwasher inside', estimatedTime: 10, chemicals: ['Dishwasher cleaner'], tools: ['Cloth'] },
          { name: 'Clean range hood and filter', estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Brush'] },
          { name: 'Clean behind appliances', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Mop', 'Vacuum'] },
          { name: 'Clean inside drawers', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean light fixtures', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean backsplash and walls', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] },
          { name: 'Deep clean sink and disposal', estimatedTime: 10, chemicals: ['Sink cleaner', 'Disposal cleaner'], tools: ['Brush'] }
        ]
      },
      {
        name: 'Bathrooms Deep Clean',
        tasks: [
          { name: 'Remove soap scum and mineral deposits', estimatedTime: 20, chemicals: ['Lime remover'], tools: ['Scrub brush'] },
          { name: 'Clean tile grout', estimatedTime: 30, chemicals: ['Grout cleaner'], tools: ['Grout brush'] },
          { name: 'Clean inside vanity cabinets', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean exhaust fan and vent', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'] },
          { name: 'Clean light fixtures', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Deep clean toilet including base', estimatedTime: 15, chemicals: ['Toilet cleaner', 'Disinfectant'], tools: ['Brush', 'Cloth'] },
          { name: 'Clean bathroom walls', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] },
          { name: 'Clean baseboards', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Polish fixtures and hardware', estimatedTime: 10, chemicals: ['Metal polish'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Living Areas Deep Clean',
        tasks: [
          { name: 'Clean inside all closets', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum'] },
          { name: 'Clean baseboards throughout', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean all light fixtures and fans', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Cloth'] },
          { name: 'Clean window sills and tracks', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Brush', 'Vacuum'] },
          { name: 'Clean all walls and spot clean', estimatedTime: 30, chemicals: ['Wall cleaner'], tools: ['Sponge'] },
          { name: 'Clean air vents and returns', estimatedTime: 15, chemicals: [], tools: ['Vacuum', 'Cloth'] },
          { name: 'Clean inside windows', estimatedTime: 20, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Deep clean carpets or floors', estimatedTime: 45, chemicals: ['Carpet cleaner', 'Floor cleaner'], tools: ['Carpet cleaner', 'Mop'] },
          { name: 'Clean doors and door frames', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Garage/Storage',
        tasks: [
          { name: 'Sweep garage floor', estimatedTime: 15, chemicals: [], tools: ['Broom'] },
          { name: 'Remove oil stains', estimatedTime: 20, chemicals: ['Degreaser'], tools: ['Scrub brush'] },
          { name: 'Clean garage door', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Wipe down shelving', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean windows', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] }
        ]
      }
    ]
  },
  
  postconstruction: {
    name: 'Post-Construction',
    icon: 'mdi-hammer',
    color: '#607D8B',
    rooms: [
      {
        name: 'Dust Removal',
        tasks: [
          { name: 'Remove construction dust from ceilings', estimatedTime: 30, chemicals: [], tools: ['Vacuum with HEPA', 'Duster'] },
          { name: 'Clean air vents and returns', estimatedTime: 20, chemicals: [], tools: ['Vacuum', 'Cloth'] },
          { name: 'Vacuum all surfaces with HEPA filter', estimatedTime: 45, chemicals: [], tools: ['HEPA vacuum'] },
          { name: 'Wipe down all walls', estimatedTime: 60, chemicals: ['All-purpose cleaner'], tools: ['Sponge', 'Cloth'] },
          { name: 'Clean light fixtures and fans', estimatedTime: 30, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean inside cabinets and drawers', estimatedTime: 45, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'] }
        ]
      },
      {
        name: 'Windows and Glass',
        tasks: [
          { name: 'Remove stickers and adhesive', estimatedTime: 20, chemicals: ['Adhesive remover'], tools: ['Scraper'] },
          { name: 'Clean window frames and sills', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean all windows inside and out', estimatedTime: 45, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Clean mirrors and glass surfaces', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Remove paint overspray', estimatedTime: 30, chemicals: ['Paint remover'], tools: ['Scraper'] }
        ]
      },
      {
        name: 'Floors',
        tasks: [
          { name: 'Remove construction debris', estimatedTime: 20, chemicals: [], tools: ['Broom', 'Dustpan'] },
          { name: 'Vacuum thoroughly with HEPA', estimatedTime: 30, chemicals: [], tools: ['HEPA vacuum'] },
          { name: 'Remove adhesive and tape', estimatedTime: 20, chemicals: ['Adhesive remover'], tools: ['Scraper'] },
          { name: 'Deep clean hard floors', estimatedTime: 45, chemicals: ['Floor cleaner'], tools: ['Mop'] },
          { name: 'Clean and seal grout', estimatedTime: 30, chemicals: ['Grout cleaner', 'Sealer'], tools: ['Brush'] },
          { name: 'Polish hardwood floors', estimatedTime: 30, chemicals: ['Wood polish'], tools: ['Buffer'] }
        ]
      },
      {
        name: 'Fixtures and Hardware',
        tasks: [
          { name: 'Remove protective coverings', estimatedTime: 15, chemicals: [], tools: [] },
          { name: 'Clean and polish all fixtures', estimatedTime: 20, chemicals: ['Metal polish'], tools: ['Cloth'] },
          { name: 'Clean appliances inside and out', estimatedTime: 30, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'] },
          { name: 'Remove paint from hardware', estimatedTime: 25, chemicals: ['Paint remover'], tools: ['Brush'] },
          { name: 'Test all fixtures and appliances', estimatedTime: 20, chemicals: [], tools: [] }
        ]
      }
    ]
  },
  
  retail: {
    name: 'Retail Store',
    icon: 'mdi-store',
    color: '#795548',
    rooms: [
      {
        name: 'Sales Floor',
        tasks: [
          { name: 'Vacuum/mop floors', estimatedTime: 30, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Dust shelves and displays', estimatedTime: 20, chemicals: ['Duster spray'], tools: ['Duster', 'Cloth'] },
          { name: 'Clean glass displays', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Wipe down checkout counters', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean fitting room mirrors', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Storage/Back Room',
        tasks: [
          { name: 'Sweep and mop floors', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Organize inventory shelves', estimatedTime: 20, chemicals: [], tools: [] },
          { name: 'Dust storage areas', estimatedTime: 10, chemicals: ['Duster spray'], tools: ['Duster'] },
          { name: 'Clean loading dock', estimatedTime: 10, chemicals: ['Degreaser'], tools: ['Pressure washer'] },
          { name: 'Empty cardboard recycling', estimatedTime: 10, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Employee Break Room',
        tasks: [
          { name: 'Clean tables and chairs', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean microwave and refrigerator', estimatedTime: 10, chemicals: ['Kitchen cleaner'], tools: ['Sponge'] },
          { name: 'Wipe down counters', estimatedTime: 5, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Sweep and mop floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Empty trash', estimatedTime: 3, chemicals: [], tools: ['Trash bags'] }
        ]
      }
    ]
  },
  
  education: {
    name: 'School/Education',
    icon: 'mdi-school',
    color: '#3F51B5',
    rooms: [
      {
        name: 'Classrooms',
        tasks: [
          { name: 'Sanitize desks and chairs', estimatedTime: 20, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean whiteboards/chalkboards', estimatedTime: 10, chemicals: ['Board cleaner'], tools: ['Eraser', 'Cloth'] },
          { name: 'Vacuum/mop floors', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Empty pencil sharpeners', estimatedTime: 3, chemicals: [], tools: [] },
          { name: 'Disinfect door handles and light switches', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean windows and window sills', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Organize books and supplies', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Empty trash and recycling', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Sanitize computer keyboards and screens', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] }
        ]
      },
      {
        name: 'Cafeteria',
        tasks: [
          { name: 'Clean and sanitize tables', estimatedTime: 25, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Clean chairs and benches', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Sweep and mop floors', estimatedTime: 30, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Clean serving line', estimatedTime: 20, chemicals: ['Food-safe cleaner'], tools: ['Cloth'] },
          { name: 'Empty and clean trash cans', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Trash bags'] },
          { name: 'Clean kitchen equipment', estimatedTime: 30, chemicals: ['Degreaser'], tools: ['Various'] },
          { name: 'Wipe down walls and surfaces', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Sponge'] }
        ]
      },
      {
        name: 'Gymnasium',
        tasks: [
          { name: 'Clean gym floor', estimatedTime: 45, chemicals: ['Gym floor cleaner'], tools: ['Floor machine'] },
          { name: 'Sanitize exercise equipment', estimatedTime: 20, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean bleachers', estimatedTime: 30, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean locker rooms', estimatedTime: 30, chemicals: ['Disinfectant'], tools: ['Various'] },
          { name: 'Wipe down mats', estimatedTime: 15, chemicals: ['Mat cleaner'], tools: ['Mop'] },
          { name: 'Empty trash bins', estimatedTime: 10, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Library',
        tasks: [
          { name: 'Dust bookshelves', estimatedTime: 30, chemicals: ['Duster spray'], tools: ['Duster'] },
          { name: 'Clean reading tables', estimatedTime: 15, chemicals: ['Furniture polish'], tools: ['Cloth'] },
          { name: 'Vacuum carpeted areas', estimatedTime: 20, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean computer stations', estimatedTime: 15, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Organize books and materials', estimatedTime: 20, chemicals: [], tools: [] },
          { name: 'Clean windows', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] }
        ]
      }
    ]
  },
  
  gym: {
    name: 'Gym/Fitness Center',
    icon: 'mdi-dumbbell',
    color: '#FF6F00',
    rooms: [
      {
        name: 'Workout Floor',
        tasks: [
          { name: 'Disinfect all equipment', estimatedTime: 45, chemicals: ['Gym equipment cleaner'], tools: ['Cloth', 'Spray bottle'] },
          { name: 'Clean mirrors', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Vacuum/mop rubber floors', estimatedTime: 30, chemicals: ['Rubber floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Wipe down weight racks', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean and organize free weights', estimatedTime: 20, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Sanitize yoga mats', estimatedTime: 15, chemicals: ['Mat sanitizer'], tools: ['Spray', 'Cloth'] },
          { name: 'Empty trash bins', estimatedTime: 10, chemicals: [], tools: ['Trash bags'] },
          { name: 'Refill sanitizer stations', estimatedTime: 10, chemicals: ['Hand sanitizer'], tools: [] }
        ]
      },
      {
        name: 'Locker Rooms',
        tasks: [
          { name: 'Clean and disinfect lockers', estimatedTime: 30, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean showers and tiles', estimatedTime: 30, chemicals: ['Shower cleaner', 'Mildew remover'], tools: ['Scrub brush'] },
          { name: 'Disinfect benches', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean and disinfect toilets', estimatedTime: 20, chemicals: ['Toilet cleaner'], tools: ['Toilet brush'] },
          { name: 'Clean sinks and counters', estimatedTime: 15, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Mop and disinfect floors', estimatedTime: 20, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Empty trash and sanitary bins', estimatedTime: 10, chemicals: [], tools: ['Trash bags'] },
          { name: 'Restock supplies', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean mirrors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Studio Rooms',
        tasks: [
          { name: 'Clean mirrors wall to wall', estimatedTime: 20, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Disinfect ballet barres', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean sound equipment', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Mop studio floors', estimatedTime: 20, chemicals: ['Wood floor cleaner'], tools: ['Mop'] },
          { name: 'Sanitize props and equipment', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Organize equipment storage', estimatedTime: 10, chemicals: [], tools: [] }
        ]
      }
    ]
  },
  
  bank: {
    name: 'Bank/Financial',
    icon: 'mdi-bank',
    color: '#006064',
    rooms: [
      {
        name: 'Teller Area',
        tasks: [
          { name: 'Disinfect teller stations', estimatedTime: 20, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean bulletproof glass', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum under counters', estimatedTime: 10, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean cash drawers (exterior)', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Sanitize keypads and equipment', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Empty waste baskets', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Customer Area',
        tasks: [
          { name: 'Clean and sanitize desks', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Vacuum/clean waiting area', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean ATM machines', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Polish brass fixtures', estimatedTime: 10, chemicals: ['Brass polish'], tools: ['Cloth'] },
          { name: 'Clean entrance doors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Sanitize pens and shared items', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Vault Area',
        tasks: [
          { name: 'Vacuum vault floor', estimatedTime: 10, chemicals: [], tools: ['Vacuum'] },
          { name: 'Dust safety deposit area', estimatedTime: 15, chemicals: [], tools: ['Duster'] },
          { name: 'Clean vault door (exterior)', estimatedTime: 10, chemicals: ['Metal cleaner'], tools: ['Cloth'] },
          { name: 'Organize and clean counters', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] }
        ]
      }
    ]
  },
  
  warehouse: {
    name: 'Warehouse/Industrial',
    icon: 'mdi-warehouse',
    color: '#424242',
    rooms: [
      {
        name: 'Warehouse Floor',
        tasks: [
          { name: 'Sweep main aisles', estimatedTime: 45, chemicals: [], tools: ['Industrial sweeper'] },
          { name: 'Clean loading dock area', estimatedTime: 30, chemicals: ['Degreaser'], tools: ['Pressure washer'] },
          { name: 'Remove oil and grease stains', estimatedTime: 20, chemicals: ['Industrial degreaser'], tools: ['Scrub brush'] },
          { name: 'Clean forklift parking area', estimatedTime: 15, chemicals: [], tools: ['Broom'] },
          { name: 'Empty industrial waste bins', estimatedTime: 20, chemicals: [], tools: ['Waste bags'] },
          { name: 'Clean safety equipment stations', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Dust high shelving units', estimatedTime: 30, chemicals: [], tools: ['Extended duster'] }
        ]
      },
      {
        name: 'Office Area',
        tasks: [
          { name: 'Clean desks and workstations', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum office carpets', estimatedTime: 10, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean computer equipment', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Empty office trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Clean windows', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee'] }
        ]
      },
      {
        name: 'Break Room',
        tasks: [
          { name: 'Clean tables and chairs', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Clean microwave and refrigerator', estimatedTime: 15, chemicals: ['Kitchen cleaner'], tools: ['Sponge'] },
          { name: 'Sweep and mop floor', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Empty trash and recycling', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] },
          { name: 'Restock supplies', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Restrooms',
        tasks: [
          { name: 'Clean and disinfect toilets', estimatedTime: 15, chemicals: ['Industrial toilet cleaner'], tools: ['Toilet brush'] },
          { name: 'Clean sinks and counters', estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Mop and disinfect floors', estimatedTime: 15, chemicals: ['Industrial floor cleaner'], tools: ['Mop'] },
          { name: 'Refill dispensers', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      }
    ]
  },
  
  salon: {
    name: 'Salon/Spa',
    icon: 'mdi-content-cut',
    color: '#E91E63',
    rooms: [
      {
        name: 'Styling Stations',
        tasks: [
          { name: 'Disinfect chairs and stations', estimatedTime: 20, chemicals: ['Barbicide'], tools: ['Cloth'] },
          { name: 'Clean mirrors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Sweep hair from floor', estimatedTime: 15, chemicals: [], tools: ['Broom'] },
          { name: 'Clean and organize tools', estimatedTime: 15, chemicals: ['Tool sanitizer'], tools: ['UV cabinet'] },
          { name: 'Wipe down counters', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean hair dryers and tools', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Brush'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      },
      {
        name: 'Wash Stations',
        tasks: [
          { name: 'Clean and disinfect sinks', estimatedTime: 15, chemicals: ['Sink cleaner'], tools: ['Sponge'] },
          { name: 'Clean chairs and headrests', estimatedTime: 10, chemicals: ['Leather cleaner'], tools: ['Cloth'] },
          { name: 'Organize hair products', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Mop floor area', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Mop'] },
          { name: 'Clean and refill shampoo dispensers', estimatedTime: 10, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Treatment Rooms',
        tasks: [
          { name: 'Sanitize treatment beds', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Change and wash linens', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean equipment and tools', estimatedTime: 15, chemicals: ['Sanitizer'], tools: ['Autoclave'] },
          { name: 'Dust shelves and products', estimatedTime: 10, chemicals: [], tools: ['Duster'] },
          { name: 'Mop floors', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Mop'] },
          { name: 'Restock supplies', estimatedTime: 10, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Reception',
        tasks: [
          { name: 'Clean reception desk', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Sanitize payment terminals', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Clean waiting area seating', estimatedTime: 10, chemicals: ['Upholstery cleaner'], tools: ['Vacuum'] },
          { name: 'Organize magazines and products', estimatedTime: 5, chemicals: [], tools: [] },
          { name: 'Vacuum entrance area', estimatedTime: 10, chemicals: [], tools: ['Vacuum'] }
        ]
      }
    ]
  },
  
  church: {
    name: 'Church/Worship',
    icon: 'mdi-church',
    color: '#6A1B9A',
    rooms: [
      {
        name: 'Sanctuary',
        tasks: [
          { name: 'Vacuum between pews', estimatedTime: 30, chemicals: [], tools: ['Vacuum'] },
          { name: 'Dust pews and hymnals', estimatedTime: 25, chemicals: ['Furniture polish'], tools: ['Cloth'] },
          { name: 'Clean altar area', estimatedTime: 15, chemicals: ['Wood polish'], tools: ['Cloth'] },
          { name: 'Polish brass and silver items', estimatedTime: 20, chemicals: ['Metal polish'], tools: ['Cloth'] },
          { name: 'Vacuum carpet/runner', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean stained glass (interior)', estimatedTime: 20, chemicals: ['Glass cleaner'], tools: ['Soft cloth'] },
          { name: 'Dust organ and piano', estimatedTime: 10, chemicals: [], tools: ['Duster'] },
          { name: 'Empty collection plates', estimatedTime: 5, chemicals: [], tools: [] }
        ]
      },
      {
        name: 'Fellowship Hall',
        tasks: [
          { name: 'Clean tables and chairs', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Sweep and mop floors', estimatedTime: 25, chemicals: ['Floor cleaner'], tools: ['Broom', 'Mop'] },
          { name: 'Clean kitchen area', estimatedTime: 20, chemicals: ['Kitchen cleaner'], tools: ['Sponge'] },
          { name: 'Empty trash bins', estimatedTime: 10, chemicals: [], tools: ['Trash bags'] },
          { name: 'Wipe down serving counters', estimatedTime: 10, chemicals: ['Sanitizer'], tools: ['Cloth'] },
          { name: 'Clean coffee makers', estimatedTime: 10, chemicals: ['Descaler'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Sunday School Rooms',
        tasks: [
          { name: 'Sanitize toys and materials', estimatedTime: 15, chemicals: ['Child-safe disinfectant'], tools: ['Cloth'] },
          { name: 'Clean child-height surfaces', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum carpets/rugs', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Organize books and supplies', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Clean whiteboards', estimatedTime: 5, chemicals: ['Board cleaner'], tools: ['Eraser'] },
          { name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'] }
        ]
      }
    ]
  },
  
  daycare: {
    name: 'Daycare/Childcare',
    icon: 'mdi-baby-carriage',
    color: '#00ACC1',
    rooms: [
      {
        name: 'Play Areas',
        tasks: [
          { name: 'Sanitize all toys', estimatedTime: 30, chemicals: ['Child-safe disinfectant'], tools: ['Cloth', 'Spray'] },
          { name: 'Clean play mats', estimatedTime: 20, chemicals: ['Mat cleaner'], tools: ['Mop'] },
          { name: 'Wipe down tables and chairs', estimatedTime: 15, chemicals: ['Non-toxic cleaner'], tools: ['Cloth'] },
          { name: 'Vacuum carpets and rugs', estimatedTime: 20, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean and organize toy storage', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Sanitize door handles (low and high)', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Clean windows at child height', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Cloth'] },
          { name: 'Empty diaper pails', estimatedTime: 10, chemicals: ['Deodorizer'], tools: ['Bags'] }
        ]
      },
      {
        name: 'Nap Room',
        tasks: [
          { name: 'Sanitize cribs and cots', estimatedTime: 25, chemicals: ['Child-safe disinfectant'], tools: ['Cloth'] },
          { name: 'Change crib sheets', estimatedTime: 20, chemicals: [], tools: [] },
          { name: 'Vacuum floor quietly', estimatedTime: 10, chemicals: [], tools: ['Quiet vacuum'] },
          { name: 'Clean and check monitors', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber'] },
          { name: 'Sanitize pacifiers station', estimatedTime: 10, chemicals: ['Sanitizer'], tools: ['UV sterilizer'] }
        ]
      },
      {
        name: 'Changing Area',
        tasks: [
          { name: 'Disinfect changing tables', estimatedTime: 15, chemicals: ['Hospital-grade disinfectant'], tools: ['Cloth'] },
          { name: 'Restock diapers and wipes', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Empty diaper bins', estimatedTime: 10, chemicals: [], tools: ['Bags'] },
          { name: 'Clean and disinfect sinks', estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'] },
          { name: 'Mop floor with disinfectant', estimatedTime: 10, chemicals: ['Floor disinfectant'], tools: ['Mop'] },
          { name: 'Refill hand sanitizers', estimatedTime: 5, chemicals: ['Hand sanitizer'], tools: [] }
        ]
      },
      {
        name: 'Kitchen/Feeding Area',
        tasks: [
          { name: 'Sanitize high chairs', estimatedTime: 20, chemicals: ['Food-safe sanitizer'], tools: ['Cloth'] },
          { name: 'Clean bottle warmers', estimatedTime: 10, chemicals: ['Descaler'], tools: ['Cloth'] },
          { name: 'Disinfect food prep surfaces', estimatedTime: 10, chemicals: ['Food-safe cleaner'], tools: ['Cloth'] },
          { name: 'Clean microwave and refrigerator', estimatedTime: 15, chemicals: ['Kitchen cleaner'], tools: ['Sponge'] },
          { name: 'Wash and sterilize bottles', estimatedTime: 20, chemicals: ['Bottle cleaner'], tools: ['Bottle brush', 'Sterilizer'] },
          { name: 'Mop kitchen floor', estimatedTime: 10, chemicals: ['Floor cleaner'], tools: ['Mop'] }
        ]
      }
    ]
  },
  
  deepClean: {
    name: 'Deep Cleaning',
    icon: 'mdi-spray-bottle',
    color: '#00BCD4',
    rooms: [
      {
        name: 'Kitchen Deep Clean',
        tasks: [
          { name: 'Degrease all surfaces', estimatedTime: 20, chemicals: ['Heavy degreaser'], tools: ['Scrub brush', 'Cloth'] },
          { name: 'Clean oven inside (deep clean)', estimatedTime: 30, chemicals: ['Oven cleaner'], tools: ['Scraper', 'Sponge'] },
          { name: 'Clean refrigerator inside and out', estimatedTime: 25, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Sponge'] },
          { name: 'Clean and descale dishwasher', estimatedTime: 20, chemicals: ['Descaler'], tools: ['Cloth'] },
          { name: 'Deep clean cabinets inside and out', estimatedTime: 30, chemicals: ['Wood cleaner'], tools: ['Cloth'] },
          { name: 'Clean light fixtures and ceiling fans', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Ladder'] },
          { name: 'Deep clean sink and disposal', estimatedTime: 10, chemicals: ['Sink cleaner', 'Disposal cleaner'], tools: ['Brush'] },
          { name: 'Clean behind and under appliances', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Mop', 'Vacuum'] },
          { name: 'Scrub tile grout', estimatedTime: 25, chemicals: ['Grout cleaner'], tools: ['Grout brush'] },
          { name: 'Polish stainless steel appliances', estimatedTime: 15, chemicals: ['Stainless steel polish'], tools: ['Microfiber cloth'] }
        ]
      },
      {
        name: 'Bathrooms Deep Clean',
        tasks: [
          { name: 'Remove and prevent mold/mildew', estimatedTime: 20, chemicals: ['Mold remover'], tools: ['Scrub brush'] },
          { name: 'Deep clean tile and grout', estimatedTime: 30, chemicals: ['Grout cleaner'], tools: ['Grout brush'] },
          { name: 'Descale showerheads and faucets', estimatedTime: 15, chemicals: ['Descaler'], tools: ['Cloth'] },
          { name: 'Deep clean toilet including base and behind', estimatedTime: 15, chemicals: ['Toilet cleaner', 'Disinfectant'], tools: ['Brush', 'Cloth'] },
          { name: 'Clean and disinfect trash cans', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Wash shower curtain/clean glass doors', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Squeegee'] },
          { name: 'Clean exhaust fan and vents', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'] },
          { name: 'Polish fixtures and mirrors', estimatedTime: 10, chemicals: ['Glass cleaner', 'Metal polish'], tools: ['Cloth'] }
        ]
      },
      {
        name: 'Living Areas Deep Clean',
        tasks: [
          { name: 'Deep clean carpets or rugs', estimatedTime: 45, chemicals: ['Carpet cleaner'], tools: ['Carpet cleaner machine'] },
          { name: 'Clean upholstery and cushions', estimatedTime: 30, chemicals: ['Upholstery cleaner'], tools: ['Vacuum', 'Brush'] },
          { name: 'Dust and clean all light fixtures', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Ladder'] },
          { name: 'Clean windows inside and out', estimatedTime: 30, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'] },
          { name: 'Clean baseboards and crown molding', estimatedTime: 25, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Duster'] },
          { name: 'Deep clean and polish wood furniture', estimatedTime: 20, chemicals: ['Wood polish'], tools: ['Microfiber cloth'] },
          { name: 'Clean air vents and returns', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'] },
          { name: 'Wash walls and touch up paint', estimatedTime: 40, chemicals: ['Wall cleaner'], tools: ['Sponge', 'Cloth'] }
        ]
      },
      {
        name: 'Bedrooms Deep Clean',
        tasks: [
          { name: 'Flip and vacuum mattress', estimatedTime: 15, chemicals: [], tools: ['Vacuum'] },
          { name: 'Clean under bed and furniture', estimatedTime: 20, chemicals: ['Floor cleaner'], tools: ['Vacuum', 'Mop'] },
          { name: 'Organize and clean closets', estimatedTime: 30, chemicals: ['All-purpose cleaner'], tools: ['Cloth'] },
          { name: 'Wash pillows and bedding', estimatedTime: 10, chemicals: ['Laundry detergent'], tools: [] },
          { name: 'Clean light fixtures and ceiling fans', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Ladder'] },
          { name: 'Deep clean carpets or floors', estimatedTime: 30, chemicals: ['Carpet/floor cleaner'], tools: ['Cleaner machine', 'Mop'] },
          { name: 'Dust and clean all surfaces thoroughly', estimatedTime: 20, chemicals: ['Furniture polish'], tools: ['Microfiber cloth'] }
        ]
      },
      {
        name: 'Whole House',
        tasks: [
          { name: 'Clean all door handles and light switches', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Replace HVAC filters', estimatedTime: 10, chemicals: [], tools: [] },
          { name: 'Deep clean all trash cans', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'] },
          { name: 'Organize and declutter all areas', estimatedTime: 45, chemicals: [], tools: [] },
          { name: 'Deep clean garage or storage areas', estimatedTime: 60, chemicals: ['All-purpose cleaner'], tools: ['Broom', 'Mop'] }
        ]
      }
    ]
  }
}

// Helper function to get all industries
export const getIndustries = (): IndustryInfo[] => {
  return Object.keys(cleaningTemplates).map(key => ({
    value: key,
    name: cleaningTemplates[key].name,
    icon: cleaningTemplates[key].icon,
    color: cleaningTemplates[key].color
  }))
}

// Helper function to get rooms for an industry
export const getRoomsByIndustry = (industry: string): RoomTemplate[] => {
  return cleaningTemplates[industry]?.rooms || []
}

// Helper function to get all unique chemicals
export const getAllChemicals = (): string[] => {
  const chemicals = new Set<string>()
  Object.values(cleaningTemplates).forEach(industry => {
    industry.rooms.forEach(room => {
      room.tasks.forEach(task => {
        task.chemicals?.forEach(chemical => chemicals.add(chemical))
      })
    })
  })
  return Array.from(chemicals).sort()
}

// Helper function to get all unique tools
export const getAllTools = (): string[] => {
  const tools = new Set<string>()
  Object.values(cleaningTemplates).forEach(industry => {
    industry.rooms.forEach(room => {
      room.tasks.forEach(task => {
        task.tools?.forEach(tool => tools.add(tool))
      })
    })
  })
  return Array.from(tools).sort()
}

// Helper function to calculate total time for a room
export const calculateRoomTime = (tasks: TaskItem[], multiplier = 1): number => {
  return tasks.reduce((total, task) => {
    return total + (task.estimatedTime * multiplier)
  }, 0)
}

// Export default
export default cleaningTemplates