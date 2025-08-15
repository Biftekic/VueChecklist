// Enhanced cleaning tasks database with professional features
export const enhancedCleaningTasks = [
  // Bathroom Tasks - High Priority, Daily/Weekly Frequency
  {
    id: 'task-001',
    name: 'Clean and disinfect toilet',
    category: 'sanitization',
    frequency: 'DAILY',
    priority: 'high',
    estimatedTime: {
      amateur: { min: 15, max: 20 },
      professional: { min: 8, max: 10 },
      modifiers: {
        firstTime: 1.5,
        heavy_soil: 1.3,
        minimal: 0.7
      }
    },
    steps: [
      'Place wet floor signs at entrance',
      'Apply toilet bowl cleaner and let dwell 5 minutes',
      'Clean exterior surfaces with disinfectant',
      'Scrub bowl with toilet brush thoroughly',
      'Clean seat, lid, and handle with disinfectant',
      'Wipe dry all surfaces',
      'Replace toilet paper if needed',
      'Remove wet floor signs'
    ],
    chemicals: [
      {
        name: 'Toilet Bowl Cleaner',
        type: 'acidic',
        ph: '2-3',
        dilution: 'Ready-to-use',
        dwellTime: 5,
        surfaces: ['porcelain'],
        warnings: ["Don't mix with bleach", 'Ensure ventilation']
      },
      {
        name: 'EPA Disinfectant',
        epaNumber: '12345-67',
        killClaims: ['COVID-19', 'Influenza', 'E. coli'],
        contactTime: 60
      }
    ],
    tools: [
      {
        name: 'Toilet Brush',
        type: 'curved',
        replaceFrequency: 'monthly'
      },
      {
        name: 'Microfiber Cloth',
        colorCode: 'red',
        quantity: 2,
        size: '16x16'
      }
    ],
    safety: {
      ppe: ['gloves', 'goggles'],
      warnings: ['Ensure ventilation', 'Wet floor hazard'],
      msds: ['toilet-cleaner-msds.pdf']
    },
    standards: {
      visual: 'Bowl visibly clean, no stains or rings',
      touch: 'All surfaces smooth and dry',
      smell: 'Fresh scent, no odor',
      measurable: {
        atpReading: '<100 RLU',
        bacteriaCount: '<10 CFU/cm²'
      }
    },
    rooms: ['Bathroom', 'Powder Room']
  },

  {
    id: 'task-002',
    name: 'Clean bathroom sink and counter',
    category: 'sanitization',
    frequency: 'DAILY',
    priority: 'high',
    estimatedTime: {
      amateur: { min: 10, max: 15 },
      professional: { min: 5, max: 8 },
      modifiers: {
        firstTime: 1.3,
        heavy_soil: 1.5,
        minimal: 0.6
      }
    },
    steps: [
      'Clear counter of personal items',
      'Spray sink and counter with cleaner',
      'Let cleaner dwell for 2 minutes',
      'Scrub sink basin and faucet',
      'Wipe counter from back to front',
      'Polish faucet to shine',
      'Dry all surfaces',
      'Replace items neatly'
    ],
    chemicals: [
      {
        name: 'Bathroom Cleaner',
        type: 'neutral',
        ph: '7-8',
        dilution: '1:32',
        dwellTime: 2,
        surfaces: ['ceramic', 'granite', 'marble'],
        warnings: ['Test on natural stone first']
      }
    ],
    tools: [
      {
        name: 'Microfiber Cloth',
        colorCode: 'red',
        quantity: 2,
        size: '16x16'
      },
      {
        name: 'Scrub Sponge',
        type: 'non-abrasive'
      }
    ],
    safety: {
      ppe: ['gloves'],
      warnings: ['Slippery when wet']
    },
    standards: {
      visual: 'Sink and counter spotless, faucet shining',
      touch: 'Smooth, no soap residue',
      smell: 'Clean, fresh'
    },
    rooms: ['Bathroom', 'Powder Room']
  },

  {
    id: 'task-003',
    name: 'Clean shower/bathtub',
    category: 'deep-cleaning',
    frequency: 'WEEKLY',
    priority: 'medium',
    estimatedTime: {
      amateur: { min: 20, max: 30 },
      professional: { min: 12, max: 18 },
      modifiers: {
        firstTime: 1.5,
        heavy_soil: 2.0,
        minimal: 0.7
      }
    },
    steps: [
      'Remove all bottles and items',
      'Rinse surfaces with hot water',
      'Apply tub and tile cleaner generously',
      'Let dwell for 5-10 minutes',
      'Scrub tiles and grout lines',
      'Clean tub/shower floor thoroughly',
      'Rinse completely with hot water',
      'Dry with squeegee or towel',
      'Replace items organized'
    ],
    chemicals: [
      {
        name: 'Tub & Tile Cleaner',
        type: 'alkaline',
        ph: '11-12',
        dilution: '1:10',
        dwellTime: 10,
        surfaces: ['ceramic', 'fiberglass', 'acrylic'],
        warnings: ['Avoid marble and natural stone']
      },
      {
        name: 'Mildew Remover',
        type: 'oxidizing',
        activeIngredient: 'Sodium hypochlorite',
        concentration: '3-6%',
        dwellTime: 5
      }
    ],
    tools: [
      {
        name: 'Scrub Brush',
        type: 'stiff bristle',
        size: 'medium'
      },
      {
        name: 'Grout Brush',
        type: 'narrow'
      },
      {
        name: 'Squeegee',
        width: '12 inch'
      }
    ],
    safety: {
      ppe: ['gloves', 'goggles', 'apron'],
      warnings: ['Ensure ventilation', 'Slippery surfaces', 'Strong fumes']
    },
    standards: {
      visual: 'No soap scum, mildew, or stains',
      touch: 'Smooth, no sticky residue',
      smell: 'Fresh, no mildew odor'
    },
    rooms: ['Bathroom']
  },

  // Kitchen Tasks - High Priority, Daily Frequency
  {
    id: 'task-004',
    name: 'Clean kitchen countertops',
    category: 'sanitization',
    frequency: 'DAILY',
    priority: 'high',
    estimatedTime: {
      amateur: { min: 10, max: 15 },
      professional: { min: 5, max: 8 },
      modifiers: {
        firstTime: 1.2,
        heavy_soil: 1.5,
        minimal: 0.5
      }
    },
    steps: [
      'Clear countertops of items',
      'Remove crumbs and debris',
      'Spray with kitchen cleaner',
      'Let dwell for 1 minute',
      'Wipe from back to front',
      'Pay attention to edges and backsplash',
      'Dry thoroughly',
      'Replace items organized'
    ],
    chemicals: [
      {
        name: 'Kitchen Degreaser',
        type: 'alkaline',
        ph: '10-11',
        dilution: '1:20',
        dwellTime: 1,
        surfaces: ['laminate', 'granite', 'quartz'],
        warnings: ['Test on natural stone']
      },
      {
        name: 'Food-Safe Sanitizer',
        type: 'quaternary ammonium',
        concentration: '200 ppm',
        contactTime: 30
      }
    ],
    tools: [
      {
        name: 'Microfiber Cloth',
        colorCode: 'green',
        quantity: 2,
        size: '16x16'
      }
    ],
    safety: {
      ppe: ['gloves'],
      warnings: ['Food contact surface - rinse if required']
    },
    standards: {
      visual: 'Clean, no crumbs or stains',
      touch: 'Smooth, not sticky',
      smell: 'Fresh, no food odors'
    },
    rooms: ['Kitchen']
  },

  {
    id: 'task-005',
    name: 'Clean stovetop',
    category: 'deep-cleaning',
    frequency: 'DAILY',
    priority: 'high',
    estimatedTime: {
      amateur: { min: 15, max: 20 },
      professional: { min: 8, max: 12 },
      modifiers: {
        firstTime: 1.5,
        heavy_soil: 2.0,
        minimal: 0.6
      }
    },
    steps: [
      'Ensure stovetop is cool',
      'Remove grates/burner covers if applicable',
      'Wipe loose debris',
      'Apply degreaser generously',
      'Let dwell for 3-5 minutes',
      'Scrub stubborn spots',
      'Wipe clean with damp cloth',
      'Dry and polish surface',
      'Replace grates/covers'
    ],
    chemicals: [
      {
        name: 'Heavy-Duty Degreaser',
        type: 'alkaline',
        ph: '12-13',
        dilution: '1:5 for heavy soil',
        dwellTime: 5,
        surfaces: ['stainless steel', 'enamel', 'glass'],
        warnings: ['May damage aluminum']
      }
    ],
    tools: [
      {
        name: 'Scraper',
        type: 'plastic',
        edge: 'flat'
      },
      {
        name: 'Scrub Pad',
        type: 'non-scratch'
      },
      {
        name: 'Microfiber Cloth',
        colorCode: 'green',
        quantity: 2
      }
    ],
    safety: {
      ppe: ['gloves'],
      warnings: ['Ensure surface is cool', 'Caustic chemical']
    },
    standards: {
      visual: 'No grease, food residue, or stains',
      touch: 'Smooth, not greasy',
      smell: 'No burnt food odor'
    },
    rooms: ['Kitchen']
  },

  // Living Areas - Medium Priority, Weekly Frequency
  {
    id: 'task-006',
    name: 'Dust surfaces and furniture',
    category: 'maintenance',
    frequency: 'WEEKLY',
    priority: 'medium',
    estimatedTime: {
      amateur: { min: 10, max: 15 },
      professional: { min: 5, max: 8 },
      modifiers: {
        firstTime: 1.2,
        heavy_soil: 1.5,
        minimal: 0.7
      }
    },
    steps: [
      'Start from top surfaces',
      'Work downward systematically',
      'Move items to dust underneath',
      'Use appropriate polish for wood',
      'Clean glass surfaces',
      'Dust electronics carefully',
      'Replace items neatly'
    ],
    chemicals: [
      {
        name: 'Furniture Polish',
        type: 'oil-based',
        surfaces: ['wood', 'laminate'],
        application: 'Spray and wipe',
        warnings: ['May make floor slippery']
      }
    ],
    tools: [
      {
        name: 'Microfiber Cloth',
        colorCode: 'yellow',
        quantity: 3,
        size: '16x16'
      },
      {
        name: 'Duster',
        type: 'extendable',
        reach: '6 feet'
      }
    ],
    safety: {
      ppe: [],
      warnings: ['Use ladder safely for high areas']
    },
    standards: {
      visual: 'No visible dust on surfaces',
      touch: 'Smooth, clean feel',
      smell: 'Fresh, no musty odor'
    },
    rooms: ['Living Room', 'Bedroom', 'Office', 'Family Room']
  },

  {
    id: 'task-007',
    name: 'Vacuum carpet/rugs',
    category: 'floor-care',
    frequency: 'WEEKLY',
    priority: 'medium',
    estimatedTime: {
      amateur: { min: 15, max: 20 },
      professional: { min: 8, max: 12 },
      modifiers: {
        firstTime: 1.0,
        heavy_soil: 1.5,
        minimal: 0.7,
        largeArea: 2.0
      }
    },
    steps: [
      'Pick up items from floor',
      'Check vacuum bag/canister',
      'Vacuum edges and corners first',
      'Vacuum in overlapping strokes',
      'Go over high-traffic areas twice',
      'Empty bag/canister if needed',
      'Clean vacuum roller if tangled'
    ],
    chemicals: [],
    tools: [
      {
        name: 'Vacuum Cleaner',
        type: 'upright or canister',
        attachments: ['crevice tool', 'upholstery brush']
      }
    ],
    safety: {
      ppe: [],
      warnings: ['Check for small objects', 'Secure loose cords']
    },
    standards: {
      visual: 'Clean carpet lines, no visible debris',
      touch: 'No grit underfoot',
      smell: 'Fresh, no pet odors'
    },
    rooms: ['Living Room', 'Bedroom', 'Office', 'Hallway', 'Stairs']
  },

  // Floor Care - Various Frequencies
  {
    id: 'task-008',
    name: 'Mop hard floors',
    category: 'floor-care',
    frequency: 'WEEKLY',
    priority: 'medium',
    estimatedTime: {
      amateur: { min: 15, max: 25 },
      professional: { min: 10, max: 15 },
      modifiers: {
        firstTime: 1.2,
        heavy_soil: 1.8,
        minimal: 0.6,
        largeArea: 2.0
      }
    },
    steps: [
      'Sweep or vacuum floor first',
      'Prepare mop solution per instructions',
      'Start mopping from far corner',
      'Work toward exit',
      'Change water if it becomes dirty',
      'Allow floor to air dry',
      'Clean mop head after use'
    ],
    chemicals: [
      {
        name: 'Neutral Floor Cleaner',
        type: 'neutral',
        ph: '7-8',
        dilution: '1:128',
        surfaces: ['tile', 'vinyl', 'sealed wood'],
        warnings: ['Slippery when wet']
      }
    ],
    tools: [
      {
        name: 'Mop',
        type: 'microfiber flat',
        width: '18 inch'
      },
      {
        name: 'Bucket',
        capacity: '5 gallon',
        features: ['wringer', 'wheels']
      }
    ],
    safety: {
      ppe: ['gloves'],
      warnings: ['Wet floor signs required', 'Slip hazard']
    },
    standards: {
      visual: 'Clean, streak-free floor',
      touch: 'Not sticky when dry',
      smell: 'Fresh, clean scent'
    },
    rooms: ['Kitchen', 'Bathroom', 'Hallway', 'Entryway', 'Laundry Room']
  },

  // Specialized Tasks - Monthly/Quarterly
  {
    id: 'task-009',
    name: 'Clean oven interior',
    category: 'deep-cleaning',
    frequency: 'MONTHLY',
    priority: 'low',
    estimatedTime: {
      amateur: { min: 30, max: 45 },
      professional: { min: 20, max: 30 },
      modifiers: {
        firstTime: 1.5,
        heavy_soil: 2.0,
        minimal: 0.8
      }
    },
    steps: [
      'Remove oven racks',
      'Apply oven cleaner to interior',
      'Close door and let dwell 20 minutes',
      'Meanwhile, clean racks separately',
      'Scrub interior with appropriate tools',
      'Wipe clean with damp cloths',
      'Repeat if necessary',
      'Dry thoroughly',
      'Replace racks'
    ],
    chemicals: [
      {
        name: 'Oven Cleaner',
        type: 'alkaline',
        ph: '13-14',
        activeIngredient: 'Sodium hydroxide',
        dwellTime: 20,
        surfaces: ['oven interior'],
        warnings: ['Caustic - use ventilation', 'Wear gloves and goggles']
      }
    ],
    tools: [
      {
        name: 'Scraper',
        type: 'plastic',
        edge: 'flat'
      },
      {
        name: 'Scrub Pad',
        type: 'heavy-duty'
      },
      {
        name: 'Sponge',
        quantity: 3
      }
    ],
    safety: {
      ppe: ['gloves', 'goggles', 'apron'],
      warnings: ['Caustic fumes', 'Ensure oven is cool', 'Ventilate area']
    },
    standards: {
      visual: 'No baked-on food or grease',
      touch: 'Smooth surfaces',
      smell: 'No burnt food odor'
    },
    rooms: ['Kitchen']
  },

  {
    id: 'task-010',
    name: 'Clean windows interior',
    category: 'detail-cleaning',
    frequency: 'MONTHLY',
    priority: 'low',
    estimatedTime: {
      amateur: { min: 10, max: 15 },
      professional: { min: 5, max: 8 },
      modifiers: {
        firstTime: 1.2,
        heavy_soil: 1.5,
        minimal: 0.7,
        manyWindows: 3.0
      }
    },
    steps: [
      'Remove screens if applicable',
      'Dust window frame and sill',
      'Spray glass cleaner on window',
      'Wipe with squeegee or cloth',
      'Detail edges with cloth',
      'Clean window sill',
      'Replace screens'
    ],
    chemicals: [
      {
        name: 'Glass Cleaner',
        type: 'ammonia-based',
        concentration: '5%',
        surfaces: ['glass', 'mirrors'],
        warnings: ['Avoid in direct sunlight']
      }
    ],
    tools: [
      {
        name: 'Squeegee',
        width: '12 inch',
        blade: 'rubber'
      },
      {
        name: 'Microfiber Cloth',
        colorCode: 'blue',
        quantity: 2
      }
    ],
    safety: {
      ppe: [],
      warnings: ['Use ladder safely for high windows']
    },
    standards: {
      visual: 'Crystal clear, streak-free',
      touch: 'Smooth, no residue',
      smell: 'No chemical odor after drying'
    },
    rooms: ['All Rooms']
  }
]

