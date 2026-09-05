export type GuideCharacterId = 'yatri' | 'virasat' | 'safar' | 'rasika' | 'khoj' | 'prithvi';

export interface GuideCharacterInfo {
  id: GuideCharacterId;
  name: string;
  hindiName: string;
  title: string;
  meaning: string;
  role: string;
  personality: string;
  themeColor: {
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    bgLight: string;
    text: string;
  };
  greeting: string;
  tagline: string;
  defaultSpeech: string;
  quickActions: Array<{
    label: string;
    actionType: 'navigate' | 'filter' | 'ai' | 'route' | 'custom';
    payload?: string;
  }>;
}

export interface CityGuideRecommendation {
  city: string;
  guideId: GuideCharacterId;
  highlightTitle: string;
  highlightDescription: string;
  actionLabel: string;
  targetTab?: string;
  placeId?: string;
  tags: string[];
}

export const GUIDE_CHARACTERS: Record<GuideCharacterId, GuideCharacterInfo> = {
  yatri: {
    id: 'yatri',
    name: 'Yatri',
    hindiName: 'यात्री',
    title: 'Your Travel Companion',
    meaning: 'The Traveler / Explorer',
    role: 'Primary YatraVerse travel companion guiding curiosity, exploration, and discovery across India.',
    personality: 'Warm, welcoming, adventurous, and insightful.',
    themeColor: {
      primary: '#B45309', // amber-700
      secondary: '#D97706', // amber-600
      accent: '#FDE68A', // amber-200
      border: '#FCD34D', // amber-300
      bgLight: '#FEF3C7', // amber-100
      text: '#92400E', // amber-800
    },
    greeting: 'Namaste! 👋',
    tagline: 'Ready to discover India?',
    defaultSpeech: 'Explore timeless heritage, living traditions, and unforgettable journeys across India.',
    quickActions: [
      { label: 'Explore India', actionType: 'navigate', payload: 'dashboard' },
      { label: 'Ask YatraVerse AI', actionType: 'ai', payload: 'What are the top must-visit heritage landmarks in India?' },
      { label: 'Plan My Journey', actionType: 'navigate', payload: 'itinerary' },
    ],
  },
  virasat: {
    id: 'virasat',
    name: 'Virasat',
    hindiName: 'विरासत',
    title: 'Heritage & Monument Specialist',
    meaning: 'Heritage / Legacy',
    role: 'Specialist in 45 UNESCO World Heritage sites, monument architecture, dynastic history, and living folklore.',
    personality: 'Scholarly, respectful, knowledgeable, and observant.',
    themeColor: {
      primary: '#1E3A8A', // blue-900 / lapis
      secondary: '#2563EB', // blue-600
      accent: '#DBEAFE', // blue-100
      border: '#BFDBFE', // blue-200
      bgLight: '#EFF6FF', // blue-50
      text: '#1E40AF', // blue-800
    },
    greeting: 'Pranam! 🏛️',
    tagline: 'Discover the story behind every monument.',
    defaultSpeech: 'Every carved stone and vaulted arch tells a chapter of India’s five-millennia civilization.',
    quickActions: [
      { label: '45 UNESCO Sites', actionType: 'navigate', payload: 'heritage' },
      { label: '3D Heritage Museum', actionType: 'navigate', payload: '3d' },
      { label: 'Ask Virasat', actionType: 'ai', payload: 'Tell me the architectural secrets and historical chronicles of this site.' },
    ],
  },
  safar: {
    id: 'safar',
    name: 'Safar',
    hindiName: 'सफ़र',
    title: 'Journey & Transit Specialist',
    meaning: 'The Journey / Transit',
    role: 'Specialist in Indian Railways, suburban train networks, multimodal route planning, distances, and fares.',
    personality: 'Dynamic, punctual, pragmatic, and helpful.',
    themeColor: {
      primary: '#047857', // emerald-700
      secondary: '#059669', // emerald-600
      accent: '#A7F3D0', // emerald-200
      border: '#6EE7B7', // emerald-300
      bgLight: '#ECFDF5', // emerald-50
      text: '#065F46', // emerald-800
    },
    greeting: 'Subh Yatra! 🚆',
    tagline: "Let's find the easiest way to reach your destination.",
    defaultSpeech: 'Connecting stations, suburban locals, and multimodal routes with verified timing and fares.',
    quickActions: [
      { label: 'Plan Transit Route', actionType: 'navigate', payload: 'routes' },
      { label: 'Suburban Rail Lines', actionType: 'navigate', payload: 'mumbai-local' },
      { label: 'Interactive Travel Map', actionType: 'navigate', payload: 'map' },
    ],
  },
  rasika: {
    id: 'rasika',
    name: 'Rasika',
    hindiName: 'रसिका',
    title: 'Food, Culture & Crafts Connoisseur',
    meaning: 'Connoisseur of Taste & Aesthetics',
    role: 'Specialist in authentic regional cuisine, GI-tagged handlooms, master artisans, and seasonal festivals.',
    personality: 'Passionate, sensory, welcoming, and celebrating local communities.',
    themeColor: {
      primary: '#C2410C', // orange-700 / terracotta
      secondary: '#EA580C', // orange-600
      accent: '#FFEDD5', // orange-100
      border: '#FED7AA', // orange-200
      bgLight: '#FFF7ED', // orange-50
      text: '#9A3412', // orange-800
    },
    greeting: 'Aao ji! 🍛',
    tagline: "Don't just visit India. Taste it. Experience it.",
    defaultSpeech: 'From centuries-old spice blends to master weaver looms, discover India through its living flavors and crafts.',
    quickActions: [
      { label: 'Traditional Crafts & GI Art', actionType: 'navigate', payload: 'culture-artisans' },
      { label: 'Regional Food & Delicacies', actionType: 'navigate', payload: 'culture-artisans' },
      { label: 'Local Living Experiences', actionType: 'navigate', payload: 'culture-artisans' },
    ],
  },
  khoj: {
    id: 'khoj',
    name: 'Khoj',
    hindiName: 'खोज',
    title: 'Hidden India & Offbeat Explorer',
    meaning: 'The Quest / Discovery',
    role: 'Specialist in lesser-known stepwells, quiet heritage alleys, non-commercial bazaars, and offbeat cultural spots.',
    personality: 'Curious, observant, adventurous, and authentic.',
    themeColor: {
      primary: '#4D7C0F', // lime-700 / forest olive
      secondary: '#65A30D', // lime-600
      accent: '#ECFCCB', // lime-100
      border: '#D9F99D', // lime-200
      bgLight: '#F7FEE7', // lime-50
      text: '#3F6212', // lime-800
    },
    greeting: 'Khoj Shuru Karein? 🔍',
    tagline: "There's more to India than the famous places.",
    defaultSpeech: 'Uncover tranquil stepwells, tucked-away art districts, and sacred ghats beyond tourist crowds.',
    quickActions: [
      { label: 'Discover Hidden India', actionType: 'custom', payload: 'hidden-india' },
      { label: 'Local Artisans & Alleyways', actionType: 'navigate', payload: 'culture-artisans' },
      { label: 'Offbeat Trails', actionType: 'ai', payload: 'Suggest quiet, lesser-known heritage and cultural places to explore.' },
    ],
  },
  prithvi: {
    id: 'prithvi',
    name: 'Prithvi',
    hindiName: 'पृथ्वी',
    title: 'Responsible Tourism & Heritage Guardian',
    meaning: 'Mother Earth / Sustainable Preservation',
    role: 'Specialist in sustainable travel, accessible facilities, crowd-conscious timing, and supporting local artisan economies.',
    personality: 'Thoughtful, compassionate, mindful, and protective of heritage.',
    themeColor: {
      primary: '#0F766E', // teal-700
      secondary: '#0D9488', // teal-600
      accent: '#CCFBF1', // teal-100
      border: '#99F6E4', // teal-200
      bgLight: '#F0FDFA', // teal-50
      text: '#115E59', // teal-800
    },
    greeting: 'Namaskar! 🌿',
    tagline: 'Travel thoughtfully. Leave a positive footprint.',
    defaultSpeech: 'Respect fragile monuments, patronize indigenous craft cooperatives, and travel with an accessible, lighter step.',
    quickActions: [
      { label: 'Accessible Travel & Facilities', actionType: 'navigate', payload: 'accessibility' },
      { label: 'Destination Carrying Capacity', actionType: 'navigate', payload: 'intelligence' },
      { label: 'Responsible Traveler Guidelines', actionType: 'custom', payload: 'responsible-guidelines' },
    ],
  },
};

