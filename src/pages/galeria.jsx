import { useEffect, useState } from 'react';

export function Galeria() {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-[#FFD51A] font-['PixelSplitter'] tracking-widest uppercase mb-4">
          Galería de Arte
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Concept arts, modelos 3D y capturas de pantalla del desarrollo de La Campanita.
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
            <div key={img.id_imagen} className="group relative rounded-xl overflow-hidden shadow-xl border border-[#807E82]/30 bg-[#1B396A]/50">
              <img 
                src={img.imagen_url} 
                alt={img.titulo || 'Arte de La Campanita'} 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-[#FFD51A] font-bold text-lg mb-1">{img.titulo || 'Sin Título'}</h3>
                {img.descripcion && (
                  <p className="text-gray-200 text-sm opacity-90 line-clamp-3">{img.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}