import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  // Estados para atrapar lo que el usuario escribe
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  // IMPORTANTE: Pon aquí la URL de tu backend en Render
  const API_URL = 'https://campanitaweb.onrender.com/api/login';

  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que la página recargue al dar enter
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentias: 'include' es VITAL para que el navegador acepte la cookie segura que hicimos en el backend
        credentials: 'include', 
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

     // Si llegamos aquí, ¡el login fue exitoso!
      localStorage.setItem('usuarioLogueado', 'true');
      
      // Guardamos en la memoria si este usuario es el jefe
      if (data.esAdmin) {
        localStorage.setItem('esAdmin', 'true');
      } else {
        localStorage.removeItem('esAdmin');
      }
      
      navigate('/');
      window.location.reload();
     

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-[#1B396A]/90 p-10 rounded-xl shadow-2xl border border-[#FFD51A]/30 w-full max-w-md backdrop-blur-sm">
        
        <h2 className="text-3xl text-[#FFD51A] font-['PixelSplitter'] mb-8 text-center tracking-widest">
          ACCESO
        </h2>

        {/* Mostramos el error si el backend nos rechaza */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-6 font-sans">
          <div>
            <label className="block text-gray-200 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors"
              placeholder="12345@gmail.com"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className={`w-full bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold py-3 px-4 rounded transition-transform tracking-widest mt-4 ${cargando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:scale-105'}`}
          >
            {cargando ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/registro')}
            className="w-full bg-transparent border border-[#FFD51A] text-[#FFD51A] font-['PixelSplitter'] font-bold py-3 px-4 rounded transition-transform tracking-widest mt-2 hover:bg-[#FFD51A] hover:text-[#1B396A] hover:scale-105"
          >
            REGISTRARSE
          </button>
        
        </form>

      </div>
    </div>
  );
}