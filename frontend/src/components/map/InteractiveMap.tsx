import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PlaceSummary } from '../../types';
import { api } from '../../services/api';
import { MapPin, Search, Layers, Compass, ExternalLink, Star } from 'lucide-react';

interface InteractiveMapProps {
  onSelectPlace: (id: string) => void;
  selectedCity?: string;
  places?: PlaceSummary[];
  states?: any[];
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectPlace,
  selectedCity = 'Mumbai',
  places: initialPlaces,
  states,
  onNavigateToPlace,
  onView3DPlace,
  height,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch places
  useEffect(() => {
    if (initialPlaces && initialPlaces.length > 0) {
      setPlaces(initialPlaces);
      setLoading(false);
      return;
    }
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await api.getPlaces({ city: selectedCity, limit: 100 });
        setPlaces(res.data);
      } catch (err) {
        console.error('Failed to load places for map:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [selectedCity]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center Mumbai
    const initialLat = selectedCity.toLowerCase() === 'delhi' ? 28.6139 :
                       selectedCity.toLowerCase() === 'jaipur' ? 26.9124 :
                       selectedCity.toLowerCase() === 'kochi' ? 9.9312 : 18.922;
    const initialLng = selectedCity.toLowerCase() === 'delhi' ? 77.2090 :
                       selectedCity.toLowerCase() === 'jaipur' ? 75.7873 :
                       selectedCity.toLowerCase() === 'kochi' ? 76.2673 : 72.8347;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);
    mapInstanceRef.current = map;

    // Dark-mode carto tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markersRef.current = markerGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedCity]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markersRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    const filtered = places.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    const bounds = L.latLngBounds([]);

    filtered.forEach((p) => {
      if (!p.coordinates?.lat || !p.coordinates?.lng) return;

      const lat = p.coordinates.lat;
      const lng = p.coordinates.lng;
      bounds.extend([lat, lng]);

      const iconHtml = `
        <div style="background-color: #f97316; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); cursor: pointer;">
          <span style="color: white; font-size: 14px; font-weight: bold;">★</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 text-slate-900 max-w-[220px] font-sans';
      popupContent.innerHTML = `
        ${p.thumbnail_url ? `<img src="${p.thumbnail_url}" alt="${p.name}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />` : ''}
        <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 2px 0; color: #0f172a;">${p.name}</h4>
        <div style="font-size: 10px; text-transform: uppercase; color: #ea580c; font-weight: 600; margin-bottom: 4px;">${p.category || 'Sight'}</div>
        <p style="font-size: 11px; line-height: 1.3; color: #475569; margin: 0 0 8px 0;">${p.summary ? p.summary.slice(0, 85) + '...' : ''}</p>
        <button id="view-btn-${p.id}" style="width: 100%; background-color: #f97316; color: white; border: none; border-radius: 6px; padding: 5px 0; font-size: 11px; font-weight: 600; cursor: pointer;">
          View Destination Dossier
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-btn-${p.id}`);
        if (btn) {
          btn.onclick = () => onSelectPlace(p.id);
        }
      });

      markerGroup.addLayer(marker);
    });

    if (filtered.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [places, selectedCategory, searchQuery, onSelectPlace]);

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'heritage', label: 'Heritage & Forts' },
    { id: 'museum', label: 'Museums & Art' },
    { id: 'coastal', label: 'Coastal & Promenades' },
    { id: 'nature', label: 'Nature & Caves' },
  ];

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-parchment-300">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${places.length} places in ${selectedCity}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-parchment-300 text-xs text-charcoal focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-orange-500 text-charcoal shadow-sm border border-orange-400'
                  : 'bg-slate-950 text-charcoal-light hover:text-charcoal border border-parchment-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-parchment-300 bg-slate-950 h-[600px] shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <span className="text-xs text-orange-400 font-semibold animate-pulse">
              Plotting geo-coordinates on map...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
