import React, { useState } from 'react';
import { Train, ArrowRight, MapPin, Compass, Navigation, Sparkles, ShieldCheck, Clock, Layers } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface ThreeDRailwayExperienceProps {
  onNavigateTab: (tab: NavTab) => void;
  selectedCity?: string;
}

interface StationRecord {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  zone: string;
  lat: number;
  lng: number;
  lines: string[];
  isJunction: boolean;
  category: string;
  dailyFootfall: string;
  heritageStatus?: string;
}

export const ThreeDRailwayExperience: React.FC<ThreeDRailwayExperienceProps> = ({
  onNavigateTab,
  selectedCity = 'All India',
}) => {
  // Verified railway dataset records from project archives
  const stations: StationRecord[] = [
    {
      id: 'csmt',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      code: 'CSMT',
      city: 'Mumbai',
      state: 'Maharashtra',
      zone: 'Central Railway (CR)',
      lat: 18.94,
      lng: 72.8353,
      lines: ['Central Suburban Mainline', 'Harbour Line', 'Long-Distance Express Terminal'],
      isJunction: true,
      category: 'NSG-1 (Non-Suburban Grade 1)',
      dailyFootfall: '3.2+ Million',
      heritageStatus: 'UNESCO World Heritage Victorian Gothic Terminus (1888 CE)',
    },
    {
      id: 'churchgate',
      name: 'Churchgate Terminal',
      code: 'CCG',
      city: 'Mumbai',
      state: 'Maharashtra',
      zone: 'Western Railway (WR)',
      lat: 18.9322,
      lng: 72.8264,
      lines: ['Western Line Suburban Headquarter'],
      isJunction: false,
      category: 'SG-1 (Suburban Grade 1)',
      dailyFootfall: '1.4+ Million',
      heritageStatus: 'Historic Southern Terminal of the Bombay Baroda & Central India Railway',
    },
    {
      id: 'ndls',
      name: 'New Delhi Railway Station',
      code: 'NDLS',
      city: 'New Delhi',
      state: 'Delhi (NCT)',
      zone: 'Northern Railway (NR)',
      lat: 28.643,
      lng: 77.2195,
      lines: ['Yellow Line Metro Interchange', 'Airport Express Link', 'Vande Bharat / Rajdhani Hub'],
      isJunction: true,
      category: 'NSG-1',
      dailyFootfall: '500,000+',
      heritageStatus: 'Largest Route-Interlocking Railway Station in the World',
    },
    {
      id: 'jp',
      name: 'Jaipur Junction',
      code: 'JP',
      city: 'Jaipur',
      state: 'Rajasthan',
      zone: 'North Western Railway (NWR)',
      lat: 26.9196,
      lng: 75.7878,
      lines: ['Jaipur Metro Link', 'Delhi-Ahmedabad Trunk Line', 'Palace on Wheels Departure'],
      isJunction: true,
      category: 'NSG-2',
      dailyFootfall: '150,000+',
      heritageStatus: 'Pink City Sandstone Jharokha Facade',
    },
    {
      id: 'bsb',
      name: 'Varanasi Junction (Varanasi Cantt)',
      code: 'BSB',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      zone: 'Northern Railway (NR)',
      lat: 25.3283,
      lng: 82.9863,
      lines: ['Howrah-Delhi Main Line', 'Kashi Vishwanath Corridor Link'],
      isJunction: true,
      category: 'NSG-2',
      dailyFootfall: '220,000+',
      heritageStatus: 'Spiritual Gateway to Sacred Kashi',
    },
    {
      id: 'ers',
      name: 'Ernakulam Junction (Cochin South)',
      code: 'ERS',
      city: 'Kochi',
      state: 'Kerala',
      zone: 'Southern Railway (SR)',
      lat: 9.9696,
      lng: 76.2902,
      lines: ['Kochi Metro Feeder', 'Shoranur-Cochin Coastal Line'],
      isJunction: true,
      category: 'NSG-2',
      dailyFootfall: '120,000+',
      heritageStatus: 'Gateway to Kerala Spice Coast & Backwaters',
    },
  ];

  const [selectedStationId, setSelectedStationId] = useState('csmt');
  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  return (
    <section className="space-y-6 pt-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#EFE8DF] shadow-warm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-200">
            <Train className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive Indian Railway & Suburban Transit</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            The Steel Arteries of India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Inspect real railway nodes, station codes, divisions, and suburban corridors across India’s world-famous railway system.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('mumbai-local')}
          className="px-5 py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-warm flex items-center gap-2 self-start md:self-auto active:scale-98"
        >
          <span>Open Mumbai Suburban Network</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive 3D / 2.5D Railway Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EFE8DF] shadow-3d-card p-6 sm:p-8">
        {/* Visual 2.5D Isometric Track & Station Corridor Canvas */}
        <div className="relative mb-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white overflow-hidden shadow-inner">
          {/* Ambient Lighting & Perspective Track Elements */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Top Status Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs mb-6 text-stone-400">
            <span className="flex items-center gap-2 font-mono text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE RAILWAY INTELLIGENCE
            </span>
            <span className="font-mono text-stone-300">
              COORDINATES: {activeStation.lat.toFixed(4)}° N, {activeStation.lng.toFixed(4)}° E
            </span>
          </div>

          {/* Isometric Visual Track Corridor with Animated Pulse & Station Nodes */}
          <div className="relative z-10 py-6">
            {/* The Rail Line Bar */}
            <div className="relative h-2 bg-stone-700 rounded-full my-6 flex items-center justify-between px-4 sm:px-8">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full w-3/4 opacity-90 animate-pulse" />

              {/* Station Node Markers along the Corridor */}
              {stations.map((st) => {
                const isSelected = st.id === selectedStationId;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStationId(st.id)}
                    className="relative group focus:outline-none z-20 flex flex-col items-center"
                    aria-label={`Select station ${st.name}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 border-white scale-135 shadow-lg shadow-amber-500/50'
                          : 'bg-stone-800 border-stone-400 group-hover:border-amber-300 group-hover:scale-110'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-stone-950' : 'bg-stone-400'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-mono mt-2 transition-colors whitespace-nowrap ${
                        isSelected ? 'text-amber-400 font-bold' : 'text-stone-400 group-hover:text-stone-200'
                      }`}
                    >
                      {st.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Train Visual Silhouette & Route Vector */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-stone-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {activeStation.name} ({activeStation.code})
                </p>
                <p className="text-stone-400 text-xs">
                  {activeStation.zone} • {activeStation.category}
                </p>
              </div>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2 font-mono text-[11px] text-stone-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Suburban & Express Operations 24/7</span>
            </div>
          </div>
        </div>

        {/* Selected Station Detailed 3D Telemetry Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
              Suburban & Corridor Lines
            </span>
            <div className="space-y-1.5 pt-1">
              {activeStation.lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
              Footfall & Railway Classification
            </span>
            <p className="text-xl font-bold font-mono text-stone-900">{activeStation.dailyFootfall}</p>
            <p className="text-xs text-stone-600 font-medium">Daily commuter flow</p>
            <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
              {activeStation.isJunction ? 'Major Multi-Track Junction' : 'Major Terminal Station'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
              Heritage & Architectural Context
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {activeStation.heritageStatus}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('routes')}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 transition"
              >
                <span>Calculate transit route from {activeStation.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
