import { useEffect, useState } from 'react';

export function Mapas() {
  const [mapas, setMapas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mapaSeleccionado, setMapaSeleccionado] = useState(null);

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

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMapaSeleccionado(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-[#FFD51A] font-['PixelSplitter'] tracking-widest uppercase mb-4">
          Explora los Territorios
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Conoce los mapas y niveles diseñados en Unreal Engine 5 donde se desarrollará la aventura. Haz clic en un mapa para inspeccionarlo en pantalla grande.
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
            <div
              key={mapa.id_mapa}
              onClick={() => setMapaSeleccionado(mapa)}
              className="bg-[#1B396A]/40 rounded-2xl overflow-hidden shadow-2xl border border-[#FFD51A]/20 hover:border-[#FFD51A]/80 transition-all duration-300 cursor-pointer flex flex-col group"
            >
              <div className="relative w-full h-80 bg-[#0D2144] overflow-hidden flex items-center justify-center">
                {/* Fondo difuminado ambiental */}
                <img
                  src={mapa.imagen_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
                />
                {/* Imagen completa sin recortes */}
                <img
                  src={mapa.imagen_url}
                  alt={mapa.nombre}
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-[#FFD51A] font-['PixelSplitter'] text-xs tracking-wider z-20 border border-white/10">
                  ZONA #{mapa.id_mapa}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white px-3 py-1.5 rounded-lg text-xs font-['PixelSplitter'] border border-white/20 shadow-lg transition-colors flex items-center gap-1.5 z-20">
                  <span>👁️</span> AMPLIAR MAPA
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[#FFD51A] transition-colors">{mapa.nombre}</h3>
                  <p className="text-gray-300 leading-relaxed text-base">{mapa.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PANTALLA GRANDE - MAPA */}
      {mapaSeleccionado && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setMapaSeleccionado(null)}
        >
          <div
            className="relative bg-[#1B396A]/90 border-2 border-[#FFD51A] rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(255,213,26,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="bg-[#FFD51A] text-[#1B396A] px-2.5 py-1 rounded text-xs font-['PixelSplitter'] font-bold">
                  ZONA #{mapaSeleccionado.id_mapa}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['PixelSplitter'] uppercase tracking-wider">
                  {mapaSeleccionado.nombre}
                </h3>
              </div>
              <button
                onClick={() => setMapaSeleccionado(null)}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-['PixelSplitter'] tracking-widest transition-colors cursor-pointer"
              >
                ✕ CERRAR
              </button>
            </div>

            {/* Contenedor mapa pantalla grande */}
            <div className="relative w-full h-[62vh] sm:h-[70vh] bg-[#0D2144] flex items-center justify-center overflow-hidden">
              <img
                src={mapaSeleccionado.imagen_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl pointer-events-none"
              />
              <img
                src={mapaSeleccionado.imagen_url}
                alt={mapaSeleccionado.nombre}
                className="relative z-10 max-w-full max-h-full object-contain p-4 drop-shadow-2xl"
              />
            </div>

            {/* Pie del modal con descripción */}
            {mapaSeleccionado.descripcion && (
              <div className="p-6 bg-black/60 border-t border-white/10 overflow-y-auto max-h-[18vh]">
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  {mapaSeleccionado.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}