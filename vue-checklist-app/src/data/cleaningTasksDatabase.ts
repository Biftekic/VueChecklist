// Comprehensive cleaning tasks database with room associations
export interface CleaningTask {
  id: number
  name: string
  description: string
  detailedSteps: string[]
  tips: string
  safety: string
  estimatedTime: number
  chemicals: string[]
  tools: string[]
  category: TaskCategory
  rooms: RoomType[]
}

export type TaskCategory = 
  | 'Floor Care'
  | 'Dusting'
  | 'Windows'
  | 'Waste Management'
  | 'Sanitization'
  | 'Detail Cleaning'
  | 'Kitchen Appliances'
  | 'Kitchen'
  | 'Kitchen Organization'
  | 'Bathroom'
  | 'Bedroom'
  | 'Bedroom Organization'
  | 'Electronics'
  | 'Living Room'
  | 'Organization'
  | 'Office'
  | 'Office Organization'
  | 'Laundry'
  | 'Garage'
  | 'Garage Organization'
  | 'Outdoor'
  | 'HVAC'
  | 'Deep Cleaning'
  | 'Furniture Care'
  | 'Maintenance'
  | 'Pet Care'
  | 'Child Care'
  | 'Fitness'

export type RoomType = 
  | 'Living Room'
  | 'Bedroom'
  | 'Guest Room'
  | 'Office'
  | 'Home Office'
  | 'Hallway'
  | 'Stairs'
  | 'Kitchen'
  | 'Bathroom'
  | 'Powder Room'
  | 'Entryway'
  | 'Laundry Room'
  | 'Garage'
  | 'Basement'
  | 'Patio'
  | 'Balcony'
  | 'Pantry'
  | 'Family Room'
  | 'Library'
  | 'Walk-in Closet'
  | 'Entertainment Center'
  | 'Shed'
  | 'Storage Room'
  | 'Workshop'
  | 'Deck'
  | 'Driveway'
  | 'Exterior'
  | 'All Carpeted Rooms'
  | 'Pet Areas'
  | 'Playroom'
  | 'Kids Bedroom'
  | 'Home Gym'
  | 'Attic'
  | 'All Rooms'

