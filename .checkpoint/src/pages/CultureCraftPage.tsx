import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Sparkles,
  MapPin,
  Clock,
  Tag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  BookOpen,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { CulturalItem, ArtisanProfile, LocalProvider } from '../types';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

interface CultureCraftPageProps {
  onSelectPlace?: (placeId: string) => void;
  selectedCity?: string;
}

export const CultureCraftPage: React.FC<CultureCraftPageProps> = ({
  onSelectPlace,
  selectedCity: initialCity = '',
}) => {
  const [activeTab, setActiveTab] = useState<'culture' | 'artisans' | 'providers'>('culture');
  const [cultureItems, setCultureItems] = useState<CulturalItem[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [providers, setProviders] = useState<LocalProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [giOnly, setGiOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal / Selected Item Detail
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanProfile | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<CulturalItem | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCity, giOnly]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cul, art, prov] = await Promise.all([
        api.getCulture({ city: selectedCity || undefined }),
        api.getArtisans({ city: selectedCity || undefined, gi_only: giOnly }),
        api.getProviders({ city: selectedCity || undefined }),
      ]);
      setCultureItems(cul);
      setArtisans(art);
      setProviders(prov);
    } catch (err) {
      console.error('Failed to load cultural & artisan data:', err);
    } finally {
      setLoading(false);
    }
  };

  const citiesList = [
    { label: 'All India', value: '' },
    { label: 'Agra', value: 'Agra' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Jaipur', value: 'Jaipur' },
    { label: 'Varanasi', value: 'Varanasi' },
    { label: 'Kolkata', value: 'Kolkata' },
    { label: 'Kochi', value: 'Kochi' },
  ];

  const filteredCulture = cultureItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cultural_significance.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === 'ALL' || item.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchSearch && matchCat;
  });

  const filteredArtisans = artisans.filter((art) => {
    const matchSearch =
      art.artisan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.craft_tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.story.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const filteredProviders = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVING HERITAGE & ARTISAN CORRIDOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Cultural Traditions, Cuisine & Master Crafts
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
              Experience the living roots of Indian civilization — from GI-certified handcrafted masterworks
              and generational workshops to culinary legacies and verified local community stewards.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ProvenanceBadge type="OFFICIAL" sourceText="Geographical Indications Registry of India / Ministry of Textiles / ASI" />
            <ProvenanceBadge type="COMMUNITY" sourceText="Audited Master Artisan Associations & Heritage Guides" />
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
          <button
            onClick={() => setActiveTab('culture')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'culture'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Living Heritage & Cuisine</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'culture' ? 'bg-amber-700/40 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {cultureItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('artisans')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'artisans'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>GI Craft Artisans</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'artisans' ? 'bg-amber-700/40 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {artisans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'providers'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Verified Local Stewards</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'providers' ? 'bg-amber-700/40 text-white' : 'bg-stone-200 text-stone-700'}`}>
              {providers.length}
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
            placeholder="Search traditions, artisans, crafts, or cuisine..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* City Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-stone-500 hidden sm:inline">Region:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden focus:border-amber-500"
            >
              {citiesList.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'artisans' && (
            <label className="flex items-center gap-2 px-3 py-2 bg-amber-50/70 border border-amber-200 rounded-lg cursor-pointer text-xs font-semibold text-amber-900">
              <input
                type="checkbox"
                checked={giOnly}
                onChange={(e) => setGiOnly(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
              />
              <span>GI Tag Certified Only</span>
            </label>
          )}

          {activeTab === 'culture' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="CULINARY_HERITAGE">Culinary Heritage</option>
              <option value="PERFORMING_ARTS">Performing Arts</option>
              <option value="LIVING_TRADITIONS">Living Traditions</option>
              <option value="TEXTILE_HERITAGE">Textile Heritage</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-600">Loading authentic heritage archives...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: CULTURE & LIVING HERITAGE */}
          {activeTab === 'culture' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCulture.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <ProvenanceBadge type={item.provenance} />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {item.city}, {item.state}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{item.category.replace(/_/g, ' ')}</span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 leading-snug">{item.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        <span>Cultural Significance</span>
                      </h4>
                      <p className="mt-1 text-xs text-stone-700 leading-relaxed line-clamp-2">
                        {item.cultural_significance}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <p className="text-[11px] font-semibold text-stone-500 mb-1.5">Recommended Locations:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.best_locations.slice(0, 2).map((loc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                          >
                            {loc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCulture(item)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <span>View Heritage Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ARTISANS & CRAFT TRADITIONS */}
          {activeTab === 'artisans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtisans.map((artisan) => (
                <div
                  key={artisan.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={artisan.thumbnail_url}
                      alt={artisan.craft_tradition}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <ProvenanceBadge type={artisan.provenance} />
                      {artisan.gi_tag_status && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black text-[10px] tracking-wide shadow-xs">
                          GI TAGGED
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {artisan.city}, {artisan.state}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        {artisan.craft_tradition}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {artisan.price_range}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">{artisan.artisan_name}</h3>
                    <p className="mt-1 text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {artisan.story}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-700">
                      <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                        <span className="block text-[10px] font-bold text-stone-500 uppercase">Visits</span>
                        <span className="font-semibold text-stone-800">
                          {artisan.visiting_allowed ? 'Workshops Open' : 'By Appointment'}
                        </span>
                      </div>
                      <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                        <span className="block text-[10px] font-bold text-stone-500 uppercase">Live Demo</span>
                        <span className="font-semibold text-stone-800">
                          {artisan.demonstration_available ? 'Available' : 'Showroom Only'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{artisan.experience_duration}</span>
                      </div>

                      <button
                        onClick={() => setSelectedArtisan(artisan)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Workshop Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VERIFIED LOCAL STEWARDS */}
          {activeTab === 'providers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={provider.thumbnail_url}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <ProvenanceBadge type={provider.provenance} />
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {provider.city}, {provider.state}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                        {provider.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{provider.rating}</span>
                        <span className="text-stone-400 font-normal">({provider.reviews_count})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{provider.name}</h3>
                    <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Specialties
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-semibold rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">Pricing</span>
                        <span className="font-bold text-stone-900">{provider.pricing}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {provider.contact.phone && (
                          <a
                            href={`tel:${provider.contact.phone}`}
                            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                            title="Call Provider"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {provider.contact.booking_url && (
                          <a
                            href={provider.contact.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                          >
                            <span>Book Direct</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Artisan Workshop Modal */}
      {selectedArtisan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-48 bg-stone-100">
              <img
                src={selectedArtisan.thumbnail_url}
                alt={selectedArtisan.craft_tradition}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedArtisan(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/70 text-white flex items-center justify-center hover:bg-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <ProvenanceBadge type={selectedArtisan.provenance} />
                {selectedArtisan.gi_tag_status && (
                  <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-black text-xs rounded">
                    GI TAG CERTIFIED TRADITION
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-stone-900">{selectedArtisan.artisan_name}</h2>
                <p className="text-sm font-semibold text-amber-700">{selectedArtisan.craft_tradition}</p>
                <p className="text-xs text-stone-500 mt-0.5">{selectedArtisan.city}, {selectedArtisan.state}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">Tradition Story</h4>
                <p className="text-sm text-stone-600 leading-relaxed">{selectedArtisan.story}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-500 block uppercase text-[10px]">Workshop Location</span>
                  <span className="font-medium text-stone-800 mt-1 block">{selectedArtisan.workshop_location}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-500 block uppercase text-[10px]">Experience Duration & Price</span>
                  <span className="font-medium text-stone-800 mt-1 block">
                    {selectedArtisan.experience_duration} • {selectedArtisan.price_range}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Signature Masterworks</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.products.map((prod, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedArtisan(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close Workshop Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Heritage Detail Modal */}
      {selectedCulture && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs"
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-48 bg-stone-100">
              <img
                src={selectedCulture.thumbnail_url}
                alt={selectedCulture.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedCulture(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/70 text-white flex items-center justify-center hover:bg-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <ProvenanceBadge type={selectedCulture.provenance} />
                <span className="text-xs font-bold text-amber-800 uppercase">
                  {selectedCulture.category.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-stone-900">{selectedCulture.name}</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedCulture.city}, {selectedCulture.state} ({selectedCulture.region})
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                  Living Cultural Significance
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">{selectedCulture.cultural_significance}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Description & Context
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">{selectedCulture.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Iconic Locations to Experience
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {selectedCulture.best_locations.map((loc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{loc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedCulture(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close Archive View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
