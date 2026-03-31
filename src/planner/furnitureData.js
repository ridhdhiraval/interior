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
    { id: 'sofa_01', name: 'Modern Sofa', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 200, depth: 90, color: '#556b2f' },
    { id: 'sofa_02', name: 'L-Shape Sofa', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 250, depth: 150, color: '#8b4513' },
    { id: 'tv_unit', name: 'TV Unit', image: 'https://cdn-icons-png.flaticon.com/512/5998/5998781.png', width: 180, depth: 40, color: '#333333' },
    { id: 'coffee_table', name: 'Coffee Table', image: 'https://cdn-icons-png.flaticon.com/512/1663/1663959.png', width: 100, depth: 60, color: '#8b4513' },
  ],
  bedroom: [
    { id: 'bed_king', name: 'King Bed', image: 'https://cdn-icons-png.flaticon.com/512/3030/3030336.png', width: 180, depth: 200, color: '#f5f5dc' },
    { id: 'bed_single', name: 'Single Bed', image: 'https://cdn-icons-png.flaticon.com/512/3030/3030336.png', width: 90, depth: 190, color: '#f5f5dc' },
    { id: 'wardrobe', name: 'Wardrobe', image: 'https://cdn-icons-png.flaticon.com/512/114/114828.png', width: 120, depth: 60, color: '#8b4513' },
    { id: 'bedside_table', name: 'Bedside Table', image: 'https://cdn-icons-png.flaticon.com/512/5029/5029242.png', width: 45, depth: 40, color: '#a0522d' },
  ],
  kitchen: [
    { id: 'table_rect', name: 'Dining Table', image: 'https://cdn-icons-png.flaticon.com/512/1663/1663959.png', width: 160, depth: 90, color: '#deb887' },
    { id: 'chair', name: 'Chair', image: 'https://cdn-icons-png.flaticon.com/512/5029/5029242.png', width: 50, depth: 50, color: '#a0522d' },
    { id: 'kitchen_cabinet', name: 'Cabinet', image: 'https://cdn-icons-png.flaticon.com/512/5998/5998781.png', width: 60, depth: 60, color: '#ffffff' },
  ],
  bathroom: [
    { id: 'bathtub', name: 'Bathtub', image: 'https://cdn-icons-png.flaticon.com/512/2200/2200547.png', width: 170, depth: 75, color: '#ffffff' },
    { id: 'toilet', name: 'Toilet', image: 'https://cdn-icons-png.flaticon.com/512/2200/2200561.png', width: 40, depth: 65, color: '#ffffff' },
    { id: 'sink', name: 'Sink', image: 'https://cdn-icons-png.flaticon.com/512/2200/2200561.png', width: 60, depth: 50, color: '#ffffff' },
  ],
  office: [
    { id: 'desk', name: 'Office Desk', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 140, depth: 70, color: '#8b4513' },
    { id: 'office_chair', name: 'Office Chair', image: 'https://cdn-icons-png.flaticon.com/512/5029/5029242.png', width: 60, depth: 60, color: '#333333' },
  ],
  lighting: [
    { id: 'lamp_floor', name: 'Floor Lamp', image: 'https://cdn-icons-png.flaticon.com/512/2954/2954868.png', width: 40, depth: 40, color: '#ffd700' },
    { id: 'lamp_table', name: 'Table Lamp', image: 'https://cdn-icons-png.flaticon.com/512/2954/2954868.png', width: 25, depth: 25, color: '#ffd700' },
  ],
  plants: [
    { id: 'plant_large', name: 'Large Plant', image: 'https://cdn-icons-png.flaticon.com/512/628/628324.png', width: 50, depth: 50, color: '#228b22' },
    { id: 'plant_small', name: 'Small Plant', image: 'https://cdn-icons-png.flaticon.com/512/628/628324.png', width: 25, depth: 25, color: '#228b22' },
  ],
  rugs: [
    { id: 'rug_rect', name: 'Rectangular Rug', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 200, depth: 150, color: '#cd853f' },
    { id: 'rug_round', name: 'Round Rug', image: 'https://cdn-icons-png.flaticon.com/512/2558/2558062.png', width: 150, depth: 150, color: '#cd853f' },
  ]
};

// --- NEW CATALOG API STRUCTURE ---
// Scalable structure to replace hardcoded nested menus in ManualDesign.jsx

export const catalogCategories = [
  { id: 'construction', name: 'Construction', image: './Construction.png' },
  { id: 'living', name: 'Furniture', image: './furniture.png' },
  { id: 'appliances', name: 'Electric appliances', image: './electric.png' },
  { id: 'decor', name: 'Decor', image: './decor.png' },
];

