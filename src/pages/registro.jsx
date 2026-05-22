import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function Registro() {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  // URL del backend principal en Render
  const API_URL = 'https://campanitaweb.onrender.com/api/registro';

  const CSRF_URL = 'https://campanitaweb.onrender.com/api/csrf-token';

  useEffect(() => {
    const obtenerTokenCsrf = async () => {
      try {
        const respuesta = await fetch(CSRF_URL, {
          method: 'GET',
          credentials: 'include'
        });

        const data = await respuesta.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        setError('No se pudo obtener el token CSRF');
      }
    };

    obtenerTokenCsrf();
  }, []);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ nombre_usuario, correo, contrasena, csrfToken })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.error || 'Error al registrarse');

      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
      navigate('/login'); // Lo mandamos a que inicie sesión con su nueva cuenta

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
          NUEVO EXPLORADOR
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={manejarRegistro} className="space-y-4 font-sans">
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <div>
            <label className="block text-gray-200 text-sm font-bold mb-1">Nombre de Usuario (Apodo)</label>
            <input 
              type="text" required value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors"
              placeholder="Ej. JaguarTec"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-bold mb-1">Correo Electrónico</label>
            <input 
              type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-bold mb-1">Contraseña</label>
            <input 
              type="password" required value={contrasena} onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" disabled={cargando}
            className={`w-full bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold py-3 px-4 rounded transition-transform tracking-widest mt-6 ${cargando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:scale-105'}`}
          >
            {cargando ? 'CREANDO...' : 'REGISTRARSE'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm font-sans">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#FFD51A] hover:underline font-bold">Ingresa aquí</Link>
        </p>

      </div>
    </div>
  );
}