export const cleaningTasksDatabase: CleaningTask[] = [
  // Universal Tasks (can be used in any room)
  { id: 1, name: 'Vacuum carpet/rugs',
    description: "Thoroughly vacuum all carpeted areas including edges, corners, and under furniture where accessible. Use appropriate attachments for different surfaces.",
    detailedSteps: [
      "Check vacuum bag/canister",
      "Move lightweight furniture",
      "Vacuum edges with crevice tool",
      "Vacuum main areas in overlapping passes",
      "Replace furniture"
    ],
    tips: "Change direction on second pass for better dirt pickup",
    safety: "Check for small objects before vacuuming to prevent damage", estimatedTime: 15, chemicals: [], tools: ['Vacuum'], category: 'Floor Care', rooms: ['Living Room', 'Bedroom', 'Office', 'Hallway', 'Stairs'] },
  { id: 2, name: 'Mop hard floors',
    description: "Mop all hard floor surfaces using appropriate cleaning solution. Work from furthest corner toward exit to avoid stepping on wet floors.",
    detailedSteps: [
      "Sweep or vacuum first",
      "Prepare mop solution per label",
      "Mop in figure-8 pattern",
      "Change water when dirty",
      "Allow to air dry"
    ],
    tips: "Use microfiber mop for better cleaning and faster drying",
    safety: "Place wet floor signs, ensure proper ventilation", estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Mop', 'Bucket'], category: 'Floor Care', rooms: ['Kitchen', 'Bathroom', 'Hallway', 'Entryway', 'Laundry Room'] },
  { id: 3, name: 'Sweep floors',
    description: "Sweep all hard floors to remove loose dirt, debris, and dust before mopping or as standalone cleaning.",
    detailedSteps: [
      "Start from corners",
      "Sweep toward center",
      "Use dustpan to collect debris",
      "Dispose in trash",
      "Clean broom after use"
    ],
    tips: "Use push broom for large areas, angle broom for corners",
    safety: "Wear mask if area is very dusty", estimatedTime: 10, chemicals: [], tools: ['Broom', 'Dustpan'], category: 'Floor Care', rooms: ['Kitchen', 'Garage', 'Basement', 'Patio', 'Balcony'] },
  { id: 4, name: 'Dust surfaces and furniture',
    description: "Dust all surfaces including furniture, shelves, decorative items, and electronics. Work from top to bottom to prevent recontamination.",
    detailedSteps: [
      "Start with ceiling fans/lights",
      "Dust furniture tops",
      "Clean decorative items",
      "Wipe baseboards last",
      "Shake out duster outside"
    ],
    tips: "Use microfiber cloth slightly dampened for better dust capture",
    safety: "Use ladder safely for high areas, unplug electronics before dusting", estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth', 'Duster'], category: 'Dusting', rooms: ['All Rooms'] },
  { id: 5, name: 'Clean windows (interior)',
    description: "Clean interior windows for streak-free clarity. Includes glass, frames, and sills for complete window cleaning.",
    detailedSteps: [
      "Remove dust from sills",
      "Spray glass cleaner",
      "Wipe in Z-pattern",
      "Dry with lint-free cloth",
      "Clean window tracks"
    ],
    tips: "Clean on cloudy day to prevent streaking from quick drying",
    safety: "Ensure stable footing, never lean out of windows", estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 6, name: 'Clean windows (exterior)',
    description: "Clean exterior windows safely using proper equipment. Includes removing dirt, spots, and environmental buildup.",
    detailedSteps: [
      "Rinse with hose if possible",
      "Apply cleaner with extension tool",
      "Scrub if needed",
      "Squeegee top to bottom",
      "Wipe edges dry"
    ],
    tips: "Add dish soap to solution for extra cleaning power",
    safety: "Use proper ladder safety, never clean in bad weather", estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Ladder'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 7, name: 'Empty trash bins',
    description: "Empty all trash bins, replace liners, and clean bins as needed. Includes sanitizing bin surfaces.",
    detailedSteps: [
      "Collect all trash bags",
      "Take to disposal area",
      "Clean bin if needed",
      "Install new liner",
      "Return bin to position"
    ],
    tips: "Keep extra bags in bottom of bin for quick replacement",
    safety: "Wear gloves, watch for sharp objects", estimatedTime: 5, chemicals: [], tools: ['Trash bags'], category: 'Waste Management', rooms: ['All Rooms'] },
  { id: 8, name: 'Disinfect door handles',
    description: "Disinfect all door handles, knobs, and push plates to reduce germ transmission in high-touch areas.",
    detailedSteps: [
      "Spray disinfectant on cloth",
      "Wipe all sides of handle",
      "Let sit for contact time",
      "Wipe dry if needed",
      "Don't forget lock mechanisms"
    ],
    tips: "Pay attention to both sides of door handles",
    safety: "Use EPA-registered disinfectant, ensure ventilation", estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 9, name: 'Clean light switches',
    description: "Clean and disinfect all light switches and switch plates throughout the space.",
    detailedSteps: [
      "Turn off power if deep cleaning",
      "Spray cloth with cleaner",
      "Wipe switch and plate",
      "Clean edges and screws",
      "Dry thoroughly"
    ],
    tips: "Use cotton swabs for detailed cleaning around switches",
    safety: "Never spray directly on electrical components", estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 10, name: 'Clean baseboards',
    description: "Clean baseboards throughout the room, removing dust, scuff marks, and buildup along floor edges.",
    detailedSteps: [
      "Vacuum with brush attachment",
      "Wipe with damp cloth",
      "Remove scuff marks",
      "Dry with clean cloth",
      "Check behind furniture"
    ],
    tips: "Use magic eraser for stubborn scuff marks",
    safety: "Protect knees when working at floor level", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum attachment'], category: 'Detail Cleaning', rooms: ['All Rooms'] },
  
  // Kitchen Specific
  { id: 11, name: 'Clean stovetop',
    description: "Deep clean stovetop including burners, grates, and control knobs. Remove grease and food residue for safe cooking surface.",
    detailedSteps: [
      "Remove grates/burners if possible",
      "Apply degreaser",
      "Let dwell 5 minutes",
      "Scrub thoroughly",
      "Clean control knobs",
      "Reassemble when dry"
    ],
    tips: "Soak removable parts in hot soapy water while cleaning stovetop",
    safety: "Ensure stove is completely cool, avoid mixing chemicals", estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Sponge', 'Scraper'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 12, name: 'Clean oven (interior)',
    description: "Clean oven interior including racks, walls, and door. Remove baked-on grease and food spillage.",
    detailedSteps: [
      "Remove racks",
      "Apply oven cleaner",
      "Let dwell per instructions",
      "Scrub walls and bottom",
      "Clean door and glass",
      "Replace clean racks"
    ],
    tips: "Clean racks in bathtub with dish soap for easier cleaning",
    safety: "Use gloves and eye protection, ensure excellent ventilation", estimatedTime: 30, chemicals: ['Oven cleaner'], tools: ['Sponge', 'Scraper'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 13, name: 'Clean oven (exterior)',
    description: "Clean oven exterior including control panel, handles, and exterior door for spotless appearance.",
    detailedSteps: [
      "Wipe control panel gently",
      "Clean door exterior",
      "Polish handles",
      "Clean sides if accessible",
      "Buff stainless steel"
    ],
    tips: "Use stainless steel cleaner in direction of grain",
    safety: "Avoid excess moisture on control panel", estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 14, name: 'Clean microwave (inside and out)',
    description: "Clean microwave inside and out, removing food splatters and odors for hygienic food preparation.",
    detailedSteps: [
      "Steam with water/lemon 2 minutes",
      "Remove turntable",
      "Wipe interior walls",
      "Clean door and seals",
      "Clean exterior",
      "Replace turntable"
    ],
    tips: "Steam cleaning loosens stuck-on food for easier removal",
    safety: "Let steam settle before opening door to avoid burns", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 15, name: 'Clean refrigerator (exterior)',
    description: "Clean refrigerator exterior including handles, top, and sides. Special attention to stainless steel surfaces.",
    detailedSteps: [
      "Clear top of fridge",
      "Dust top and back coils",
      "Clean doors and handles",
      "Wipe sides",
      "Clean door seals",
      "Polish if stainless"
    ],
    tips: "Clean coils every 6 months for efficiency",
    safety: "Don't use abrasive cleaners on stainless steel", estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 16, name: 'Clean refrigerator (interior)',
    description: "Deep clean refrigerator interior including shelves, drawers, and walls. Organize and check expiration dates.",
    detailedSteps: [
      "Remove all food",
      "Check expirations",
      "Remove shelves/drawers",
      "Wash removable parts",
      "Wipe interior walls",
      "Dry and reassemble",
      "Return food organized"
    ],
    tips: "Use baking soda solution for odor removal",
    safety: "Work quickly to maintain food safety temperatures", estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 17, name: 'Clean dishwasher',
    description: "Clean dishwasher including filter, spray arms, and door seals for optimal performance.",
    detailedSteps: [
      "Empty dishwasher",
      "Remove bottom dish rack",
      "Clean filter",
      "Check spray arms",
      "Wipe door seals",
      "Run cleaning cycle"
    ],
    tips: "Run monthly cleaning cycle with dishwasher cleaner",
    safety: "Check filter for broken glass or sharp objects", estimatedTime: 10, chemicals: ['Dishwasher cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 18, name: 'Clean sink and faucet',
    description: "Clean and sanitize kitchen sink and faucet including drain and garbage disposal if present.",
    detailedSteps: [
      "Clear sink completely",
      "Scrub basin with cleanser",
      "Clean faucet and handles",
      "Sanitize drain",
      "Polish faucet",
      "Run disposal with ice"
    ],
    tips: "Use old toothbrush for faucet crevices",
    safety: "Never put hand in disposal", estimatedTime: 10, chemicals: ['Sink cleaner', 'Descaler'], tools: ['Sponge', 'Brush'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 19, name: 'Clean countertops',
    description: "Clean and sanitize all kitchen countertops, removing stains and ensuring food-safe surfaces.",
    detailedSteps: [
      "Clear countertops",
      "Wipe crumbs into sink",
      "Apply appropriate cleaner",
      "Scrub if needed",
      "Rinse if required",
      "Dry completely"
    ],
    tips: "Different countertop materials need different cleaners",
    safety: "Use food-safe cleaners in food prep areas", estimatedTime: 10, chemicals: ['Kitchen cleaner'], tools: ['Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 20, name: 'Clean cabinet fronts',
    description: "Clean cabinet fronts removing fingerprints, grease, and food splatters from doors and frames.",
    detailedSteps: [
      "Dust cabinet tops",
      "Apply wood/appropriate cleaner",
      "Wipe doors top to bottom",
      "Clean handles/knobs",
      "Clean frames",
      "Buff dry"
    ],
    tips: "Pay extra attention to cabinets near stove",
    safety: "Test cleaner in hidden area first", estimatedTime: 15, chemicals: ['Wood cleaner'], tools: ['Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 21, name: 'Clean inside cabinets',
    description: "Organize and clean inside kitchen cabinets, checking for expired items and improving organization.",
    detailedSteps: [
      "Empty one cabinet at a time",
      "Check expiration dates",
      "Vacuum crumbs",
      "Wipe shelves",
      "Organize items",
      "Adjust shelves if needed"
    ],
    tips: "Use shelf liners for easier future cleaning",
    safety: "Be careful with heavy items on high shelves", estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 22, name: 'Clean backsplash',
    description: "Clean kitchen backsplash removing grease splatters and food residue from tiles or other surfaces.",
    detailedSteps: [
      "Apply degreaser",
      "Let dwell 2 minutes",
      "Scrub grout lines",
      "Wipe tiles clean",
      "Rinse if needed",
      "Dry to prevent water spots"
    ],
    tips: "Use grout brush for deep cleaning grout lines",
    safety: "Protect countertops from cleaning products", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 23, name: 'Clean range hood and filter',
    description: "Clean range hood and filter to maintain proper ventilation and remove grease buildup.",
    detailedSteps: [
      "Remove filter if possible",
      "Soak filter in degreaser",
      "Wipe hood interior",
      "Clean exterior surfaces",
      "Clean fan blades if accessible",
      "Replace clean filter"
    ],
    tips: "Replace or clean filter monthly for best performance",
    safety: "Turn off power at breaker for deep cleaning", estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Brush', 'Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 24, name: 'Clean garbage disposal',
    description: "Clean and deodorize garbage disposal to eliminate odors and maintain proper function.",
    detailedSteps: [
      "Run hot water",
      "Add ice cubes and salt",
      "Run disposal",
      "Add citrus peels",
      "Run again with cold water",
      "Wipe rubber gasket"
    ],
    tips: "Use disposal cleaning tablets monthly",
    safety: "Never put hand in disposal, always run water", estimatedTime: 5, chemicals: ['Disposal cleaner'], tools: [], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 25, name: 'Organize pantry',
    description: "Organize pantry including checking expiration dates, wiping shelves, and improving storage efficiency.",
    detailedSteps: [
      "Remove all items",
      "Check dates",
      "Vacuum/wipe shelves",
      "Group similar items",
      "Label containers",
      "Create inventory list"
    ],
    tips: "Use FIFO (first in, first out) system",
    safety: "Step stool for high shelves", estimatedTime: 20, chemicals: [], tools: [], category: 'Kitchen Organization', rooms: ['Kitchen', 'Pantry'] },
  { id: 26, name: 'Clean small appliances',
    description: "Clean small kitchen appliances including toaster, coffee maker, blender, and other countertop devices.",
    detailedSteps: [
      "Unplug all appliances",
      "Clean exterior surfaces",
      "Remove crumb trays",
      "Clean removable parts",
      "Wipe cords",
      "Dry before use"
    ],
    tips: "Check manufacturer instructions for specific cleaning",
    safety: "Never immerse electrical components in water", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 27, name: 'Descale coffee maker',
    description: "Descale coffee maker to remove mineral buildup and improve coffee taste and machine performance.",
    detailedSteps: [
      "Empty water reservoir",
      "Fill with descaling solution",
      "Run brew cycle",
      "Let sit 15 minutes",
      "Run 2-3 rinse cycles",
      "Wash carafe"
    ],
    tips: "Descale monthly in hard water areas",
    safety: "Use proper descaling solution, not just vinegar", estimatedTime: 15, chemicals: ['Descaler'], tools: [], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 28, name: 'Clean toaster/toaster oven',
    description: "Clean toaster or toaster oven including crumb tray, interior, and heating elements for fire safety.",
    detailedSteps: [
      "Unplug and cool completely",
      "Remove crumb tray",
      "Shake out crumbs",
      "Wipe interior carefully",
      "Clean glass door",
      "Clean exterior"
    ],
    tips: "Clean crumb tray weekly to prevent fires",
    safety: "Never use metal objects near heating elements", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Brush', 'Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  
  // Bathroom Specific
  { id: 29, name: 'Clean and disinfect toilet',
    description: "Thoroughly clean and disinfect toilet including bowl, seat, lid, and base. Ensure complete sanitization of all surfaces.",
    detailedSteps: [
      "Apply toilet bowl cleaner",
      "Let dwell 10 minutes",
      "Scrub bowl with brush",
      "Wipe seat and lid",
      "Clean base and behind",
      "Disinfect handle",
      "Mop around base"
    ],
    tips: "Use pumice stone for stubborn mineral deposits",
    safety: "Never mix toilet cleaner with other chemicals, use gloves", estimatedTime: 15, chemicals: ['Toilet bowl cleaner', 'Disinfectant'], tools: ['Toilet brush', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 30, name: 'Clean shower/bathtub',
    description: "Deep clean shower and bathtub removing soap scum, mildew, and mineral deposits from all surfaces.",
    detailedSteps: [
      "Spray all surfaces",
      "Let cleaner dwell",
      "Scrub walls top to bottom",
      "Clean fixtures",
      "Scrub tub/floor",
      "Rinse thoroughly",
      "Squeegee dry"
    ],
    tips: "Heat bathroom first - warm surfaces clean easier",
    safety: "Ensure ventilation, use non-slip protection", estimatedTime: 20, chemicals: ['Tub cleaner', 'Mildew remover'], tools: ['Scrub brush', 'Sponge'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 31, name: 'Clean shower doors/curtain',
    description: "Clean shower doors or curtain removing soap scum, water spots, and mildew for clear, hygienic shower enclosure.",
    detailedSteps: [
      "Remove curtain if fabric",
      "Spray glass/curtain",
      "Let dwell 5 minutes",
      "Scrub thoroughly",
      "Clean door tracks",
      "Rinse well",
      "Dry to prevent spots"
    ],
    tips: "Use dryer sheets on glass doors to repel water",
    safety: "Be careful with glass doors, support while cleaning", estimatedTime: 10, chemicals: ['Glass cleaner', 'Mildew remover'], tools: ['Squeegee', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 32, name: 'Clean bathroom sink and counter',
    description: "Clean bathroom sink, faucet, and counter removing toothpaste, soap residue, and ensuring sanitized surfaces.",
    detailedSteps: [
      "Clear counter items",
      "Spray sink and counter",
      "Scrub sink basin",
      "Clean faucet details",
      "Wipe counter",
      "Clean items before replacing",
      "Polish faucet"
    ],
    tips: "Use old toothbrush for faucet details",
    safety: "Store personal items away from cleaning products", estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 33, name: 'Clean bathroom mirror',
    description: "Clean bathroom mirror for streak-free reflection, including frame and any attached lighting.",
    detailedSteps: [
      "Dust mirror and frame",
      "Spray glass cleaner",
      "Wipe in circular motion",
      "Dry with microfiber",
      "Clean frame",
      "Check for spots"
    ],
    tips: "Use newspaper for streak-free finish",
    safety: "Be careful around light fixtures", estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 34, name: 'Clean tile grout',
    description: "Deep clean tile grout removing mold, mildew, and discoloration to restore original appearance.",
    detailedSteps: [
      "Apply grout cleaner",
      "Let dwell 10 minutes",
      "Scrub with grout brush",
      "Focus on problem areas",
      "Rinse thoroughly",
      "Dry completely",
      "Apply sealer if needed"
    ],
    tips: "Use baking soda paste for eco-friendly option",
    safety: "Ensure excellent ventilation with grout cleaners", estimatedTime: 30, chemicals: ['Grout cleaner'], tools: ['Grout brush'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 35, name: 'Clean exhaust fan',
    description: "Clean bathroom exhaust fan to maintain proper ventilation and prevent mold growth.",
    detailedSteps: [
      "Turn off at breaker",
      "Remove cover",
      "Vacuum fan blades",
      "Wipe blades clean",
      "Clean cover in sink",
      "Dry and reinstall"
    ],
    tips: "Clean quarterly for best performance",
    safety: "Always turn off power first", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 36, name: 'Replace towels',
    description: "Replace bathroom towels with fresh, clean ones and arrange decoratively if desired.",
    detailedSteps: [
      "Remove used towels",
      "Check towel bars are clean",
      "Hang fresh towels",
      "Arrange hand towels",
      "Place washcloths",
      "Style decoratively"
    ],
    tips: "Fold towels in thirds for spa-like appearance",
    safety: "Ensure towel bars are secure", estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 37, name: 'Restock toiletries',
    description: "Restock bathroom toiletries including toilet paper, tissues, soap, and other essentials.",
    detailedSteps: [
      "Check all supplies",
      "Note what's needed",
      "Refill soap dispensers",
      "Stock toilet paper",
      "Replace tissues",
      "Check first aid supplies"
    ],
    tips: "Keep backup supplies easily accessible",
    safety: "Store chemicals safely away from children", estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 38, name: 'Clean medicine cabinet',
    description: "Clean and organize medicine cabinet, checking expiration dates and improving organization.",
    detailedSteps: [
      "Remove all items",
      "Check expiration dates",
      "Clean shelves and mirror",
      "Organize by category",
      "Dispose expired items safely",
      "Restock neatly"
    ],
    tips: "Keep frequently used items at eye level",
    safety: "Dispose of medications properly, not in trash", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 39, name: 'Wash bath mats',
    description: "Wash bathroom rugs and mats to eliminate odors, bacteria, and moisture buildup.",
    detailedSteps: [
      "Shake out loose dirt",
      "Check care labels",
      "Pretreat stains",
      "Wash in machine",
      "Dry thoroughly",
      "Place back when dry"
    ],
    tips: "Add vinegar to wash for odor elimination",
    safety: "Ensure mats are completely dry to prevent mold", estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 40, name: 'Clean toilet brush holder',
    description: "Clean and disinfect toilet brush holder to prevent bacterial growth and odors.",
    detailedSteps: [
      "Remove brush",
      "Empty holder",
      "Disinfect holder",
      "Clean brush in toilet",
      "Add disinfectant to holder",
      "Replace brush when dry"
    ],
    tips: "Replace toilet brush every 6 months",
    safety: "Use gloves and disinfectant", estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 41, name: 'Descale showerhead',
    description: "Descale showerhead and faucets to improve water flow and remove mineral buildup.",
    detailedSteps: [
      "Remove showerhead if possible",
      "Soak in descaler/vinegar",
      "Scrub with brush",
      "Clean faucet aerators",
      "Rinse thoroughly",
      "Reinstall fixtures"
    ],
    tips: "Use plastic bag method if can't remove showerhead",
    safety: "Don't overtighten when reinstalling", estimatedTime: 10, chemicals: ['Descaler'], tools: ['Brush'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 42, name: 'Clean bathroom scale',
    description: "Clean bathroom scale for accurate readings and hygienic use.",
    detailedSteps: [
      "Remove batteries if digital",
      "Wipe top surface",
      "Clean underside",
      "Clean feet/wheels",
      "Disinfect surface",
      "Test accuracy"
    ],
    tips: "Calibrate after cleaning if possible",
    safety: "Keep water away from electronics", estimatedTime: 3, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  
  // Bedroom Specific
  { id: 43, name: 'Make bed/change linens',
    description: "Make bed properly with hospital corners or change linens completely for fresh, inviting appearance.",
    detailedSteps: [
      "Strip bed if changing",
      "Air out mattress",
      "Apply fitted sheet",
      "Add flat sheet",
      "Place duvet/comforter",
      "Arrange pillows",
      "Add decorative elements"
    ],
    tips: "Iron pillowcases for luxury hotel look",
    safety: "Lift mattress corners properly to avoid strain", estimatedTime: 10, chemicals: [], tools: [], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 44, name: 'Dust nightstands',
    description: "Dust bedroom furniture including nightstands, dressers, and headboard for allergen-free environment.",
    detailedSteps: [
      "Start with highest surfaces",
      "Dust headboard",
      "Clean nightstands",
      "Dust dresser and mirror",
      "Wipe lamps and shades",
      "Don't forget under bed"
    ],
    tips: "Use fabric softener sheet to repel dust",
    safety: "Move furniture carefully to avoid injury", estimatedTime: 5, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 45, name: 'Clean under bed',
    description: "Vacuum under bed removing dust bunnies, allergens, and lost items for cleaner air quality.",
    detailedSteps: [
      "Move items stored under bed",
      "Use vacuum extension",
      "Get corners and edges",
      "Check for lost items",
      "Clean items before returning",
      "Consider bed risers for easier access"
    ],
    tips: "Do this monthly for better air quality",
    safety: "Don't strain reaching, move bed if needed", estimatedTime: 10, chemicals: [], tools: ['Vacuum', 'Duster'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 46, name: 'Organize closet',
    description: "Clean bedroom mirrors and glass surfaces for clear reflections and bright room appearance.",
    detailedSteps: [
      "Dust mirror frame",
      "Spray glass cleaner",
      "Wipe in S-pattern",
      "Dry with lint-free cloth",
      "Clean any glass furniture",
      "Check for streaks"
    ],
    tips: "Clean mirrors last to avoid re-dusting",
    safety: "Support large mirrors while cleaning", estimatedTime: 30, chemicals: [], tools: [], category: 'Bedroom Organization', rooms: ['Bedroom', 'Walk-in Closet'] },
  { id: 47, name: 'Dust dresser and decor',
    description: "Organize closet including sorting clothes, organizing shoes, and improving storage efficiency.",
    detailedSteps: [
      "Remove items from floor",
      "Sort by season/frequency",
      "Organize by type/color",
      "Arrange shoes",
      "Use organizers",
      "Donate unused items"
    ],
    tips: "Face hangers same direction, reverse when worn",
    safety: "Use step stool for high shelves", estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 48, name: 'Clean ceiling fan',
    description: "Clean ceiling fan blades and light fixtures to improve air quality and brightness.",
    detailedSteps: [
      "Turn off at switch",
      "Cover bed with sheet",
      "Clean each blade top/bottom",
      "Wipe motor housing",
      "Clean light fixtures",
      "Remove protective sheet"
    ],
    tips: "Use pillowcase to trap dust from blades",
    safety: "Use stable ladder, never stand on bed", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Living Room'] },
  { id: 49, name: 'Vacuum/clean mattress',
    description: "Wash curtains or clean blinds to remove dust, allergens, and improve room appearance.",
    detailedSteps: [
      "Vacuum curtains/blinds first",
      "Check care labels",
      "Remove if washing",
      "Clean blinds slat by slat",
      "Rehang curtains when dry",
      "Adjust for even hanging"
    ],
    tips: "Use tongs with microfiber for blind cleaning",
    safety: "Support curtain rod when removing curtains", estimatedTime: 15, chemicals: ['Fabric cleaner'], tools: ['Vacuum'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 50, name: 'Clean lamp shades',
    description: "Vacuum or clean bedroom rugs thoroughly to remove dirt, dust, and allergens.",
    detailedSteps: [
      "Pick up small items",
      "Vacuum both sides if possible",
      "Treat any stains",
      "Use carpet freshener",
      "Vacuum thoroughly",
      "Rotate rug for even wear"
    ],
    tips: "Vacuum slowly for better dirt removal",
    safety: "Secure rug edges to prevent tripping", estimatedTime: 10, chemicals: [], tools: ['Vacuum attachment', 'Duster'], category: 'Bedroom', rooms: ['Bedroom', 'Living Room'] },
  
  // Living Room Specific
  { id: 51, name: 'Vacuum sofa and cushions',
    description: "Dust and clean lamps and lampshades to improve lighting and remove allergens.",
    detailedSteps: [
      "Unplug lamps",
      "Remove shades if possible",
      "Vacuum fabric shades",
      "Wipe hard shades",
      "Clean lamp base",
      "Replace bulbs if needed"
    ],
    tips: "Use lint roller on fabric shades",
    safety: "Let bulbs cool before handling", estimatedTime: 15, chemicals: [], tools: ['Vacuum attachment'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 52, name: 'Clean TV screen',
    description: "Dust and clean entertainment center including TV, gaming consoles, and cable management.",
    detailedSteps: [
      "Turn off all electronics",
      "Dust TV screen gently",
      "Clean console vents",
      "Organize cables",
      "Dust shelves and items",
      "Clean remote controls"
    ],
    tips: "Use microfiber cloth designed for electronics",
    safety: "Never spray liquids directly on electronics", estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'], category: 'Electronics', rooms: ['Living Room', 'Bedroom', 'Family Room'] },
  { id: 53, name: 'Dust entertainment center',
    description: "Clean TV screen and other electronic displays for optimal viewing without damage.",
    detailedSteps: [
      "Turn off and cool",
      "Dust with dry microfiber",
      "Apply screen cleaner to cloth",
      "Wipe gently in circles",
      "Dry with clean cloth",
      "Clean TV frame"
    ],
    tips: "Never use paper towels on screens",
    safety: "Avoid pressure on LCD/LED screens", estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 54, name: 'Clean remote controls',
    description: "Vacuum upholstered furniture including cushions, crevices, and under cushions for cleanliness.",
    detailedSteps: [
      "Remove cushions",
      "Vacuum frame",
      "Clean crevices",
      "Vacuum all cushion sides",
      "Check for items",
      "Treat stains if needed",
      "Replace cushions fluffed"
    ],
    tips: "Use upholstery attachment to avoid damage",
    safety: "Check for loose change or sharp objects first", estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Electronics', rooms: ['Living Room', 'Bedroom', 'Family Room'] },
  { id: 55, name: 'Organize books and magazines',
    description: "Fluff and arrange decorative pillows and cushions for inviting appearance.",
    detailedSteps: [
      "Remove all pillows",
      "Fluff each thoroughly",
      "Check for stains",
      "Arrange by size",
      "Create symmetry",
      "Add throw blankets"
    ],
    tips: "Karate chop decorative pillows for designer look",
    safety: "Check zippers for damage", estimatedTime: 10, chemicals: [], tools: [], category: 'Organization', rooms: ['Living Room', 'Office', 'Library'] },
  { id: 56, name: 'Clean coffee table',
    description: "Dust books, shelves, and decorative items maintaining organization and cleanliness.",
    detailedSteps: [
      "Remove items from shelf",
      "Dust shelf thoroughly",
      "Clean each item",
      "Dust book spines",
      "Reorganize thoughtfully",
      "Style decoratively"
    ],
    tips: "Use vacuum brush for book tops",
    safety: "Support heavy items when moving", estimatedTime: 5, chemicals: ['Glass cleaner', 'Wood polish'], tools: ['Cloth'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 57, name: 'Fluff and arrange pillows',
    description: "Clean coffee and end tables including glass, wood, or other surfaces.",
    detailedSteps: [
      "Clear table completely",
      "Dust surface",
      "Apply appropriate cleaner",
      "Clean table legs",
      "Polish if needed",
      "Replace items organized"
    ],
    tips: "Use coasters to prevent future rings",
    safety: "Lift items don't drag to prevent scratches", estimatedTime: 5, chemicals: [], tools: [], category: 'Living Room', rooms: ['Living Room', 'Bedroom'] },
  { id: 58, name: 'Clean fireplace/mantel',
    description: "Vacuum or clean area rugs and runners thoroughly on both sides if possible.",
    detailedSteps: [
      "Remove furniture if possible",
      "Shake out if small",
      "Vacuum top thoroughly",
      "Flip and vacuum back",
      "Treat stains",
      "Return to position"
    ],
    tips: "Vacuum in different directions for best results",
    safety: "Get help moving heavy furniture", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Brush', 'Vacuum'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  
  // Office Specific
  { id: 59, name: 'Clean computer monitor',
    description: "Clean remote controls and gaming controllers removing germs and buildup.",
    detailedSteps: [
      "Remove batteries",
      "Wipe with disinfectant",
      "Clean between buttons",
      "Clean battery compartment",
      "Replace batteries",
      "Test functionality"
    ],
    tips: "Use cotton swabs for button crevices",
    safety: "Don't oversaturate with liquid", estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 60, name: 'Clean keyboard and mouse',
    description: "Organize magazines, books, and media for tidy, accessible storage.",
    detailedSteps: [
      "Sort by category",
      "Check dates on magazines",
      "Recycle old issues",
      "Organize books by preference",
      "Arrange media items",
      "Create reading station"
    ],
    tips: "Keep current items accessible",
    safety: "Don't overload shelves", estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Compressed air', 'Cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 61, name: 'Organize desk and drawers',
    description: "Clean computer keyboard removing crumbs, dust, and bacteria for hygienic use.",
    detailedSteps: [
      "Turn keyboard upside down",
      "Shake out debris",
      "Use compressed air",
      "Wipe keys with alcohol",
      "Clean between keys",
      "Clean palm rest"
    ],
    tips: "Photo keyboard before deep cleaning for key placement",
    safety: "Unplug or turn off before cleaning", estimatedTime: 20, chemicals: [], tools: [], category: 'Office Organization', rooms: ['Office', 'Home Office'] },
  { id: 62, name: 'Dust computer equipment',
    description: "Clean computer monitor and screens for clear viewing without damage.",
    detailedSteps: [
      "Power off monitor",
      "Dust with microfiber",
      "Apply cleaner to cloth",
      "Wipe in circles",
      "Clean monitor base",
      "Clean cables"
    ],
    tips: "Clean weekly to reduce eye strain",
    safety: "Never spray liquid on screen", estimatedTime: 10, chemicals: [], tools: ['Compressed air', 'Microfiber cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 63, name: 'Clean phone and accessories',
    description: "Organize desk drawers improving efficiency and reducing clutter.",
    detailedSteps: [
      "Empty one drawer",
      "Sort items",
      "Clean drawer",
      "Use organizers",
      "Return needed items",
      "Repeat for each drawer"
    ],
    tips: "Keep frequently used items in top drawer",
    safety: "Dispose of old batteries properly", estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 64, name: 'Shred documents',
    description: "Dust and organize office shelves maintaining professional appearance.",
    detailedSteps: [
      "Remove all items",
      "Dust shelf thoroughly",
      "Clean items",
      "Reorganize by use",
      "Label if helpful",
      "Style professionally"
    ],
    tips: "Keep reference materials at eye level",
    safety: "Use ladder for high shelves", estimatedTime: 15, chemicals: [], tools: ['Shredder'], category: 'Office Organization', rooms: ['Office', 'Home Office'] },
  { id: 65, name: 'Organize cables and cords',
    description: "Clean office chair including wheels, armrests, and upholstery for comfort and hygiene.",
    detailedSteps: [
      "Vacuum seat and back",
      "Clean armrests",
      "Wipe adjustment levers",
      "Clean wheel axles",
      "Lubricate if needed",
      "Adjust ergonomically"
    ],
    tips: "Remove hair from wheels with scissors",
    safety: "Lock wheels when cleaning", estimatedTime: 10, chemicals: [], tools: ['Cable ties'], category: 'Office Organization', rooms: ['Office', 'Entertainment Center'] },
  
  // Laundry Room Specific
  { id: 66, name: 'Clean washing machine',
    description: "Shred and organize documents maintaining security and reducing clutter.",
    detailedSteps: [
      "Sort documents",
      "Identify sensitive items",
      "Shred confidential papers",
      "File important documents",
      "Recycle non-sensitive",
      "Update filing system"
    ],
    tips: "Shred anything with personal information",
    safety: "Keep fingers away from shredder opening", estimatedTime: 10, chemicals: ['Washing machine cleaner'], tools: ['Cloth'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 67, name: 'Clean dryer and lint trap',
    description: "Clean and organize filing cabinets for efficient document management.",
    detailedSteps: [
      "Review file categories",
      "Purge old files",
      "Clean drawer slides",
      "Reorganize folders",
      "Label clearly",
      "Create index"
    ],
    tips: "Use color coding for categories",
    safety: "Open one drawer at a time to prevent tipping", estimatedTime: 10, chemicals: [], tools: ['Vacuum', 'Brush'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 68, name: 'Clean laundry sink',
    description: "Sanitize office phone and accessories for hygienic communication.",
    detailedSteps: [
      "Unplug if corded",
      "Wipe handset",
      "Clean keypad",
      "Disinfect mouthpiece",
      "Clean cradle",
      "Wipe cord"
    ],
    tips: "Clean weekly during flu season",
    safety: "Use appropriate disinfectant", estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 69, name: 'Organize laundry supplies',
    description: "Clean washing machine including drum, dispensers, and seals to prevent odors and improve performance.",
    detailedSteps: [
      "Run empty hot cycle",
      "Clean dispensers",
      "Wipe door seal",
      "Clean filter",
      "Wipe exterior",
      "Leave door open to dry"
    ],
    tips: "Run cleaning cycle monthly",
    safety: "Check pockets before washing", estimatedTime: 10, chemicals: [], tools: [], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 70, name: 'Clean dryer vent',
    description: "Clean dryer including lint trap, vent, and drum for fire safety and efficiency.",
    detailedSteps: [
      "Clean lint trap",
      "Vacuum trap slot",
      "Wipe drum",
      "Check vent outside",
      "Clean exterior",
      "Level if needed"
    ],
    tips: "Clean vent annually for safety",
    safety: "Lint buildup is fire hazard", estimatedTime: 20, chemicals: [], tools: ['Vent brush', 'Vacuum'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 71, name: 'Wipe down folding area',
    description: "Organize laundry supplies for efficient washing and space utilization.",
    detailedSteps: [
      "Check supply levels",
      "Dispose empty containers",
      "Organize by type",
      "Clean storage area",
      "Check expiration dates",
      "Make shopping list"
    ],
    tips: "Keep stain removers accessible",
    safety: "Store chemicals safely", estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Laundry', rooms: ['Laundry Room'] },
  
  // Garage Specific
  { id: 72, name: 'Sweep garage floor',
    description: "Clean laundry sink and counter for multipurpose use and hygiene.",
    detailedSteps: [
      "Clear items",
      "Scrub sink basin",
      "Clean faucet",
      "Wipe counter",
      "Organize supplies",
      "Check drain flow"
    ],
    tips: "Use sink for pre-treating stains",
    safety: "Don't mix cleaning chemicals", estimatedTime: 20, chemicals: [], tools: ['Broom', 'Dustpan'], category: 'Garage', rooms: ['Garage'] },
  { id: 73, name: 'Remove oil stains',
    description: "Sweep and mop laundry room floor removing lint, detergent spills, and dust.",
    detailedSteps: [
      "Move portable items",
      "Sweep thoroughly",
      "Check behind machines",
      "Mop with appropriate cleaner",
      "Clean baseboards",
      "Replace items"
    ],
    tips: "Check for leaks while cleaning",
    safety: "Unplug machines if moving", estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Scrub brush'], category: 'Garage', rooms: ['Garage', 'Driveway'] },
  { id: 74, name: 'Organize tools',
    description: "Clean and organize laundry baskets and hampers to prevent odor and bacteria buildup.",
    detailedSteps: [
      "Empty completely",
      "Wipe interior",
      "Disinfect if needed",
      "Clean exterior",
      "Air dry completely",
      "Organize by type"
    ],
    tips: "Use separate baskets for colors and whites",
    safety: "Check for sharp objects", estimatedTime: 30, chemicals: [], tools: [], category: 'Garage Organization', rooms: ['Garage', 'Shed'] },
  { id: 75, name: 'Clean garage door',
    description: "Clean and organize coat closet or hooks for seasonal use and accessibility.",
    detailedSteps: [
      "Remove all items",
      "Sort by season",
      "Clean hooks/rod",
      "Vacuum floor",
      "Organize by family member",
      "Store off-season items"
    ],
    tips: "Keep frequently used items at easy height",
    safety: "Check pockets before storing", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Hose'], category: 'Garage', rooms: ['Garage'] },
  { id: 76, name: 'Wipe down shelving',
    description: "Clean and organize shoe storage preventing dirt tracking and odors.",
    detailedSteps: [
      "Remove all shoes",
      "Clean storage area",
      "Sort shoes",
      "Clean dirty shoes",
      "Use deodorizer",
      "Organize by frequency"
    ],
    tips: "Keep door mat for wiping shoes",
    safety: "Check for spiders in stored shoes", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Garage', rooms: ['Garage', 'Storage Room'] },
  { id: 77, name: 'Clean workbench',
    description: "Vacuum or clean entry mats and rugs for cleanliness and safety.",
    detailedSteps: [
      "Shake out mats outside",
      "Vacuum both sides",
      "Scrub if needed",
      "Allow to dry",
      "Apply protector spray",
      "Ensure flat placement"
    ],
    tips: "Have seasonal mats for weather",
    safety: "Ensure mats don't create trip hazard", estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Garage', rooms: ['Garage', 'Workshop'] },
  
  // Outdoor/Patio Specific
  { id: 78, name: 'Sweep patio/deck',
    description: "Clean entry door and frame including glass, hardware, and threshold.",
    detailedSteps: [
      "Dust door frame",
      "Clean door both sides",
      "Polish hardware",
      "Clean threshold",
      "Wash glass if present",
      "Check weatherstripping"
    ],
    tips: "Oil hinges if squeaky",
    safety: "Prop door open safely", estimatedTime: 15, chemicals: [], tools: ['Broom'], category: 'Outdoor', rooms: ['Patio', 'Deck', 'Balcony'] },
  { id: 79, name: 'Clean outdoor furniture',
    description: "Organize mail and package area to prevent clutter and lost items.",
    detailedSteps: [
      "Sort accumulated mail",
      "Shred junk mail",
      "File important items",
      "Create system",
      "Clean surface",
      "Set up recycling"
    ],
    tips: "Deal with mail immediately",
    safety: "Shred sensitive information", estimatedTime: 20, chemicals: ['Outdoor cleaner'], tools: ['Cloth', 'Hose'], category: 'Outdoor', rooms: ['Patio', 'Deck', 'Balcony'] },
  { id: 80, name: 'Clean grill',
    description: "Clean and organize umbrella stand or storage for wet weather readiness.",
    detailedSteps: [
      "Remove umbrellas",
      "Clean stand/storage",
      "Check umbrellas work",
      "Dry thoroughly",
      "Organize by size",
      "Add drip tray"
    ],
    tips: "Keep mini umbrella in car",
    safety: "Ensure umbrellas dry to prevent mold", estimatedTime: 30, chemicals: ['Grill cleaner'], tools: ['Grill brush', 'Scraper'], category: 'Outdoor', rooms: ['Patio', 'Deck'] },
  { id: 81, name: 'Power wash surfaces',
    description: "Sweep garage floor removing dirt, leaves, and debris for cleaner space.",
    detailedSteps: [
      "Open garage door",
      "Move vehicles if possible",
      "Sweep from back forward",
      "Focus on corners",
      "Dispose of debris",
      "Check for leaks"
    ],
    tips: "Use leaf blower for quick cleaning",
    safety: "Wear mask if dusty", estimatedTime: 45, chemicals: ['Pressure wash solution'], tools: ['Pressure washer'], category: 'Outdoor', rooms: ['Driveway', 'Patio', 'Deck'] },
  { id: 82, name: 'Clean outdoor cushions',
    description: "Organize tools and equipment for safety and efficiency.",
    detailedSteps: [
      "Gather all tools",
      "Sort by type",
      "Clean dirty tools",
      "Check for damage",
      "Organize on pegboard",
      "Label storage"
    ],
    tips: "Keep frequently used tools accessible",
    safety: "Lock away dangerous tools", estimatedTime: 15, chemicals: ['Fabric cleaner'], tools: ['Brush', 'Hose'], category: 'Outdoor', rooms: ['Patio', 'Deck'] },
  { id: 83, name: 'Clean outdoor windows',
    description: "Clean garage door and windows for better appearance and function.",
    detailedSteps: [
      "Rinse with hose",
      "Apply cleaner",
      "Scrub if needed",
      "Clean windows",
      "Rinse thoroughly",
      "Check door operation"
    ],
    tips: "Lubricate door tracks annually",
    safety: "Disconnect opener when cleaning", estimatedTime: 20, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Ladder'], category: 'Outdoor', rooms: ['Exterior'] },
  
  // Specialty/Deep Cleaning
  { id: 84, name: 'Clean air vents',
    description: "Organize sports equipment and recreational items for easy access and preservation.",
    detailedSteps: [
      "Gather all equipment",
      "Check condition",
      "Clean items",
      "Organize by sport",
      "Use wall storage",
      "Inflate balls properly"
    ],
    tips: "Store seasonally used items higher",
    safety: "Secure heavy items", estimatedTime: 20, chemicals: [], tools: ['Vacuum', 'Duster'], category: 'HVAC', rooms: ['All Rooms'] },
  { id: 85, name: 'Clean light fixtures',
    description: "Clean workbench and tool area for safe, efficient workspace.",
    detailedSteps: [
      "Clear workbench",
      "Sort items",
      "Clean surface",
      "Organize tools",
      "Check power tools",
      "Set up storage"
    ],
    tips: "Keep safety equipment accessible",
    safety: "Unplug power tools when not in use", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Ladder'], category: 'Detail Cleaning', rooms: ['All Rooms'] },
  { id: 86, name: 'Wash walls',
    description: "Dispose of hazardous materials properly following local regulations.",
    detailedSteps: [
      "Identify hazardous items",
      "Check local rules",
      "Package properly",
      "Label clearly",
      "Transport safely",
      "Get disposal receipt"
    ],
    tips: "Never mix chemicals",
    safety: "Wear protective equipment", estimatedTime: 30, chemicals: ['Wall cleaner'], tools: ['Sponge', 'Cloth'], category: 'Deep Cleaning', rooms: ['All Rooms'] },
  { id: 87, name: 'Clean window blinds',
    description: "Sweep patio, deck, or porch removing debris for usable outdoor space.",
    detailedSteps: [
      "Remove furniture",
      "Sweep thoroughly",
      "Clean corners",
      "Check for damage",
      "Clean furniture",
      "Replace arranged"
    ],
    tips: "Power wash annually",
    safety: "Check for loose boards", estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Duster'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 88, name: 'Clean curtains/drapes',
    description: "Clean outdoor furniture for comfort and longevity.",
    detailedSteps: [
      "Check material type",
      "Apply appropriate cleaner",
      "Scrub if needed",
      "Rinse thoroughly",
      "Dry completely",
      "Apply protectant"
    ],
    tips: "Store cushions indoors",
    safety: "Check furniture stability", estimatedTime: 15, chemicals: [], tools: ['Vacuum attachment', 'Steamer'], category: 'Windows', rooms: ['Living Room', 'Bedroom'] },
  { id: 89, name: 'Polish wood furniture',
    description: "Clean outdoor light fixtures for better illumination and appearance.",
    detailedSteps: [
      "Turn off power",
      "Remove fixtures if possible",
      "Clean glass",
      "Remove bugs/debris",
      "Check bulbs",
      "Reinstall securely"
    ],
    tips: "Use LED bulbs for longevity",
    safety: "Use proper ladder", estimatedTime: 20, chemicals: ['Wood polish'], tools: ['Cloth'], category: 'Furniture Care', rooms: ['All Rooms'] },
  { id: 90, name: 'Clean leather furniture',
    description: "Clean BBQ grill for food safety and better cooking.",
    detailedSteps: [
      "Heat grill first",
      "Scrub grates",
      "Clean interior",
      "Empty grease trap",
      "Clean exterior",
      "Check gas connections"
    ],
    tips: "Clean after each use when warm",
    safety: "Check for gas leaks", estimatedTime: 20, chemicals: ['Leather cleaner', 'Leather conditioner'], tools: ['Cloth'], category: 'Furniture Care', rooms: ['Living Room', 'Office'] },
  { id: 91, name: 'Steam clean carpets',
    description: "Organize garden tools and supplies for efficiency and tool preservation.",
    detailedSteps: [
      "Gather all tools",
      "Clean dirty tools",
      "Sharpen if needed",
      "Oil metal parts",
      "Organize by type",
      "Store properly"
    ],
    tips: "Hang tools to save space",
    safety: "Point sharp tools down", estimatedTime: 60, chemicals: ['Carpet cleaner'], tools: ['Carpet cleaner machine'], category: 'Deep Cleaning', rooms: ['All Carpeted Rooms'] },
  { id: 92, name: 'Polish stainless steel',
    description: "Clean outdoor trash and recycling bins for hygiene and odor control.",
    detailedSteps: [
      "Empty completely",
      "Rinse with hose",
      "Apply disinfectant",
      "Scrub if needed",
      "Rinse again",
      "Dry before use"
    ],
    tips: "Clean monthly in summer",
    safety: "Wear gloves", estimatedTime: 15, chemicals: ['Stainless steel polish'], tools: ['Microfiber cloth'], category: 'Detail Cleaning', rooms: ['Kitchen'] },
  { id: 93, name: 'Clean inside drawers',
    description: "Clean and disinfect pet areas including beds, bowls, and toys for pet health.",
    detailedSteps: [
      "Remove pet items",
      "Wash bedding",
      "Clean food/water bowls",
      "Disinfect area",
      "Clean toys",
      "Replace fresh"
    ],
    tips: "Use pet-safe cleaners only",
    safety: "Keep pets away during cleaning", estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'], category: 'Organization', rooms: ['All Rooms'] },
  { id: 94, name: 'Sanitize doorknobs',
    description: "Clean playroom or kids' areas organizing toys and ensuring safety.",
    detailedSteps: [
      "Have kids help sort",
      "Organize toys by type",
      "Clean surfaces",
      "Disinfect toys",
      "Check for broken items",
      "Create zones"
    ],
    tips: "Rotate toys to maintain interest",
    safety: "Check for choking hazards", estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 95, name: 'Clean and oil door hinges',
    description: "Deep clean carpets removing stains, odors, and deep dirt.",
    detailedSteps: [
      "Vacuum thoroughly",
      "Pretreat stains",
      "Apply carpet cleaner",
      "Use machine/scrub",
      "Extract moisture",
      "Dry completely"
    ],
    tips: "Clean high-traffic areas more often",
    safety: "Ensure good ventilation", estimatedTime: 10, chemicals: ['WD-40'], tools: ['Cloth'], category: 'Maintenance', rooms: ['All Rooms'] },
  { id: 96, name: 'Clean pet areas',
    description: "Polish hardwood floors restoring shine and protecting wood.",
    detailedSteps: [
      "Clear floor completely",
      "Dust mop thoroughly",
      "Apply polish evenly",
      "Buff if required",
      "Allow to dry",
      "Replace furniture carefully"
    ],
    tips: "Use felt pads under furniture",
    safety: "Floors will be slippery", estimatedTime: 20, chemicals: ['Pet-safe cleaner'], tools: ['Vacuum', 'Mop'], category: 'Pet Care', rooms: ['Pet Areas'] },
  { id: 97, name: 'Sanitize children toys',
    description: "Clean air vents and returns improving air quality and HVAC efficiency.",
    detailedSteps: [
      "Turn off HVAC",
      "Remove vent covers",
      "Vacuum ducts visible",
      "Wash vent covers",
      "Dry completely",
      "Replace securely"
    ],
    tips: "Change filters monthly",
    safety: "Wear mask for dust", estimatedTime: 15, chemicals: ['Child-safe disinfectant'], tools: ['Cloth'], category: 'Child Care', rooms: ['Playroom', 'Kids Bedroom'] },
  { id: 98, name: 'Clean exercise equipment',
    description: "Wash walls removing marks, scuffs, and dust for fresh appearance.",
    detailedSteps: [
      "Dust walls first",
      "Test cleaner spot",
      "Work top to bottom",
      "Focus on marks",
      "Rinse if needed",
      "Dry to prevent streaks"
    ],
    tips: "Magic eraser for tough marks",
    safety: "Protect floors from drips", estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Fitness', rooms: ['Home Gym', 'Basement'] },
  { id: 99, name: 'Organize storage areas',
    description: "Clean light fixtures and ceiling fans throughout for better lighting and air quality.",
    detailedSteps: [
      "Turn off power",
      "Remove fixtures if possible",
      "Clean all parts",
      "Replace bulbs",
      "Clean fan blades",
      "Reassemble carefully"
    ],
    tips: "Take before photo for reassembly",
    safety: "Never stand on furniture", estimatedTime: 45, chemicals: [], tools: [], category: 'Organization', rooms: ['Attic', 'Basement', 'Storage Room'] },
  { id: 100, name: 'Clean mirrors',
    description: "Perform seasonal deep cleaning addressing areas often overlooked in regular cleaning.",
    detailedSteps: [
      "Create checklist",
      "Work room by room",
      "Include hidden areas",
      "Clean or replace filters",
      "Check safety devices",
      "Document completed"
    ],
    tips: "Schedule quarterly for best results",
    safety: "Don't rush, take breaks", estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Microfiber cloth'], category: 'Detail Cleaning', rooms: ['All Rooms'] }
];

// Helper function to search tasks by room
export const getTasksByRoom = (roomName: RoomType): CleaningTask[] => {
  return cleaningTasksDatabase.filter(task => 
    task.rooms.includes(roomName) || task.rooms.includes('All Rooms')
  );
};

// Helper function to search tasks by category
export const getTasksByCategory = (category: TaskCategory): CleaningTask[] => {
  return cleaningTasksDatabase.filter(task => task.category === category);
};

// Helper function to get all unique categories
export const getAllCategories = (): TaskCategory[] => {
  const categories = new Set<TaskCategory>();
  cleaningTasksDatabase.forEach(task => categories.add(task.category));
  return Array.from(categories).sort();
};

// Helper function to get all unique rooms
export const getAllRooms = (): RoomType[] => {
  const rooms = new Set<RoomType>();
  cleaningTasksDatabase.forEach(task => {
    task.rooms.forEach(room => {
      if (room !== 'All Rooms') {
        rooms.add(room);
      }
    });
  });
  return Array.from(rooms).sort();
};

// Helper function for fuzzy search across all tasks
export const searchTasks = (query: string, roomFilter: RoomType | null = null): CleaningTask[] => {
  const lowerQuery = query.toLowerCase();
  
  return cleaningTasksDatabase.filter(task => {
    // Check if task matches the search query
    const matchesQuery = task.name.toLowerCase().includes(lowerQuery) ||
                        task.category.toLowerCase().includes(lowerQuery) ||
                        task.chemicals?.some(c => c.toLowerCase().includes(lowerQuery)) ||
                        task.tools?.some(t => t.toLowerCase().includes(lowerQuery));
    
    // Check if task is available for the specified room
    const matchesRoom = !roomFilter || 
                       task.rooms.includes(roomFilter) || 
                       task.rooms.includes('All Rooms');
    
    return matchesQuery && matchesRoom;
  });
};

// Export default
export default cleaningTasksDatabase;