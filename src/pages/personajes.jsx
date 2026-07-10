import { useEffect, useState } from 'react';

export function Personajes() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  useEffect(() => {
    fetch('https://campanitaweb.onrender.com/personajes')
      .then((res) => res.json())
      .then((data) => {
        setPersonajes(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar personajes:", err);
        setCargando(false);
      });
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setItemSeleccionado(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const esModelo3D = (url) => {
    if (!url) return false;
    const u = url.toLowerCase();
    return u.endsWith('.glb') || u.endsWith('.gltf') || u.includes('.glb');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <h2 className="text-4xl text-[#FFD51A] font-['PixelSplitter'] text-center tracking-widest mb-10 uppercase">
        Personajes del Juego
      </h2>

      {cargando ? (
        <p className="text-center text-gray-400">Consultando pergaminos antiguos en Aiven...</p>
      ) : personajes.length === 0 ? (
        <p className="text-center text-gray-400">El lore está vacío. Registra personajes en el Dashboard.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personajes.map((p) => {
            const is3D = esModelo3D(p.imagen_url);
            return (
              <div
                key={p.id_personaje}
                className="bg-[#1B396A]/60 rounded-xl overflow-hidden shadow-2xl border border-[#807E82]/20 hover:border-[#FFD51A]/60 transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => setItemSeleccionado(p)}
              >
                {is3D ? (
                  <div className="w-full h-72 sm:h-80 bg-[#0D2144] relative border-b border-white/10 flex items-center justify-center overflow-hidden">
                    <model-viewer
                      src={p.imagen_url}
                      alt={`Modelo 3D de ${p.nombre}`}
                      auto-rotate
                      camera-controls
                      loading="eager"
                      reveal="auto"
                      touch-action="pan-y"
                      shadow-intensity="1"
                      exposure="1"
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
                    >
                      <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center bg-[#0D2144]/80 pointer-events-none">
                        <span className="text-[#FFD51A] text-xs font-['PixelSplitter'] animate-pulse">CARGANDO 3D...</span>
                      </div>
                    </model-viewer>
                    <div className="absolute top-3 right-3 bg-black/80 px-3 py-1.5 rounded-full text-[11px] text-[#FFD51A] font-['PixelSplitter'] border border-[#FFD51A]/40 pointer-events-none shadow-md flex items-center gap-1.5 z-10">
                      <span>🕹️</span> 3D INTERACTIVO
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#1B396A]/90 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white px-3 py-1.5 rounded-lg text-xs font-['PixelSplitter'] border border-white/20 shadow-lg transition-colors flex items-center gap-1.5 z-10">
                      <span>👁️</span> AMPLIAR
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-72 sm:h-80 bg-[#0D2144] relative border-b border-white/10 flex items-center justify-center overflow-hidden">
                    {/* Fondo difuminado para que las tarjetas se vean parejas sin recortes */}
                    <img
                      src={p.imagen_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
                    />
                    {/* Imagen principal sin recortes */}
                    <img
                      src={p.imagen_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
                      alt={p.nombre}
                      className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/75 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white px-3 py-1.5 rounded-lg text-xs font-['PixelSplitter'] border border-white/20 shadow-lg transition-colors flex items-center gap-1.5 z-20">
                      <span>👁️</span> PANTALLA GRANDE
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FFD51A] transition-colors">{p.nombre}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{p.descripcion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE PANTALLA GRANDE */}
      {itemSeleccionado && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setItemSeleccionado(null)}
        >
          <div
            className="relative bg-[#1B396A]/90 border-2 border-[#FFD51A] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(255,213,26,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFD51A] font-['PixelSplitter'] uppercase tracking-wider">
                {itemSeleccionado.nombre}
              </h3>
              <button
                onClick={() => setItemSeleccionado(null)}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-['PixelSplitter'] tracking-widest transition-colors cursor-pointer"
              >
                ✕ CERRAR
              </button>
            </div>

            {/* Contenedor visual en pantalla grande */}
            <div className="relative w-full h-[60vh] sm:h-[68vh] bg-[#0D2144] flex items-center justify-center overflow-hidden">
              {esModelo3D(itemSeleccionado.imagen_url) ? (
                <model-viewer
                  src={itemSeleccionado.imagen_url}
                  alt={`Modelo 3D de ${itemSeleccionado.nombre}`}
                  auto-rotate
                  camera-controls
                  loading="eager"
                  reveal="auto"
                  touch-action="pan-y"
                  shadow-intensity="1"
                  exposure="1"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
                >
                  <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center bg-[#0D2144]/80 pointer-events-none">
                    <span className="text-[#FFD51A] text-sm font-['PixelSplitter'] animate-pulse">CARGANDO MODELO 3D EN ALTA DEFINICIÓN...</span>
                  </div>
                </model-viewer>
              ) : (
                <>
                  <img
                    src={itemSeleccionado.imagen_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl pointer-events-none"
                  />
                  <img
                    src={itemSeleccionado.imagen_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
                    alt={itemSeleccionado.nombre}
                    className="relative z-10 max-w-full max-h-full object-contain p-4 drop-shadow-2xl"
                  />
                </>
              )}
            </div>

            {/* Descripción en el pie del modal */}
            <div className="p-6 bg-black/60 border-t border-white/10 overflow-y-auto max-h-[20vh]">
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                {itemSeleccionado.descripcion || "Sin descripción disponible."}
              </p>
              {esModelo3D(itemSeleccionado.imagen_url) && (
                <p className="text-[#FFD51A] text-xs mt-3 font-['PixelSplitter'] tracking-wide">
                  🕹️ CONTROLES 3D: Arrastra con un dedo o clic para rotar • Pellizca o rueda el mouse para hacer zoom
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}