export const decorationData = {
    categories: [
        { id: 'paint', name: 'Paint', icon: '🎨' },
        { id: 'tiles', name: 'Ceramic Tiles', icon: '🧱' },
        { id: 'wallpapers', name: 'Wallpapers', icon: '📜' },
        { id: 'stone', name: 'Stone', icon: '🪨' },
        { id: 'concrete', name: 'Concrete', icon: '🏗️' },
        { id: 'brick', name: 'Brick', icon: '🧱' }
    ],
    paint: {
        colors: [
            // Neutrals
            '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121',
            // Warm
            '#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F',
            // Earth
            '#EFEBE9', '#D7CCC8', '#BCAAA4', '#A1887F', '#8D6E63', '#795548', '#6D4C41', '#5D4037',
            // Deep
            '#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F',
            // Nature
            '#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C',
            // Sunset
            '#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00'
        ],
        gradients: [
            { name: 'Morning Sky', value: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' },
            { name: 'Warm Sunset', value: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)' },
            { name: 'Ocean Deep', value: 'linear-gradient(to right, #434343 0%, #000000 100%)' }
        ]
    },
    items: {
        tiles: [
            { id: 'tile_1', name: 'White Marble', image: '/decoration/tiles/marble_1.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'tile_2', name: 'Black Granite', image: '/decoration/tiles/granite_1.jpg', defaultScale: 0.008, plan: 'STANDARD' },
            { id: 'tile_3', name: 'Terracotta', image: '/decoration/tiles/terracotta_1.jpg', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'tile_4', name: 'Beige Travertine', image: '/decoration/tiles/travertine_1.png', defaultScale: 0.008, plan: 'STANDARD' },
            { id: 'tile_5', name: 'Charcoal Slate', image: '/decoration/tiles/slate_1.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'tile_6', name: 'Victorian Pattern', image: '/decoration/tiles/mosaic_1.png', defaultScale: 0.008, plan: 'PREMIUM' },
            { id: 'tile_7', name: 'Sandstone', image: '/decoration/tiles/sandstone_1.png', defaultScale: 0.008, plan: 'BASIC' }
        ],
        wallpapers: [
            { id: 'wp_1', name: 'Geometric Pattern', image: '/decoration/wallpapers/geom_pattern.png', defaultScale: 0.004, plan: 'BASIC' },
            { id: 'wp_2', name: 'Floral Vintage', image: '/decoration/wallpapers/floral_vintage.png', defaultScale: 0.006, plan: 'STANDARD' },
            { id: 'wp_3', name: 'Damask Royal', image: '/decoration/wallpapers/damask_royal.png', defaultScale: 0.005, plan: 'PREMIUM' },
            { id: 'wp_4', name: 'Tropical Leaves', image: '/decoration/wallpapers/tropical_leaves.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'wp_5', name: 'Minimal Stripes', image: '/decoration/wallpapers/minimal_stripes.png', defaultScale: 0.004, plan: 'STANDARD' },
            { id: 'wp_6', name: 'Watercolor Wash', image: '/decoration/wallpapers/watercolor_wash.png', defaultScale: 0.006, plan: 'BASIC' },
            { id: 'wp_7', name: 'Industrial Loft', image: '/decoration/wallpapers/industrial_loft.png', defaultScale: 0.008, plan: 'PREMIUM' }
        ],
        stone: [
            { id: 'stone_1', name: 'Stacked Slate', image: '/decoration/stone/stacked_slate.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'stone_2', name: 'Rough Limestone', image: '/decoration/stone/limestone.png', defaultScale: 0.012, plan: 'STANDARD' },
            { id: 'stone_3', name: 'Granite River', image: '/decoration/stone/granite_river.png', defaultScale: 0.006, plan: 'BASIC' },
            { id: 'stone_4', name: 'Basalt Rock', image: '/decoration/stone/basalt_rock.png', defaultScale: 0.012, plan: 'PREMIUM' },
            { id: 'stone_5', name: 'Quartz Crystal', image: '/decoration/stone/quartz_crystal.png', defaultScale: 0.006, plan: 'BASIC' },
            { id: 'stone_6', name: 'Travertine Silver', image: '/decoration/stone/travertine_silver.png', defaultScale: 0.008, plan: 'STANDARD' },
            { id: 'stone_7', name: 'Sandstone Desert', image: '/decoration/stone/sandstone_desert.png', defaultScale: 0.016, plan: 'BASIC' }
        ],
        concrete: [
            { id: 'conc_1', name: 'Industrial Grey', image: '/decoration/concrete/industrial_grey.png', defaultScale: 0.006, plan: 'BASIC' },
            { id: 'conc_2', name: 'Exposed Concrete', image: '/decoration/concrete/exposed_concrete.png', defaultScale: 0.008, plan: 'STANDARD' },
            { id: 'conc_3', name: 'Polished Floor', image: '/decoration/concrete/polished_floor.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'conc_4', name: 'Brutalist Wall', image: '/decoration/concrete/brutalist_wall.png', defaultScale: 0.012, plan: 'PREMIUM' },
            { id: 'conc_5', name: 'Cement Smooth', image: '/decoration/concrete/cement_smooth.png', defaultScale: 0.008, plan: 'BASIC' },
            { id: 'conc_6', name: 'Microcement', image: '/decoration/concrete/microcement.png', defaultScale: 0.005, plan: 'STANDARD' },
            { id: 'conc_7', name: 'Weathered Slab', image: '/decoration/concrete/weathered_slab.png', defaultScale: 0.009, plan: 'BASIC' }
        ],
        brick: [
            { id: 'brick_1', name: 'London Red', image: '/decoration/brick/london_red.png', defaultScale: 0.012, plan: 'BASIC' },
            { id: 'brick_2', name: 'Rustic White', image: '/decoration/brick/rustic_white.png', defaultScale: 0.012, plan: 'STANDARD' },
            { id: 'brick_3', name: 'Antique Yellow', image: '/decoration/brick/antique_yellow.png', defaultScale: 0.012, plan: 'BASIC' },
            { id: 'brick_4', name: 'Charcoal Modern', image: '/decoration/brick/charcoal_modern.png', defaultScale: 0.016, plan: 'PREMIUM' },
            { id: 'brick_5', name: 'Salvaged Grey', image: '/decoration/brick/salvaged_grey.png', defaultScale: 0.012, plan: 'BASIC' },
            { id: 'brick_6', name: 'Classic Red', image: '/decoration/brick/classic_red.png', defaultScale: 0.012, plan: 'STANDARD' },
            { id: 'brick_7', name: 'Painted White', image: '/decoration/brick/painted_white.png', defaultScale: 0.016, plan: 'BASIC' }
        ]
    }
};
