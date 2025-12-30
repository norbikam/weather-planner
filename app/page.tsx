'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { TravelDestination, WeatherData } from '@/types/weather';
import { v4 as uuidv4 } from 'uuid';
import Galaxy from '@/app/components/bits/Galaxy';

const TravelMap = dynamic(() => import('@/app/components/TravelMap'), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-3xl flex items-center justify-center text-white/20">Inicjalizacja mapy wszechświata...</div>
});

export default function TravelPlanner() {
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<{lat: number, lng: number, temp: number, code: number} | null>(null);
  const [note, setNote] = useState('');

  const fetchWeather = async (lat: number, lng: number) => {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
    const data: WeatherData = await res.json();
    
    setSelectedWeather({
      lat,
      lng,
      temp: data.current_weather.temperature,
      code: data.current_weather.weathercode
    });
  };

  const addDestination = () => {
    if (!selectedWeather) return;

    const newDest: TravelDestination = {
      id: uuidv4(),
      name: `Punkt ${selectedWeather.lat.toFixed(2)}, ${selectedWeather.lng.toFixed(2)}`,
      lat: selectedWeather.lat,
      lng: selectedWeather.lng,
      temp: selectedWeather.temp,
      weatherCode: selectedWeather.code,
      note: note
    };

    setDestinations([newDest, ...destinations]);
    setNote('');
    setSelectedWeather(null);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans text-white">
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <Galaxy 
          density={1.5}
          speed={1}
          glowIntensity={0.3}
          twinkleIntensity={0.5}
          transparent={false}
          hueShift={210}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="text-5xl font-black tracking-tighter italic uppercase">
            Weather<span className="text-blue-400">Planner</span>
          </h1>
          <p className="text-blue-200/50 font-mono text-xs uppercase tracking-[0.3em] mt-2">
            Pogoda na żywo dla podróży
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-black/20 backdrop-blur-sm">
              <TravelMap onMapClick={fetchWeather} />
            </div>

            {selectedWeather && (
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-blue-400 text-xs font-black uppercase tracking-widest mb-1">Wybrany Kwadrant</h3>
                    <p className="text-sm text-white/60 font-mono">LAT: {selectedWeather.lat.toFixed(4)} LNG: {selectedWeather.lng.toFixed(4)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-black text-white tracking-tighter">{selectedWeather.temp}°C</span>
                  </div>
                </div>
                
                <div className="relative group mb-6">
                  <input 
                    type="text"
                    placeholder="Wpisz notatkę podróżną..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <button 
                  onClick={addDestination}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] uppercase tracking-widest text-sm"
                >
                  Zapisz współrzędne
                </button>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-8 h-[calc(100vh-8rem)] flex flex-col">
              <h2 className="text-xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" />
                CELE PODRÓŻY
              </h2>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {destinations.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/20 text-sm italic font-mono uppercase tracking-widest">Brak zapisanych danych...</p>
                  </div>
                )}
                
                {destinations.map(dest => (
                  <div key={dest.id} className="group p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-black text-blue-400 leading-none">{dest.temp}°C</span>
                      <button 
                        onClick={() => setDestinations(destinations.filter(d => d.id !== dest.id))}
                        className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all uppercase text-[10px] font-bold"
                      >
                        usuń
                      </button>
                    </div>
                    <p className="text-sm font-medium text-white/90 mb-3">{dest.note || "Bez nazwy"}</p>
                    <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase">
                      <span>{dest.lat.toFixed(2)}N</span>
                      <span>{dest.lng.toFixed(2)}E</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        .leaflet-container {
          background: #0a0a0a !important;
           hue-rotate(180deg) brightness(0.6) contrast(1.2);
        }
      `}</style>
    </main>
  );
}