export const furnitureCategories = [
  // Furniture
  { id: 'living', name: 'Living Room', icon: '🛋️', type: 'FURNITURE' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', type: 'FURNITURE' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', type: 'FURNITURE' },
  { id: 'bathroom', name: 'Bathroom', icon: '🛁', type: 'FURNITURE' },
  { id: 'office', name: 'Office', icon: '💼', type: 'FURNITURE' },

  // Decor
  { id: 'lighting', name: 'Lighting', icon: '💡', type: 'DECOR' },
  { id: 'plants', name: 'Plants', icon: '🌿', type: 'DECOR' },
  { id: 'rugs', name: 'Rugs', icon: '🧶', type: 'DECOR' },
];

export const furnitureItems = {
  living: [
    {
      id: 'sofa_01',
      name: 'Modern Sofa',
      image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png',
      width: 200, depth: 90, color: '#556b2f',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/couch/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'BASIC'
    },
    {
      id: 'sofa_02',
      name: 'L-Shape Sofa',
      image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png',
      width: 250, depth: 150, color: '#8b4513',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'STANDARD'
    },
    {
      id: 'tv_unit',
      name: 'TV Unit',
      image: 'https://cdn-icons-png.flaticon.com/512/5998/5998781.png',
      width: 180, depth: 40, color: '#333333',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tv-set/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'BASIC'
    },
    {
      id: 'coffee_table',
      name: 'Coffee Table',
      image: 'https://cdn-icons-png.flaticon.com/512/1663/1663959.png',
      width: 100, depth: 60, color: '#8b4513',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-table-projection/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'PREMIUM'
    },
  ],
  bedroom: [
    {
      id: 'bed_king',
      name: 'King Bed',
      image: 'https://cdn-icons-png.flaticon.com/512/3030/3030336.png',
      width: 180, depth: 200, color: '#f5f5dc',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bed-double/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'PREMIUM'
    },
    {
      id: 'bed_single',
      name: 'Single Bed',
      image: 'https://cdn-icons-png.flaticon.com/512/3030/3030336.png',
      width: 90, depth: 190, color: '#f5f5dc',
      model: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bed-single/model.gltf',
      modelScale: [0.01, 0.01, 0.01],
      plan: 'BASIC'
    },
    {
      id: 'wardrobe',
      name: 'Modern Wardrobe',
      image: '/3D/icon/wardrobe/wardrobe.png',
      model: '/3D/model/wardrobe/wardrobe.fbx',
      width: 120, depth: 60, height: 210,
      color: '#5d4037',
      modelScale: [0.07, 0.07, 0.07],
      plan: 'STANDARD'
    },
    { id: 'bedside_table', name: 'Bedside Table', image: 'https://cdn-icons-png.flaticon.com/512/5029/5029242.png', width: 45, depth: 40, color: '#a0522d', plan: 'BASIC' },
  ],
  kitchen: [
    { id: 'table_rect', name: 'Dining Table', image: 'https://cdn-icons-png.flaticon.com/512/1663/1663959.png', width: 160, depth: 90, color: '#deb887', plan: 'BASIC' },
    { id: 'fridge', name: 'Fridge', image: '/3D/icon/kitchen%20applience/fridge.png', model: '/3D/model/kitchen%20applience/fridge1.fbx', type: 'FURNITURE', width: 70, depth: 70, height: 180, elevation: 0, modelScale: [0.01, 0.01, 0.01], plan: 'STANDARD' },
  ],
  bathroom: [
    { id: 'bathtub1', name: 'Bathtub 1', image: '/3D/icon/bathroom/bathtub1.png', model: '/3D/model/bathroom/bathtub.fbx', type: 'FURNITURE', width: 170, depth: 75, height: 60, elevation: 0, modelScale: [0.03, 0.03, 0.03], plan: 'PREMIUM' },
    { id: 'sink1', name: 'Sink 1', image: '/3D/icon/bathroom/sink1.png', model: '/3D/model/bathroom/sink1.fbx', type: 'FURNITURE', width: 60, depth: 50, height: 80, elevation: 0, modelScale: [0.09, 0.09, 0.09], plan: 'BASIC' },
    { id: 'sink2', name: 'Sink 2', image: '/3D/icon/bathroom/sink2.png', model: '/3D/model/bathroom/sink2.fbx', type: 'FURNITURE', width: 60, depth: 50, height: 80, elevation: 0, modelScale: [0.01, 0.01, 0.01], plan: 'STANDARD' },
    { id: 'washbasin', name: 'Washbasin', image: '/3D/icon/bathroom/washbasin.png', model: '/3D/model/bathroom/washbasin.fbx', type: 'FURNITURE', width: 80, depth: 50, height: 85, elevation: 0, modelScale: [0.01, 0.01, 0.01], plan: 'BASIC' },
    { id: 'toilet', name: 'Toilet', image: '/3D/icon/bathroom/toilet.png', model: '/3D/model/bathroom/toilet.fbx', type: 'FURNITURE', width: 40, depth: 65, height: 75, elevation: 0, modelScale: [0.01, 0.01, 0.01], plan: 'BASIC' }
  ],
  office: [
    { id: 'desk', name: 'Office Desk', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 140, depth: 70, color: '#8b4513' },
    { id: 'office_chair', name: 'Office Chair', image: 'https://cdn-icons-png.flaticon.com/512/5029/5029242.png', width: 60, depth: 60, color: '#333333' },
  ],
  lighting: [
    { id: 'lamp1', name: 'Lamp 1', image: '/3D/icon/lights/lamp1.png', model: '/3D/model/lights/lamp1.fbx', type: 'FURNITURE', width: 40, depth: 40, height: 160, elevation: 0, modelScale: [0.01, 0.01, 0.01], modelRotation: [-Math.PI / 2, 0, 0] },
  ],
  plants: [
    { id: 'plant_large', name: 'Large Plant', image: 'https://cdn-icons-png.flaticon.com/512/628/628324.png', width: 50, depth: 50, color: '#228b22' },
    { id: 'plant_small', name: 'Small Plant', image: 'https://cdn-icons-png.flaticon.com/512/628/628324.png', width: 25, depth: 25, color: '#228b22' },
  ],
  rugs: [
    { id: 'carpet_classic', name: 'Classic Rug', image: '/carpet_round_classic.png', texture: '/carpet_round_classic.png', model: '/3D/model/carpet/carpet.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'carpet_floral', name: 'Floral Rug', image: '/carpet_round_floral.png', texture: '/carpet_round_floral.png', model: '/3D/model/carpet/carpet1.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'carpet_butterfly', name: 'Butterfly Rug', image: '/carpet_round_butterfly.png', texture: '/carpet_round_butterfly.png', model: '/3D/model/carpet/carpet.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
  ]
};

// --- NEW CATALOG API STRUCTURE ---
export const catalogCategories = [
  { id: 'construction', name: 'Construction', image: '/Construction.png' },
  { id: 'living', name: 'Furniture', image: '/furniture.png' },
  { id: 'appliances', name: 'Electric appliances', image: '/Household_appliances.png' },
  { id: 'decor', name: 'Decor', image: '/decor.png' },
];

export const catalogSubCategories = {
  construction: [
    { id: 'windows', name: 'Windows', image: '/Windows.png' },
    { id: 'doors', name: 'Doors', image: '/Doors.png' },
    { id: 'stairs', name: 'Stairs', image: '/Stairs.png' },
    { id: 'fireplaces', name: 'Fireplaces', image: '/Fireplaces.png' },
  ],
  living: [
    { id: 'upholstered', name: 'Upholstered furniture', image: '/Upholstered.png' },
    { id: 'chairs', name: 'Chairs, benches', image: '/Chairs.png' },
    { id: 'tables', name: 'Tables', image: '/Tables.png' },
    { id: 'beds', name: 'Beds', image: '/Beds.png' },
    { id: 'cabinets', name: 'Cabinets & Shelves', image: '/Cabinets.png' },
    { id: 'kitchen_furn', name: 'Kitchen', image: '/KitchenFurn.png' },
    { id: 'bathroom_furn', name: 'Bathroom', image: '/BathroomFurn.png' },
  ],
  appliances: [
    { id: 'household_appl', name: 'Household appliances', image: '/Household_appliances.png' },
    { id: 'tv_audio', name: 'TV / Video / Audio', image: '/TV_Video_Audio.png' },
    { id: 'lighting', name: 'Lighting', image: '/Lighting_appliances.png' },
    { id: 'kitchen_appl', name: 'Kitchen Appliances', image: '/Kitchen_Appliances.png' },
    { id: 'climate', name: 'Climate', image: '/Climate.png' },
  ],
  decor: [
    { id: 'carpets_rugs', name: 'Carpets & Rugs', image: '/Carpets_Rugs.png' },
    { id: 'plants', name: 'Plants', image: '/Plants.png' },
  ],
};

export const catalogItems = {
  windows: [
    { id: 'window1', name: 'Window 1', image: '/3D/icon/window/window1.png', model: '/3D/model/window/window1.fbx', type: 'WINDOW', width: 100, height: 120, elevation: 100, modelScale: [0.01, 0.01, 0.01] },
    { id: 'window2', name: 'Window 2', image: '/3D/icon/window/window2.png', model: '/3D/model/window/window2.fbx', type: 'WINDOW', width: 100, height: 120, elevation: 100, modelScale: [0.01, 0.01, 0.01], modelRotation: [0, Math.PI / 2, 0] },
    { id: 'window3', name: 'Window 3', image: '/3D/icon/window/window3.png', model: '/3D/model/window/window3.fbx', type: 'WINDOW', width: 100, height: 120, elevation: 100, modelScale: [0.01, 0.01, 0.01] }
  ],
  doors: [
    { id: 'door1', name: 'Door 1', image: '/3D/icon/door/door1.png', model: '/3D/model/door/door1.fbx', type: 'DOOR', width: 90, height: 210, elevation: 0, modelScale: [0.01, 0.01, 0.01], modelRotation: [0, Math.PI / 2, 0] },

    { id: 'door3', name: 'Door 3', image: '/3D/icon/door/door3.png', model: '/3D/model/door/door3.fbx', type: 'DOOR', width: 90, height: 210, elevation: 0, modelScale: [0.01, 0.01, 0.01], isArched: true, archDrop: 40 }
  ],
  stairs: [
    { id: 'stair1', name: 'Stairs 1', image: '/3D/icon/stairs/stair1.png', model: '/3D/model/stairs/stair1.fbx', type: 'FURNITURE', width: 150, depth: 150, height: 300, elevation: 0, modelScale: [0.01, 0.01, 0.01] }
  ],
  fireplaces: [
  ],
  upholstered: [
    { id: 'sofa1', name: 'Sofa 1 (New)', image: '/3D/icon/Upholstered%20furniture/sofa1.png', model: '/3D/model/Upholstered%20furniture/sofa1.fbx', type: 'FURNITURE', width: 200, depth: 90, height: 80, elevation: 0, modelScale: [0.3, 0.3, 0.3] },
    { id: 'sofa2', name: 'Sofa 2', image: '/3D/icon/Upholstered%20furniture/sofa2.png', model: '/3D/model/Upholstered%20furniture/sofa2.fbx', type: 'FURNITURE', width: 200, depth: 90, height: 80, elevation: 0, modelScale: [0.01, 0.01, 0.01] }
  ],
  chairs: [
    { id: 'chair1', name: 'Chair 1', image: '/3D/icon/chair/chair1.png', model: '/3D/model/chair/chair1.fbx', type: 'FURNITURE', width: 50, depth: 50, height: 90, elevation: 0, modelScale: [0.02, 0.02, 0.02] },
    { id: 'chair2', name: 'New Chair 2', image: '/3D/icon/chair/chair2.png', model: '/3D/model/chair/chair2.fbx', type: 'FURNITURE', width: 50, depth: 50, height: 90, elevation: 0, modelScale: [0.02, 0.02, 0.02] }
  ],
  tables: [
    { id: 'table2', name: 'Modern Table 2', image: '/3D/icon/tables/table2.png', model: '/3D/model/tables/table2.fbx', type: 'FURNITURE', width: 140, depth: 80, height: 75, elevation: 0, modelScale: [0.04, 0.04, 0.04] }
  ],
  beds: [
    { id: 'bed2', name: 'Bed 2', image: '/3D/icon/beds/bed2.png', model: '/3D/model/beds/bed2.fbx', type: 'FURNITURE', width: 180, depth: 200, height: 100, elevation: 0, modelScale: [0.01, 0.01, 0.01] },
    { id: 'bed3', name: 'Bed 3 (Large & Tri-Color)', image: '/3D/icon/beds/bed3.png', model: '/3D/model/beds/bed3.fbx', type: 'FURNITURE', width: 250, depth: 260, height: 140, elevation: 0, modelScale: [0.02, 0.02, 0.02] }
  ],
  cabinets: [
    { id: 'wardrobe_new', name: 'Modern Wardrobe', image: '/3D/icon/wardrobe/wardrobe.png', model: '/3D/model/wardrobe/wardrobe.fbx', type: 'FURNITURE', width: 120, depth: 60, height: 210, elevation: 0, modelScale: [0.07, 0.07, 0.07] }
  ],
  kitchen_furn: [
    { id: 'dining_table', name: 'Dining Table', image: '/3D/icon/kitchen/dining%20table.png', model: '/3D/model/kitchen/dining%20table.fbx', type: 'FURNITURE', width: 160, depth: 90, height: 75, elevation: 0, modelScale: [1.5, 1.5, 1.5] },
    { id: 'cabinet', name: 'Kitchen Cabinet', image: '/3D/icon/kitchen/cabinet.png', model: '/3D/model/kitchen/cabinet.fbx', type: 'FURNITURE', width: 120, depth: 60, height: 90, elevation: 0, modelScale: [1.9, 1.9, 1.9] }
  ],
  bathroom_furn: [
    { id: 'bathtub1', name: 'Bathtub 1', image: '/3D/icon/bathroom/bathtub1.png', model: '/3D/model/bathroom/bathtub.fbx', type: 'FURNITURE', width: 170, depth: 75, height: 60, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'sink1', name: 'Sink 1', image: '/3D/icon/bathroom/sink1.png', model: '/3D/model/bathroom/sink1.fbx', type: 'FURNITURE', width: 60, depth: 50, height: 80, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'sink2', name: 'Sink 2', image: '/3D/icon/bathroom/sink2.png', model: '/3D/model/bathroom/sink2.fbx', type: 'FURNITURE', width: 60, depth: 50, height: 80, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'washbasin', name: 'Washbasin', image: '/3D/icon/bathroom/washbasin.png', model: '/3D/model/bathroom/washbasin.fbx', type: 'FURNITURE', width: 80, depth: 50, height: 85, elevation: 0, modelScale: [0.02, 0.02, 0.02] },
    { id: 'toilet', name: 'Toilet', image: '/3D/icon/bathroom/toilet.png', model: '/3D/model/bathroom/toilet.fbx', type: 'FURNITURE', width: 40, depth: 65, height: 75, elevation: 0, modelScale: [0.02, 0.02, 0.02] }
  ],
  household_appl: [
    { id: 'washingmachine', name: 'Washing Machine', image: '/3D/icon/household/washingmachine.png', model: '/3D/model/household/washingmachine.fbx', type: 'FURNITURE', width: 60, depth: 60, height: 85, elevation: 0, modelScale: [0.006, 0.006, 0.006] }
  ],
  tv_audio: [
    { id: 'tv', name: 'TV', image: '/3D/icon/tv/tv.png', model: '/3D/model/tv/tv.fbx', type: 'FURNITURE', width: 120, depth: 10, height: 70, elevation: 0, modelScale: [0.01, 0.01, 0.01] }
  ],
  lighting: [
    { id: 'lamp1', name: 'Lamp 1', image: '/3D/icon/lights/lamp1.png', model: '/3D/model/lights/lamp1.fbx', type: 'FURNITURE', width: 40, depth: 40, height: 160, elevation: 0, modelScale: [0.03, 0.03, 0.03], modelRotation: [-Math.PI / 2, 0, 0] }
  ],
  kitchen_appl: [
    { id: 'fridge', name: 'Fridge', image: '/3D/icon/kitchen%20applience/fridge.png', model: '/3D/model/kitchen%20applience/fridge1.fbx', type: 'FURNITURE', width: 70, depth: 70, height: 180, elevation: 0, modelScale: [0.01, 0.01, 0.01] },
    { id: 'stove', name: 'Stove', image: '/3D/icon/kitchen%20applience/stove.png', model: '/3D/model/kitchen%20applience/stove.fbx', type: 'FURNITURE', width: 60, depth: 60, height: 90, elevation: 0, modelScale: [0.01, 0.01, 0.01] }
  ],
  climate: [
    { id: 'ac', name: 'AC 1', image: '/3D/icon/climate/ac.png', model: '/3D/model/climate/ac.fbx', type: 'FURNITURE', width: 80, depth: 30, height: 30, elevation: 200, modelScale: [0.006, 0.006, 0.006] },
  ],
  carpets_rugs: [
    { id: 'carpet_classic', name: 'Classic Rug', image: '/carpet_round_classic.png', texture: '/carpet_round_classic.png', model: '/3D/model/carpet/carpet.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'carpet_floral', name: 'Floral Rug', image: '/carpet_round_floral.png', texture: '/carpet_round_floral.png', model: '/3D/model/carpet/carpet1.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
    { id: 'carpet_butterfly', name: 'Butterfly Rug', image: '/carpet_round_butterfly.png', texture: '/carpet_round_butterfly.png', model: '/3D/model/carpet/carpet.fbx', type: 'FURNITURE', width: 800, depth: 1200, height: 1, elevation: 0, modelScale: [0.03, 0.03, 0.03] },
  ],
  plants: [
    { id: 'plant1', name: 'Plant 1', image: '/3D/icon/plant/plant1.png', model: '/3D/model/plant/plant1.fbx', type: 'FURNITURE', width: 50, depth: 50, height: 100, elevation: 0, modelScale: [0.01, 0.01, 0.01] }
  ]
};