// Verified City-Specific Guide Recommendations (Strictly city-isolated)
export const CITY_GUIDE_RECOMMENDATIONS: Record<string, CityGuideRecommendation[]> = {
  mumbai: [
    {
      city: 'Mumbai',
      guideId: 'virasat',
      highlightTitle: 'Victorian Gothic & Art Deco Ensembles',
      highlightDescription: 'UNESCO World Heritage precinct connecting Marine Drive Art Deco buildings with Oval Maidan Gothic gems.',
      actionLabel: 'Explore Victorian Architecture',
      placeId: 'chhatrapati-shivaji-terminus',
      tags: ['UNESCO Inscribed 2018', 'Heritage Walk', 'Colonial Basalt'],
    },
    {
      city: 'Mumbai',
      guideId: 'safar',
      highlightTitle: 'Mumbai Suburban Railway Lifeline',
      highlightDescription: 'Western & Central lines moving 7.5 million daily commuters. Western Line connects Churchgate to suburban heritage.',
      actionLabel: 'View Suburban Rail Map',
      targetTab: 'mumbai-local',
      tags: ['Local Fast/Slow', 'Churchgate-CSMT', 'Verified Fares'],
    },
    {
      city: 'Mumbai',
      guideId: 'rasika',
      highlightTitle: 'Dadar Vada Pav & Konkan Seafood',
      highlightDescription: 'Authentic Girgaon Chowpatty street eats and Malvani surmai fry infused with kokum and fresh coconut.',
      actionLabel: 'Discover Mumbai Flavors',
      targetTab: 'culture-artisans',
      tags: ['Working-class Heritage', 'Kokum Curries', 'Local Stalls'],
    },
    {
      city: 'Mumbai',
      guideId: 'khoj',
      highlightTitle: 'Banganga Sacred Water Tank & Khotachiwadi',
      highlightDescription: '12th-century mythological spring tank in Malabar Hill and wooden Portuguese-style heritage homes in Girgaon.',
      actionLabel: 'Discover Hidden Mumbai',
      targetTab: 'culture-artisans',
      tags: ['12th-century Silhara', 'Wooden Verandas', 'Peaceful'],
    },
    {
      city: 'Mumbai',
      guideId: 'prithvi',
      highlightTitle: 'Sanjay Gandhi National Park & Kanheri Conservation',
      highlightDescription: 'One of the world’s rare protected forested parks inside city limits. Use e-cycles to reach rock-cut Buddhist caves.',
      actionLabel: 'Check Green Transit Tips',
      targetTab: 'accessibility',
      tags: ['Zero Emission E-cycles', 'Ramp Access', 'Forest Canopy'],
    },
  ],
  delhi: [
    {
      city: 'Delhi',
      guideId: 'virasat',
      highlightTitle: 'Qutb Complex & Humayun’s Garden Tomb',
      highlightDescription: 'Precursor to the Taj Mahal with Persian charbagh layout, alongside the 72.5m 12th-century victory minaret.',
      actionLabel: 'Explore Mughal Architecture',
      placeId: 'humayuns-tomb',
      tags: ['UNESCO Heritage', 'Persian Charbagh', 'Red Sandstone'],
    },
    {
      city: 'Delhi',
      guideId: 'safar',
      highlightTitle: 'Delhi Metro Yellow & Violet Heritage Lines',
      highlightDescription: 'Rapid air-conditioned underground transit directly linking Old Delhi (Chandni Chowk) with Qutab Minar station.',
      actionLabel: 'Check Metro Connections',
      targetTab: 'routes',
      tags: ['Yellow Line', 'Direct Monument Access', 'High Frequency'],
    },
    {
      city: 'Delhi',
      guideId: 'rasika',
      highlightTitle: 'Chandni Chowk Paranthe & Daryaganj Mughlai',
      highlightDescription: 'Centuries-old Paranthe Wali Gali, slow-simmered nihari, and royal jaleba fried in pure ghee in Shahjahanabad.',
      actionLabel: 'Savor Shahjahanabad Delicacies',
      targetTab: 'culture-artisans',
      tags: ['300-year Culinary History', 'Old Delhi Bazaars', 'Kulfi Falooda'],
    },
    {
      city: 'Delhi',
      guideId: 'khoj',
      highlightTitle: 'Agrasen ki Baoli & Mehrauli Archaeological Park',
      highlightDescription: 'Ancient 108-step reservoir tucked behind Connaught Place, and 200 forgotten sultanate tombs hidden in Mehrauli forest.',
      actionLabel: 'Explore Secret Stepwells',
      targetTab: 'culture-artisans',
      tags: ['14th-Century Baoli', 'Ruins in Greenery', 'Photogenic'],
    },
    {
      city: 'Delhi',
      guideId: 'prithvi',
      highlightTitle: 'Eco-Battery Rickshaws & Red Fort Wheelchair Ramps',
      highlightDescription: 'ASI-mandated tactile paths and motorized wheelchairs available at Humayun’s Tomb and Red Fort entrance pavilions.',
      actionLabel: 'Accessibility & Clean Transit',
      targetTab: 'accessibility',
      tags: ['ASI Ramp Approved', 'Solar Rickshaws', 'Clean Energy Zone'],
    },
  ],
  jaipur: [
    {
      city: 'Jaipur',
      guideId: 'virasat',
      highlightTitle: 'Jantar Mantar UNESCO Astronomical Yantras',
      highlightDescription: 'World’s largest stone sundial (Samrat Yantra) built in 1734 by Sawai Jai Singh II, measuring time to 2 seconds accuracy.',
      actionLabel: 'Discover Astronomical Legacy',
      placeId: 'jantar-mantar',
      tags: ['UNESCO World Heritage', 'Stone Observatory', 'Precision Geometry'],
    },
    {
      city: 'Jaipur',
      guideId: 'rasika',
      highlightTitle: 'Blue Pottery of Kot Jewar & Sanganer Block Prints',
      highlightDescription: 'GI-tagged turquoise quartz pottery made without clay, and natural vegetable-dye handblock printing by Chippa artisans.',
      actionLabel: 'Meet Master Potters & Dyers',
      targetTab: 'culture-artisans',
      tags: ['GI Tagged', 'No-Clay Quartz Glaze', 'Vegetable Dyes'],
    },
    {
      city: 'Jaipur',
      guideId: 'khoj',
      highlightTitle: 'Panna Meena ka Kund Stepwell & Galta Ji',
      highlightDescription: 'Geometric 16th-century criss-cross stepwell near Amer, and the serene sacred natural spring temple in the Aravalli hills.',
      actionLabel: 'Uncover Rajput Stepwells',
      targetTab: 'culture-artisans',
      tags: ['Symmetrical Stairs', 'Aravalli Valley', 'Quiet Sunrise'],
    },
  ],
  agra: [
    {
      city: 'Agra',
      guideId: 'virasat',
      highlightTitle: 'Taj Mahal & Fatehpur Sikri Red Citadel',
      highlightDescription: 'Pietra dura marble inlay of the Taj Mahal and the uninhabited imperial sandstone ghost city of Emperor Akbar.',
      actionLabel: 'Explore Imperial Mughal Circuit',
      placeId: 'taj-mahal',
      tags: ['Pietra Dura Inlay', 'Mughal Zenith', 'Yamuna Riverbank'],
    },
    {
      city: 'Agra',
      guideId: 'rasika',
      highlightTitle: 'Agra Petha & Zari Zardozi Embroidery',
      highlightDescription: 'Translucent ash gourd confectionery created during royal kitchen era, alongside gold-thread metallic embroidery artisans.',
      actionLabel: 'Discover Agra Royal Crafts',
      targetTab: 'culture-artisans',
      tags: ['GI Advocacy Sweet', 'Royal Confectioners', 'Master Embroiderers'],
    },
    {
      city: 'Agra',
      guideId: 'khoj',
      highlightTitle: 'Mehtab Bagh Moonlight Garden & Chini ka Rauza',
      highlightDescription: 'Mughal riverfront pleasure garden aligned with the Taj across Yamuna, and Persian glazed tilework tomb of Afzal Khan.',
      actionLabel: 'View Taj From Across The River',
      targetTab: 'culture-artisans',
      tags: ['No-Crowd Sunset', 'Glazed Blue Tiles', 'Yamuna Reflection'],
    },
  ],
  varanasi: [
    {
      city: 'Varanasi',
      guideId: 'virasat',
      highlightTitle: 'Dashashwamedh Ghat & Sarnath Deer Park',
      highlightDescription: 'Oldest continuously inhabited city on earth, and the sacred deer park where Gautama Buddha delivered his First Sermon.',
      actionLabel: 'Explore Sacred Heritage',
      placeId: 'dashashwamedh-ghat',
      tags: ['First Sermon Sarnath', 'Ganga Aarti', 'Ancient Civilization'],
    },
    {
      city: 'Varanasi',
      guideId: 'rasika',
      highlightTitle: 'Banarasi Zari Handloom & Kachori Jalebi',
      highlightDescription: 'Six centuries of master Muslim and Hindu karigars weaving pure silver-electroplated silk, and morning street breakfasts.',
      actionLabel: 'Explore Master Weavers',
      targetTab: 'culture-artisans',
      tags: ['UNESCO Craft City', 'GI Tagged Handloom', 'Morning Ghat Food'],
    },
    {
      city: 'Varanasi',
      guideId: 'khoj',
      highlightTitle: 'Panchganga Ghat Hidden Subterranean Cells',
      highlightDescription: 'Confluence of five sacred unseen rivers with tranquil stone pavilions and meditation chambers far from central tourist piers.',
      actionLabel: 'Discover Sacred Ghat Alleys',
      targetTab: 'culture-artisans',
      tags: ['Tranquil Atmosphere', 'Ancient Stepways', 'Spiritual Silence'],
    },
  ],
  kochi: [
    {
      city: 'Kochi',
      guideId: 'virasat',
      highlightTitle: 'Fort Kochi Chinese Fishing Nets & Mattancherry Palace',
      highlightDescription: 'Cantilevered shore-operated fishing nets dating to 14th-century Kublai Khan era and Dutch Palace Hindu murals.',
      actionLabel: 'Explore Maritime Heritage',
      placeId: 'fort-kochi',
      tags: ['Maritime Silk Road', 'Cantilever Nets', 'Mural Frescoes'],
    },
    {
      city: 'Kochi',
      guideId: 'safar',
      highlightTitle: 'Kochi Water Metro Electric Boat Transit',
      highlightDescription: 'India’s first integrated battery-powered urban water ferry system seamlessly connecting 10 mainland and island terminals.',
      actionLabel: 'Experience Water Metro',
      targetTab: 'routes',
      tags: ['Zero Emission Boats', 'Island Hopping', 'Modern Public Transit'],
    },
    {
      city: 'Kochi',
      guideId: 'rasika',
      highlightTitle: 'Jew Town Spice Markets & Appam Stew',
      highlightDescription: 'Old Jewish quarter warehousing fragrant green cardamom, black pepper, and Syrian Christian coconut milk stews.',
      actionLabel: 'Discover Malabar Spice Heritage',
      targetTab: 'culture-artisans',
      tags: ['Cardamom & Pepper', 'Antiques Bazaars', 'Coastal Delicacies'],
    },
  ],
};
