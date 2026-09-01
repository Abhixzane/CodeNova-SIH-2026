import React, { useEffect, useRef, useState } from 'react';
import { PlaceSummary, StateItem } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  LocateFixed, 
  ExternalLink,
  ArrowRight,
  Box,
  Compass
} from 'lucide-react';
import L from 'leaflet';

interface InteractiveMapProps {
  places: PlaceSummary[];
  states?: StateItem[];
  selectedPlaceId?: string | null;
  onSelectPlace: (placeId: string) => void;
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  states = [],
  selectedPlaceId,
  onSelectPlace,
  onNavigateToPlace,
  onView3DPlace,
  height = 'h-[560px]',
  initialCenter = [20.5937, 78.9629], // All-India default view
  initialZoom = 5,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activePlace, setActivePlace] = useState<PlaceSummary | null>(null);

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'heritage', label: '🏛️ Heritage' },
    { id: 'coastal', label: '🏖️ Coastal' },
    { id: 'nature', label: '🌲 Nature' },
    { id: 'spiritual', label: '✨ Spiritual' },
    { id: 'museum', label: '🏛️ Museums' },
  ];

  const stateCenterMap: Record<string, { center: [number, number]; zoom: number }> = {
    all: { center: [20.5937, 78.9629], zoom: 5 },
    maharashtra: { center: [18.94, 72.83], zoom: 12 },
    rajasthan: { center: [26.9124, 75.7873], zoom: 11 },
    delhi: { center: [28.6139, 77.2090], zoom: 12 },
    kerala: { center: [9.4981, 76.3388], zoom: 11 },
    goa: { center: [15.4909, 73.8278], zoom: 11 },
    'uttar-pradesh': { center: [27.1767, 78.0081], zoom: 11 },
    'himachal-pradesh': { center: [31.1048, 77.1734], zoom: 11 },
  };

  const getPinColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'heritage': return '#f59e0b';
      case 'coastal': return '#06b6d4';
      case 'nature': return '#10b981';
      case 'spiritual': return '#a855f7';
      case 'museum': return '#3b82f6';
      default: return '#10b981';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const filtered = places.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchState = selectedState === 'all' || p.state.toLowerCase().includes(selectedState.toLowerCase());
      return matchCat && matchState;
    });

    filtered.forEach((p) => {
      const lat = p.coordinates.lat || (p.coordinates as any).latitude;
      const lng = p.coordinates.lng || (p.coordinates as any).longitude;
      if (!lat || !lng) return;

      const pinColor = getPinColor(p.category);
      const isSelected = selectedPlaceId === p.id || activePlace?.id === p.id;

      const customIcon = L.divIcon({
        className: 'custom-bharat-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            background: ${pinColor};
            border: 2px solid #ffffff;
            box-shadow: 0 0 15px ${pinColor}aa;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        `,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActivePlace(p);
        onSelectPlace(p.id);
        map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 1.2 });
      });

      markersRef.current[p.id] = marker;
    });

    // If state changed, fly to state center
    if (stateCenterMap[selectedState]) {
      const cfg = stateCenterMap[selectedState];
      map.flyTo(cfg.center, cfg.zoom, { duration: 1.5 });
    }
  }, [places, activeCategory, selectedState, selectedPlaceId]);

  // Handle Locate User
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 14, { duration: 1.5 });

          const userIcon = L.divIcon({
            className: 'user-location-pin',
            html: `
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #10b981;
                border: 3px solid #ffffff;
                box-shadow: 0 0 12px #10b981;
                animation: pulse 2s infinite;
              "></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>📍 Your Current Location</b>')
            .openPopup();
        }
      },
      () => {
        alert('Please allow location permission in your browser to center map on your position.');
      }
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-parchment-300 bg-parchment shadow-2xl">
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* State Selector */}
        <div className="pointer-events-auto bg-parchment-50/90 backdrop-blur-md p-1.5 rounded-2xl border border-parchment-300 flex items-center gap-2 shadow-xl">
          <Layers size={16} className="text-terracotta ml-2" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-transparent text-xs font-bold text-charcoal pr-4 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-parchment-50">🇮🇳 Pan-India Overview</option>
            <option value="maharashtra" className="bg-parchment-50">Maharashtra (Mumbai)</option>
            <option value="rajasthan" className="bg-parchment-50">Rajasthan (Jaipur)</option>
            <option value="delhi" className="bg-parchment-50">Delhi (NCT)</option>
            <option value="kerala" className="bg-parchment-50">Kerala (Kochi)</option>
            <option value="goa" className="bg-parchment-50">Goa (Panaji)</option>
            <option value="uttar-pradesh" className="bg-parchment-50">Uttar Pradesh (Agra)</option>
            <option value="himachal-pradesh" className="bg-parchment-50">Himachal Pradesh (Shimla)</option>
          </select>
        </div>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-terracotta hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
        >
          <LocateFixed size={16} />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="absolute bottom-4 left-4 z-[400] max-w-xl overflow-x-auto flex gap-1.5 p-1.5 bg-parchment-50/90 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-xl scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-terracotta text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-charcoal-light hover:text-charcoal hover:bg-slate-800/60'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className={`w-full ${height} z-0`} />

      {/* Selected Place Overlay Drawer */}
      {activePlace && (
        <div className="absolute top-16 right-4 z-[400] w-80 bg-parchment-50/95 backdrop-blur-xl border border-sage rounded-3xl p-5 shadow-2xl text-charcoal animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-terracotta/10 text-terracotta border border-emerald-500/20 text-[10px] font-bold uppercase">
                {activePlace.category}
              </span>
              <h3 className="text-lg font-bold text-charcoal mt-1 leading-tight">{activePlace.name}</h3>
              <p className="text-xs text-charcoal-light flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-terracotta" /> {activePlace.city}, {activePlace.state}
              </p>
            </div>
            <button
              onClick={() => setActivePlace(null)}
              className="text-charcoal-light hover:text-charcoal p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-charcoal-light line-clamp-3 mb-4 leading-relaxed">
            {activePlace.summary}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSelectPlace(activePlace.id)}
              className="w-full py-2.5 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <span>View Full Dossier & Stations</span>
              <ArrowRight size={14} />
            </button>

            {activePlace.features['3d'] && onView3DPlace && (
              <button
                onClick={() => onView3DPlace(activePlace.id)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-terracotta font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-emerald-500/20"
              >
                <Box size={14} />
                <span>Explore in 3D WebGL</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
