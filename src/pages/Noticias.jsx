import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const URL_BACKEND = 'https://campanitaweb.onrender.com';
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        setCargando(true);
        const res = await fetch(`${URL_BACKEND}/noticias`);
        if (!res.ok) throw new Error('Error al cargar noticias');
        const data = await res.json();
        setNoticias(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las noticias desde el servidor en este momento.');
      } finally {
        setCargando(false);
      }
    };
    obtenerNoticias();
  }, []);

  // Función para obtener categoría derivada o del tag [Categoría] en el título
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

  // Función para recortar contenido sin cortar palabras a la mitad
  const generarResumen = (texto, maxChars = 150) => {
    if (!texto) return '';
    if (texto.length <= maxChars) return texto;
    const recortado = texto.substring(0, maxChars);
    const ultimoEspacio = recortado.lastIndexOf(' ');
    return (ultimoEspacio > 0 ? recortado.substring(0, ultimoEspacio) : recortado) + '...';
  };

  const categorias = ['Todas', 'Noticia Oficial', 'Actualización', 'Devlog'];

  const noticiasConCategoria = noticias.map(n => ({
    ...n,
    categoriaDerivada: obtenerCategoria(n.titulo)
  }));

  const noticiasFiltradas = categoriaActiva === 'Todas'
    ? noticiasConCategoria
    : noticiasConCategoria.filter(n => n.categoriaDerivada === categoriaActiva);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-200">

      {/* CABECERA */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-['PixelSplitter'] text-[#FFD51A] tracking-widest uppercase mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          NOTICIAS & UPDATES
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
          Mantente al tanto del desarrollo del proyecto La Campanita, notas del parche, devlogs y descubrimientos en el Mictlán.
        </p>

        {/* FILTROS POR CATEGORÍA */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-8">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-5 py-2 rounded-xl font-['PixelSplitter'] text-xs tracking-wider transition-all duration-300 cursor-pointer ${categoriaActiva === cat
                  ? 'bg-[#FFD51A] text-[#1B396A] font-bold shadow-[0_0_15px_rgba(255,213,26,0.4)] scale-105'
                  : 'bg-[#1B396A]/60 text-gray-300 hover:bg-[#1B396A] hover:text-white border border-white/10'
                }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ESTADO DE CARGA / ERROR */}
      {cargando && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD51A] mb-4"></div>
          <p className="text-[#FFD51A] font-['PixelSplitter'] tracking-widest text-lg">CARGANDO NOTICIAS DEL MICTLÁN...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-200 p-6 rounded-2xl text-center max-w-xl mx-auto my-12 shadow-lg">
          <p className="font-bold mb-2 text-lg">⚠️ Error de conexión</p>
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && noticiasFiltradas.length === 0 && (
        <div className="text-center py-16 bg-[#1B396A]/30 rounded-2xl border border-white/10 max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg italic">No hay noticias publicadas en esta categoría aún.</p>
        </div>
      )}

      {/* LISTA DE NOTICIAS */}
      {!cargando && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {noticiasFiltradas.map((noticia) => (
            <div
              key={noticia.id_noticia}
              onClick={() => navigate(`/noticias/${noticia.id_noticia}`)}
              className="bg-[#1B396A]/50 rounded-2xl overflow-hidden border border-[#807E82]/30 shadow-xl hover:border-[#FFD51A]/80 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-[#0D2144] flex items-center justify-center">
                {/* Fondo difuminado ambiental */}
                <img
                  src={noticia.imagen_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110 pointer-events-none"
                />
                {/* Imagen completa sin recortes */}
                <img
                  src={noticia.imagen_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'}
                  alt={noticia.titulo}
                  className="relative z-10 w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B396A] via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs text-[#FFD51A] font-['PixelSplitter'] tracking-wider z-20">
                  {noticia.categoriaDerivada.toUpperCase()}
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-gray-300 font-medium z-20">
                  📅 {new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD51A] transition-colors font-['PixelSplitter'] leading-snug">
                    {obtenerTituloLimpio(noticia.titulo)}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {generarResumen(noticia.contenido, 150)}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-['PixelSplitter'] text-[#FFD51A] tracking-wider">
                  <span>LEER MÁS</span>
                  <span className="transform transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