export const catalogSubCategories = {
  construction: [
    { id: 'windows', name: 'Windows', image: './Windows.png' },
    { id: 'doors', name: 'Doors', image: './Doors.png' },
    { id: 'stairs', name: 'Stairs', image: './Stairs.png' },
    { id: 'fireplaces', name: 'Fireplaces', image: './Fireplaces.png' },
    { id: 'pillars', name: 'Pillars and beams', image: './Pillars.png' },
    { id: 'partitions', name: 'Partitions', image: './Partitions.png' },
    { id: 'wall_panels', name: 'Wall panels', image: './WallPanels.png' },
    { id: 'fences', name: 'Fences', image: './Fences.png' },
    { id: 'roof', name: 'Roof', image: './Roof.png' },
  ],
  living: [
    { id: 'upholstered', name: 'Upholstered furniture', image: './Upholstered.png' },
    { id: 'chairs_benches', name: 'Chairs, benches', image: './Chairs.png' },
    { id: 'tables', name: 'Tables', image: './Tables.png' },
    { id: 'beds', name: 'Beds', image: './Beds.png' },
    { id: 'cabinets_shelves', name: 'Cabinets & Shelves', image: './Cabinets.png' },
    { id: 'kitchen_furn', name: 'Kitchen', image: './KitchenFurn.png' },
    { id: 'bathroom_furn', name: 'Bathroom', image: './BathroomFurn.png' },
    { id: 'office_furn', name: 'Office', image: './OfficeFurn.png' },
    { id: 'outdoor', name: 'Outdoor furniture', image: './Outdoor.png' },
    { id: 'childrens', name: "Children's furniture", image: './Childrens.png' },
  ],
  upholstered: [
    { id: 'straight_sofas', name: 'Straight', image: './Straight.png' },
    { id: 'corner_sofas', name: 'Corner', image: './Corner.png' },
    { id: 'modular_sofas', name: 'Modular', image: './Modular.png' },
    { id: 'armchairs', name: 'Armchairs', image: './Armchairs.png' },
    { id: 'ottomans', name: 'Ottomans', image: './Ottomans.png' }
  ]
};

