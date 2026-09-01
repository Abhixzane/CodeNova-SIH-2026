import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trash2, ArrowRight, Plus } from 'lucide-react';
import { TripItem } from '../types';
import { api } from '../services/api';

interface MyTripsPageProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateToPlanner: () => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onSelectPlace, onNavigateToPlanner }) => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    await api.deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-parchment text-charcoal p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-parchment-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-emerald-500/20 text-terracotta text-xs font-semibold mb-2">
              <Calendar size={14} /> Saved Itineraries
            </div>
            <h1 className="text-3xl font-extrabold text-charcoal">My Heritage Trips</h1>
            <p className="text-sm text-charcoal-light mt-1">
              Your saved personalized travel itineraries with stop timings, railway connections, and budget breakdowns.
            </p>
          </div>
          <button
            onClick={onNavigateToPlanner}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} /> Plan New Itinerary
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-charcoal-light">Loading saved trips...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-parchment-50 border border-parchment-300/80 rounded-3xl p-8">
            <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-charcoal mb-2">No Saved Trips Yet</h3>
            <p className="text-sm text-charcoal-light max-w-md mx-auto mb-6">
              Use our AI Itinerary Planner and Budget Optimizer to generate custom day trips, then click Save Trip.
            </p>
            <button
              onClick={onNavigateToPlanner}
              className="px-6 py-3 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Open Itinerary Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-parchment-50 border border-parchment-300 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-terracotta/10 text-terracotta border border-emerald-500/20 text-[11px] font-bold">
                      {trip.city}
                    </span>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-1.5 rounded-lg text-charcoal-light hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Trip"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-charcoal mb-2">{trip.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-charcoal-light mb-5">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-terracotta" /> {trip.duration_hours}h Duration
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-teal-400" /> {trip.total_places} Stops
                    </span>
                    <span className="font-bold text-terracotta">
                      Est. ₹{trip.estimated_cost}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-parchment-300 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Stops Sequence</p>
                    {trip.stops.map((stop, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-terracotta/20 text-terracotta font-bold flex items-center justify-center text-[10px]">
                            {stop.order}
                          </span>
                          <span className="text-charcoal font-medium">{stop.place_name}</span>
                        </div>
                        <span className="text-charcoal-light text-[11px]">{stop.visit_minutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-parchment-300 flex items-center justify-between">
                  <button
                    onClick={() => onSelectPlace(trip.stops[0]?.place_id || 'gateway-of-india')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:text-emerald-300 transition"
                  >
                    <span>View First Stop Dossier</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
