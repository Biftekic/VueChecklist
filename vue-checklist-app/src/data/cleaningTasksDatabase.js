// Comprehensive cleaning tasks database with room associations
export const cleaningTasksDatabase = [
  // Universal Tasks (can be used in any room)
  { id: 1, name: 'Vacuum carpet/rugs', estimatedTime: 15, chemicals: [], tools: ['Vacuum'], category: 'Floor Care', rooms: ['Living Room', 'Bedroom', 'Office', 'Hallway', 'Stairs'] },
  { id: 2, name: 'Mop hard floors', estimatedTime: 15, chemicals: ['Floor cleaner'], tools: ['Mop', 'Bucket'], category: 'Floor Care', rooms: ['Kitchen', 'Bathroom', 'Hallway', 'Entryway', 'Laundry Room'] },
  { id: 3, name: 'Sweep floors', estimatedTime: 10, chemicals: [], tools: ['Broom', 'Dustpan'], category: 'Floor Care', rooms: ['Kitchen', 'Garage', 'Basement', 'Patio', 'Balcony'] },
  { id: 4, name: 'Dust surfaces and furniture', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Microfiber cloth', 'Duster'], category: 'Dusting', rooms: ['All Rooms'] },
  { id: 5, name: 'Clean windows (interior)', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Cloth'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 6, name: 'Clean windows (exterior)', estimatedTime: 15, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Ladder'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 7, name: 'Empty trash bins', estimatedTime: 5, chemicals: [], tools: ['Trash bags'], category: 'Waste Management', rooms: ['All Rooms'] },
  { id: 8, name: 'Disinfect door handles', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 9, name: 'Clean light switches', estimatedTime: 3, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 10, name: 'Clean baseboards', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum attachment'], category: 'Detail Cleaning', rooms: ['All Rooms'] },
  
  // Kitchen Specific
  { id: 11, name: 'Clean stovetop', estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Sponge', 'Scraper'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 12, name: 'Clean oven (interior)', estimatedTime: 30, chemicals: ['Oven cleaner'], tools: ['Sponge', 'Scraper'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 13, name: 'Clean oven (exterior)', estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 14, name: 'Clean microwave (inside and out)', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 15, name: 'Clean refrigerator (exterior)', estimatedTime: 5, chemicals: ['Stainless steel cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 16, name: 'Clean refrigerator (interior)', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 17, name: 'Clean dishwasher', estimatedTime: 10, chemicals: ['Dishwasher cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 18, name: 'Clean sink and faucet', estimatedTime: 10, chemicals: ['Sink cleaner', 'Descaler'], tools: ['Sponge', 'Brush'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 19, name: 'Clean countertops', estimatedTime: 10, chemicals: ['Kitchen cleaner'], tools: ['Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 20, name: 'Clean cabinet fronts', estimatedTime: 15, chemicals: ['Wood cleaner'], tools: ['Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 21, name: 'Clean inside cabinets', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Vacuum'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 22, name: 'Clean backsplash', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 23, name: 'Clean range hood and filter', estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Brush', 'Cloth'], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 24, name: 'Clean garbage disposal', estimatedTime: 5, chemicals: ['Disposal cleaner'], tools: [], category: 'Kitchen', rooms: ['Kitchen'] },
  { id: 25, name: 'Organize pantry', estimatedTime: 20, chemicals: [], tools: [], category: 'Kitchen Organization', rooms: ['Kitchen', 'Pantry'] },
  { id: 26, name: 'Clean small appliances', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 27, name: 'Descale coffee maker', estimatedTime: 15, chemicals: ['Descaler'], tools: [], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  { id: 28, name: 'Clean toaster/toaster oven', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Brush', 'Cloth'], category: 'Kitchen Appliances', rooms: ['Kitchen'] },
  
  // Bathroom Specific
  { id: 29, name: 'Clean and disinfect toilet', estimatedTime: 15, chemicals: ['Toilet bowl cleaner', 'Disinfectant'], tools: ['Toilet brush', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 30, name: 'Clean shower/bathtub', estimatedTime: 20, chemicals: ['Tub cleaner', 'Mildew remover'], tools: ['Scrub brush', 'Sponge'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 31, name: 'Clean shower doors/curtain', estimatedTime: 10, chemicals: ['Glass cleaner', 'Mildew remover'], tools: ['Squeegee', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 32, name: 'Clean bathroom sink and counter', estimatedTime: 10, chemicals: ['Bathroom cleaner'], tools: ['Sponge'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 33, name: 'Clean bathroom mirror', estimatedTime: 5, chemicals: ['Glass cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 34, name: 'Clean tile grout', estimatedTime: 30, chemicals: ['Grout cleaner'], tools: ['Grout brush'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 35, name: 'Clean exhaust fan', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 36, name: 'Replace towels', estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom', 'Powder Room'] },
  { id: 37, name: 'Restock toiletries', estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 38, name: 'Clean medicine cabinet', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 39, name: 'Wash bath mats', estimatedTime: 5, chemicals: [], tools: [], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 40, name: 'Clean toilet brush holder', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 41, name: 'Descale showerhead', estimatedTime: 10, chemicals: ['Descaler'], tools: ['Brush'], category: 'Bathroom', rooms: ['Bathroom'] },
  { id: 42, name: 'Clean bathroom scale', estimatedTime: 3, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Bathroom', rooms: ['Bathroom'] },
  
  // Bedroom Specific
  { id: 43, name: 'Make bed/change linens', estimatedTime: 10, chemicals: [], tools: [], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 44, name: 'Dust nightstands', estimatedTime: 5, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 45, name: 'Clean under bed', estimatedTime: 10, chemicals: [], tools: ['Vacuum', 'Duster'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 46, name: 'Organize closet', estimatedTime: 30, chemicals: [], tools: [], category: 'Bedroom Organization', rooms: ['Bedroom', 'Walk-in Closet'] },
  { id: 47, name: 'Dust dresser and decor', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 48, name: 'Clean ceiling fan', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Duster', 'Cloth'], category: 'Bedroom', rooms: ['Bedroom', 'Living Room'] },
  { id: 49, name: 'Vacuum/clean mattress', estimatedTime: 15, chemicals: ['Fabric cleaner'], tools: ['Vacuum'], category: 'Bedroom', rooms: ['Bedroom', 'Guest Room'] },
  { id: 50, name: 'Clean lamp shades', estimatedTime: 10, chemicals: [], tools: ['Vacuum attachment', 'Duster'], category: 'Bedroom', rooms: ['Bedroom', 'Living Room'] },
  
  // Living Room Specific
  { id: 51, name: 'Vacuum sofa and cushions', estimatedTime: 15, chemicals: [], tools: ['Vacuum attachment'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 52, name: 'Clean TV screen', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'], category: 'Electronics', rooms: ['Living Room', 'Bedroom', 'Family Room'] },
  { id: 53, name: 'Dust entertainment center', estimatedTime: 10, chemicals: ['Furniture polish'], tools: ['Cloth'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 54, name: 'Clean remote controls', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Electronics', rooms: ['Living Room', 'Bedroom', 'Family Room'] },
  { id: 55, name: 'Organize books and magazines', estimatedTime: 10, chemicals: [], tools: [], category: 'Organization', rooms: ['Living Room', 'Office', 'Library'] },
  { id: 56, name: 'Clean coffee table', estimatedTime: 5, chemicals: ['Glass cleaner', 'Wood polish'], tools: ['Cloth'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  { id: 57, name: 'Fluff and arrange pillows', estimatedTime: 5, chemicals: [], tools: [], category: 'Living Room', rooms: ['Living Room', 'Bedroom'] },
  { id: 58, name: 'Clean fireplace/mantel', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Brush', 'Vacuum'], category: 'Living Room', rooms: ['Living Room', 'Family Room'] },
  
  // Office Specific
  { id: 59, name: 'Clean computer monitor', estimatedTime: 5, chemicals: ['Electronic cleaner'], tools: ['Microfiber cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 60, name: 'Clean keyboard and mouse', estimatedTime: 10, chemicals: ['Electronic cleaner'], tools: ['Compressed air', 'Cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 61, name: 'Organize desk and drawers', estimatedTime: 20, chemicals: [], tools: [], category: 'Office Organization', rooms: ['Office', 'Home Office'] },
  { id: 62, name: 'Dust computer equipment', estimatedTime: 10, chemicals: [], tools: ['Compressed air', 'Microfiber cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 63, name: 'Clean phone and accessories', estimatedTime: 5, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Office', rooms: ['Office', 'Home Office'] },
  { id: 64, name: 'Shred documents', estimatedTime: 15, chemicals: [], tools: ['Shredder'], category: 'Office Organization', rooms: ['Office', 'Home Office'] },
  { id: 65, name: 'Organize cables and cords', estimatedTime: 10, chemicals: [], tools: ['Cable ties'], category: 'Office Organization', rooms: ['Office', 'Entertainment Center'] },
  
  // Laundry Room Specific
  { id: 66, name: 'Clean washing machine', estimatedTime: 10, chemicals: ['Washing machine cleaner'], tools: ['Cloth'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 67, name: 'Clean dryer and lint trap', estimatedTime: 10, chemicals: [], tools: ['Vacuum', 'Brush'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 68, name: 'Clean laundry sink', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Sponge'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 69, name: 'Organize laundry supplies', estimatedTime: 10, chemicals: [], tools: [], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 70, name: 'Clean dryer vent', estimatedTime: 20, chemicals: [], tools: ['Vent brush', 'Vacuum'], category: 'Laundry', rooms: ['Laundry Room'] },
  { id: 71, name: 'Wipe down folding area', estimatedTime: 5, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Laundry', rooms: ['Laundry Room'] },
  
  // Garage Specific
  { id: 72, name: 'Sweep garage floor', estimatedTime: 20, chemicals: [], tools: ['Broom', 'Dustpan'], category: 'Garage', rooms: ['Garage'] },
  { id: 73, name: 'Remove oil stains', estimatedTime: 15, chemicals: ['Degreaser'], tools: ['Scrub brush'], category: 'Garage', rooms: ['Garage', 'Driveway'] },
  { id: 74, name: 'Organize tools', estimatedTime: 30, chemicals: [], tools: [], category: 'Garage Organization', rooms: ['Garage', 'Shed'] },
  { id: 75, name: 'Clean garage door', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Hose'], category: 'Garage', rooms: ['Garage'] },
  { id: 76, name: 'Wipe down shelving', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Garage', rooms: ['Garage', 'Storage Room'] },
  { id: 77, name: 'Clean workbench', estimatedTime: 10, chemicals: ['All-purpose cleaner'], tools: ['Cloth'], category: 'Garage', rooms: ['Garage', 'Workshop'] },
  
  // Outdoor/Patio Specific
  { id: 78, name: 'Sweep patio/deck', estimatedTime: 15, chemicals: [], tools: ['Broom'], category: 'Outdoor', rooms: ['Patio', 'Deck', 'Balcony'] },
  { id: 79, name: 'Clean outdoor furniture', estimatedTime: 20, chemicals: ['Outdoor cleaner'], tools: ['Cloth', 'Hose'], category: 'Outdoor', rooms: ['Patio', 'Deck', 'Balcony'] },
  { id: 80, name: 'Clean grill', estimatedTime: 30, chemicals: ['Grill cleaner'], tools: ['Grill brush', 'Scraper'], category: 'Outdoor', rooms: ['Patio', 'Deck'] },
  { id: 81, name: 'Power wash surfaces', estimatedTime: 45, chemicals: ['Pressure wash solution'], tools: ['Pressure washer'], category: 'Outdoor', rooms: ['Driveway', 'Patio', 'Deck'] },
  { id: 82, name: 'Clean outdoor cushions', estimatedTime: 15, chemicals: ['Fabric cleaner'], tools: ['Brush', 'Hose'], category: 'Outdoor', rooms: ['Patio', 'Deck'] },
  { id: 83, name: 'Clean outdoor windows', estimatedTime: 20, chemicals: ['Glass cleaner'], tools: ['Squeegee', 'Ladder'], category: 'Outdoor', rooms: ['Exterior'] },
  
  // Specialty/Deep Cleaning
  { id: 84, name: 'Clean air vents', estimatedTime: 20, chemicals: [], tools: ['Vacuum', 'Duster'], category: 'HVAC', rooms: ['All Rooms'] },
  { id: 85, name: 'Clean light fixtures', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Ladder'], category: 'Detail Cleaning', rooms: ['All Rooms'] },
  { id: 86, name: 'Wash walls', estimatedTime: 30, chemicals: ['Wall cleaner'], tools: ['Sponge', 'Cloth'], category: 'Deep Cleaning', rooms: ['All Rooms'] },
  { id: 87, name: 'Clean window blinds', estimatedTime: 20, chemicals: ['All-purpose cleaner'], tools: ['Cloth', 'Duster'], category: 'Windows', rooms: ['All Rooms'] },
  { id: 88, name: 'Clean curtains/drapes', estimatedTime: 15, chemicals: [], tools: ['Vacuum attachment', 'Steamer'], category: 'Windows', rooms: ['Living Room', 'Bedroom'] },
  { id: 89, name: 'Polish wood furniture', estimatedTime: 20, chemicals: ['Wood polish'], tools: ['Cloth'], category: 'Furniture Care', rooms: ['All Rooms'] },
  { id: 90, name: 'Clean leather furniture', estimatedTime: 20, chemicals: ['Leather cleaner', 'Leather conditioner'], tools: ['Cloth'], category: 'Furniture Care', rooms: ['Living Room', 'Office'] },
  { id: 91, name: 'Steam clean carpets', estimatedTime: 60, chemicals: ['Carpet cleaner'], tools: ['Carpet cleaner machine'], category: 'Deep Cleaning', rooms: ['All Carpeted Rooms'] },
  { id: 92, name: 'Polish stainless steel', estimatedTime: 15, chemicals: ['Stainless steel polish'], tools: ['Microfiber cloth'], category: 'Detail Cleaning', rooms: ['Kitchen'] },
  { id: 93, name: 'Clean inside drawers', estimatedTime: 15, chemicals: ['All-purpose cleaner'], tools: ['Vacuum', 'Cloth'], category: 'Organization', rooms: ['All Rooms'] },
  { id: 94, name: 'Sanitize doorknobs', estimatedTime: 10, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Sanitization', rooms: ['All Rooms'] },
  { id: 95, name: 'Clean and oil door hinges', estimatedTime: 10, chemicals: ['WD-40'], tools: ['Cloth'], category: 'Maintenance', rooms: ['All Rooms'] },
  { id: 96, name: 'Clean pet areas', estimatedTime: 20, chemicals: ['Pet-safe cleaner'], tools: ['Vacuum', 'Mop'], category: 'Pet Care', rooms: ['Pet Areas'] },
  { id: 97, name: 'Sanitize children toys', estimatedTime: 15, chemicals: ['Child-safe disinfectant'], tools: ['Cloth'], category: 'Child Care', rooms: ['Playroom', 'Kids Bedroom'] },
  { id: 98, name: 'Clean exercise equipment', estimatedTime: 15, chemicals: ['Disinfectant'], tools: ['Cloth'], category: 'Fitness', rooms: ['Home Gym', 'Basement'] },
  { id: 99, name: 'Organize storage areas', estimatedTime: 45, chemicals: [], tools: [], category: 'Organization', rooms: ['Attic', 'Basement', 'Storage Room'] },
  { id: 100, name: 'Clean mirrors', estimatedTime: 10, chemicals: ['Glass cleaner'], tools: ['Microfiber cloth'], category: 'Detail Cleaning', rooms: ['All Rooms'] }
];

// Helper function to search tasks by room
export const getTasksByRoom = (roomName) => {
  return cleaningTasksDatabase.filter(task => 
    task.rooms.includes(roomName) || task.rooms.includes('All Rooms')
  );
};

// Helper function to search tasks by category
export const getTasksByCategory = (category) => {
  return cleaningTasksDatabase.filter(task => task.category === category);
};

// Helper function to get all unique categories
export const getAllCategories = () => {
  const categories = new Set();
  cleaningTasksDatabase.forEach(task => categories.add(task.category));
  return Array.from(categories).sort();
};

// Helper function to get all unique rooms
export const getAllRooms = () => {
  const rooms = new Set();
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
export const searchTasks = (query, roomFilter = null) => {
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