export const catalogItems = {
  windows: [
    { id: 'win_3sec', name: 'Three sections window', image: './win_3sec.png', isPremium: false },
    { id: 'win_basic1', name: 'Window', image: './win_basic1.png', isPremium: false },
    { id: 'win_arched1', name: 'Arched window', image: './win_arched1.png', isPremium: false },
    { id: 'win_arched2', name: 'Arched window', image: './win_arched2.png', isPremium: false },
    { id: 'win_grid1', name: 'Window', image: './win_grid1.png', isPremium: false },
    { id: 'win_round', name: 'Round window', image: './win_round.png', isPremium: false },
    { id: 'win_grid2', name: 'Window', image: './win_grid2.png', isPremium: false },
    { id: 'win_arc', name: 'Arc window', image: './win_arc.png', isPremium: false },
    { id: 'win_pano1', name: 'Panoramic window', image: './win_pano1.png', isPremium: true },
    { id: 'win_pano2', name: 'Panoramic window', image: './win_pano2.png', isPremium: true },
    { id: 'win_basic2', name: 'Window', image: './win_basic2.png', isPremium: true },
    { id: 'win_pano3', name: 'Panoramic window', image: './win_pano3.png', isPremium: true },
    { id: 'win_horiz', name: 'Window horizontal', image: './win_horiz.png', isPremium: true },
    { id: 'win_pano4', name: 'Panoramic window', image: './win_pano4.png', isPremium: true },
    { id: 'win_2sec', name: 'Two sections window', image: './win_2sec.png', isPremium: true },
  ],
  doors: [
    { id: 'door_swing', name: 'Swing doors', image: './Swing_doors.png', isPremium: false },
    { id: 'door_sliding', name: 'Sliding & accordion doors', image: './Sliding_doors.png', isPremium: false },
  ],
  stairs: [
    { id: 'stair_ladder', name: 'Ladder', image: './stair_ladder.png', isPremium: false },
    { id: 'stair_basic1', name: 'Staircase', image: './stair_basic1.png', isPremium: false },
    { id: 'stair_wood1', name: 'Staircase', image: './stair_wood1.png', isPremium: true },
    { id: 'stair_float1', name: 'Staircase', image: './stair_float1.png', isPremium: true },
    { id: 'stair_spiral_black', name: 'Staircase', image: './stair_spiral_black.png', isPremium: false },
    { id: 'stair_wood_norail', name: 'Staircase', image: './stair_wood_norail.png', isPremium: true },
    { id: 'stair_down', name: 'Stairs down', image: './stair_down.png', isPremium: true },
    { id: 'stair_spiral_white', name: 'Staircase', image: './stair_spiral_white.png', isPremium: true },
  ],
  fireplaces: [
    { id: 'fp_stone_grey', name: 'Fireplace', image: './fp_stone_grey.png', isPremium: false },
    { id: 'fp_wood_classic1', name: 'Fireplace', image: './fp_wood_classic1.png', isPremium: false },
    { id: 'fp_brick_rustic', name: 'Fireplace', image: './fp_brick_rustic.png', isPremium: false },
    { id: 'fp_modern_hanging', name: 'Fireplace', image: './fp_modern_hanging.png', isPremium: false },
    { id: 'fp_modern_white1', name: 'Fireplace', image: './fp_modern_white1.png', isPremium: true },
    { id: 'fp_modern_white2', name: 'Fireplace', image: './fp_modern_white2.png', isPremium: true },
    { id: 'fp_stove_black', name: 'Fireplace', image: './fp_stove_black.png', isPremium: true },
    { id: 'fp_black_brick_in', name: 'Fireplace', image: './fp_black_brick_in.png', isPremium: true },
    { id: 'fp_wood_classic2', name: 'Fireplace', image: './fp_wood_classic2.png', isPremium: true },
  ],
  pillars: [
    { id: 'beam_square', name: 'Square beam', image: './beam_square.png', isPremium: false },
    { id: 'pilaster_flat', name: 'Pilaster', image: './beam_round.png', isPremium: false },
    { id: 'pilaster_round', name: 'Pilaster', image: './pilaster_round.png', isPremium: false },
    { id: 'pillar_thick', name: 'Pillar', image: './pillar_thick.png', isPremium: true },
    { id: 'pilaster_fancy', name: 'Pilaster', image: './pilaster_fancy.png', isPremium: true },
    { id: 'pillar_style1', name: 'Pillar', image: './pillar_style1.png', isPremium: true },
    { id: 'pillar_style2', name: 'Pillar', image: './pillar_style2.png', isPremium: true },
    { id: 'pillar_half', name: 'Pillar', image: './pillar_half.png', isPremium: true },
  ],
  partitions: [
    { id: 'part_glass1', name: 'Glass partition', image: './part_glass1.png', isPremium: false },
    { id: 'part_glass2', name: 'Glass partition', image: './part_glass2.png', isPremium: false },
    { id: 'part_glass_grid1', name: 'Glass partition', image: './part_glass_grid1.png', isPremium: false },
    { id: 'part_glass_grid2', name: 'Glass partition', image: './part_glass_grid2.png', isPremium: true },
    { id: 'part_glass_block', name: 'Glass block', image: './part_glass_block.png', isPremium: true },
    { id: 'part_glass3', name: 'Glass partition', image: './part_glass3.png', isPremium: true },
    { id: 'part_glass4', name: 'Glass partition', image: './part_glass4.png', isPremium: true },
    { id: 'part_glass5', name: 'Glass partition', image: './part_glass5.png', isPremium: true },
    { id: 'part_glass6', name: 'Glass partition', image: './part_glass6.png', isPremium: true },
    { id: 'part_glass7', name: 'Glass partition', image: './part_glass7.png', isPremium: true },
  ],
  wall_panels: [
    { id: 'panel_slats_dark', name: 'Decorative slats', image: './panel_slats_dark.png', isPremium: false },
    { id: 'panel_slats_light', name: 'Decorative slats', image: './panel_slats_light.png', isPremium: false },
    { id: 'panel_slat_dark', name: 'Decorative slat', image: './panel_slat_dark.png', isPremium: true },
    { id: 'panel_slat_light', name: 'Decorative slat', image: './panel_slat_light.png', isPremium: true },
    { id: 'panel_deco_light1', name: 'Decorative panel', image: './panel_deco_light1.png', isPremium: true },
    { id: 'panel_plaster_circle', name: 'Plaster panel', image: './panel_plaster_circle.png', isPremium: true },
    { id: 'panel_plaster_curve1', name: 'Plaster panel', image: './panel_plaster_curve1.png', isPremium: true },
    { id: 'panel_plaster_curve2', name: 'Plaster panel', image: './panel_plaster_curve2.png', isPremium: true },
    { id: 'panel_plaster_wave', name: 'Plaster panel', image: './panel_plaster_wave.png', isPremium: true },
    { id: 'panel_wood_paneled1', name: 'Wooden panel', image: './panel_wood_paneled1.png', isPremium: true },
  ],
  fences: [
    { id: 'fence_wood_tall', name: 'Fence', image: './fence_wood_tall.png', isPremium: false },
    { id: 'fence_wood_wide', name: 'Fence', image: './fence_wood_wide.png', isPremium: false },
    { id: 'fence_metal_black', name: 'Fence', image: './fence_metal_black.png', isPremium: true },
    { id: 'fence_wood_picket', name: 'Fence', image: './fence_wood_picket.png', isPremium: true },
  ],
  roof: [
    { id: 'roof_gable1', name: 'Gable', image: './roof_gable1.png', isPremium: false },
    { id: 'roof_mansard1', name: 'Mansard', image: './roof_mansard1.png', isPremium: false },
    { id: 'roof_pyramid', name: 'Pyramid', image: './roof_pyramid.png', isPremium: true },
    { id: 'roof_gambrel', name: 'Gambrel', image: './roof_gambrel.png', isPremium: true },
    { id: 'roof_jerkinhead', name: 'Jerkinhead', image: './roof_jerkinhead.png', isPremium: true },
  ],
  straight_sofas: [
    { id: 'sofa_straight_beige1', name: 'Sofa', image: './sofa_straight_beige1.png', isPremium: false },
    { id: 'sofa_straight_beige2', name: 'Sofa', image: './sofa_straight_beige2.png', isPremium: false },
    { id: 'sofa_straight_bw', name: 'Sofa', image: './sofa_straight_bw.png', isPremium: false },
    { id: 'sofa_straight_grey1', name: 'Sofa', image: './sofa_straight_grey1.png', isPremium: false },
    { id: 'bench_seat_bw', name: 'Bench seat', image: './bench_seat_bw.png', isPremium: true },
    { id: 'sofa_straight_grey2', name: 'Sofa', image: './sofa_straight_grey2.png', isPremium: true },
    { id: 'sofa_wade_verona', name: 'Sofa WADE Verona', image: './sofa_wade_verona.png', isPremium: true },
    { id: 'sofa_loft_straight', name: 'Loft sofa', image: './sofa_loft_straight.png', isPremium: true },
  ],
  corner_sofas: [
    { id: 'sofa_corner_loft1', name: 'Loft sofa', image: './sofa_corner_loft1.png', isPremium: false },
    { id: 'sofa_corner_lightgrey', name: 'Sofa', image: './sofa_corner_lightgrey.png', isPremium: false },
    { id: 'sofa_palermo_beige', name: 'Palermo corner sofa', image: './sofa_palermo_beige.png', isPremium: false },
    { id: 'sofa_corner_darkbeige', name: 'Sofa', image: './sofa_corner_darkbeige.png', isPremium: false },
    { id: 'sofa_chicago_blue', name: 'Chicago corner sofa', image: './sofa_chicago_blue.png', isPremium: false },
  ],
  modular_sofas: [
    { id: 'ontario_ottoman', name: "Sofa 'Ontario'", image: './ontario_ottoman.png', isPremium: false },
    { id: 'ontario_corner', name: "Sofa 'Ontario'", image: './ontario_corner.png', isPremium: false },
    { id: 'ontario_single', name: "Sofa 'Ontario'", image: './ontario_single.png', isPremium: false },
    { id: 'ontario_table', name: 'Ontario', image: './ontario_table.png', isPremium: false },
    { id: 'ontario_wide', name: 'Ontario', image: './ontario_wide.png', isPremium: true },
  ],
  armchairs: [
    { id: 'armchair_classic1', name: 'Armchair', image: './armchair_classic1.png', isPremium: false },
    { id: 'armchair_classic2', name: 'Armchair', image: './armchair_classic2.png', isPremium: false },
    { id: 'armchair_blocky_grey', name: 'Armchair', image: './armchair_blocky_grey.png', isPremium: false },
    { id: 'armchair_curved_brown', name: 'Armchair', image: './armchair_curved_brown.png', isPremium: false },
    { id: 'armchair_thinlegs_grey', name: 'Armchair', image: './armchair_thinlegs_grey.png', isPremium: false },
    { id: 'armchair_woodframe_grey', name: 'Armchair', image: './armchair_woodframe_grey.png', isPremium: false },
  ],
  ottomans: [
    { id: 'ottoman_cube_beige', name: 'Ottoman', image: './ottoman_cube_beige.png', isPremium: false },
    { id: 'ottoman_teal_tufted', name: 'Ottoman', image: './ottoman_teal_tufted.png', isPremium: false },
    { id: 'ottoman_grey_square', name: 'Ottoman', image: './ottoman_grey_square.png', isPremium: false },
    { id: 'ottoman_red_round', name: 'Ottoman', image: './ottoman_red_round.png', isPremium: false },
    { id: 'ottoman_grey_double', name: 'Ottoman', image: './ottoman_grey_double.png', isPremium: false },
    { id: 'ottoman_darkblue', name: 'Ottoman', image: './ottoman_darkblue.png', isPremium: false },
    { id: 'ottoman_white_redtop', name: 'Ottoman', image: './ottoman_white_redtop.png', isPremium: true },
    { id: 'ottoman_grey_legs', name: 'Ottoman', image: './ottoman_grey_legs.png', isPremium: true },
    { id: 'ottoman_triconfort', name: 'Ottoman Triconfort Biarritz', image: './ottoman_triconfort.png', isPremium: true },
  ]
};
