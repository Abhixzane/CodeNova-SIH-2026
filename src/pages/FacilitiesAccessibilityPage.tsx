import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Navigation,
  Compass,
  Search,
  Filter,
  Eye,
  Info,
  Clock,
  Sparkles,
  Accessibility
} from 'lucide-react';
import { api } from '../services/api';
import { InfrastructureFacility, AccessibilityRecord } from '../types';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const FacilitiesAccessibilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'accessibility'>('facilities');
  const [facilities, setFacilities] = useState<InfrastructureFacility[]>([]);
  const [accessibilityRecords, setAccessibilityRecords] = useState<AccessibilityRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('ALL');
  const [wheelchairFilter, setWheelchairFilter] = useState<string>('ALL');
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Accessibility Detail Modal
  const [selectedAudit, setSelectedAudit] = useState<AccessibilityRecord | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCity, accessibleOnly]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [facs, accs] = await Promise.all([
        api.getFacilities({ city: selectedCity || undefined, accessible: accessibleOnly }),
        api.getAccessibility({ city: selectedCity || undefined }),
      ]);
      setFacilities(facs);
      setAccessibilityRecords(accs);
    } catch (err) {
      console.error('Failed to load facilities or accessibility data:', err);
    } finally {
      setLoading(false);
    }
  };

  const citiesList = [
    { label: 'All Cities', value: '' },
    { label: 'Agra', value: 'Agra' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'New Delhi', value: 'New Delhi' },
    { label: 'Jaipur', value: 'Jaipur' },
    { label: 'Kolkata', value: 'Kolkata' },
  ];

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedFacilityType === 'ALL' || f.type === selectedFacilityType;
    return matchesSearch && matchesType;
  });

  const filteredAccessibility = accessibilityRecords.filter((rec) => {
    const matchesSearch =
      rec.place_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWheelchair =
      wheelchairFilter === 'ALL' || rec.wheelchair_access === wheelchairFilter;
    return matchesSearch && matchesWheelchair;
  });

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'TOILET':
        return '🚻';
      case 'PARKING':
        return '🅿️';
      case 'MEDICAL':
        return '🏥';
      case 'POLICE':
        return '👮';
      case 'TOURIST_INFO':
        return 'ℹ️';
      case 'WATER_ATM':
        return '💧';
      default:
        return '📍';
    }
  };

  const getWheelchairBadge = (access: string) => {
    switch (access) {
      case 'YES':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fully Barrier-Free</span>
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Partially Accessible</span>
          </span>
        );
      case 'NO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Steps / Barriers Present</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
              <Accessibility className="w-3.5 h-3.5" />
              <span>BARRIER-FREE TRAVEL & CIVIC AMENITIES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Tourist Facilities & Accessibility Audits
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
              Real-time directory of essential public tourist infrastructure — clean restrooms, emergency medical
              booths, police aid, water stations, and official barrier-free accessibility audits for Indian heritage monuments.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ProvenanceBadge type="OFFICIAL" sourceText="Ministry of Tourism Sugamya Bharat Abhiyan / ASI Physical Access Audit" />
          </div>
        </div>

        {/* View Switcher */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'facilities'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Civic & Tourist Facilities</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'facilities' ? 'bg-blue-700/40 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {facilities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'accessibility'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Monument Accessibility Audits</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'accessibility' ? 'bg-blue-700/40 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {accessibilityRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'facilities'
                ? 'Search facilities by name, location, address...'
                : 'Search monuments by name, city...'
            }
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* City Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-stone-500 hidden sm:inline">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden"
            >
              {citiesList.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'facilities' && (
            <>
              <select
                value={selectedFacilityType}
                onChange={(e) => setSelectedFacilityType(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden"
              >
                <option value="ALL">All Types</option>
                <option value="TOILET">Restrooms / Washrooms</option>
                <option value="PARKING">Parking Facilities</option>
                <option value="MEDICAL">Medical First Aid</option>
                <option value="POLICE">Tourist Police</option>
                <option value="TOURIST_INFO">Visitor Info Centers</option>
                <option value="WATER_ATM">Pure Drinking Water</option>
              </select>

              <label className="flex items-center gap-2 px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-lg cursor-pointer text-xs font-semibold text-blue-900">
                <input
                  type="checkbox"
                  checked={accessibleOnly}
                  onChange={(e) => setAccessibleOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-stone-300 focus:ring-blue-500"
                />
                <span>Wheelchair Accessible</span>
              </label>
            </>
          )}

          {activeTab === 'accessibility' && (
            <select
              value={wheelchairFilter}
              onChange={(e) => setWheelchairFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden"
            >
              <option value="ALL">All Access Levels</option>
              <option value="YES">Fully Accessible (YES)</option>
              <option value="PARTIAL">Partial Accessibility</option>
              <option value="NO">Barriers / Steps Present</option>
            </select>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Retrieving facilities and accessibility records...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFacilityIcon(fac.type)}</span>
                        <span className="text-xs font-bold text-stone-500 tracking-wide uppercase">
                          {fac.type.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {fac.is_24x7 && (
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                            24x7 OPEN
                          </span>
                        )}
                        {fac.is_accessible && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            ACCESSIBLE
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug">{fac.name}</h3>
                    <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>{fac.address}</span>
                    </p>

                    {fac.description && (
                      <p className="mt-3 text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        {fac.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{fac.contact}</span>
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MONUMENT ACCESSIBILITY AUDITS */}
          {activeTab === 'accessibility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccessibility.map((audit) => (
                <div
                  key={audit.place_id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <ProvenanceBadge type={audit.provenance} />
                      <span className="text-xs font-semibold text-stone-500">
                        {audit.city}, {audit.state}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 leading-snug">{audit.place_name}</h3>

                    <div className="mt-3">
                      {getWheelchairBadge(audit.wheelchair_access)}
                    </div>

                    {/* Terrain & Key Amenities Checklist */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">Flat / Paved Terrain</span>
                        <span className="font-bold text-stone-800">{audit.flat_terrain_percentage}%</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${audit.flat_terrain_percentage}%` }}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-stone-700">
                        <div className={`p-1.5 rounded-md flex items-center gap-1.5 ${audit.ramp_available ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                          {audit.ramp_available ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>Ramps</span>
                        </div>
                        <div className={`p-1.5 rounded-md flex items-center gap-1.5 ${audit.accessible_toilet ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                          {audit.accessible_toilet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>Accessible Restroom</span>
                        </div>
                        <div className={`p-1.5 rounded-md flex items-center gap-1.5 ${audit.tactile_paving_or_braille ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                          {audit.tactile_paving_or_braille ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>Braille / Tactile</span>
                        </div>
                        <div className={`p-1.5 rounded-md flex items-center gap-1.5 ${audit.audio_guide_available ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-50 text-stone-400'}`}>
                          {audit.audio_guide_available ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>Audio Guides</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-stone-600 line-clamp-3 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {audit.accessibility_notes}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">ASI Barrier-Free Audit</span>
                    <button
                      onClick={() => setSelectedAudit(audit)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Audit Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Accessibility Full Audit Modal */}
      {selectedAudit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs"
        >
          <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ProvenanceBadge type={selectedAudit.provenance} />
                  <span className="text-xs text-stone-500">{selectedAudit.city}, {selectedAudit.state}</span>
                </div>
                <h2 className="text-xl font-bold text-stone-900">{selectedAudit.place_name}</h2>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Wheelchair Navigation Status
                </span>
                {getWheelchairBadge(selectedAudit.wheelchair_access)}
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  <span>Official Field Reconnaissance Notes</span>
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed mt-1">
                  {selectedAudit.accessibility_notes}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Detailed Feature Audit Checklist
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Ramped Entrances</span>
                    <span className="font-bold text-stone-800">{selectedAudit.ramp_available ? 'Available' : 'No Ramps'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Accessible Washroom</span>
                    <span className="font-bold text-stone-800">{selectedAudit.accessible_toilet ? 'Present' : 'Not Present'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Tactile / Braille Signage</span>
                    <span className="font-bold text-stone-800">{selectedAudit.tactile_paving_or_braille ? 'Installed' : 'None'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Audio Guide Available</span>
                    <span className="font-bold text-stone-800">{selectedAudit.audio_guide_available ? 'Available' : 'None'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Elevators / Lifts</span>
                    <span className="font-bold text-stone-800">{selectedAudit.elevator_available ? 'Operating' : 'None'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Dedicated Divyangjan Parking</span>
                    <span className="font-bold text-stone-800">{selectedAudit.dedicated_parking ? 'Reserved' : 'General'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
