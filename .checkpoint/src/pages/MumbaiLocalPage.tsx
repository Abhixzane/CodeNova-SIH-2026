import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { MumbaiLocalStation, MumbaiLocalRouteResult } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import {
  Train,
  ArrowRight,
  ArrowUpDown,
  Clock,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle2,
  Share2,
  Navigation,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface MumbaiLocalPageProps {
  onNavigateTab?: (tab: NavTab) => void;
}

export const MumbaiLocalPage: React.FC<MumbaiLocalPageProps> = ({ onNavigateTab }) => {
  const [stations, setStations] = useState<MumbaiLocalStation[]>([]);
  const [linesData, setLinesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Route calculation state
  const [originCode, setOriginCode] = useState('CCG');
  const [destCode, setDestCode] = useState('DDR');
  const [routeResult, setRouteResult] = useState<MumbaiLocalRouteResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Active view tab
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'explorer' | 'advisory'>('planner');
  const [selectedLineTab, setSelectedLineTab] = useState<'western' | 'central' | 'harbour'>('western');

  useEffect(() => {
    const fetchNetwork = async () => {
      setLoading(true);
      try {
        const [stRes, linesRes] = await Promise.all([
          api.getMumbaiLocalStations(),
          api.getMumbaiLocalLines(),
        ]);
        setStations(stRes || []);
        setLinesData(linesRes || null);
      } catch (err) {
        console.error('Failed to load Mumbai Local data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  const handleCalculateRoute = async (from = originCode, to = destCode) => {
    if (!from || !to) return;
    if (from === to) {
      setRouteError('Origin and destination cannot be the same station.');
      setRouteResult(null);
      return;
    }

    setCalculating(true);
    setRouteError(null);
    try {
      const result = await api.getMumbaiLocalRoute(from, to);
      setRouteResult(result);
    } catch (err: any) {
      setRouteError(err.message || 'Unable to calculate suburban route. Please try another pair.');
      setRouteResult(null);
    } finally {
      setCalculating(false);
    }
  };

  // Initial calculation
  useEffect(() => {
    if (stations.length > 0 && !routeResult) {
      handleCalculateRoute('CCG', 'DDR');
    }
  }, [stations]);

  const handleSwapStations = () => {
    const temp = originCode;
    setOriginCode(destCode);
    setDestCode(temp);
    handleCalculateRoute(destCode, temp);
  };

  const handleQuickPreset = (from: string, to: string) => {
    setOriginCode(from);
    setDestCode(to);
    handleCalculateRoute(from, to);
  };

  const quickPresets = [
    { label: 'Churchgate → Dadar', from: 'CCG', to: 'DDR' },
    { label: 'CSMT → Thane', from: 'CSMT', to: 'TNA' },
    { label: 'Churchgate → Borivali', from: 'CCG', to: 'BVI' },
    { label: 'Andheri → CSMT (Transfer)', from: 'ADH', to: 'CSMT' },
    { label: 'Bandra → Ghatkopar', from: 'BA', to: 'GC' },
  ];

  const currentLineStations = useMemo(() => {
    if (!linesData?.lines) return [];
    return linesData.lines[selectedLineTab]?.stations || [];
  }, [linesData, selectedLineTab]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Train className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
            <Train className="w-3.5 h-3.5 text-sky-400" />
            <span>Mumbai Suburban Transit Engine • Western, Central & Harbour Corridors</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Mumbai Local Rail Navigator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Navigate the Lifeline of Mumbai with authentic track distances, step-by-step intermediate stops, foot overbridge transfer guidance at Dadar Junction, and official Suburban Fare slabs for 2nd Class, 1st Class, and AC Local trains.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
              Western Line (Churchgate ↔ Dahanu)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
              Central Line (CSMT ↔ Kalyan)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Harbour Line (CSMT ↔ Panvel)
            </span>
          </div>
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('planner')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSubTab === 'planner'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Suburban Route & Fare Planner
        </button>
        <button
          onClick={() => setActiveSubTab('explorer')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSubTab === 'explorer'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Network Stations Directory
        </button>
        <button
          onClick={() => setActiveSubTab('advisory')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all ${
            activeSubTab === 'advisory'
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Peak Hours & Commuter Advisory
        </button>
      </div>

      {/* PLANNER TAB */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold whitespace-nowrap">Popular Routes:</span>
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleQuickPreset(preset.from, preset.to)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                  originCode === preset.from && destCode === preset.to
                    ? 'bg-sky-100 text-sky-800 font-bold border border-sky-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Input Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Select Origin and Destination Stations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-3">
              {/* Origin Station Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Boarding Station (From)
                </label>
                <select
                  value={originCode}
                  onChange={(e) => setOriginCode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {stations.map((st) => (
                    <option key={`from-${st.code}`} value={st.code}>
                      {st.name} ({st.code}) {st.is_interchange ? '★ Interchange' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-2xs"
                  title="Swap boarding and arrival stations"
                >
                  <ArrowUpDown className="w-4 h-4 md:rotate-90" />
                </button>
              </div>

              {/* Destination Station Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Destination Station (To)
                </label>
                <select
                  value={destCode}
                  onChange={(e) => setDestCode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {stations.map((st) => (
                    <option key={`to-${st.code}`} value={st.code}>
                      {st.name} ({st.code}) {st.is_interchange ? '★ Interchange' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => handleCalculateRoute()}
                disabled={calculating}
                className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Train className="w-4 h-4" />
                <span>{calculating ? 'Calculating Track Route...' : 'Calculate Suburban Journey'}</span>
              </button>
            </div>
          </div>

          {/* Route Error Alert */}
          {routeError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{routeError}</span>
            </div>
          )}

          {/* Route Result Card */}
          {routeResult && (
            <div className="space-y-6">
              {/* Summary Metrics Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          routeResult.route_type === 'direct'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {routeResult.route_type === 'direct' ? 'Direct Journey' : 'Interchange Required'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {routeResult.from_line} {routeResult.from_line !== routeResult.to_line ? `→ ${routeResult.to_line}` : ''}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                      <span>{routeResult.from.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span>{routeResult.to.name}</span>
                    </h3>
                  </div>

                  {/* Interchange notice if applicable */}
                  {routeResult.interchange && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 space-y-0.5 max-w-sm">
                      <div className="font-bold flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Transfer at {routeResult.interchange.name}</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        {routeResult.interchange.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Distance</span>
                    <span className="text-base sm:text-xl font-black text-slate-900">
                      {routeResult.distance_km} <span className="text-xs font-normal text-slate-500">km</span>
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Est. Travel Time</span>
                    <span className="text-base sm:text-xl font-black text-slate-900">
                      {routeResult.journey_time_minutes} <span className="text-xs font-normal text-slate-500">mins</span>
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Stops</span>
                    <span className="text-base sm:text-xl font-black text-slate-900">
                      {routeResult.stops_count} <span className="text-xs font-normal text-slate-500">stations</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Fares Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span>Official Suburban Ticket Fare Slabs</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {routeResult.fare.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">2nd Class (Ordinary)</span>
                      <span className="text-[10px] text-slate-500 block">Standard suburban unreserved ticket</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-3">
                      ₹{routeResult.fare.second_class}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">1st Class Compartment</span>
                      <span className="text-[10px] text-amber-700 block">Cushioned seating coach ticket</span>
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-3">
                      ₹{routeResult.fare.first_class}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-sky-900 block">Air-Conditioned Local (AC)</span>
                      <span className="text-[10px] text-sky-700 block">Full vestibuled AC rake ticket</span>
                    </div>
                    <div className="text-2xl font-black text-sky-900 mt-3">
                      ₹{routeResult.fare.ac_local}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  * Note: Fares derived from official Western and Central Suburban Railway distance slabs. Season passes and UTS mobile ticketing available at railway counters.
                </p>
              </div>

              {/* Step-by-Step Intermediate Stops Timeline */}
              {routeResult.intermediate_stops && routeResult.intermediate_stops.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Station Sequence & Route Timeline ({routeResult.intermediate_stops.length} Stations)
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      All Fast/Slow local corridors
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-200">
                    {routeResult.intermediate_stops.map((st, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === routeResult.intermediate_stops.length - 1;
                      const isTransfer = st.code === 'DDR';

                      return (
                        <div key={st.code} className="relative flex items-start gap-3 text-xs">
                          {/* Circle marker */}
                          <div
                            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] shadow-xs ${
                              isFirst
                                ? 'bg-emerald-600 text-white'
                                : isLast
                                ? 'bg-rose-600 text-white'
                                : isTransfer
                                ? 'bg-amber-500 text-white'
                                : 'bg-white border-2 border-sky-400 text-slate-700'
                            }`}
                          >
                            {isFirst ? 'A' : isLast ? 'B' : idx + 1}
                          </div>

                          <div className="flex-1 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${isFirst || isLast ? 'text-slate-900 text-sm' : 'text-slate-700'}`}>
                                  {st.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                  {st.code}
                                </span>
                                {isTransfer && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    Transfer Junction
                                  </span>
                                )}
                              </div>
                              {st.interchanges && st.interchanges.length > 0 && (
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  Interchange: {st.interchanges.join(' • ')}
                                </p>
                              )}
                            </div>

                            <div className="text-right text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-700">{st.km_from_start} km</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* EXPLORER TAB */}
      {activeSubTab === 'explorer' && (
        <div className="space-y-6">
          {/* Line Selection */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setSelectedLineTab('western')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedLineTab === 'western'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Western Line (Churchgate ↔ Dahanu Road)
            </button>
            <button
              onClick={() => setSelectedLineTab('central')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedLineTab === 'central'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Central Line (CSMT ↔ Kalyan Junction)
            </button>
            <button
              onClick={() => setSelectedLineTab('harbour')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedLineTab === 'harbour'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Harbour Line (CSMT ↔ Panvel)
            </button>
          </div>

          {/* Line Details Header */}
          {linesData?.lines?.[selectedLineTab] && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {linesData.lines[selectedLineTab].name}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Length: {linesData.lines[selectedLineTab].total_length_km} km • Total Stations: {linesData.lines[selectedLineTab].stations?.length || 0}
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                Major Interchanges: {linesData.lines[selectedLineTab].major_interchanges?.join(', ')}
              </div>
            </div>
          )}

          {/* Station Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Station Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Km from Terminus</th>
                    <th className="py-3 px-4">Interchange Details</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentLineStations.map((st: any, idx: number) => (
                    <tr key={st.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {st.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                          {st.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {st.km_from_start} km
                      </td>
                      <td className="py-3 px-4">
                        {st.is_interchange ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {st.interchanges?.join(', ') || 'Interchange'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setOriginCode(st.code);
                            setActiveSubTab('planner');
                          }}
                          className="text-sky-600 hover:text-sky-800 font-semibold text-xs"
                        >
                          Plan from here →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADVISORY TAB */}
      {activeSubTab === 'advisory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Peak Hours Advisory for Visitors</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mumbai locals carry over 7.5 million daily commuters. If visiting as a tourist or traveler with luggage, plan your travel during non-peak windows:
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-bold block">Morning Rush (Avoid Southbound):</span>
                <span>8:30 AM – 11:00 AM towards Churchgate / CSMT</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-bold block">Evening Rush (Avoid Northbound):</span>
                <span>5:30 PM – 9:00 PM towards Borivali / Kalyan / Panvel</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="font-bold block">Ideal Travel Windows for Tourists:</span>
                <span>11:30 AM – 4:30 PM & Sundays (all day)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-sky-600" />
              <span>Suburban Commuter Tips & UTS App</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>UTS Mobile App</strong>: Buy paperless QR unreserved and AC train tickets without queuing at physical counters.
              </li>
              <li>
                <strong>Fast vs Slow Trains</strong>: "Slow" trains halt at all stations. "Fast" trains halt only at major hubs (e.g. Bandra, Andheri, Borivali).
              </li>
              <li>
                <strong>First Class & AC Compartments</strong>: Marked with red and white diagonal zebra stripes on the exterior for quick boarding.
              </li>
              <li>
                <strong>Platform Bridge Crossings</strong>: Always use Foot Overbridges (FOBs) or escalators. Never walk across tracks.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
