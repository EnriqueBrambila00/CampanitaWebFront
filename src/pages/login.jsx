import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  // Estados para el login tradicional
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  // NUEVOS ESTADOS PARA MFA
  const [requiereMfa, setRequiereMfa] = useState(false);
  const [codigoMfa, setCodigoMfa] = useState('');
  const [codigoNotificacion, setCodigoNotificacion] = useState(null);
  
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  // URLs del backend en Render
  const URL_BACKEND = 'https://campanitaweb.onrender.com';
  const CSRF_URL = `${URL_BACKEND}/api/csrf-token`;
  const LOGIN_URL = `${URL_BACKEND}/api/login`;
  const MFA_URL = `${URL_BACKEND}/api/login/verificar-mfa`;
  const GOOGLE_AUTH_URL = `${URL_BACKEND}/api/auth/google`;

  // ========================================================
  // PASO 1: ENVIAR CORREO Y CONTRASEÑA
  // ========================================================
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuestaCsrf = await fetch(CSRF_URL, { method: 'GET', credentials: 'include' });
      if (!respuestaCsrf.ok) throw new Error('Error de conexión segura. Recarga la página.');
      
      const dataCsrf = await respuestaCsrf.json();
      const tokenCsrfFresco = dataCsrf.csrfToken;

      const respuestaLogin = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': tokenCsrfFresco
        },
        credentials: 'include',
        body: JSON.stringify({ correo, contrasena, csrfToken: tokenCsrfFresco })
      });

      const dataLogin = await respuestaLogin.json();

      if (!respuestaLogin.ok) throw new Error(dataLogin.error || 'Error al iniciar sesión');

      // Si el backend nos dice que requiere MFA, cambiamos la pantalla
      if (dataLogin.requiereMfa) {
        setRequiereMfa(true);
        setError(null); // Limpiamos errores previos
        setCodigoNotificacion(dataLogin.codigoDemo); // Mostramos el código de MFA en una notificación
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // ========================================================
  // PASO 2: ENVIAR EL CÓDIGO DE 6 DÍGITOS
  // ========================================================
  const manejarVerificarMfa = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const respuestaCsrf = await fetch(CSRF_URL, { method: 'GET', credentials: 'include' });
      const dataCsrf = await respuestaCsrf.json();
      const tokenCsrfFresco = dataCsrf.csrfToken;

      const respuestaMfa = await fetch(MFA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': tokenCsrfFresco
        },
        credentials: 'include',
        body: JSON.stringify({ correo, codigo: codigoMfa, csrfToken: tokenCsrfFresco })
      });

      const dataMfa = await respuestaMfa.json();

      if (!respuestaMfa.ok) throw new Error(dataMfa.error || 'Código incorrecto');

      // ¡LOGIN EXITOSO FINAL! Guardamos sesión
      localStorage.setItem('usuarioLogueado', 'true');
      if (dataMfa.esAdmin) {
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
          {requiereMfa ? 'VERIFICACIÓN' : 'ACCESO'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm font-sans text-center">
            {error}
          </div>
        )}

        {/* ======================================================== */}
        {/* RENDERIZADO CONDICIONAL: PANTALLA MFA O PANTALLA NORMAL */}
        {/* ======================================================== */}
        
        {requiereMfa ? (

          // --- PANTALLA DEL CÓDIGO MFA ---
          <form onSubmit={manejarVerificarMfa} className="space-y-6 font-sans">
            {/* ======================================================== */}
            {/* CAJA DE MODO DEMO PARA PROBLEMA DE ENVÍO DE CORREOS */}
            {/* ======================================================== */}
            {codigoNotificacion && (
              <div className="bg-blue-900/50 border border-blue-400 p-4 rounded-lg mb-6 shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300 bg-blue-950 px-2 py-1 rounded">🎓 MODO EVALUACIÓN</span>
                  <span className="text-xs text-gray-400">Restricción SMTP Render</span>
                </div>
                <p className="text-sm text-gray-200 text-center">
                  Simulador de bandeja de entrada. Has recibido este código:
                </p>
                <div className="text-center mt-2">
                  <span className="font-['PixelSplitter'] text-3xl text-[#FFD51A] tracking-widest">{codigoNotificacion}</span>
                </div>
              </div>
            )}
            {/* ======================================================== */}
            <div className="text-center text-gray-300 text-sm mb-4">
              Hemos enviado un código de 6 dígitos a <br/>
              <span className="font-bold text-[#FFD51A]">{correo}</span>
            </div>
            
            <div>
              <label className="block text-gray-200 text-sm font-bold mb-2 text-center">Ingresa tu código</label>
              <input 
                type="text" 
                required
                maxLength="6"
                value={codigoMfa}
                onChange={(e) => setCodigoMfa(e.target.value.replace(/\D/g, ''))} // Solo permite números
                className="w-full px-4 py-3 rounded bg-black/30 border border-[#807E82] text-white focus:outline-none focus:border-[#FFD51A] transition-colors text-center text-2xl tracking-[0.5em]"
                placeholder="000000"
              />
            </div>

            <button 
              type="submit" 
              disabled={cargando || codigoMfa.length < 6}
              className={`w-full bg-[#FFD51A] text-[#1B396A] font-['PixelSplitter'] font-bold py-3 px-4 rounded transition-transform tracking-widest mt-4 ${cargando || codigoMfa.length < 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:scale-105'}`}
            >
              {cargando ? 'VERIFICANDO...' : 'CONFIRMAR'}
            </button>

            <button 
              type="button" 
              onClick={() => { setRequiereMfa(false); setCodigoMfa(''); setError(null); }}
              className="w-full bg-transparent text-gray-400 text-sm py-2 mt-2 hover:text-white transition-colors"
            >
              Volver al inicio de sesión
            </button>
          </form>

        ) : (
          // --- PANTALLA DE LOGIN NORMAL ---
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
            
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-500"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-['PixelSplitter'] tracking-widest">O</span>
              <div className="flex-grow border-t border-gray-500"></div>
            </div>

            <button 
              type="button" 
              onClick={() => window.location.href = GOOGLE_AUTH_URL}
              className="w-full bg-white text-gray-700 font-bold py-3 px-4 rounded transition-transform mt-2 hover:bg-gray-100 hover:scale-105 flex items-center justify-center gap-3 shadow-md"
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google Logo" 
                className="w-5 h-5"
              />
              CONTINUAR CON GOOGLE
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/registro')}
              className="w-full bg-transparent border border-[#FFD51A] text-[#FFD51A] font-['PixelSplitter'] font-bold py-3 px-4 rounded transition-transform tracking-widest mt-2 hover:bg-[#FFD51A] hover:text-[#1B396A] hover:scale-105"
            >
              REGISTRARSE
            </button>
          </form>
        )}
      </div>
    </div>
  );
}