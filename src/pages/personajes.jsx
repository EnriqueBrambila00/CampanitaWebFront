import { useEffect, useState } from 'react';

export function Personajes() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);

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
          {personajes.map((p) => (
            <div key={p.id_personaje} className="bg-[#1B396A]/60 rounded-xl overflow-hidden shadow-2xl border border-[#807E82]/20 flex flex-col">
              <img 
                src={p.imagen_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"} 
                alt={p.nombre} 
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{p.nombre}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{p.descripcion}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#FFD51A] tracking-wider uppercase font-['PixelSplitter']">
                  ID: #{p.id_personaje}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}