import React, { useEffect, useState } from 'react';
import { Bookmark, Calendar, Trash2, Clock, IndianRupee, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { TripItem } from '../types';
import { NavTab } from '../components/layout/Sidebar';

interface MyTripsPageProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (id: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onNavigateTab, onSelectPlace }) => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Itinerary Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mt-1">My Saved Trips</h1>
          <p className="text-xs text-charcoal-light">
            Stored daily plans and multi-stop circuits created via the Day Planner.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('itinerary')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-charcoal text-xs font-bold transition shadow-md shadow-orange-500/20 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Plan New Day Trip</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-orange-400 font-semibold animate-pulse">
          Loading your travel itineraries...
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/50 border border-parchment-300 p-8 space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-charcoal">No saved trips yet</p>
          <p className="text-xs text-charcoal-light max-w-sm mx-auto">
            Use the Day Planner to assemble custom visits with automated travel legs, then save them here.
          </p>
          <button
            onClick={() => onNavigateTab('itinerary')}
            className="px-4 py-2 rounded-xl bg-orange-500 text-charcoal text-xs font-bold mt-2 hover:bg-orange-600 transition"
          >
            Launch Day Planner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-3xl bg-parchment-100/90 border border-parchment-300 p-5 sm:p-6 space-y-4 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-charcoal">{trip.title}</h3>
                  <p className="text-xs text-charcoal-light">
                    {trip.city} • Created on {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-charcoal-light">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {trip.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <IndianRupee className="w-3.5 h-3.5" />
                      ₹{trip.estimated_cost}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-2 rounded-xl text-charcoal-light hover:text-red-400 hover:bg-slate-900 transition"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stops list */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Itinerary Stops ({trip.stops?.length || 0})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {trip.stops?.map((stop, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                      className="p-2.5 rounded-xl bg-slate-950 border border-parchment-300 flex items-center justify-between text-xs cursor-pointer hover:border-orange-500/50 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {stop.order}
                        </span>
                        <span className="font-semibold text-charcoal truncate">
                          {stop.place_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-charcoal-light font-mono ml-2">
                        {stop.visit_minutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
