import { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import logoPiramide from '../assets/piramide.png';
import { getAuthHeaders } from '../utils/auth';

export function Navbar() {
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false); // NUEVO: Controla el menú de celular
  const navigate = useNavigate();
  const location = useLocation(); // <--- NUEVO: Para leer la URL actual

  // ========================================================
  // NUEVO: INTERCEPTOR DE LOGIN DE GOOGLE
  // ========================================================
  useEffect(() => {
    // Revisamos si la URL tiene el parámetro "?oauth=google"
    const parametrosUrl = new URLSearchParams(location.search);
    
    if (parametrosUrl.get('oauth') === 'google') {
      const tokenOauth = parametrosUrl.get('token');
      if (tokenOauth) {
        localStorage.setItem('token', tokenOauth);
      }
      // 1. Le decimos a React que ya estamos logueados
      localStorage.setItem('usuarioLogueado', 'true');
      
      // 2. Si el backend nos mandó a la ruta /dashboard, es porque somos administradores
      if (location.pathname.includes('/dashboard')) {
        localStorage.setItem('esAdmin', 'true');
      }

      // 3. Limpiamos la URL para que no se vea el "?oauth=google" y recargamos el menú
      navigate(location.pathname, { replace: true });
      setTimeout(() => window.location.reload(), 100);
    }
  }, [location, navigate]);
  // ========================================================


  
  // ========================================================
  // CAZAFANTASMAS DE SESIONES EXPIRADAS
  // ========================================================
  useEffect(() => {
    const verificarSesionViva = async () => {
      // Si React cree que estamos logueados, vamos a preguntarle al backend si es cierto
      if (localStorage.getItem('usuarioLogueado') === 'true') {
        try {
          // Hacemos un "ping" silencioso a una ruta protegida (la del perfil sirve perfecto)
          const res = await fetch('https://campanitaweb.onrender.com/api/perfil/telefono', {
            headers: getAuthHeaders(),
            credentials: 'include' // Importante para enviar la cookie a ver si aún sirve
          });

          // Si el backend nos batea (401 Unauthorized), significa que la cookie ya expiró
          if (res.status === 401) {
            console.log("Sesión expirada detectada. Limpiando frontend...");
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('esAdmin');
            localStorage.removeItem('token');
            window.location.reload(); // Recargamos la página para limpiar la Navbar visualmente
          }
        } catch (error) {
          console.error("No se pudo verificar la sesión de fondo");
        }
      }
    };

    verificarSesionViva();
  }, []);
  // ========================================================
  
  const usuarioAutenticado = localStorage.getItem('usuarioLogueado') === 'true';
  const esAdmin = localStorage.getItem('esAdmin') === 'true';
  
  const manejarCerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('esAdmin');
    localStorage.removeItem('token');
    setMenuPerfilAbierto(false);
    setMenuAbierto(false); // Cerramos el menú de celular si estaba abierto
    navigate('/login');
    window.location.reload();
  };

  const cerrarMenuMobile = () => setMenuAbierto(false);

  return (
    // Agregué 'relative z-50' para que el menú desplegable del celular quede por encima de todo
    <header className="bg-[#1B396A] border-b border-[#807E82]/30 shadow-lg relative z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Título */}
          <div className="flex-1 flex items-center">
            <Link className="flex items-center gap-3 transition hover:opacity-80" to="/" onClick={cerrarMenuMobile}>
              <img src={logoPiramide} alt="Logo La Campana" className="h-10 md:h-12 w-auto" />
              <span className="font-['PixelSplitter'] text-[#FFD51A] text-xl md:text-2xl tracking-widest uppercase">
                La Campanita
              </span>
            </Link>
          </div>

          {/* BOTÓN DE HAMBURGUESA (SOLO EN CELULARES) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-[#FFD51A] hover:text-white focus:outline-none text-3xl"
            >
              {menuAbierto ? '✖' : '☰'}
            </button>
          </div>

          {/* MENÚ PRINCIPAL DE NAVEGACIÓN (OCULTO EN CELULARES, VISIBLE EN ESCRITORIO) */}
          <div className="hidden md:flex md:items-center md:gap-12">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm font-['PixelSplitter'] tracking-widest">
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/">Inicio</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/noticias">Noticias</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/personajes">Personajes</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/galeria">Galería</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/mapas">Mapas</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/descargar">Descargar</Link></li>
                {/* BOTÓN SECRETO PARA EL ADMINISTRADOR */}
                {esAdmin && (
                  <li>
                    <Link className="text-[#1B396A] bg-[#FFD51A] px-3 py-1 rounded transition hover:bg-white ml-4 font-bold" to="/dashboard">
                      DASHBOARD
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="relative">
              {/* RENDERIZADO CONDICIONAL PERFIL ESCRITORIO */}
              {usuarioAutenticado ? (
                <>
                  <button 
                    type="button" 
                    onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}
                    className="overflow-hidden rounded-full border-2 border-[#FFD51A] shadow-inner focus:outline-none transition-transform hover:scale-105"
                  >
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&amp;fit=crop&amp;q=80&amp;w=1160" alt="Perfil" className="size-10 object-cover" />
                  </button>

                  {menuPerfilAbierto && (
                    <div className="absolute end-0 z-10 mt-2 w-48 rounded-md border border-[#1B396A] bg-white shadow-xl font-['PixelSplitter'] text-xs tracking-wider" role="menu">
                      <div className="p-2">
                        <Link to="/perfil" className="block rounded-lg px-4 py-3 text-[#1B396A] hover:bg-gray-100" role="menuitem" onClick={() => setMenuPerfilAbierto(false)}>
                          MI PERFIL
                        </Link>
                        <button 
                          type="button" 
                          onClick={manejarCerrarSesion}
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50 transition-colors" 
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"></path>
                          </svg>
                          CERRAR SESIÓN
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] px-5 py-2 rounded shadow-lg hover:bg-white transition-colors tracking-widest text-sm"
                >
                  INGRESAR
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MENÚ DESPLEGABLE PARA CELULARES (DISEÑO ADAPTADO) */}
      {/* ========================================================= */}
      {menuAbierto && (
        <div className="md:hidden bg-[#1B396A] border-b border-[#807E82]/30 absolute w-full left-0 top-16 shadow-2xl font-['PixelSplitter']">
          <div className="px-4 pt-4 pb-6 space-y-5 flex flex-col">
            <Link to="/" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">INICIO</Link>
            <Link to="/noticias" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">NOTICIAS</Link>
            <Link to="/personajes" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">PERSONAJES</Link>
            <Link to="/galeria" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">GALERÍA</Link>
            <Link to="/mapas" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">MAPAS</Link>
            <Link to="/descargar" onClick={cerrarMenuMobile} className="block text-white hover:text-[#FFD51A] tracking-widest text-center text-sm">DESCARGAR</Link>
            
            {esAdmin && (
              <Link to="/dashboard" onClick={cerrarMenuMobile} className="block text-[#FFD51A] hover:text-white tracking-widest text-center text-sm">DASHBOARD</Link>
            )}

            {/* ZONA DE AUTENTICACIÓN MÓVIL */}
            <div className="pt-4 border-t border-white/20 flex flex-col items-center gap-4">
              {usuarioAutenticado ? (
                <>
                  <Link to="/perfil" onClick={cerrarMenuMobile} className="text-white hover:text-[#FFD51A] tracking-widest text-sm">MI PERFIL</Link>
                  <button onClick={manejarCerrarSesion} className="text-red-400 hover:text-red-300 tracking-widest text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"></path>
                    </svg>
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={cerrarMenuMobile} className="bg-[#FFD51A] text-[#1B396A] px-5 py-3 rounded hover:bg-white tracking-widest w-3/4 text-center text-sm">
                  INGRESAR
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}