import React, { useState, useEffect } from 'react';
import { RouteResponse, TransportMode } from '../../types';
import { api } from '../../services/api';
import { FareBadge } from '../common/FareBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  Car, 
  Train, 
  Footprints, 
  Bike, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Info
} from 'lucide-react';
import { MultimodalRoute3DVisualizer } from './MultimodalRoute3DVisualizer';

interface RouteCalculatorProps {
  destinationId: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  destinationCity?: string;
  initialOrigin?: string;
  onViewOnMap?: (origin: string, destination: string) => void;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  destinationId,
  destinationName,
  destinationLat,
  destinationLng,
  destinationCity,
  initialOrigin,
  onViewOnMap,
}) => {
  const getPresetOrigins = (city?: string) => {
    const c = (city || '').toLowerCase();
    if (c.includes('jaipur') || c.includes('rajasthan')) {
      return [
        { id: 'jaipur-junction', label: 'Jaipur Junction (JP)' },
        { id: 'gandhi-nagar-station', label: 'Gandhi Nagar Station' },
        { id: 'sindhi-camp', label: 'Sindhi Camp Bus Stand' },
        { id: 'jaipur-airport', label: 'Jaipur Airport (JAI)' },
      ];
    }
    if (c.includes('delhi')) {
      return [
        { id: 'new-delhi', label: 'New Delhi Railway Station (NDLS)' },
        { id: 'hazrat-nizamuddin', label: 'Hazrat Nizamuddin (NZM)' },
        { id: 'old-delhi', label: 'Old Delhi Railway Station (DLI)' },
        { id: 'igi-airport', label: 'Indira Gandhi Airport (DEL)' },
      ];
    }
    if (c.includes('agra')) {
      return [
        { id: 'agra-cantt', label: 'Agra Cantt Railway Station (AGC)' },
        { id: 'agra-fort-station', label: 'Agra Fort Station (AF)' },
        { id: 'idgah-bus-stand', label: 'Idgah Bus Stand' },
      ];
    }
    if (c.includes('varanasi')) {
      return [
        { id: 'varanasi-junction', label: 'Varanasi Junction (BSB)' },
        { id: 'pt-deen-dayal-upadhyaya', label: 'Pt. Deen Dayal Upadhyaya (DDU)' },
        { id: 'dashashwamedh', label: 'Dashashwamedh Ghat' },
      ];
    }
    if (c.includes('kochi') || c.includes('kerala')) {
      return [
        { id: 'ernakulam-jn', label: 'Ernakulam Junction (ERS)' },
        { id: 'ernakulam-town', label: 'Ernakulam Town (ERN)' },
        { id: 'fort-kochi-ferry', label: 'Fort Kochi Boat Jetty' },
        { id: 'cochin-airport', label: 'Cochin Airport (COK)' },
      ];
    }
    // Default / Mumbai
    return [
      { id: 'csmt', label: 'CSMT Railway Terminus' },
      { id: 'churchgate', label: 'Churchgate Terminal' },
      { id: 'dadar', label: 'Dadar Junction Interchange' },
      { id: 'mumbai-central', label: 'Mumbai Central (MMCT)' },
      { id: 'airport', label: 'Mumbai Airport (BOM)' },
    ];
  };

  const presetOrigins = getPresetOrigins(destinationCity);
  const [origin, setOrigin] = useState(initialOrigin || presetOrigins[0]?.id || 'csmt');
  const [customOrigin, setCustomOrigin] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TransportMode>('DRIVE');
  const [routes, setRoutes] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);

  const fetchRoute = async (originQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRoutes(originQuery, destinationId, selectedMode);
      setRoutes(data);
    } catch (err: any) {
      setError('Unable to calculate multimodal route. Showing verified geodesic metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeOrigin = isCustom ? customOrigin : origin;
    if (activeOrigin) {
      fetchRoute(activeOrigin);
    }
  }, [origin, isCustom, destinationId, selectedMode]);

  const activeOption: any = routes?.options?.find((o: any) => o.mode === selectedMode) || routes?.options?.[0];
  const originLabel = isCustom ? customOrigin : presetOrigins.find((p) => p.id === origin)?.label || origin;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DF] shadow-warm space-y-6">
      {/* Journey Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EFE8DF]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Journey Planner & Fare Estimator
            </h3>
            <p className="text-xs text-stone-500">
              Direct routing using YatraVerse Multimodal Engine
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Transparent Regional Tariffs
        </span>
      </div>

      {/* Clean FROM -> TO Journey Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure Point (FROM) */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              FROM (Departure):
            </span>
            <button
              onClick={() => setIsCustom(!isCustom)}
              className="text-[11px] font-semibold text-amber-800 hover:underline"
            >
              {isCustom ? 'Use Presets' : 'Custom Place'}
            </button>
          </div>

          {isCustom ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Station, hotel or area..."
                value={customOrigin}
                onChange={(e) => setCustomOrigin(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#EFE8DF] rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-600"
              />
              <button
                onClick={() => customOrigin.trim() && fetchRoute(customOrigin.trim())}
                className="px-3.5 py-2 bg-amber-800 text-white rounded-xl text-xs font-bold"
              >
                Go
              </button>
            </div>
          ) : (
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EFE8DF] rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              {presetOrigins.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Destination (TO) */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            TO (Destination):
          </span>
          <div className="px-3 py-2 bg-white border border-[#EFE8DF] rounded-xl text-xs font-bold text-stone-900 flex items-center justify-between">
            <span className="truncate">{destinationName}</span>
            <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-semibold shrink-0 ml-2">
              {destinationCity || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* Travel By Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Travel By:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { mode: 'TRANSIT' as TransportMode, label: 'Train / Transit', icon: Train, note: 'Public Rail / Bus' },
            { mode: 'DRIVE' as TransportMode, label: 'Road / Taxi', icon: Car, note: 'Direct Cab / Auto' },
            { mode: 'WALK' as TransportMode, label: 'Walk', icon: Footprints, note: 'Heritage Walk' },
            { mode: 'BICYCLE' as TransportMode, label: 'Multi-Modal', icon: Navigation, note: 'Combined Modes' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setSelectedMode(item.mode)}
                className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EFE8DF]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-100' : 'text-stone-500'}`}>
                  {item.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Route Results Metric Cards */}
      {loading ? (
        <LoadingSpinner message="Calculating coordinates, distances & verified fares..." />
      ) : activeOption ? (
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-5">
          {/* Key Metrics: Distance, Estimated time, Estimated fare */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-white border border-[#EFE8DF] shadow-xs">
              <div className="text-[10px] uppercase font-bold text-stone-400">Distance</div>
              <div className="text-2xl font-bold text-stone-900 font-mono mt-0.5">
                {activeOption.distance_km} <span className="text-sm font-sans font-normal text-stone-500">km</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#EFE8DF] shadow-xs">
              <div className="text-[10px] uppercase font-bold text-stone-400">Estimated Time</div>
              <div className="text-2xl font-bold text-stone-900 font-mono mt-0.5">
                {activeOption.duration_minutes || activeOption.duration_mins} <span className="text-sm font-sans font-normal text-stone-500">mins</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#EFE8DF] shadow-xs">
              <div className="text-[10px] uppercase font-bold text-stone-400">Estimated Fare</div>
              <div className="text-2xl font-bold text-amber-800 font-mono mt-0.5">
                {activeOption.estimated_fare === 0
                  ? 'Free Walk'
                  : activeOption.estimated_fare !== null && activeOption.estimated_fare !== undefined
                  ? `₹${activeOption.estimated_fare}`
                  : 'Standard Pass'}
              </div>
            </div>
          </div>

          {activeOption.fare_note && (
            <div className="p-3 rounded-xl bg-white border border-[#EFE8DF] text-xs text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{activeOption.fare_note}</span>
            </div>
          )}

          {/* 3D Multimodal Route Visualizer Sequence */}
          <MultimodalRoute3DVisualizer
            originName={isCustom ? (customOrigin || 'Origin') : (presetOrigins.find((p) => p.id === origin)?.label || origin)}
            destinationName={destinationName}
            routeOption={activeOption}
            selectedMode={selectedMode}
            cityName={destinationCity}
          />

          {/* Progressive Disclosure: Route Details */}
          <div className="border-t border-[#EFE8DF] pt-3">
            <button
              onClick={() => setShowRouteDetails(!showRouteDetails)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 transition"
            >
              <span>{showRouteDetails ? 'Hide Route Details' : 'View Route Details & Steps'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRouteDetails ? 'rotate-180' : ''}`} />
            </button>

            {showRouteDetails && activeOption.steps_summary && activeOption.steps_summary.length > 0 && (
              <div className="mt-3 space-y-2 animate-fadeIn">
                {activeOption.steps_summary.map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-stone-700 bg-white p-3 rounded-xl border border-[#EFE8DF]"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          {onViewOnMap && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => onViewOnMap(origin, destinationId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-xs font-semibold text-stone-800 shadow-xs transition"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-700" />
                <span>View Polyline on Interactive Map</span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
