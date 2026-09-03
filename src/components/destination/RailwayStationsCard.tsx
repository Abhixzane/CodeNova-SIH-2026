import React from 'react';
import { RailwayStationInfo } from '../../types';
import { Train, Navigation, Footprints, Car, ArrowRight, ShieldCheck } from 'lucide-react';

interface RailwayStationsCardProps {
  stations: RailwayStationInfo[];
  placeName: string;
  onSelectStationForRoute?: (stationName: string) => void;
}

export const RailwayStationsCard: React.FC<RailwayStationsCardProps> = ({
  stations,
  placeName,
  onSelectStationForRoute,
}) => {
  if (!stations || stations.length === 0) return null;

  return (
    <div className="heritage-border heritage-shadow bg-parchment-50 rounded-3xl p-6 border border-parchment-300 bg-parchment-50/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal font-['Plus_Jakarta_Sans']">
              Nearby Railway Stations & Transit Hubs
            </h3>
            <p className="text-xs text-charcoal-light">
              Verified rail connections for {placeName}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          Indian Railways & Transit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {stations.map((st) => (
          <div
            key={st.id}
            className="p-4 rounded-2xl bg-parchment-100/90 border border-parchment-300 hover:border-cyan-500/40 transition-all space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-charcoal group-hover:text-cyan-400 transition-colors">
                    {st.name}
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-charcoal-light">
                    {st.code}
                  </span>
                </div>
                <div className="text-[11px] text-charcoal-light mt-0.5">
                  {st.line}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-cyan-400 font-mono">
                  {st.distance_km} km
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-charcoal-light pt-1 border-t border-parchment-300/80">
              <div className="flex items-center gap-1 text-charcoal-light">
                <Footprints className="w-3.5 h-3.5 text-terracotta" />
                <span>{st.walking_time_mins} min walk</span>
              </div>
              <div className="flex items-center gap-1 text-charcoal-light">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>{st.road_time_mins} min drive</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 flex-wrap">
                {st.transfer_modes.map((mode, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-charcoal-light border border-parchment-300"
                  >
                    {mode}
                  </span>
                ))}
              </div>
              {onSelectStationForRoute && (
                <button
                  onClick={() => onSelectStationForRoute(st.name)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Route</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
