import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#1B396A] border-t border-[#023326] text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo y Contacto (Ocupa 2 columnas) */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-5 items-start">
            <div className="shrink-0">
               <img 
                 src="https://i.postimg.cc/qqxTY9xF/campanita.jpg" 
                 alt="Campanita" 
                 className="w-16 h-16 rounded-xl object-cover border border-[#023326] shadow-lg opacity-90 transition-opacity hover:opacity-100" 
               />
            </div>
            <div>
              <p className="text-[10px] tracking-wider text-gray-400 uppercase font-bold">Proyecto</p>
              <h3 className="text-xl font-medium text-[#FFD51A] mt-1 hover:text-yellow-400 transition-colors">
                TECNM Colima
              </h3>
              <div className="mt-2 text-xs space-y-1 text-gray-300/90">
                <p>Ingeniería en Sistemas Computacionales</p>
                <p>Villa de Álvarez, Colima</p>
              </div>
              <div className="mt-4">
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-400 transition-colors hover:text-[#FFD51A] inline-block">
                  <span className="sr-only">GitHub</span>
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces: Explorar */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Explorar</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/personajes" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Personajes</Link></li>
              <li><Link to="/mapas" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Mapas del Juego</Link></li>
              <li><Link to="/galeria" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Galería Visual</Link></li>
            </ul>
          </div>

          {/* Enlaces: El Proyecto */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">El Proyecto</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/historia" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Historia (Lore)</Link></li>
              <li><Link to="/noticias" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Noticias y Updates</Link></li>
              <li><a href="#" className="text-gray-300 transition-colors hover:text-[#FFD51A]">Documentación</a></li>
            </ul>
          </div>
        </div>

        {/* Separador y Derechos */}
        <div className="mt-8 pt-6 border-t border-[#023326]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <ul className="flex flex-wrap justify-center gap-5 text-xs text-gray-400">
            <li><a href="#" className="transition-colors hover:text-white">Términos y Condiciones</a></li>
            <li><a href="#" className="transition-colors hover:text-white">Aviso de Privacidad</a></li>
          </ul>
          <p className="text-xs text-gray-400 text-center">
            © 2026. Proyecto "La Campana". Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}