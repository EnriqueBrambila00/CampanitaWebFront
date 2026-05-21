import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoPiramide from '../assets/piramide.png';

export function Navbar() {
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const navigate = useNavigate(); // Inicializamos la herramienta para cambiar de página
  
  const usuarioAutenticado = localStorage.getItem('usuarioLogueado') === 'true';
  const esAdmin = localStorage.getItem('esAdmin') === 'true';
  
  const manejarCerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado'); // Destruimos la llave
    localStorage.removeItem('esAdmin');
    setMenuPerfilAbierto(false); // Cerramos el menú
    navigate('/login'); // Te mandamos a la pantalla de login
    window.location.reload(); // Refrescamos rápido para actualizar la barra
  };

  return (
    <header className="bg-[#1B396A] border-b border-[#807E82]/30 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Título */}
          <div className="flex-1 md:flex md:items-center">
            <Link className="flex items-center gap-3 transition hover:opacity-80" to="/">
              <img src={logoPiramide} alt="Logo La Campana" className="h-12 w-auto" />
              <span className="font-['PixelSplitter'] text-[#FFD51A] text-2xl tracking-widest uppercase">
                La Campanita
              </span>
            </Link>
          </div>

          {/* Menú principal de navegación */}
          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm font-['PixelSplitter'] tracking-widest">
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/">Inicio</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/personajes">Personajes</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/galeria">Galería</Link></li>
                <li><Link className="text-white transition hover:text-[#FFD51A]" to="/mapas">Mapas</Link></li>
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

            <div className="relative hidden md:block">
              {/* RENDERIZADO CONDICIONAL: Si está logueado muestra perfil, si no, botón de Login */}
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
                        <Link to="/perfil" className="block rounded-lg px-4 py-3 text-[#1B396A] hover:bg-gray-100" role="menuitem">
                          MI PERFIL
                        </Link>
                        
                        {/* AQUÍ SE CONECTÓ LA FUNCIÓN AL BOTÓN */}
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
    </header>
  );
}