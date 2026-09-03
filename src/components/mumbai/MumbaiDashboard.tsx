import React, { useState, useEffect } from 'react';
import { PlaceSummary, StateItem, CityWeather } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Sun, 
  Bell, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Box, 
  CalendarDays, 
  ChevronRight,
  Landmark,
  Palmtree,
  Trees,
  Building,
  Utensils,
  Clock,
  Send,
  Star,
  Compass
} from 'lucide-react';
import { InteractiveMap } from '../map/InteractiveMap';

interface MumbaiDashboardProps {
  places: PlaceSummary[];
  states: StateItem[];
  selectedCity: string;
  onSelectPlace: (placeId: string) => void;
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenAIChatWithMessage?: (msg: string) => void;
}

export const MumbaiDashboard: React.FC<MumbaiDashboardProps> = ({
  places,
  states,
  selectedCity,
  onSelectPlace,
  onNavigateToPlace,
  onView3DPlace,
  onNavigateTab,
  onSearchSubmit,
  onOpenAIChatWithMessage,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiMessageInput, setAiMessageInput] = useState('');
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const w = await api.getWeather(selectedCity.toLowerCase());
      setWeather(w);
    };
    fetchWeather();
  }, [selectedCity]);

  const categories = [
    { id: 'heritage', label: 'Heritage', count: '42 Places', icon: Landmark, color: 'text-amber-400 bg-amber-500/10' },
    { id: 'historic', label: 'Historic', count: '36 Places', icon: Building, color: 'text-rose-400 bg-rose-500/10' },
    { id: 'beaches', label: 'Beaches', count: '18 Places', icon: Palmtree, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 'temples', label: 'Temples', count: '29 Places', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'museums', label: 'Museums', count: '28 Places', icon: Landmark, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'nature', label: 'Nature', count: '31 Places', icon: Trees, color: 'text-terracotta bg-terracotta/10' },
  ];

  const suggestedItineraries = [
    {
      id: 'heritage-walk',
      title: `${selectedCity} Heritage Walk`,
      places: '3 Places',
      duration: '5-6 Hours',
      cost: '₹80.00',
      description: 'Explore iconic heritage sites, colonial architecture, and promenades.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'city-in-a-day',
      title: `${selectedCity} in a Day`,
      places: '5 Places',
      duration: '8-10 Hours',
      cost: '₹180.00',
      description: 'Covers the best of attractions, markets, beaches, and local street food.',
      imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'nature-trail',
      title: 'Nature & Caves Trail',
      places: '3 Places',
      duration: '6-7 Hours',
      cost: '₹120.00',
      description: 'Discover ancient rock-cut caves, national parks, and peaceful scenic vistas.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiMessageInput.trim() && onOpenAIChatWithMessage) {
      onOpenAIChatWithMessage(aiMessageInput.trim());
      setAiMessageInput('');
    } else {
      onNavigateTab('ai');
    }
  };

  const cityPlaces = places.filter((p) =>
    selectedCity === 'All' ? true : p.city.toLowerCase().includes(selectedCity.toLowerCase())
  );

  const displayPlaces = cityPlaces.length > 0 ? cityPlaces : places;

  const getCityHeroImage = (city: string) => {
    const c = city.toLowerCase();
    if (c.includes('jaipur') || c.includes('rajasthan')) return 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=1200&auto=format&fit=crop&q=80';
    if (c.includes('delhi')) return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80';
    if (c.includes('kochi') || c.includes('kerala')) return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80';
    if (c.includes('goa')) return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80';
    if (c.includes('agra')) return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80';
    if (c.includes('varanasi')) return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80';
    return displayPlaces[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80';
  };

  const heritageCount = displayPlaces.filter(p => p.category?.toLowerCase() === 'heritage' || p.tags?.includes('heritage')).length || displayPlaces.length;
  const museumCount = displayPlaces.filter(p => p.category?.toLowerCase() === 'museum' || p.tags?.includes('museum') || p.tags?.includes('art') || p.category?.toLowerCase() === 'monument').length || Math.max(1, Math.round(displayPlaces.length * 0.4));
  const natureCount = displayPlaces.filter(p => p.category?.toLowerCase() === 'coastal' || p.category?.toLowerCase() === 'nature' || p.tags?.includes('coastal') || p.tags?.includes('nature')).length || Math.max(1, Math.round(displayPlaces.length * 0.3));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header matching Image 2: Search with ⌘K + 28°C Weather + Notification + User */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar matching Image 2 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-2 border border-parchment-300 bg-parchment-50/90 flex items-center gap-2.5 focus-within:border-terracotta transition-colors">
            <Search className="w-4 h-4 text-charcoal-light ml-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search places in ${selectedCity}, heritage, activities...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-charcoal placeholder-slate-400 focus:outline-none"
            />
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-parchment-100 text-charcoal-light rounded-md border border-parchment-300 flex-shrink-0">
              ⌘ K
            </kbd>
          </div>
        </form>

        {/* Right Info: Weather, Bell, User matching Image 2 */}
        <div className="flex items-center gap-4">
          {/* Weather Widget */}
          <div className="hidden sm:flex items-center gap-2 bg-parchment-100/80 px-3 py-1.5 rounded-xl border border-parchment-300 text-xs text-charcoal-light">
            <Sun className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="font-bold text-charcoal">{weather?.temperature_c || 28}°C</span>
              <span className="text-[10px] text-charcoal-light ml-1">{selectedCity}</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-parchment-100/80 border border-parchment-300 text-charcoal-light hover:text-charcoal transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terracotta text-[10px] font-bold text-slate-950 flex items-center justify-center">
                ✓
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 p-3.5 bg-slate-950 border border-parchment-300 rounded-2xl shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-charcoal pb-2 border-b border-slate-800">
                  <span>Transit & Route Advisory</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Operational</span>
                </div>
                <p className="text-charcoal-light leading-relaxed">
                  All tourism routes, suburban transit, and railway connections in <strong>{selectedCity}</strong> are running normally today.
                </p>
                <div className="text-[10px] text-slate-500 pt-1">Live Status • Verified</div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="flex items-center gap-2.5 pl-1 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-terracotta/20 text-terracotta border border-sage flex items-center justify-center font-bold text-sm group-hover:scale-105 transition">
              {user?.name.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-charcoal group-hover:text-terracotta transition">{user?.name || 'Aman Verma'}</div>
              <div className="text-[10px] text-terracotta">{user?.survey?.traveler_type || 'Explorer'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: Left (8 Cols) + Right (4 Cols) matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Hero Banner, Categories, Top Heritage Places, Why Visit */}
        <div className="lg:col-span-8 space-y-8">
          {/* Panoramic Hero Banner matching Image 2 */}
          <div className="relative rounded-3xl overflow-hidden heritage-border heritage-shadow bg-parchment-50 border border-parchment-300/80 bg-parchment-50 h-80 shadow-2xl">
            <img
              src={getCityHeroImage(selectedCity)}
              alt={`${selectedCity} Heritage`}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-[#080d19]/60 to-transparent" />

            {/* Overlaid Banner Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-charcoal-light font-medium">
                <span className="flex items-center gap-1">🏛️ India</span>
                <span>›</span>
                <span className="text-terracotta font-bold">{selectedCity}</span>
              </div>

              {/* City Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-black text-charcoal font-['Plus_Jakarta_Sans'] tracking-tight">
                    {selectedCity}
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal-light mt-1 font-medium">
                    Explore curated heritage monuments, ancient sites, and verified multi-modal routes in {selectedCity}.
                  </p>
                </div>

                {/* 4 Dynamic Stats Chips */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-xs text-charcoal">
                    <span className="font-bold text-charcoal mr-1">{displayPlaces.length}</span> Curated Places
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-xs text-charcoal">
                    <span className="font-bold text-amber-400 mr-1">{heritageCount}</span> Heritage Sites
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-xs text-charcoal">
                    <span className="font-bold text-blue-400 mr-1">{museumCount}</span> Museums & Culture
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-parchment-300 text-xs text-charcoal">
                    <span className="font-bold text-cyan-400 mr-1">{natureCount}</span> Coastal & Nature
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Categories matching Image 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                Explore Categories
              </h2>
              <button
                onClick={() => onNavigateTab('explore')}
                className="text-xs text-terracotta hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="heritage-border heritage-shadow bg-parchment-50 hover:shadow-md transition-shadow rounded-2xl p-4 border border-parchment-300 bg-parchment-50/90 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer group"
                  >
                    <div className={`p-2.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal group-hover:text-terracotta transition-colors">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-charcoal-light mt-0.5">
                        {cat.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Heritage Places in City matching Image 2 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                Top Heritage Places in {selectedCity}
              </h2>
              <button
                onClick={() => onNavigateTab('explore')}
                className="text-xs text-terracotta hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Carousel / Cards Grid matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayPlaces.slice(0, 6).map((place) => (
                <div
                  key={place.id}
                  className="heritage-border heritage-shadow bg-parchment-50 hover:shadow-md transition-shadow rounded-2xl overflow-hidden border border-parchment-300 bg-parchment-50/90 flex flex-col justify-between group"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-parchment-100">
                    <img
                      src={place.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d19] via-[#080d19]/20 to-transparent" />

                    {/* Category & 3D Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-terracotta border border-emerald-500/30 backdrop-blur-md">
                        {place.category}
                      </span>
                      {place.features && place.features['3d'] && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-terracotta text-slate-950 shadow-md">
                          3D Ready
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectPlace(place.id)}
                        className="text-sm font-bold text-charcoal group-hover:text-terracotta transition-colors cursor-pointer truncate"
                      >
                        {place.name}
                      </h3>
                      <p className="text-[11px] text-charcoal-light mt-1 line-clamp-1">
                        {place.summary}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-parchment-300/80 text-xs">
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{place.rating || 4.7}</span>
                        </div>
                        <span className="text-[10px] text-charcoal-light">
                          {place.area_neighborhood || place.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onSelectPlace(place.id)}
                        className="flex-1 py-1.5 rounded-xl bg-terracotta/10 hover:bg-terracotta text-terracotta hover:text-slate-950 text-xs font-bold transition-all border border-emerald-500/30 text-center"
                      >
                        Explore
                      </button>
                      {place.features && place.features['3d'] && onView3DPlace && (
                        <button
                          onClick={() => onView3DPlace(place.id)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-charcoal-light hover:text-charcoal border border-parchment-300"
                          title="Explore in 3D"
                        >
                          <Box className="w-3.5 h-3.5 text-terracotta" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Visit Section matching Image 2 */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Why Visit {selectedCity}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/80 space-y-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-charcoal">Rich Heritage</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  A blend of ancient architecture, royal palaces, UNESCO ensembles, and iconic monuments.
                </p>
              </div>

              <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/80 space-y-2">
                <div className="p-2 rounded-xl bg-terracotta/10 text-terracotta border border-emerald-500/20 w-fit">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-charcoal">Vibrant Culture</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Traditional arts, colorful bazaars, musical traditions, and authentic Indian hospitality.
                </p>
              </div>

              <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/80 space-y-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                  <Palmtree className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-charcoal">Scenic Vistas</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Stunning promenades, natural lakes, mountain air, and breathtaking sunset panoramas.
                </p>
              </div>

              <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-4 border border-parchment-300 bg-parchment-50/80 space-y-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-charcoal">Culinary Delights</h3>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Regional culinary wonders from street specialties to authentic traditional thalis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (4 cols): Map Preview, Suggested Itineraries, AI Assistant matching Image 2 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Interactive Map Widget matching Image 2 */}
          <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-5 border border-parchment-300 bg-parchment-50/95 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                Explore {selectedCity} on Map
              </h3>
              <button
                onClick={() => onNavigateTab('map')}
                className="text-xs text-terracotta hover:text-emerald-300 font-semibold"
              >
                View Full Map
              </button>
            </div>

            <InteractiveMap
              places={displayPlaces}
              states={states}
              onSelectPlace={onSelectPlace}
              onNavigateToPlace={onNavigateToPlace}
              onView3DPlace={onView3DPlace}
              height="h-56"
            />
          </div>

          {/* Suggested Itineraries matching Image 2 */}
          <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-5 border border-parchment-300 bg-parchment-50/95 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                Suggested Itineraries
              </h3>
              <button
                onClick={() => onNavigateTab('itinerary')}
                className="text-xs text-terracotta hover:text-emerald-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {suggestedItineraries.map((itin) => (
                <div
                  key={itin.id}
                  onClick={() => onNavigateTab('itinerary')}
                  className="p-3 rounded-2xl bg-parchment-100/90 hover:bg-slate-800/90 border border-parchment-300 cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <img
                    src={itin.imageUrl}
                    alt={itin.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-charcoal group-hover:text-terracotta transition-colors truncate">
                        {itin.title}
                      </h4>
                      <span className="text-[11px] font-bold text-terracotta">
                        {itin.cost}
                      </span>
                    </div>
                    <div className="text-[10px] text-charcoal-light mt-0.5">
                      {itin.places} • {itin.duration}
                    </div>
                    <p className="text-[10px] text-charcoal-light line-clamp-1 mt-1">
                      {itin.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated AI Assistant Panel matching Image 2 */}
          <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-5 border border-parchment-300 bg-parchment-50/95 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-terracotta/15 text-terracotta flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
                  AI Travel Assistant
                </h3>
              </div>
              <span className="text-[10px] font-bold text-terracotta flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-parchment-300 text-xs text-charcoal-light leading-relaxed">
              <strong>Namaste {user?.name.split(' ')[0] || 'Friend'}! 🙏</strong> <br />
              How can I help you plan your journey in {selectedCity} today?
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  if (onOpenAIChatWithMessage) onOpenAIChatWithMessage(`Best heritage places to visit in ${selectedCity}`);
                }}
                className="p-2 rounded-xl bg-parchment-100/80 hover:bg-slate-800 text-charcoal-light hover:text-terracotta text-[11px] font-medium text-left border border-parchment-300 transition-colors"
              >
                Best places to visit in {selectedCity}
              </button>
              <button
                onClick={() => {
                  if (onOpenAIChatWithMessage) onOpenAIChatWithMessage(`Plan a 2 day heritage trip for ${selectedCity}`);
                }}
                className="p-2 rounded-xl bg-parchment-100/80 hover:bg-slate-800 text-charcoal-light hover:text-terracotta text-[11px] font-medium text-left border border-parchment-300 transition-colors"
              >
                Plan a 2 day heritage trip
              </button>
              <button
                onClick={() => {
                  if (onOpenAIChatWithMessage) onOpenAIChatWithMessage(`Find nearest railway stations in ${selectedCity}`);
                }}
                className="p-2 rounded-xl bg-parchment-100/80 hover:bg-slate-800 text-charcoal-light hover:text-terracotta text-[11px] font-medium text-left border border-parchment-300 transition-colors"
              >
                Nearest railway connections & fares
              </button>
            </div>

            <form onSubmit={handleAiSend}>
              <div className="relative rounded-2xl bg-slate-950 border border-parchment-300 p-1 flex items-center gap-2 focus-within:border-terracotta">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={aiMessageInput}
                  onChange={(e) => setAiMessageInput(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-charcoal placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-slate-950 font-bold transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
