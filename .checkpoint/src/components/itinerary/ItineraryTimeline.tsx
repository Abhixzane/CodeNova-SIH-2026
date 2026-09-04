import React, { useState } from 'react';
import { ItineraryResponse } from '../../types';
import { api } from '../../services/api';
import { 
  Clock, 
  MapPin, 
  Car, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Compass,
  Sparkles,
  Bookmark,
  Check
} from 'lucide-react';

interface ItineraryTimelineProps {
  itinerary: ItineraryResponse;
  onSelectPlace?: (placeId: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onSelectPlace,
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!itinerary || !itinerary.stops || itinerary.stops.length === 0) {
    return null;
  }

  const validStops = itinerary.stops;

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      const stopsCount = itinerary.total_places || validStops.length;
      await api.createTrip({
        title: `${itinerary.city} ${itinerary.duration_hours}h Tour`,
        city: itinerary.city,
        duration_hours: itinerary.duration_hours,
        total_places: stopsCount,
        estimated_cost: itinerary.estimated_total_cost || (stopsCount * 45),
        stops: validStops.map((s) => ({
          order: s.order,
          place_id: s.place_id,
          place_name: s.name || s.place_name || 'Destination Stop',
          visit_minutes: s.recommended_duration_minutes,
          travel_minutes: s.travel_time_from_previous_minutes || 0,
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save trip:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate multi-stop Google Maps URL
  const stopsQuery = validStops.map((s) => encodeURIComponent(s.name || s.place_name || '')).join('/');
  const multiStopGoogleUrl = `https://www.google.com/maps/dir/${stopsQuery}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Overview Stats Bar */}
      <div className="heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-6 border border-terracotta/30 bg-parchment-100/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-parchment-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Optimized {itinerary.city} Tour</span>
            </div>
            <h3 className="text-xl font-extrabold text-charcoal font-['Plus_Jakarta_Sans']">
              {itinerary.duration_hours}-Hour Tour Schedule
            </h3>
            <p className="text-xs text-charcoal-light mt-0.5">{itinerary.summary}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleSaveTrip}
              disabled={saving || saved}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                saved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-parchment-100 hover:bg-slate-800 text-charcoal border-parchment-300 hover:border-orange-500/50'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-orange-400" />}
              <span>{saved ? 'Saved to My Trips!' : saving ? 'Saving...' : 'Save to My Trips'}</span>
            </button>

            <a
              href={multiStopGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Tour in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-parchment-300">
            <div className="text-[11px] text-charcoal-light uppercase font-semibold">Total Stops</div>
            <div className="text-lg font-black text-orange-400 mt-0.5">
              {itinerary.total_places} Destinations
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-parchment-300">
            <div className="text-[11px] text-charcoal-light uppercase font-semibold">Visiting Time</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">
              {((itinerary.estimated_total_visiting_minutes || 180) / 60).toFixed(1)} hrs
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-parchment-300">
            <div className="text-[11px] text-charcoal-light uppercase font-semibold">Travel Time</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">
              ~{itinerary.estimated_total_travel_minutes || 45} mins
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Stops Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800">
        {itinerary.stops.map((stop, idx) => (
          <div key={stop.place_id} className="relative flex items-start gap-5 group">
            {/* Step Number Circle */}
            <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-charcoal font-extrabold text-base flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0 group-hover:scale-110 transition-transform">
              {stop.order}
            </div>

            {/* Stop Content Card */}
            <div className="flex-1 heritage-border heritage-shadow bg-parchment-50 rounded-2xl p-5 border border-parchment-300/80 bg-parchment-100/60 hover:border-terracotta transition-all space-y-4">
              {/* Inter-stop travel segment indicator */}
              {stop.travel_time_from_previous_minutes !== undefined && stop.travel_time_from_previous_minutes !== null && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-parchment-300 text-[11px] text-charcoal-light">
                  <Car className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    ~{stop.travel_time_from_previous_minutes} min travel ({stop.travel_mode_from_previous || 'Drive/Transit'})
                  </span>
                  {stop.distance_from_previous_km && (
                    <span className="text-slate-500">• {stop.distance_from_previous_km.toFixed(1)} km</span>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={stop.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'}
                    alt={stop.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-800 flex-shrink-0 border border-parchment-300"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {stop.category}
                    </span>
                    <h4 
                      onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                      className="text-base font-bold text-charcoal hover:text-orange-400 transition-colors cursor-pointer mt-1"
                    >
                      {stop.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-light mt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Recommended Visit: <strong>{stop.recommended_duration_minutes} minutes</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-orange-500 hover:text-charcoal text-charcoal text-xs font-semibold rounded-xl transition-all border border-parchment-300 hover:border-orange-400 self-start"
                >
                  <span>Explore Destination</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stop Tips */}
              {stop.visit_tips && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-parchment-300 text-xs text-charcoal-light flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>{stop.visit_tips}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
