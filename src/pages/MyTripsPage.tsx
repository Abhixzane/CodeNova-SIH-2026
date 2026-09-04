import React, { useEffect, useState } from 'react';
import { Bookmark, Calendar, Trash2, Clock, IndianRupee, MapPin, ArrowRight, Navigation } from 'lucide-react';
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Itinerary Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">My Saved Trips</h1>
          <p className="text-xs text-slate-500">
            Stored daily plans and multi-stop circuits created via the Smart Day Planner.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('itinerary')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Plan New Day Trip</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-emerald-700 font-semibold animate-pulse">
          Loading your travel itineraries...
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-800">No saved trips yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Use the Smart Day Planner to assemble custom visits with automated travel legs, then save them here to access anytime.
          </p>
          <button
            onClick={() => onNavigateTab('itinerary')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm mt-2"
          >
            Launch Day Planner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{trip.title}</h3>
                  <p className="text-xs text-slate-500">
                    {trip.city} • Created {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      {trip.duration_hours}h circuit
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5" />
                      ₹{trip.estimated_cost}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('map')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </button>

                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stops list */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Itinerary Stops ({trip.stops?.length || 0})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {trip.stops?.map((stop, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-400 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {stop.order}
                        </span>
                        <span className="font-bold text-slate-800 truncate">
                          {stop.place_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono ml-2">
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
