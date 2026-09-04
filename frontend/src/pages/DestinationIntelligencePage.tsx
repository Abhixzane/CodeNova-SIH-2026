import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Layers,
  Train,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import {
  DestinationHealthResponse,
  DestinationHealthCity,
  TourismGapZone,
  HeritageCluster,
  CommuterNetwork
} from '../types';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const DestinationIntelligencePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'health' | 'gaps' | 'clusters' | 'suburban'>('health');
  const [healthData, setHealthData] = useState<DestinationHealthResponse | null>(null);
  const [clusters, setClusters] = useState<HeritageCluster[]>([]);
  const [suburbanNetworks, setSuburbanNetworks] = useState<CommuterNetwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected City for Deep-Dive
  const [selectedCityId, setSelectedCityId] = useState<string>('agra');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hData, clus, sub] = await Promise.all([
        api.getDestinationHealth(),
        api.getClusters(),
        api.getSuburbanNetworks(),
      ]);
      setHealthData(hData);
      setClusters(clus);
      setSuburbanNetworks(sub);
    } catch (err) {
      console.error('Failed to load destination intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCityData: DestinationHealthCity | undefined =
    healthData?.cities.find((c) => c.city_id === selectedCityId) || healthData?.cities[0];

  const getMetricColor = (val: number, inverse: boolean = false) => {
    const isGood = inverse ? val < 60 : val > 75;
    const isMedium = inverse ? val >= 60 && val <= 80 : val >= 60 && val <= 75;
    if (isGood) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (isMedium) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>TOURISM INTELLIGENCE & CIVIC GAP ANALYTICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Destination Health & Tourism Infrastructure
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
              Decision-support intelligence for destination carrying capacities, transit stress points,
              heritage conservation risk indexes, and pan-India commuter railway corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ProvenanceBadge
              type="MODELLED"
              sourceText="Analytical estimate derived from historical footfall density, transit headway frequencies, and field reconnaissance."
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
          <button
            onClick={() => setActiveSection('health')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSection === 'health'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Destination Health Index</span>
          </button>

          <button
            onClick={() => setActiveSection('gaps')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSection === 'gaps'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Tourism Gap Map</span>
          </button>

          <button
            onClick={() => setActiveSection('clusters')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSection === 'clusters'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Heritage Clusters ({clusters.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('suburban')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSection === 'suburban'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Pan-India Commuter Rail ({suburbanNetworks.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Synthesizing destination carrying capacities...</p>
        </div>
      ) : (
        <>
          {/* SECTION 1: DESTINATION HEALTH DASHBOARD */}
          {activeSection === 'health' && healthData && selectedCityData && (
            <div className="space-y-6">
              {/* City Selection Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {healthData.cities.map((c) => (
                  <button
                    key={c.city_id}
                    onClick={() => setSelectedCityId(c.city_id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedCityId === c.city_id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c.city_name} ({c.state})
                  </button>
                ))}
              </div>

              {/* Peak Season Alert Notice */}
              {selectedCityData.peak_season_warning && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Seasonal Load & Carrying Capacity Advisory
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                      {selectedCityData.peak_season_warning}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Vital Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Visitor Load Index
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.visitor_load_index}
                    </span>
                    <span className="text-xs text-stone-400">/ 100</span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.visitor_load_index}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Transit Stress Index
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.transport_load_index}
                    </span>
                    <span className="text-xs text-stone-400">/ 100</span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-rose-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.transport_load_index}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Heritage Risk Score
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.heritage_risk_index}
                    </span>
                    <span className="text-xs text-stone-400">/ 100</span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.heritage_risk_index}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Accessibility Readiness
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.accessibility_score}
                    </span>
                    <span className="text-xs text-stone-400">/ 100</span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.accessibility_score}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Sanitation & Water
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.sanitation_readiness}
                    </span>
                    <span className="text-xs text-stone-400">/ 100</span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.sanitation_readiness}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Local Enterprise Share
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-900">
                      {selectedCityData.local_business_participation}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${selectedCityData.local_business_participation}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Critical Gaps & Civic Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Identified Infrastructure Bottlenecks</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {selectedCityData.critical_gaps.map((gap, i) => (
                      <li
                        key={i}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700 leading-relaxed flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Civic Interventions & Dispersal Policy</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {selectedCityData.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: TOURISM GAP MAP */}
          {activeSection === 'gaps' && healthData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthData.gap_map_zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                          {zone.city} Heritage Buffer Zone
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          {zone.footfall_density} FOOTFALL
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-900 leading-snug">{zone.zone_name}</h3>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold text-stone-400 block uppercase">
                            Transit Friction
                          </span>
                          <span className="font-bold text-stone-800">{zone.transit_connectivity_gap}</span>
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold text-stone-400 block uppercase">
                            Sanitation Status
                          </span>
                          <span className="font-bold text-stone-800">{zone.sanitation_gap}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                        <span className="text-[10px] font-bold text-amber-900 block uppercase tracking-wider mb-1">
                          Action Required for Tourism Master Plan
                        </span>
                        <p className="text-xs text-stone-700 leading-relaxed">{zone.recommended_action}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Civic Gap Map Unit #{zone.id.split('-')[1]}</span>
                      <span className="font-bold text-stone-800">Priority Action Assigned</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: HERITAGE CLUSTERS */}
          {activeSection === 'clusters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        {cluster.city}, {cluster.state}
                      </span>
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-xs font-bold rounded">
                        {cluster.recommended_duration_hours} Hours Circuit
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">{cluster.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {cluster.description}
                    </p>

                    <div className="mt-4">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                        Included Heritage Sites ({cluster.sites.length})
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {cluster.sites.map((site) => (
                          <div
                            key={site.id}
                            className="p-2 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="text-xs font-semibold text-stone-800 truncate">{site.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                      <span className="font-bold text-stone-900 block text-[10px] uppercase">
                        Recommended Transit Transfer
                      </span>
                      <span className="mt-0.5 block">{cluster.transit_tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 4: PAN-INDIA COMMUTER NETWORKS */}
          {activeSection === 'suburban' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suburbanNetworks.map((net) => (
                  <div
                    key={net.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
                          {net.city} • {net.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">{net.operator}</span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-900">{net.network_name}</h3>
                      <p className="mt-1 text-xs text-stone-600 leading-relaxed">{net.description}</p>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">Ridership</span>
                          <span className="font-bold text-stone-800 text-[11px]">{net.daily_ridership}</span>
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">Lines</span>
                          <span className="font-bold text-stone-800 text-sm">{net.lines_count} Corridors</span>
                        </div>
                        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">Stations</span>
                          <span className="font-bold text-stone-800 text-sm">{net.stations_count}+</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                          Key Lines & Heritage Interchanges
                        </span>
                        {net.lines.map((line, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs"
                          >
                            <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: line.color }}
                              />
                              <span>{line.name}</span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">
                              {line.key_stations.join(' ➔ ')}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-950">
                        <span className="font-bold block text-[10px] uppercase">Fare Structure</span>
                        <span className="mt-0.5 block">{net.fare_structure}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
