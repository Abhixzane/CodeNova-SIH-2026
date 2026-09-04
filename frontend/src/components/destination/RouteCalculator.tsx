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
  MapPin
} from 'lucide-react';

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
    if (c.includes('kochi') || c.includes('kerala')) {
      return [
        { id: 'ernakulam-jn', label: 'Ernakulam Junction (ERS)' },
        { id: 'cochin-airport', label: 'Cochin International Airport' },
        { id: 'fort-kochi-jetty', label: 'Fort Kochi Boat Jetty' },
      ];
    }
    if (c.includes('agra')) {
      return [
        { id: 'agra-cantt', label: 'Agra Cantonment (AGC)' },
        { id: 'agra-fort-station', label: 'Agra Fort Railway Station' },
        { id: 'idgah-bus-stand', label: 'Idgah Bus Stand' },
      ];
    }
    return [
      { id: 'csmt', label: 'CSMT Station (Central Hub)' },
      { id: 'churchgate', label: 'Churchgate (Western Terminal)' },
      { id: 'dadar', label: 'Dadar Junction (Interchange)' },
      { id: 'andheri', label: 'Andheri Metro & Rail Hub' },
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
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);

  const fetchRoute = async (originQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRoutes(originQuery, destinationId, selectedMode);
      setRoutes(data);

      const url = await api.getGoogleMapsUrl(originQuery, destinationName, selectedMode);
      setMapsUrl(url);
    } catch (err: any) {
      setError('Unable to calculate multi-modal route. Showing estimated geodesic travel metrics.');
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

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Multi-Modal Route & Fare Intelligence
            </h3>
            <p className="text-xs text-slate-500">
              Direct journey comparison to <strong className="text-slate-800">{destinationName}</strong>
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Transparent City Tariffs
        </span>
      </div>

      {/* Origin Selection Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Select Departure / Origin Point:
        </label>
        <div className="flex flex-wrap gap-2">
          {presetOrigins.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setIsCustom(false);
                setOrigin(p.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !isCustom && origin === p.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isCustom
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Custom Location...
          </button>
        </div>

        {isCustom && (
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Enter railway station, hotel, or landmark..."
              value={customOrigin}
              onChange={(e) => setCustomOrigin(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => customOrigin.trim() && fetchRoute(customOrigin.trim())}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Calculate
            </button>
          </div>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { mode: 'DRIVE' as TransportMode, label: 'Taxi / Cab', icon: Car, desc: 'Fastest door-to-door' },
          { mode: 'TRANSIT' as TransportMode, label: 'Train / Transit', icon: Train, desc: 'Cheapest public fare' },
          { mode: 'WALK' as TransportMode, label: 'Walking', icon: Footprints, desc: 'Heritage walkways' },
          { mode: 'BICYCLE' as TransportMode, label: 'Bicycle', icon: Bike, desc: 'Eco-friendly active' },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setSelectedMode(item.mode)}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                isSelected
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                <span className="font-bold">{item.label}</span>
              </div>
              <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">{item.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Results View */}
      {loading ? (
        <LoadingSpinner message="Calculating coordinates, distances & city tariffs..." />
      ) : activeOption ? (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Time</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {activeOption.duration_minutes || activeOption.duration_mins} min
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Road Distance</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {activeOption.distance_km} km
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Fare</div>
              <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                {activeOption.estimated_fare === 0
                  ? 'Free Walk'
                  : activeOption.estimated_fare !== null && activeOption.estimated_fare !== undefined
                  ? `₹${activeOption.estimated_fare}`
                  : 'Transit Pass'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center items-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tariff Status</div>
              <FareBadge status={activeOption.fare_status as any} />
            </div>
          </div>

          {activeOption.fare_note && (
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
              <span className="text-emerald-700 font-bold">ℹ️</span>
              <span>{activeOption.fare_note}</span>
            </div>
          )}

          {/* Step-by-Step Directions */}
          {activeOption.steps_summary && activeOption.steps_summary.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Turn-by-turn Route Steps:</div>
              <div className="space-y-2">
                {activeOption.steps_summary.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            {onViewOnMap && (
              <button
                onClick={() => onViewOnMap(isCustom ? customOrigin : origin, destinationId)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>View Route on Interactive Map</span>
              </button>
            )}

            <a
              href={mapsUrl || `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destinationName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
            >
              <span>External GPS App</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-500">
          Select an origin and transport mode to view route calculations.
        </div>
      )}
    </div>
  );
};
