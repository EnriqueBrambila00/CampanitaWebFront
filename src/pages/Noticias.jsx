import { useState } from 'react';

export function Noticias() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  const noticias = [
    {
      id: 1,
      titulo: '¡LANZAMIENTO DE LA BETA ABIERTA V0.8.5 EN UNREAL ENGINE 5!',
      fecha: '2 de Julio, 2026',
      categoria: 'Actualización',
      imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
      resumen: 'El equipo de Ingeniería en Sistemas del TECNM Colima publica oficialmente la primera build jugable con iluminación global Lumen y modelos arqueológicos escaneados.',
      contenido: 'Después de meses de intenso desarrollo y modelado 3D de las ruinas de la zona arqueológica de La Campana en Villa de Álvarez, Colima, estamos enormemente emocionados de anunciar la Beta Abierta v0.8.5. En esta versión podrás explorar el primer nivel del inframundo (Mictlán), enfrentarte a las deidades olvidadas y probar el nuevo sistema de combate en tiempo real. ¡Descárgala ya en la sección de Descargas!'
    },
    {
      id: 2,
      titulo: 'REVELADO EL NUEVO MAPA: LAS TUMBAS DE TIRO DEL MICTLÁN',
      fecha: '20 de Junio, 2026',
      categoria: 'Devlog',
      imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
      resumen: 'Un vistazo exclusivo a los conceptos artísticos y la arquitectura subterránea inspirada en las tradiciones funerarias del occidente de México.',
      contenido: 'Nuestro equipo de arte ha trabajado estrechamente con investigaciones antropológicas para recrear la atmósfera mística de las Tumbas de Tiro. Utilizando la tecnología Nanite de Unreal Engine 5, logramos texturas rupestres con millones de polígonos que reaccionan a la antorcha del jugador en tiempo real. Entra en la Galería para ver los renders en 4K.'
    },
    {
      id: 3,
      titulo: 'BANDA SONORA: GRABACIÓN CON INSTRUMENTOS PREHISPÁNICOS',
      fecha: '5 de Junio, 2026',
      categoria: 'Sonido',
      imagen: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
      resumen: 'Entrevista con el departamento de audio sobre el uso de ocarinas, huehuétls y caracoles marinos para dar vida a los espíritus del juego.',
      contenido: 'La inmersión en La Campanita no solo es visual. Hemos grabado sesiones acústicas en vivo utilizando recreaciones exactas de instrumentos cerámicos colimenses. Cada zona del mapa cuenta con una capa acústica dinámica que aumenta en intensidad cuando los guardianes ancestrales se acercan a tu posición.'
    },
    {
      id: 4,
      titulo: 'OPTIMIZACIÓN Y SOPORTE PARA TARJETAS GRÁFICAS DE GAMA MEDIA',
      fecha: '18 de Mayo, 2026',
      categoria: 'Actualización',
      imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200',
      resumen: 'Mejoras significativas en el rendimiento general, reducción del uso de VRAM y tiempos de carga 40% más rápidos.',
      contenido: 'Sabemos que no todos los jugadores cuentan con hardware de última generación. En el último parche interno reescribimos varios shaders del agua y vegetación de Colima, logrando una tasa estable de 60 FPS en tarjetas como la NVIDIA GTX 1060 y AMD RX 580 sin sacrificar la calidad visual que define a nuestro proyecto.'
    }
  ];

  const categorias = ['Todas', 'Actualización', 'Devlog', 'Sonido'];

  const noticiasFiltradas = categoriaActiva === 'Todas'
    ? noticias
    : noticias.filter(n => n.categoria === categoriaActiva);

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
              className={`px-5 py-2 rounded-xl font-['PixelSplitter'] text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                categoriaActiva === cat
                  ? 'bg-[#FFD51A] text-[#1B396A] font-bold shadow-[0_0_15px_rgba(255,213,26,0.4)] scale-105'
                  : 'bg-[#1B396A]/60 text-gray-300 hover:bg-[#1B396A] hover:text-white border border-white/10'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL PARA LEER NOTICIA COMPLETA */}
      {noticiaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1B396A] border-2 border-[#FFD51A] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(255,213,26,0.3)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNoticiaSeleccionada(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-[#FFD51A] hover:text-[#1B396A] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
            >
              ✕
            </button>
            <span className="inline-block px-3 py-1 bg-[#FFD51A]/20 border border-[#FFD51A] text-[#FFD51A] font-['PixelSplitter'] text-xs rounded-full mb-4">
              {noticiaSeleccionada.categoria.toUpperCase()} • {noticiaSeleccionada.fecha}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['PixelSplitter'] mb-6 leading-tight">
              {noticiaSeleccionada.titulo}
            </h2>
            <img
              src={noticiaSeleccionada.imagen}
              alt={noticiaSeleccionada.titulo}
              className="w-full h-64 object-cover rounded-xl mb-6 border border-white/10 shadow-lg"
            />
            <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line mb-8">
              {noticiaSeleccionada.contenido}
            </p>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <button
                onClick={() => setNoticiaSeleccionada(null)}
                className="bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold px-6 py-2.5 rounded-lg hover:bg-white transition-colors text-xs tracking-widest cursor-pointer"
              >
                CERRAR NOTICIA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE NOTICIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {noticiasFiltradas.map((noticia) => (
          <div
            key={noticia.id}
            onClick={() => setNoticiaSeleccionada(noticia)}
            className="bg-[#1B396A]/50 rounded-2xl overflow-hidden border border-[#807E82]/30 shadow-xl hover:border-[#FFD51A]/80 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={noticia.imagen}
                alt={noticia.titulo}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B396A] via-transparent to-transparent opacity-80"></div>
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs text-[#FFD51A] font-['PixelSplitter'] tracking-wider">
                {noticia.categoria.toUpperCase()}
              </div>
              <div className="absolute bottom-4 left-4 text-xs text-gray-300 font-medium">
                📅 {noticia.fecha}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD51A] transition-colors font-['PixelSplitter'] leading-snug">
                  {noticia.titulo}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {noticia.resumen}
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

    </div>
  );
}
