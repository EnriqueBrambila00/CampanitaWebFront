import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function NoticiaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [imagenModal, setImagenModal] = useState(null);
  const URL_BACKEND = 'https://campanitaweb.onrender.com';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setImagenModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const obtenerNoticia = async () => {
      try {
        setCargando(true);
        const res = await fetch(`${URL_BACKEND}/noticias/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('La noticia que buscas no existe o fue eliminada.');
          throw new Error('Error al cargar la noticia desde el servidor.');
        }
        const data = await res.json();
        setNoticia(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerNoticia();
  }, [id]);

  const obtenerCategoria = (titulo) => {
    const tit = titulo || '';
    const match = tit.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) return match[1];
    const t = tit.toLowerCase();
    if (t.includes('parche') || t.includes('update') || t.includes('actualización') || t.includes('v0.')) return 'Actualización';
    if (t.includes('devlog') || t.includes('desarrollo') || t.includes('mapa')) return 'Devlog';
    return 'Noticia Oficial';
  };

  const obtenerTituloLimpio = (titulo) => {
    const tit = titulo || '';
    const match = tit.match(/^\[(.*?)\]\s*(.*)$/);
    return match ? match[2] : tit;
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD51A] mb-4"></div>
        <p className="text-[#FFD51A] font-['PixelSplitter'] tracking-widest text-lg">CARGANDO CRÓNICA DEL MICTLÁN...</p>
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center animate-fadeIn">
        <div className="bg-[#1B396A]/80 border-2 border-red-500 rounded-3xl p-8 shadow-2xl">
          <span className="text-5xl block mb-4">📜</span>
          <h2 className="text-2xl font-bold text-white font-['PixelSplitter'] mb-4">CRÓNICA NO ENCONTRADA</h2>
          <p className="text-gray-300 mb-8">{error || 'No se pudo encontrar el artículo en la base de datos.'}</p>
          <button
            onClick={() => navigate('/noticias')}
            className="bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors tracking-widest text-xs cursor-pointer shadow-lg"
          >
            ← VOLVER A NOTICIAS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-200 animate-fadeIn">

      {/* BOTÓN VOLVER */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/noticias')}
          className="inline-flex items-center gap-2 bg-[#1B396A]/80 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white border border-white/20 px-5 py-2.5 rounded-xl font-['PixelSplitter'] text-xs tracking-wider transition-all duration-300 cursor-pointer shadow-lg group"
        >
          <span className="transform transition-transform group-hover:-translate-x-1">←</span> VOLVER A NOTICIAS
        </button>
      </div>

      {/* TARJETA DE CONTENIDO PRINCIPAL */}
      <article className="bg-[#1B396A]/80 border-2 border-[#FFD51A]/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(255,213,26,0.15)] relative">

        {/* METADATOS */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="inline-block px-4 py-1.5 bg-[#FFD51A]/20 border border-[#FFD51A] text-[#FFD51A] font-['PixelSplitter'] text-xs rounded-full tracking-wider shadow-sm">
            {obtenerCategoria(noticia.titulo).toUpperCase()}
          </span>
          <span className="text-sm text-gray-300 flex items-center gap-1 font-medium">
            📅 {new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['PixelSplitter'] mb-8 leading-tight drop-shadow-md">
          {obtenerTituloLimpio(noticia.titulo)}
        </h1>

        {/* IMAGEN GRANDE SIN RECORTE */}
        <div
          className="relative rounded-2xl overflow-hidden mb-10 border border-white/15 shadow-2xl bg-[#0D2144] h-80 sm:h-96 flex items-center justify-center cursor-pointer group"
          onClick={() => setImagenModal(noticia.imagen_url)}
        >
          <img
            src={noticia.imagen_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
          />
          <img
            src={noticia.imagen_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'}
            alt={noticia.titulo}
            className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'; }}
          />
          <div className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white px-3 py-1.5 rounded-lg text-xs font-['PixelSplitter'] border border-white/20 shadow-lg transition-colors flex items-center gap-1.5 z-20">
            <span>👁️</span> AMPLIAR EN PANTALLA GRANDE
          </div>
        </div>

        {/* CONTENIDO COMPLETO */}
        <div className="text-gray-100 text-lg sm:text-xl leading-relaxed whitespace-pre-line space-y-6 font-normal border-t border-white/10 pt-8">
          {noticia.contenido}
        </div>

        {/* PIE DEL ARTÍCULO */}
        <div className="flex justify-between items-center border-t border-white/10 mt-12 pt-6">
          <div className="text-xs text-gray-400 font-['PixelSplitter'] tracking-wider">
            ID CRÓNICA: #{noticia.id_noticia}
          </div>
          <button
            onClick={() => navigate('/noticias')}
            className="bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors text-xs tracking-widest cursor-pointer shadow-lg"
          >
            ← VOLVER AL LISTADO
          </button>
        </div>

      </article>

      {/* MODAL DE PANTALLA GRANDE */}
      {imagenModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setImagenModal(null)}
        >
          <div
            className="relative bg-[#1B396A]/90 border-2 border-[#FFD51A] rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(255,213,26,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <h3 className="text-lg sm:text-xl font-bold text-[#FFD51A] font-['PixelSplitter'] uppercase tracking-wider line-clamp-1">
                {obtenerTituloLimpio(noticia.titulo)}
              </h3>
              <button
                onClick={() => setImagenModal(null)}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-['PixelSplitter'] tracking-widest transition-colors cursor-pointer"
              >
                ✕ CERRAR
              </button>
            </div>

            <div className="relative w-full h-[70vh] bg-[#0D2144] flex items-center justify-center overflow-hidden">
              <img
                src={imagenModal}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl pointer-events-none"
              />
              <img
                src={imagenModal}
                alt={noticia.titulo}
                className="relative z-10 max-w-full max-h-full object-contain p-4 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
