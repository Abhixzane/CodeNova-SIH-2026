import React, { useState } from 'react';
import { Box, Sparkles, Layers, Info, Rotate3d, Compass } from 'lucide-react';
import { GatewayOfIndia3D } from '../components/threed/GatewayOfIndia3D';

export const Heritage3DPage: React.FC = () => {
  const [selectedMonument, setSelectedMonument] = useState('Gateway of India');

  const monuments = [
    {
      name: 'Gateway of India',
      city: 'Mumbai',
      era: 'Indo-Saracenic (1924)',
      architect: 'George Wittet',
      material: 'Yellow Basalt & Reinforced Concrete',
      description: 'Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911. Blends 16th-century Gujarati architectural traditions with classical Roman triumphal arch motifs.',
    },
    {
      name: 'Taj Mahal',
      city: 'Agra',
      era: 'Mughal Architectural Apex (1653)',
      architect: 'Ustad Ahmad Lahori',
      material: 'Makrana Pure White Marble',
      description: 'UNESCO World Heritage monument showcasing fourfold symmetry, intricate pietra dura inlay work, and monumental onion domes set amidst charbagh water channels.',
    },
    {
      name: 'Qutub Minar',
      city: 'Delhi',
      era: 'Delhi Sultanate (1199)',
      architect: 'Qutb-ud-din Aibak & Iltutmish',
      material: 'Fluted Red Sandstone & Marble',
      description: 'The tallest brick minaret in the world standing at 72.5 meters. Features fluted columns, ornate balcony brackets, and Quranic calligraphic friezes.',
    },
    {
      name: 'Hawa Mahal',
      city: 'Jaipur',
      era: 'Rajput Architecture (1799)',
      architect: 'Lal Chand Ustad',
      material: 'Pink and Red Sandstone',
      description: 'The Palace of Winds features 953 intricate jharokha honeycomb windows designed with natural Venturi airflow for royal women to observe street processions.',
    },
  ];

  const current = monuments.find((m) => m.name === selectedMonument) || monuments[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 animate-fadeIn">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Box className="w-3.5 h-3.5" />
          <span>WebGL 3D Architectural Simulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">3D Heritage Explorer</h1>
        <p className="text-xs sm:text-sm text-charcoal-light max-w-2xl leading-relaxed">
          Interactive real-time three-dimensional models of historical Indian structures. Rotate, toggle wireframes, and inspect volumetric proportions.
        </p>
      </div>

      {/* Monument selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {monuments.map((m) => (
          <button
            key={m.name}
            onClick={() => setSelectedMonument(m.name)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              selectedMonument === m.name
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400'
                : 'bg-slate-900 text-charcoal-light hover:text-charcoal border border-parchment-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <GatewayOfIndia3D placeName={current.name} />

      {/* Architectural Dossier */}
      <div className="rounded-3xl bg-slate-900/60 border border-parchment-300 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-charcoal">
          <Info className="w-4 h-4 text-orange-400" />
          <span>Architectural Breakdown: {current.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-parchment-300 space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Era & Style</span>
            <span className="font-bold text-charcoal">{current.era}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-parchment-300 space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Master Architect</span>
            <span className="font-bold text-charcoal">{current.architect}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-parchment-300 space-y-1">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Materiality</span>
            <span className="font-bold text-charcoal">{current.material}</span>
          </div>
        </div>

        <p className="text-xs text-charcoal-light leading-relaxed pt-2 border-t border-slate-800">
          {current.description}
        </p>
      </div>
    </div>
  );
};
