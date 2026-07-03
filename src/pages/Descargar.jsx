import { useState } from 'react';

export function Descargar() {
  const [tabActiva, setTabActiva] = useState('descargas'); // 'descargas', 'requisitos', 'guia'
  const [descargando, setDescargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [archivoActual, setArchivoActual] = useState('');
  const [descargaCompleta, setDescargaCompleta] = useState(false);

  const iniciarDescarga = (nombreArchivo) => {
    if (descargando) return;
    setArchivoActual(nombreArchivo);
    setDescargando(true);
    setProgreso(0);
    setDescargaCompleta(false);

    const intervalo = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setDescargando(false);
          setDescargaCompleta(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const cerrarModal = () => {
    setDescargaCompleta(false);
    setProgreso(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-200">
      
      {/* SECCIÓN HERO */}
      <div className="text-center mb-12 relative bg-[#1B396A]/60 p-8 md:p-12 rounded-3xl border border-[#807E82]/30 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Luces de fondo decorativas */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FFD51A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FFD51A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD51A]/20 border border-[#FFD51A]/40 text-[#FFD51A] text-xs font-['PixelSplitter'] uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FFD51A] animate-ping"></span>
          VERSIÓN 0.8.5 BETA DISPONIBLE
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-['PixelSplitter'] text-white tracking-widest uppercase mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          DESCARGA <span className="text-[#FFD51A]">LA CAMPANITA</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Prepárate para adentrarte en el inframundo del Mictlán. Descarga el cliente oficial para PC, 
          desarrollado en Unreal Engine 5 por el equipo de ingeniería de TECNM Colima.
        </p>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
          <button
            onClick={() => setTabActiva('descargas')}
            className={`px-6 py-3 rounded-xl font-['PixelSplitter'] text-xs sm:text-sm tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              tabActiva === 'descargas'
                ? 'bg-[#FFD51A] text-[#1B396A] font-bold shadow-[0_0_20px_rgba(255,213,26,0.4)] scale-105'
                : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-white border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ARCHIVOS DE JUEGO
          </button>

          <button
            onClick={() => setTabActiva('requisitos')}
            className={`px-6 py-3 rounded-xl font-['PixelSplitter'] text-xs sm:text-sm tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              tabActiva === 'requisitos'
                ? 'bg-[#FFD51A] text-[#1B396A] font-bold shadow-[0_0_20px_rgba(255,213,26,0.4)] scale-105'
                : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-white border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            REQUISITOS DEL SISTEMA
          </button>

          <button
            onClick={() => setTabActiva('guia')}
            className={`px-6 py-3 rounded-xl font-['PixelSplitter'] text-xs sm:text-sm tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              tabActiva === 'guia'
                ? 'bg-[#FFD51A] text-[#1B396A] font-bold shadow-[0_0_20px_rgba(255,213,26,0.4)] scale-105'
                : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-white border border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            GUÍA DE INSTALACIÓN
          </button>
        </div>
      </div>

      {/* MODAL DE DESCARGA COMPLETADA */}
      {descargaCompleta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#1B396A] border-2 border-[#FFD51A] rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(255,213,26,0.3)] relative">
            <div className="w-16 h-16 bg-[#FFD51A]/20 border border-[#FFD51A] rounded-full flex items-center justify-center mx-auto mb-6 text-[#FFD51A]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-['PixelSplitter'] text-white mb-2 tracking-wider uppercase">
              ¡DESCARGA INICIADA!
            </h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              El archivo <span className="text-[#FFD51A] font-bold">{archivoActual}</span> se está descargando en tu equipo. Prepárate para explorar las antiguas ruinas de La Campana.
            </p>
            <div className="bg-black/40 rounded-lg p-3 text-xs text-gray-400 mb-6 border border-white/5 font-mono">
              SHA-256: 8f9b42...e1a9c3 (Verificado por TecNM)
            </div>
            <button
              onClick={cerrarModal}
              className="w-full bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold py-3 rounded-lg hover:bg-white transition-colors tracking-widest text-sm cursor-pointer"
            >
              ENTENDIDO, ¡A JUGAR!
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO 1: ARCHIVOS DE DESCARGA */}
      {tabActiva === 'descargas' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* BARRA DE PROGRESO DE DESCARGA EN CURSO */}
          {descargando && (
            <div className="bg-[#1B396A]/90 border border-[#FFD51A] rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-2 font-['PixelSplitter'] text-xs sm:text-sm">
                <span className="text-white flex items-center gap-2">
                  <span className="animate-spin text-[#FFD51A]">↻</span> DESCARGANDO: {archivoActual}
                </span>
                <span className="text-[#FFD51A] font-bold">{progreso}%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-yellow-600 via-[#FFD51A] to-yellow-300 h-full transition-all duration-200" 
                  style={{ width: `${progreso}%` }}
                ></div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 italic">
                Por favor no cierres esta pestaña mientras preparamos el paquete criptográfico...
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* TARJETA 1: CLIENTE PRINCIPAL */}
            <div className="bg-gradient-to-b from-[#1B396A]/80 to-[#1B396A]/40 rounded-2xl p-8 border-2 border-[#FFD51A]/60 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#FFD51A] transition-all duration-300">
              <div className="absolute top-0 right-0 bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] text-xs font-bold px-4 py-1.5 rounded-bl-xl tracking-wider">
                RECOMENDADO
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#FFD51A]/30 text-[#FFD51A]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['PixelSplitter'] tracking-wide">
                      CLIENTE OFICIAL PC
                    </h3>
                    <p className="text-sm text-[#FFD51A] font-medium">Instalador Windows (64-bit)</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Paquete completo del juego que incluye el prólogo arqueológico, el primer nivel del Mictlán, 
                  y el sistema de combate contra espíritus guardianes. Optimizado con Nanite y Lumen.
                </p>

                <div className="grid grid-cols-2 gap-4 bg-black/30 rounded-xl p-4 text-xs border border-white/5 mb-8">
                  <div>
                    <span className="text-gray-400 block">Versión:</span>
                    <span className="text-white font-semibold">0.8.5 Beta</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Tamaño del archivo:</span>
                    <span className="text-white font-semibold">12.4 GB</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Última actualización:</span>
                    <span className="text-white font-semibold">3 de Julio, 2026</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Motor gráfico:</span>
                    <span className="text-[#FFD51A] font-semibold">Unreal Engine 5.4</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => iniciarDescarga('LaCampanita_Setup_v0.8.5.exe')}
                disabled={descargando}
                className={`w-full py-4 rounded-xl font-['PixelSplitter'] font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg cursor-pointer ${
                  descargando
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FFD51A] text-[#1B396A] hover:bg-white hover:scale-[1.02] shadow-[0_0_25px_rgba(255,213,26,0.3)]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {descargando ? 'DESCARGANDO...' : 'DESCARGAR JUEGO (.EXE)'}
              </button>
            </div>

            {/* TARJETA 2: DLC / TEXTURAS 4K */}
            <div className="bg-[#1B396A]/50 rounded-2xl p-8 border border-[#807E82]/30 shadow-2xl flex flex-col justify-between hover:border-white/40 transition-all duration-300">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-cyan-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['PixelSplitter'] tracking-wide">
                      PACK DE TEXTURAS 4K & LORE
                    </h3>
                    <p className="text-sm text-cyan-400 font-medium">Contenido Adicional Opcional</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Descarga texturas ultra-detalladas de los relieves de la Pirámide de La Campana, 
                  la banda sonora sin compresión en FLAC y el libro de arte digital con bocetos de los desarrolladores.
                </p>

                <div className="grid grid-cols-2 gap-4 bg-black/30 rounded-xl p-4 text-xs border border-white/5 mb-8">
                  <div>
                    <span className="text-gray-400 block">Formato:</span>
                    <span className="text-white font-semibold">Archivo ZIP comprimido</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Tamaño extra:</span>
                    <span className="text-white font-semibold">8.2 GB</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Compatibilidad:</span>
                    <span className="text-white font-semibold">Requiere v0.8.5</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Licencia:</span>
                    <span className="text-green-400 font-semibold">Gratuito (Open Source)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => iniciarDescarga('LaCampanita_DLC_4K_Pack.zip')}
                disabled={descargando}
                className={`w-full py-4 rounded-xl font-['PixelSplitter'] font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 border-2 cursor-pointer ${
                  descargando
                    ? 'bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-transparent border-[#FFD51A] text-[#FFD51A] hover:bg-[#FFD51A] hover:text-[#1B396A]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {descargando ? 'DESCARGANDO...' : 'DESCARGAR DLC (.ZIP)'}
              </button>
            </div>

          </div>

          {/* NOTA AL PIE DE ARCHIVOS */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-center text-xs text-gray-400">
            <p className="flex items-center justify-center gap-2 mb-1 text-yellow-400 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              NOTA DE SEGURIDAD
            </p>
            Todos los instaladores están libres de software malicioso y se distribuyen exclusivamente desde los servidores de La Campanita en Render y TECNM Colima.
          </div>

        </div>
      )}

      {/* CONTENIDO 2: REQUISITOS DEL SISTEMA */}
      {tabActiva === 'requisitos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          
          {/* REQUISITOS MÍNIMOS */}
          <div className="bg-[#1B396A]/50 rounded-2xl p-8 border border-[#807E82]/30 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <h3 className="text-2xl font-bold text-white font-['PixelSplitter'] tracking-wider">
                REQUISITOS MÍNIMOS
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-6 italic">
              Configuración recomendada para jugar a 1080p y 30 FPS con gráficos en calidad Media/Baja.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Sistema Operativo:</span>
                <span className="text-white font-semibold">Windows 10 (64-bit)</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Procesador (CPU):</span>
                <span className="text-white font-semibold">Intel Core i5-8400 / AMD Ryzen 5 2600</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Memoria RAM:</span>
                <span className="text-white font-semibold">12 GB RAM</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Tarjeta Gráfica (GPU):</span>
                <span className="text-white font-semibold">NVIDIA GTX 1060 (6GB) / RX 580</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">DirectX:</span>
                <span className="text-white font-semibold">Versión 12</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2">
                <span className="text-gray-400 font-medium">Almacenamiento:</span>
                <span className="text-white font-semibold">45 GB de espacio disponible</span>
              </li>
            </ul>
          </div>

          {/* REQUISITOS RECOMENDADOS */}
          <div className="bg-gradient-to-b from-[#1B396A]/80 to-[#1B396A]/40 rounded-2xl p-8 border-2 border-[#FFD51A]/50 shadow-2xl relative">
            <div className="absolute -top-3 right-6 bg-[#FFD51A] text-[#1B396A] text-xs font-bold font-['PixelSplitter'] px-3 py-1 rounded-full">
              OPTIMO UE5
            </div>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              <h3 className="text-2xl font-bold text-white font-['PixelSplitter'] tracking-wider">
                REQUISITOS RECOMENDADOS
              </h3>
            </div>
            <p className="text-xs text-[#FFD51A] mb-6 italic">
              Configuración recomendada para 1440p / 60 FPS con iluminación global Lumen y texturas 4K.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Sistema Operativo:</span>
                <span className="text-white font-semibold">Windows 10 / 11 (64-bit actualizados)</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Procesador (CPU):</span>
                <span className="text-white font-semibold">Intel Core i7-10700K / Ryzen 7 5800X</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Memoria RAM:</span>
                <span className="text-white font-semibold">16 GB o 32 GB RAM</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">Tarjeta Gráfica (GPU):</span>
                <span className="text-[#FFD51A] font-semibold">NVIDIA RTX 3060 Ti / RX 6700 XT</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 font-medium">DirectX:</span>
                <span className="text-white font-semibold">Versión 12 Ultimate</span>
              </li>
              <li className="flex flex-col sm:flex-row justify-between py-2">
                <span className="text-gray-400 font-medium">Almacenamiento:</span>
                <span className="text-[#FFD51A] font-semibold">45 GB en SSD NVMe de alta velocidad</span>
              </li>
            </ul>
          </div>

        </div>
      )}

      {/* CONTENIDO 3: GUÍA DE INSTALACIÓN */}
      {tabActiva === 'guia' && (
        <div className="bg-[#1B396A]/60 rounded-2xl p-8 md:p-12 border border-[#807E82]/30 shadow-xl max-w-4xl mx-auto animate-fadeIn">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#FFD51A] font-['PixelSplitter'] tracking-widest uppercase mb-8 text-center">
            PASO A PASO PARA COMENZAR TU AVENTURA
          </h3>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold text-xl flex items-center justify-center shrink-0 shadow-lg">
                01
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Descarga y verifica el instalador</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Haz clic en el botón <span className="text-[#FFD51A] font-semibold">"DESCARGAR JUEGO (.EXE)"</span> en la pestaña de archivos. Guarda el ejecutable en una carpeta de fácil acceso como tu Escritorio o carpeta de Descargas.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold text-xl flex items-center justify-center shrink-0 shadow-lg">
                02
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Ejecuta el asistente de instalación</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Haz doble clic en <code className="bg-black/50 px-2 py-0.5 rounded text-[#FFD51A]">LaCampanita_Setup_v0.8.5.exe</code>. Si Windows SmartScreen muestra una advertencia, selecciona <em>"Más información"</em> y luego <em>"Ejecutar de todas formas"</em> (el proyecto al ser universitario está en proceso de certificación oficial).
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold text-xl flex items-center justify-center shrink-0 shadow-lg">
                03
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Instala las dependencias y DirectX</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Asegúrate de marcar la casilla para instalar los componentes de <strong>DirectX 12</strong> y los redistribuibles de <strong>Visual C++</strong> al finalizar el instalador para evitar errores de librerías DLL al arrancar el motor Unreal Engine 5.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold text-xl flex items-center justify-center shrink-0 shadow-lg">
                04
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Inicia sesión y conecta tu cuenta</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Abre el acceso directo en tu escritorio. En la pantalla principal del juego, ingresa con el mismo correo y contraseña que registraste en esta página web para guardar tu progreso en la nube y desbloquear logros en tu perfil.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              ¿Tienes algún error técnico o bug gráfico?
            </div>
            <a
              href="mailto:lg330000@gmail.com"
              className="bg-black/50 hover:bg-black/80 text-[#FFD51A] border border-[#FFD51A]/40 px-5 py-2.5 rounded-lg text-xs font-['PixelSplitter'] tracking-wider transition-all"
            >
              REPORTAR BUG AL EQUIPO TECNM
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
