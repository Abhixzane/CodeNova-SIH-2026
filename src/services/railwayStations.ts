import { RailwayStationInfo } from '../types';

export function getNearbyStationsForPlace(
  placeId?: string,
  lat?: number,
  lng?: number
): RailwayStationInfo[] {
  const pId = (placeId || '').toLowerCase();

  if (pId.includes('marine') || pId.includes('gateway') || pId.includes('colaba') || pId.includes('csmt') || pId.includes('fort')) {
    return [
      {
        id: 'csmt',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
        code: 'CSMT',
        line: 'Central Line & Harbour Line Hub',
        distance_km: 1.8,
        walking_time_mins: 22,
        road_time_mins: 8,
        transfer_modes: ['Taxi', 'BEST Bus (111, 112)', 'Walk'],
      },
      {
        id: 'churchgate',
        name: 'Churchgate Suburban Terminal',
        code: 'CCG',
        line: 'Western Line Suburban Terminal',
        distance_km: 2.1,
        walking_time_mins: 25,
        road_time_mins: 10,
        transfer_modes: ['Taxi', 'BEST Bus', 'Walk'],
      },
    ];
  }

  return [
    {
      id: 'junction-main',
      name: 'Central Junction Railway Station',
      code: 'JN',
      line: 'City Suburban & Express Network',
      distance_km: 3.5,
      walking_time_mins: 40,
      road_time_mins: 15,
      transfer_modes: ['Auto-rickshaw', 'City Bus', 'Taxi'],
    },
    {
      id: 'suburban-station',
      name: 'Suburban Transit Terminal',
      code: 'ST',
      line: 'Main Line Local Transit',
      distance_km: 4.8,
      walking_time_mins: 55,
      road_time_mins: 18,
      transfer_modes: ['Metro Feeder', 'Auto'],
    },
  ];
}
