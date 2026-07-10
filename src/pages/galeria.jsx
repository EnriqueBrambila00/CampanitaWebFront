import { useEffect, useState } from 'react';

export function Galeria() {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    fetch('https://campanitaweb.onrender.com/galeria')
      .then((res) => res.json())
      .then((data) => {
        setImagenes(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar galería:", err);
        setCargando(false);
      });
  }, []);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setImagenSeleccionada(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-[#FFD51A] font-['PixelSplitter'] tracking-widest uppercase mb-4">
          Galería de Arte
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Concept arts, modelos 3D y capturas de pantalla del desarrollo de La Campanita. Haz clic en cualquier imagen para verla en pantalla grande.
        </p>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20">
          <p className="text-[#FFD51A] font-bold animate-pulse text-xl">Cargando archivos visuales...</p>
        </div>
      ) : imagenes.length === 0 ? (
        <p className="text-center text-gray-400 py-10 border border-dashed border-gray-600 rounded-lg">
          La galería está vacía en este momento. Vuelve pronto para ver más contenido.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imagenes.map((img) => (
            <div
              key={img.id_imagen}
              onClick={() => setImagenSeleccionada(img)}
              className="group relative rounded-xl overflow-hidden shadow-xl border border-[#807E82]/30 bg-[#1B396A]/50 hover:border-[#FFD51A]/80 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-72 bg-[#0D2144] overflow-hidden flex items-center justify-center">
                {/* Fondo difuminado para llenar el espacio sin barras negras */}
                <img
                  src={img.imagen_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
                />
                {/* Imagen principal completa sin recortar */}
                <img
                  src={img.imagen_url}
                  alt={img.titulo || 'Arte de La Campanita'}
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/75 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white px-3 py-1.5 rounded-lg text-xs font-['PixelSplitter'] border border-white/20 shadow-lg transition-colors flex items-center gap-1.5 z-20">
                  <span>👁️</span> PANTALLA GRANDE
                </div>
              </div>
              <div className="p-4 bg-[#1B396A]/80 flex-1 flex flex-col justify-between">
                <h3 className="text-[#FFD51A] font-bold text-base mb-1 group-hover:text-white transition-colors">
                  {img.titulo || 'Sin Título'}
                </h3>
                {img.descripcion && (
                  <p className="text-gray-300 text-xs line-clamp-2">{img.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PANTALLA GRANDE - GALERÍA */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div
            className="relative bg-[#1B396A]/90 border-2 border-[#FFD51A] rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(255,213,26,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFD51A] font-['PixelSplitter'] uppercase tracking-wider">
                {imagenSeleccionada.titulo || 'Arte de La Campanita'}
              </h3>
              <button
                onClick={() => setImagenSeleccionada(null)}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-['PixelSplitter'] tracking-widest transition-colors cursor-pointer"
              >
                ✕ CERRAR
              </button>
            </div>

            {/* Contenedor imagen pantalla grande */}
            <div className="relative w-full h-[65vh] sm:h-[72vh] bg-[#0D2144] flex items-center justify-center overflow-hidden">
              <img
                src={imagenSeleccionada.imagen_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl pointer-events-none"
              />
              <img
                src={imagenSeleccionada.imagen_url}
                alt={imagenSeleccionada.titulo || 'Arte'}
                className="relative z-10 max-w-full max-h-full object-contain p-4 drop-shadow-2xl"
              />
            </div>

            {/* Pie del modal con descripción */}
            {imagenSeleccionada.descripcion && (
              <div className="p-5 bg-black/60 border-t border-white/10 overflow-y-auto max-h-[18vh]">
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                  {imagenSeleccionada.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}