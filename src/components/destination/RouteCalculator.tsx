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
  ShieldAlert,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface RouteCalculatorProps {
  destinationId: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  destinationCity?: string;
  initialOrigin?: string;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  destinationId,
  destinationName,
  destinationLat,
  destinationLng,
  destinationCity,
  initialOrigin,
}) => {
  const getPresetOrigins = (city?: string) => {
    const c = (city || '').toLowerCase();
    if (c.includes('jaipur') || c.includes('rajasthan')) {
      return [
        { id: 'jaipur-junction', label: 'Jaipur Junction Railway Station' },
        { id: 'gandhi-nagar-station', label: 'Gandhi Nagar Station' },
        { id: 'sindhi-camp', label: 'Sindhi Camp Bus Stand' },
        { id: 'jaipur-airport', label: 'Jaipur International Airport' },
      ];
    }
    if (c.includes('delhi')) {
      return [
        { id: 'ndls', label: 'New Delhi Railway Station (NDLS)' },
        { id: 'nizamuddin', label: 'Hazrat Nizamuddin Station' },
        { id: 'old-delhi', label: 'Old Delhi Railway Station' },
        { id: 'igi-airport', label: 'Indira Gandhi Airport (DEL)' },
      ];
    }
    if (c.includes('kochi') || c.includes('kerala')) {
      return [
        { id: 'ernakulam-junction', label: 'Ernakulam Junction (South)' },
        { id: 'ernakulam-town', label: 'Ernakulam Town (North)' },
        { id: 'cochin-airport', label: 'Cochin International Airport' },
      ];
    }
    if (c.includes('goa') || c.includes('panaji')) {
      return [
        { id: 'karmali-station', label: 'Karmali Railway Station' },
        { id: 'madgaon-junction', label: 'Madgaon Junction' },
        { id: 'panjim-bus-stand', label: 'Panjim KTC Bus Stand' },
        { id: 'goa-airport', label: 'Goa Airport' },
      ];
    }
    return [
      { id: 'csmt', label: 'CSMT Railway Station' },
      { id: 'churchgate', label: 'Churchgate Station' },
      { id: 'dadar', label: 'Dadar Junction' },
      { id: 'bandra', label: 'Bandra Terminus' },
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
      const data = await api.getRoutes(originQuery, destinationId);
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
  }, [origin, isCustom, destinationId]);

  useEffect(() => {
    const activeOrigin = isCustom ? customOrigin : origin;
    if (activeOrigin) {
      api.getGoogleMapsUrl(activeOrigin, destinationName, selectedMode)
        .then((url) => setMapsUrl(url))
        .catch(() => {});
    }
  }, [selectedMode]);

  const activeOption: any = routes?.options?.find((o: any) => o.mode === selectedMode) || routes?.options?.[0];

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-terracotta/10 text-terracotta border border-emerald-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Multi-Modal Route & Fare Intelligence
            </h3>
            <p className="text-xs text-charcoal-light">
              Directions to {destinationName}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-terracotta/15 text-emerald-300 border border-emerald-500/30">
          Geodesic & Tariffs
        </span>
      </div>

      {/* Origin Selection Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-charcoal-light">
          Select Departure / Origin Point
        </label>
        <div className="flex flex-wrap gap-2">
          {presetOrigins.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setIsCustom(false);
                setOrigin(p.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                !isCustom && origin === p.id
                  ? 'bg-terracotta text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-parchment-100 text-charcoal-light hover:bg-slate-800 border border-parchment-300'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isCustom
                ? 'bg-terracotta text-slate-950 font-bold'
                : 'bg-parchment-100 text-charcoal-light hover:bg-slate-800 border border-parchment-300'
            }`}
          >
            Custom Location / Station...
          </button>
        </div>

        {isCustom && (
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Enter station, hotel, or landmark..."
              value={customOrigin}
              onChange={(e) => setCustomOrigin(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-950 border border-parchment-300 rounded-xl text-xs text-charcoal placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => customOrigin.trim() && fetchRoute(customOrigin.trim())}
              className="px-4 py-2 bg-terracotta text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
            >
              Calculate
            </button>
          </div>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-parchment-300">
        {[
          { mode: 'DRIVE' as TransportMode, label: 'Taxi / Cab', icon: Car },
          { mode: 'TRANSIT' as TransportMode, label: 'Train / Bus', icon: Train },
          { mode: 'WALK' as TransportMode, label: 'Walking', icon: Footprints },
          { mode: 'BICYCLE' as TransportMode, label: 'Bicycle', icon: Bike },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setSelectedMode(item.mode)}
              className={`py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-terracotta text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-charcoal-light hover:text-charcoal hover:bg-parchment-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results View */}
      {loading ? (
        <LoadingSpinner message="Calculating coordinates, distances & city tariffs..." />
      ) : activeOption ? (
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-parchment-300 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-parchment-100/90 border border-parchment-300">
              <div className="text-[10px] uppercase font-bold text-charcoal-light">Estimated Time</div>
              <div className="text-lg font-black text-charcoal font-mono mt-0.5">
                {activeOption.duration_minutes} min
              </div>
            </div>

            <div className="p-3 rounded-xl bg-parchment-100/90 border border-parchment-300">
              <div className="text-[10px] uppercase font-bold text-charcoal-light">Road Distance</div>
              <div className="text-lg font-black text-charcoal font-mono mt-0.5">
                {activeOption.distance_km} km
              </div>
            </div>

            <div className="p-3 rounded-xl bg-parchment-100/90 border border-parchment-300">
              <div className="text-[10px] uppercase font-bold text-charcoal-light">Estimated Fare</div>
              <div className="text-lg font-black text-terracotta font-mono mt-0.5">
                {activeOption.estimated_fare !== null && activeOption.estimated_fare !== undefined
                  ? `₹${activeOption.estimated_fare}`
                  : 'Transit Pass'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-parchment-100/90 border border-parchment-300 flex flex-col justify-center items-center">
              <div className="text-[10px] uppercase font-bold text-charcoal-light mb-1">Fare Status</div>
              <FareBadge status={activeOption.fare_status as any} />
            </div>
          </div>

          {activeOption.fare_note && (
            <p className="text-xs text-charcoal-light italic">
              ℹ️ {activeOption.fare_note}
            </p>
          )}

          {/* Safe Universal Google Maps Handoff Button */}
          <div className="pt-2 flex justify-end">
            <a
              href={mapsUrl || `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destinationName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-charcoal-light">
          Select an origin and transport mode to view route calculations.
        </div>
      )}
    </div>
  );
};
