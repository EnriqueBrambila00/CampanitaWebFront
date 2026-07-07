import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Inicio() {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Observador para reproducir el video cuando esté visible (estilo Facebook)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si al menos el 50% del video está visible en pantalla
          if (entry.isIntersecting) {
            videoElement.play().catch((err) => {
              console.log("Autoplay silenciado requerido o bloqueado:", err);
            });
          } else {
            // Si se sale de la vista, se pausa automáticamente
            if (!videoElement.paused) {
              videoElement.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  return (
    <div className="flex flex-col font-sans mb-10 overflow-x-hidden">

      {/* SECCIÓN HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] pt-6 px-4">

        {/* LOGOS INSTITUCIONALES */}
        <div className="flex items-center justify-center gap-16 md:gap-32 mb-8 w-full max-w-4xl mx-auto z-20">
          <img
            src="https://www.colima.tecnm.mx/img/logoitcolima.gif"
            alt="Logo Instituto Tecnológico de Colima"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform duration-300 hover:scale-110"
          />
          <img
            src="https://www.cdcuauhtemoc.tecnm.mx/wp-content/uploads/2021/08/LOGO-VERTICAL-TECNM.png"
            alt="Logo TecNM"
            className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Contenido Central */}
        <div className="relative z-20 text-center max-w-4xl mx-auto">

          <span className="text-[#FFD51A] text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Villa de Álvarez, Colima
          </span>

          <h1 className="text-5xl md:text-7xl text-white font-['PixelSplitter'] tracking-widest mb-8 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
            LA <span className="text-[#FFD51A]">CAMPANITA</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 mb-12 leading-relaxed drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] font-medium max-w-3xl mx-auto">
            Más allá de las antiguas pirámides y las tumbas de tiro, un secreto ancestral te aguarda.
            Adéntrate en las ruinas de La Campana y embárcate en un viaje de supervivencia a través
            de los traicioneros niveles del Mictlán. ¿Tienes el valor para guiar tu alma por el inframundo,
            enfrentar a las deidades olvidadas y descubrir la verdad oculta bajo la piedra?
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/registro"
              className="bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105 hover:bg-white tracking-widest text-lg shadow-[0_0_20px_rgba(255,213,26,0.4)]"
            >
              JUGAR AHORA
            </Link>
            <Link
              to="/mapas"
              className="bg-black/50 border-2 border-[#FFD51A] text-[#FFD51A] font-['PixelSplitter'] font-bold py-4 px-8 rounded-lg transition-colors hover:bg-[#FFD51A]/10 tracking-widest text-lg"
            >
              VER NIVELES
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 z-20 relative">

        <div className="bg-[#1B396A]/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#FFD51A]/50 transition-colors shadow-lg">
          <div className="text-4xl mb-4">💀</div>
          <h3 className="text-xl font-bold text-white mb-3">Los 9 Niveles</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Sobrevive a las pruebas del Mictlán. Cruza ríos de sangre, enfréntate a vientos de obsidiana y esquiva las bestias que resguardan el inframundo.
          </p>
        </div>

        <div className="bg-[#1B396A]/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#FFD51A]/50 transition-colors shadow-lg">
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold text-white mb-3">La Campana 3D</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Explora una recreación meticulosa de la zona arqueológica de Colima desarrollada en Unreal Engine 5, con detalles históricos precisos.
          </p>
        </div>

        <div className="bg-[#1B396A]/60 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#FFD51A]/50 transition-colors shadow-lg">
          <div className="text-4xl mb-4">🗿</div>
          <h3 className="text-xl font-bold text-white mb-3">Lore Profundo</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Conoce a entidades milenarias y descubre una historia rica basada en la mitología prehispánica de la región occidente de México.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE VIDEO CON AUTOPLAY AL HACER SCROLL (ESTILO FACEBOOK) */}
      <div className="flex flex-col items-center justify-center my-16 px-4 z-20 relative">
        <div className="text-center mb-6">
          <span className="text-[#FFD51A] text-xs md:text-sm font-bold tracking-[0.2em] uppercase block mb-2">
            Gameplay y Experiencia
          </span>
          <h2 className="text-2xl md:text-4xl text-white font-['PixelSplitter'] tracking-wide">
            EXPLORA EL <span className="text-[#FFD51A]">MICTLÁN</span>
          </h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden border-2 border-[#023326] shadow-[0_0_30px_rgba(27,57,106,0.6)] bg-black/80 max-w-4xl w-full flex justify-center group">
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/kdpzubj7/video/upload/v1783098678/la_campanita_zvxt8n.mp4"
            controls
            muted
            playsInline
            loop
            className="w-full max-h-[75vh] object-contain"
          ></video>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          💡 El video se reproduce automáticamente al bajar en la página y se pausa si sales de la vista. Puedes activar el sonido en los controles.
        </p>
      </div>

    </div>
  );
}