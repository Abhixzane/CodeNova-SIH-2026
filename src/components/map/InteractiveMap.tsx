import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { PlaceSummary, RouteResponse, TransportMode } from '../../types';
import { api } from '../../services/api';
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Navigation,
  Train,
  Landmark,
  Car,
  Footprints,
  Bike,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Ticket,
  ChevronRight,
  Info,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';

interface InteractiveMapProps {
  onSelectPlace: (id: string) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  places?: PlaceSummary[];
  states?: any[];
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  initialOrigin?: string;
  initialDestination?: string;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectPlace,
  selectedCity = 'Mumbai',
  onSelectCity,
  places: propPlaces,
  onNavigateToPlace,
  onView3DPlace,
  initialOrigin,
  initialDestination,
  height = '620px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heritageLayerRef = useRef<L.LayerGroup | null>(null);
  const stationLayerRef = useRef<L.LayerGroup | null>(null);
  const sightsLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeMarkersRef = useRef<L.LayerGroup | null>(null);

  // Datasets
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Layer Toggles
  const [showHeritage, setShowHeritage] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showSights, setShowSights] = useState(true);

  // In-Map Route State
  const [isRoutingOpen, setIsRoutingOpen] = useState(Boolean(initialOrigin || initialDestination));
  const [routeOrigin, setRouteOrigin] = useState<string>(initialOrigin || 'csmt');
  const [routeOriginName, setRouteOriginName] = useState<string>('CSMT Railway Station');
  const [routeOriginCoords, setRouteOriginCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.94, lng: 72.8353 });
  const [routeDestination, setRouteDestination] = useState<string>(initialDestination || 'gateway-of-india');
  const [routeDestName, setRouteDestName] = useState<string>('Gateway of India');
  const [routeDestCoords, setRouteDestCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.922, lng: 72.8347 });
  const [selectedMode, setSelectedMode] = useState<TransportMode>('DRIVE');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isRoutePanelMinimized, setIsRoutePanelMinimized] = useState(false);

  const handleSwapPoints = () => {
    const tempOrigin = routeOrigin;
    const tempOriginName = routeOriginName;
    const tempOriginCoords = routeOriginCoords;
    setRouteOrigin(routeDestination);
    setRouteOriginName(routeDestName);
    setRouteOriginCoords(routeDestCoords);
    setRouteDestination(tempOrigin);
    setRouteDestName(tempOriginName);
    setRouteDestCoords(tempOriginCoords);
  };

  // 1. Fetch all datasets (Heritage 42+, Stations, Places)
  useEffect(() => {
    let isMounted = true;
    const loadAllMapData = async () => {
      setLoading(true);
      try {
        const [heritageRes, stationsRes, placesRes] = await Promise.all([
          api.getHeritage({ limit: 100 }),
          api.getRailwayStations(),
          propPlaces && propPlaces.length > 0 ? Promise.resolve({ data: propPlaces }) : api.getPlaces({ limit: 100 }),
        ]);

        if (isMounted) {
          setHeritageSites(heritageRes.data || []);
          setStations(stationsRes || []);
          setAllPlaces(placesRes.data || []);
        }
      } catch (err) {
        console.error('[Map] Error fetching map datasets:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAllMapData();
    return () => {
      isMounted = false;
    };
  }, [propPlaces]);

  // City preset coordinates for rapid panning
  const cityCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
    'all-india': { lat: 22.5, lng: 79.0, zoom: 5 },
    mumbai: { lat: 18.9431, lng: 72.833, zoom: 13 },
    delhi: { lat: 28.6139, lng: 77.209, zoom: 12 },
    jaipur: { lat: 26.9124, lng: 75.7873, zoom: 13 },
    agra: { lat: 27.1751, lng: 78.0421, zoom: 13 },
    kochi: { lat: 9.9312, lng: 76.2673, zoom: 13 },
    varanasi: { lat: 25.3176, lng: 82.9739, zoom: 13 },
    goa: { lat: 15.4909, lng: 73.8278, zoom: 12 },
    bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 12 },
    kolkata: { lat: 22.5726, lng: 88.3639, zoom: 12 },
    amritsar: { lat: 31.6340, lng: 74.8723, zoom: 13 },
  };

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const cityKey = selectedCity.toLowerCase().replace(/\s+/g, '-');
    const cityCfg = cityCoordinates[cityKey] || cityCoordinates['all-india'];

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([cityCfg.lat, cityCfg.lng], cityCfg.zoom);

    mapInstanceRef.current = map;

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Light Carto Voyager OpenStreetMap Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Layers
    heritageLayerRef.current = L.layerGroup().addTo(map);
    stationLayerRef.current = L.layerGroup().addTo(map);
    sightsLayerRef.current = L.layerGroup().addTo(map);
    routeMarkersRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Pan map when selectedCity changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity) return;
    const key = selectedCity.toLowerCase().replace(/\s+/g, '-');
    const cfg = cityCoordinates[key] || cityCoordinates['all-india'];
    if (cfg) {
      mapInstanceRef.current.flyTo([cfg.lat, cfg.lng], cfg.zoom, { duration: 1.2 });
    }
  }, [selectedCity]);

  const handleCityJump = (cityKey: string) => {
    const key = cityKey.toLowerCase().replace(/\s+/g, '-');
    const cfg = cityCoordinates[key] || cityCoordinates['all-india'];
    if (cfg && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cfg.lat, cfg.lng], cfg.zoom, { duration: 1.2 });
    }
    if (onSelectCity) {
      if (key === 'all-india') {
        onSelectCity('All India');
      } else {
        onSelectCity(cityKey.charAt(0).toUpperCase() + cityKey.slice(1));
      }
    }
  };

  // 4. Update Markers on Map based on layers & search query
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const hLayer = heritageLayerRef.current;
    const stLayer = stationLayerRef.current;
    const sLayer = sightsLayerRef.current;

    if (hLayer) hLayer.clearLayers();
    if (stLayer) stLayer.clearLayers();
    if (sLayer) sLayer.clearLayers();

    const q = searchQuery.toLowerCase().trim();

    // Helper to create HTML popup card
    const createPopupContent = (item: any, type: 'heritage' | 'station' | 'sight') => {
      const isHeritage = type === 'heritage';
      const isStation = type === 'station';
      const name = item.name;
      const subtitle = isStation
        ? `${item.city} • Code: ${item.code || 'IR'}`
        : `${item.city || ''}, ${item.state || 'India'}`;
      const img = item.thumbnail_url || (item.images && item.images[0]) || '';
      const fee = item.entry_fee
        ? item.entry_fee.domestic === 0
          ? 'Free Entry'
          : `₹${item.entry_fee.domestic}`
        : item.entry_fee_inr
        ? `₹${item.entry_fee_inr}`
        : isStation
        ? 'Platform Ticket ₹10'
        : 'Free Access';

      const timing = item.visiting_hours || item.timings || (isStation ? 'Open 24/7' : '09:00 AM - 05:30 PM');

      const card = document.createElement('div');
      card.className = 'p-3 text-slate-900 max-w-[270px] font-sans rounded-xl';
      card.innerHTML = `
        ${img ? `<div style="position: relative; margin: -12px -12px 10px -12px; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; height: 110px;">
          <img src="${img}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; bottom: 8px; left: 8px; font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 7px; border-radius: 6px; text-transform: uppercase;">
            ${isHeritage ? 'Heritage Site' : isStation ? 'Railway Hub' : 'Attraction'}
          </span>
        </div>` : ''}
        <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.25;">${name}</h4>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${subtitle}</div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 10px; font-size: 11px; background: #f8fafc; padding: 6px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="flex: 1;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Hours</div>
            <div style="font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${timing}</div>
          </div>
          <div style="border-left: 1px solid #cbd5e1; padding-left: 8px;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Fee</div>
            <div style="font-weight: 700; color: #059669;">${fee}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <button id="btn-origin-${item.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🚩 Start Route
          </button>
          <button id="btn-dest-${item.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🎯 Route To Here
          </button>
        </div>

        <div style="display: flex; gap: 6px;">
          <button id="btn-dossier-${item.id}" style="flex: 1; background: #059669; color: #fff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
            View Details
          </button>
          ${item.model_3d?.available || item.features?.['3d'] ? `
            <button id="btn-3d-${item.id}" style="background: #f97316; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              🧊 3D
            </button>
          ` : ''}
        </div>
      `;
      return card;
    };

    // A. Plot Heritage Sites (UNESCO & ASI)
    if (showHeritage && hLayer) {
      heritageSites.forEach((site) => {
        if (!site.coordinates?.lat || !site.coordinates?.lng) return;
        const matchesSearch =
          !q ||
          site.name.toLowerCase().includes(q) ||
          site.city?.toLowerCase().includes(q) ||
          site.state?.toLowerCase().includes(q);

        if (!matchesSearch) return;

        const iconHtml = `
          <div style="background-color: #ea580c; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.45); cursor: pointer; transition: transform 0.2s;" title="${site.name}">
            <span style="font-size: 16px;">🏛️</span>
          </div>
        `;
        const markerIcon = L.divIcon({
          className: 'heritage-pin',
          html: iconHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([site.coordinates.lat, site.coordinates.lng], { icon: markerIcon });
        const popup = createPopupContent(site, 'heritage');
        marker.bindPopup(popup);

        marker.on('popupopen', () => {
          const btnDossier = document.getElementById(`btn-dossier-${site.id}`);
          if (btnDossier) btnDossier.onclick = () => onSelectPlace(site.id);

          const btnOrigin = document.getElementById(`btn-origin-${site.id}`);
          if (btnOrigin)
            btnOrigin.onclick = () => {
              setRouteOrigin(site.id);
              setRouteOriginName(site.name);
              setRouteOriginCoords({ lat: site.coordinates.lat, lng: site.coordinates.lng });
              setIsRoutingOpen(true);
            };

          const btnDest = document.getElementById(`btn-dest-${site.id}`);
          if (btnDest)
            btnDest.onclick = () => {
              setRouteDestination(site.id);
              setRouteDestName(site.name);
              setRouteDestCoords({ lat: site.coordinates.lat, lng: site.coordinates.lng });
              setIsRoutingOpen(true);
            };

          const btn3d = document.getElementById(`btn-3d-${site.id}`);
          if (btn3d && onView3DPlace) btn3d.onclick = () => onView3DPlace(site.id);
        });

        hLayer.addLayer(marker);
      });
    }

    // B. Plot Railway Stations & Transit Hubs
    if (showStations && stLayer) {
      stations.forEach((st) => {
        if (!st.lat || !st.lng) return;
        const matchesSearch =
          !q ||
          st.name.toLowerCase().includes(q) ||
          st.code?.toLowerCase().includes(q) ||
          st.city?.toLowerCase().includes(q);

        if (!matchesSearch) return;

        const iconHtml = `
          <div style="background-color: #0284c7; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.4); cursor: pointer;" title="${st.name} (${st.code})">
            <span style="font-size: 14px;">🚆</span>
          </div>
        `;
        const markerIcon = L.divIcon({
          className: 'station-pin',
          html: iconHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([st.lat, st.lng], { icon: markerIcon });
        const popup = createPopupContent(st, 'station');
        marker.bindPopup(popup);

        marker.on('popupopen', () => {
          const btnOrigin = document.getElementById(`btn-origin-${st.id}`);
          if (btnOrigin)
            btnOrigin.onclick = () => {
              setRouteOrigin(st.id || st.code);
              setRouteOriginName(st.name);
              setRouteOriginCoords({ lat: st.lat, lng: st.lng });
              setIsRoutingOpen(true);
            };

          const btnDest = document.getElementById(`btn-dest-${st.id}`);
          if (btnDest)
            btnDest.onclick = () => {
              setRouteDestination(st.id || st.code);
              setRouteDestName(st.name);
              setRouteDestCoords({ lat: st.lat, lng: st.lng });
              setIsRoutingOpen(true);
            };
        });

        stLayer.addLayer(marker);
      });
    }

    // C. Plot Tourism Attractions & Sights
    if (showSights && sLayer) {
      allPlaces.forEach((p) => {
        if (!p.coordinates?.lat || !p.coordinates?.lng) return;
        // Avoid duplicate pin if already in heritage list
        if (heritageSites.some((h) => h.id === p.id)) return;

        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q);

        if (!matchesSearch) return;

        const iconHtml = `
          <div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4); cursor: pointer;" title="${p.name}">
            <span style="color: white; font-size: 11px; font-weight: 800;">★</span>
          </div>
        `;
        const markerIcon = L.divIcon({
          className: 'sight-pin',
          html: iconHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -15],
        });

        const marker = L.marker([p.coordinates.lat, p.coordinates.lng], { icon: markerIcon });
        const popup = createPopupContent(p, 'sight');
        marker.bindPopup(popup);

        marker.on('popupopen', () => {
          const btnDossier = document.getElementById(`btn-dossier-${p.id}`);
          if (btnDossier) btnDossier.onclick = () => onSelectPlace(p.id);

          const btnOrigin = document.getElementById(`btn-origin-${p.id}`);
          if (btnOrigin)
            btnOrigin.onclick = () => {
              setRouteOrigin(p.id);
              setRouteOriginName(p.name);
              setRouteOriginCoords({ lat: p.coordinates.lat, lng: p.coordinates.lng });
              setIsRoutingOpen(true);
            };

          const btnDest = document.getElementById(`btn-dest-${p.id}`);
          if (btnDest)
            btnDest.onclick = () => {
              setRouteDestination(p.id);
              setRouteDestName(p.name);
              setRouteDestCoords({ lat: p.coordinates.lat, lng: p.coordinates.lng });
              setIsRoutingOpen(true);
            };
        });

        sLayer.addLayer(marker);
      });
    }
  }, [
    heritageSites,
    stations,
    allPlaces,
    showHeritage,
    showStations,
    showSights,
    searchQuery,
    onSelectPlace,
    onView3DPlace,
  ]);

  // 5. In-Map Real Routing Execution
  const handleCalculateRoute = async () => {
    if (!routeOrigin || !routeDestination) {
      setRouteError('Please choose both an origin and a destination.');
      return;
    }
    if (routeOrigin === routeDestination) {
      setRouteError('Origin and destination cannot be identical.');
      return;
    }

    setIsCalculatingRoute(true);
    setRouteError(null);

    try {
      const res = await api.getRoutes(routeOrigin, routeDestination, selectedMode);
      setActiveRoute(res);

      const map = mapInstanceRef.current;
      if (!map) return;

      // Clean old polyline
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      if (routeMarkersRef.current) {
        routeMarkersRef.current.clearLayers();
      }

      // Pick option matching mode or first option
      const opt: any = res.options?.find((o: any) => o.mode === selectedMode) || res.options?.[0];

      let polyCoords: [number, number][] = [];
      if (opt && opt.polyline && Array.isArray(opt.polyline) && opt.polyline.length > 0) {
        polyCoords = opt.polyline;
      } else if (res.origin?.latitude && res.destination?.latitude) {
        polyCoords = [
          [res.origin.latitude, res.origin.longitude],
          [res.destination.latitude, res.destination.longitude],
        ];
      }

      if (polyCoords.length > 0) {
        // Draw crisp routed polyline on Leaflet
        const color = selectedMode === 'WALK' ? '#059669' : selectedMode === 'BICYCLE' ? '#0284c7' : '#ea580c';
        const polyline = L.polyline(polyCoords, {
          color,
          weight: 5,
          opacity: 0.85,
          lineJoin: 'round',
          dashArray: selectedMode === 'WALK' ? '8, 8' : undefined,
        }).addTo(map);

        routePolylineRef.current = polyline;

        // Add distinct Start (A) & Destination (B) route markers
        const startIcon = L.divIcon({
          className: 'route-start-pin',
          html: `<div style="background:#10b981; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; border:2px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3);">A</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const endIcon = L.divIcon({
          className: 'route-end-pin',
          html: `<div style="background:#ea580c; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; border:2px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3);">B</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const startPt = polyCoords[0];
        const endPt = polyCoords[polyCoords.length - 1];

        if (routeMarkersRef.current) {
          L.marker(startPt, { icon: startIcon }).addTo(routeMarkersRef.current);
          L.marker(endPt, { icon: endIcon }).addTo(routeMarkersRef.current);
        }

        // Fit map smoothly to route bounds
        map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 15 });
      }
    } catch (err: any) {
      setRouteError('Unable to generate route coordinates. Please choose other points.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleClearRoute = () => {
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routeMarkersRef.current) {
      routeMarkersRef.current.clearLayers();
    }
    setActiveRoute(null);
    setRouteError(null);
  };

  const activeOption: any =
    activeRoute?.options?.find((o: any) => o.mode === selectedMode) || activeRoute?.options?.[0];

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar: City Jumps & Layer Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* City Quick Jumps */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Jump:
          </span>
          {[
            { id: 'all-india', label: 'All India' },
            { id: 'mumbai', label: 'Mumbai' },
            { id: 'delhi', label: 'Delhi' },
            { id: 'jaipur', label: 'Jaipur' },
            { id: 'agra', label: 'Agra' },
            { id: 'kochi', label: 'Kochi' },
            { id: 'varanasi', label: 'Varanasi' },
            { id: 'goa', label: 'Goa' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => handleCityJump(c.id)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Layer Toggles & Route Studio Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeritage}
              onChange={(e) => setShowHeritage(e.target.checked)}
              className="accent-orange-600 rounded cursor-pointer"
            />
            <span>🏛️ Heritage ({heritageSites.length})</span>
          </label>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="accent-sky-600 rounded cursor-pointer"
            />
            <span>🚆 Stations ({stations.length})</span>
          </label>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showSights}
              onChange={(e) => setShowSights(e.target.checked)}
              className="accent-emerald-600 rounded cursor-pointer"
            />
            <span>📍 Sights</span>
          </label>

          <button
            onClick={() => setIsRoutingOpen(!isRoutingOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              isRoutingOpen
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Studio</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg" style={{ height }}>
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Search Bar Overlay (Responsive Top Left) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:left-4 sm:top-4 z-[400] sm:w-72 md:w-80">
          <div className="relative shadow-md rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monuments, stations, cities..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-transparent text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive In-Map Route Panel: Mobile Bottom Sheet / Desktop Floating Side Panel */}
        {isRoutingOpen && (
          <div
            className={`absolute inset-x-0 bottom-0 z-[450] md:inset-auto md:top-4 md:right-4 md:w-96 bg-white/98 md:bg-white/95 backdrop-blur-md rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ${
              isRoutePanelMinimized
                ? 'max-h-[60px] overflow-hidden'
                : 'max-h-[72%] sm:max-h-[75%] md:max-h-[calc(100%-32px)]'
            }`}
          >
            {/* Drag/Swipe Indicator for Mobile */}
            <div
              onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
              className="w-full pt-2.5 pb-1 flex justify-center md:hidden cursor-pointer touch-manipulation"
              title={isRoutePanelMinimized ? "Tap to expand Route Engine" : "Tap to minimize Route Engine"}
            >
              <div className="w-10 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border-b border-slate-100 shrink-0">
              <div
                onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer md:cursor-default"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    In-Map Route Engine
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {isRoutePanelMinimized && activeOption
                      ? `${activeOption.duration_minutes || activeOption.duration_mins} min • ${activeOption.distance_km} km • ₹${activeOption.estimated_fare ?? 0}`
                      : 'Calculate distance, fare & real paths'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {/* Mobile Minimize / Expand Toggle */}
                <button
                  type="button"
                  onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label={isRoutePanelMinimized ? "Expand Route Engine" : "Minimize Route Engine"}
                  title={isRoutePanelMinimized ? "Expand Route Engine" : "Minimize to view map"}
                >
                  {isRoutePanelMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsRoutingOpen(false);
                    setIsRoutePanelMinimized(false);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Close Route Engine"
                  title="Close Route Engine"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body (Hidden when minimized) */}
            {!isRoutePanelMinimized && (
              <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4 flex-1">
                {/* Origin & Destination Inputs with Swap */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span>🚩</span> Origin (Point A)
                      </label>
                      {(routeOrigin || routeOriginName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setRouteOrigin('');
                            setRouteOriginName('');
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={routeOriginName || routeOrigin}
                      onChange={(e) => {
                        setRouteOrigin(e.target.value);
                        setRouteOriginName(e.target.value);
                      }}
                      placeholder="Search origin or click pin on map..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Swap Origin & Destination Button */}
                  <div className="flex justify-center -my-1">
                    <button
                      type="button"
                      onClick={handleSwapPoints}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition shadow-2xs flex items-center gap-1 text-[10px] font-bold px-2.5"
                      title="Swap Origin and Destination"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Swap</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span>🎯</span> Destination (Point B)
                      </label>
                      {(routeDestination || routeDestName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setRouteDestination('');
                            setRouteDestName('');
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={routeDestName || routeDestination}
                      onChange={(e) => {
                        setRouteDestination(e.target.value);
                        setRouteDestName(e.target.value);
                      }}
                      placeholder="Search destination or click pin on map..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Mode Selectors */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Transport Mode
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    {[
                      { mode: 'DRIVE' as TransportMode, label: 'Taxi', icon: Car },
                      { mode: 'TRANSIT' as TransportMode, label: 'Train', icon: Train },
                      { mode: 'WALK' as TransportMode, label: 'Walk', icon: Footprints },
                      { mode: 'BICYCLE' as TransportMode, label: 'Cycle', icon: Bike },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = selectedMode === m.mode;
                      return (
                        <button
                          key={m.mode}
                          type="button"
                          onClick={() => setSelectedMode(m.mode)}
                          className={`min-h-[44px] py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                            isSelected
                              ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCalculateRoute}
                    disabled={isCalculatingRoute}
                    className="flex-1 min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                  >
                    <Navigation className="w-4 h-4 shrink-0" />
                    <span>{isCalculatingRoute ? 'Tracing Route...' : 'Plot Route on Map'}</span>
                  </button>

                  {activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shrink-0"
                      title="Clear Route and Polyline"
                      aria-label="Clear Route"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {routeError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {routeError}
                  </div>
                )}

                {/* Active Route Summary Result Cards */}
                {activeOption && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-slate-900 font-mono mt-0.5">
                          {activeOption.duration_minutes || activeOption.duration_mins} min
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Distance</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-slate-900 font-mono mt-0.5">
                          {activeOption.distance_km} km
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fare</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-emerald-600 font-mono mt-0.5">
                          {activeOption.estimated_fare === 0
                            ? 'Free'
                            : activeOption.estimated_fare !== null && activeOption.estimated_fare !== undefined
                            ? `₹${activeOption.estimated_fare}`
                            : 'Pass'}
                        </div>
                      </div>
                    </div>

                    {/* Quick minimize helper on mobile to inspect polyline */}
                    <div className="flex items-center justify-between pt-1 md:hidden">
                      <button
                        type="button"
                        onClick={() => setIsRoutePanelMinimized(true)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <span>Minimize to inspect polyline on map</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Steps summary */}
                    {activeOption.steps_summary && activeOption.steps_summary.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                          Turn-by-turn Guidance
                        </div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {activeOption.steps_summary.map((step: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed bg-white p-2 rounded-xl border border-slate-100">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="flex-1 break-words">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Floating Quick Route Button when panel is closed */}
        {!isRoutingOpen && (
          <button
            type="button"
            onClick={() => {
              setIsRoutingOpen(true);
              setIsRoutePanelMinimized(false);
            }}
            className="md:hidden absolute bottom-4 right-4 z-[400] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl border border-emerald-500/50 active:scale-95 transition"
            aria-label="Open In-Map Route Engine"
          >
            <Navigation className="w-4 h-4" />
            <span>Route Engine</span>
          </button>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-[1000] flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-800 font-bold">Plotting India Heritage & Rail Network...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
