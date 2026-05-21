import { useEffect, useState } from 'react';

export function Mapas() {
  const [mapas, setMapas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('https://campanitaweb.onrender.com/mapas')
      .then((res) => res.json())
      .then((data) => {
        setMapas(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar mapas:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-[#FFD51A] font-['PixelSplitter'] tracking-widest uppercase mb-4">
          Explora los Territorios
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Conoce los mapas y niveles diseñados en Unreal Engine 5 donde se desarrollará la aventura.
        </p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <p className="text-[#FFD51A] font-bold animate-pulse text-xl">Cargando cartografía...</p>
        </div>
      ) : mapas.length === 0 ? (
        <p className="text-center text-gray-400 py-10 border border-dashed border-gray-600 rounded-lg">
          Aún no se han revelado zonas del mapa.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mapas.map((mapa) => (
            <div key={mapa.id_mapa} className="bg-[#1B396A]/40 rounded-2xl overflow-hidden shadow-2xl border border-[#FFD51A]/20 hover:border-[#FFD51A]/60 transition-colors duration-300">
              <div className="relative h-72">
                <img 
                  src={mapa.imagen_url} 
                  alt={mapa.nombre} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-[#FFD51A] font-['PixelSplitter'] text-xs tracking-wider">
                  ZONA #{mapa.id_mapa}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4">{mapa.nombre}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{mapa.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}