// Helper function to get tasks by frequency
export const getTasksByFrequency = (frequency) => {
  return enhancedCleaningTasks.filter(task => task.frequency === frequency)
}

// Helper function to get tasks by priority
export const getTasksByPriority = (priority) => {
  return enhancedCleaningTasks.filter(task => task.priority === priority)
}

// Helper function to get tasks by room
export const getTasksByRoom = (room) => {
  return enhancedCleaningTasks.filter(task => 
    task.rooms.includes(room) || task.rooms.includes('All Rooms')
  )
}

// Helper function to calculate adjusted time
export const calculateAdjustedTime = (task, isProfessional = false, modifiers = {}) => {
  const timeRange = isProfessional ? task.estimatedTime.professional : task.estimatedTime.amateur
  let baseTime = (timeRange.min + timeRange.max) / 2
  
  // Apply modifiers
  Object.entries(modifiers).forEach(([key, value]) => {
    if (task.estimatedTime.modifiers[key] && value) {
      baseTime *= task.estimatedTime.modifiers[key]
    }
  })
  
  return Math.round(baseTime)
}

// Frequency configuration
export const FREQUENCY_CONFIG = {
  DAILY: {
    label: 'Daily',
    color: 'primary',
    icon: 'mdi-calendar-today',
    description: 'Essential daily cleaning tasks'
  },
  WEEKLY: {
    label: 'Weekly',
    color: 'success',
    icon: 'mdi-calendar-week',
    description: 'Regular weekly maintenance'
  },
  MONTHLY: {
    label: 'Monthly',
    color: 'warning',
    icon: 'mdi-calendar-month',
    description: 'Deep cleaning monthly tasks'
  },
  QUARTERLY: {
    label: 'Quarterly',
    color: 'error',
    icon: 'mdi-calendar-blank-multiple',
    description: 'Seasonal deep cleaning'
  }
}

// Priority configuration
export const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    color: 'error',
    icon: 'mdi-alert-circle'
  },
  medium: {
    label: 'Medium Priority',
    color: 'warning',
    icon: 'mdi-alert'
  },
  low: {
    label: 'Low Priority',
    color: 'info',
    icon: 'mdi-information'
  }
}