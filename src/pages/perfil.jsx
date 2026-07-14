import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../utils/auth';

export function Perfil() {
  const [perfil, setPerfil] = useState({
    nombre_usuario: '',
    correo: '',
    fecha_registro: '',
    estado_cuenta: 'activo',
    roles: []
  });

  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [gamertag, setGamertag] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cargando, setCargando] = useState(false);

  const URL_BACKEND = 'https://campanitaweb.onrender.com';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${URL_BACKEND}/api/perfil`, { headers: getAuthHeaders(), credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setPerfil(data);
          if (data.telefono) setTelefono(data.telefono);
          if (data.fecha_nacimiento) setFechaNacimiento(data.fecha_nacimiento);
          if (data.gamertag) setGamertag(data.gamertag);
        } else {
          // Fallback a ruta de teléfono por compatibilidad
          const resTel = await fetch(`${URL_BACKEND}/api/perfil/telefono`, { headers: getAuthHeaders(), credentials: 'include' });
          if (resTel.ok) {
            const dataTel = await resTel.json();
            if (dataTel.telefono) setTelefono(dataTel.telefono);
          }
        }
      } catch (e) {
        console.error("Error cargando perfil:", e);
      }
    };
    cargarDatos();
  }, []);

  const manejarGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrorMsg('');

    // Validación Gamertag máximo 15 caracteres
    if (gamertag && gamertag.length > 15) {
      setErrorMsg('⚠️ El Gamertag no puede tener más de 15 caracteres.');
      return;
    }

    // Validación Fecha de Nacimiento no futura
    if (fechaNacimiento) {
      const hoy = new Date().toISOString().split('T')[0];
      if (fechaNacimiento > hoy) {
        setErrorMsg('⚠️ La fecha de nacimiento no puede ser una fecha futura.');
        return;
      }
    }

    setCargando(true);
    try {
      const resCsrf = await fetch(`${URL_BACKEND}/api/csrf-token`, { credentials: 'include' });
      const { csrfToken } = await resCsrf.json();

      const res = await fetch(`${URL_BACKEND}/api/perfil`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }),
        credentials: 'include',
        body: JSON.stringify({
          telefono,
          fecha_nacimiento: fechaNacimiento || null,
          gamertag: gamertag || null,
          csrfToken
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Datos de perfil y campos sensibles actualizados y protegidos correctamente.');
      } else {
        setErrorMsg(`❌ ${data.error || 'Error al guardar cambios'}`);
      }
    } catch (e) {
      setErrorMsg('❌ Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'No disponible';
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return fechaISO;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-[#1B396A]/90 p-8 rounded-xl border border-[#FFD51A]/30 text-white font-sans shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#FFD51A]/20">
        <div>
          <h2 className="text-2xl text-[#FFD51A] font-['PixelSplitter']">MI PERFIL DE USUARIO</h2>
          <p className="text-xs text-gray-300 mt-1">Información de cuenta y protección de datos sensibles</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold font-['PixelSplitter'] uppercase border ${
          perfil.estado_cuenta === 'baneado'
            ? 'bg-red-500/20 text-red-300 border-red-500/40'
            : perfil.estado_cuenta === 'suspendido'
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
            : 'bg-green-500/20 text-green-300 border-green-500/40'
        }`}>
          {perfil.estado_cuenta || 'ACTIVO'}
        </span>
      </div>

      {/* INFORMACIÓN DEL SISTEMA (OBTENIDA AUTOMÁTICAMENTE DE BD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-black/20 p-4 rounded-lg border border-white/10">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">NOMBRE DE USUARIO</span>
          <span className="text-sm font-bold text-[#FFD51A]">👤 {perfil.nombre_usuario || 'Cargando...'}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">CORREO ELECTRÓNICO</span>
          <span className="text-sm text-gray-200">📧 {perfil.correo || 'Cargando...'}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">FECHA DE REGISTRO</span>
          <span className="text-sm text-gray-200">📅 {formatearFecha(perfil.fecha_registro)}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block font-semibold">ROLES ASIGNADOS</span>
          <span className="text-sm text-gray-200">🛡️ {perfil.roles?.length ? perfil.roles.join(', ') : 'Usuario general'}</span>
        </div>
      </div>

      {/* FORMULARIO EDITABLE Y PROTEGIDO */}
      <form onSubmit={manejarGuardar} className="space-y-6">
        <div>
          <label className="text-white text-sm font-semibold flex items-center gap-2">
            <span>🎮 Gamertag:</span>
            <span className="text-xs text-[#FFD51A] bg-black/40 px-2 py-0.5 rounded border border-[#FFD51A]/20">
              🔒 Protegido (Máx. 15 caracteres)
            </span>
          </label>
          <input
            type="text"
            maxLength={15}
            value={gamertag}
            onChange={(e) => setGamertag(e.target.value)}
            className="w-full mt-2 p-2.5 rounded bg-black/30 border border-[#807E82] text-white focus:border-[#FFD51A] focus:outline-none transition-colors"
            placeholder="Ej: Brambila98"
          />
        </div>

        <div>
          <label className="text-white text-sm font-semibold flex items-center gap-2">
            <span>📅 Fecha de Nacimiento:</span>
            <span className="text-xs text-[#FFD51A] bg-black/40 px-2 py-0.5 rounded border border-[#FFD51A]/20">
              🔒 Privacidad activada
            </span>
          </label>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full mt-2 p-2.5 rounded bg-black/30 border border-[#807E82] text-white focus:border-[#FFD51A] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-white text-sm font-semibold flex items-center gap-2">
            <span>📱 Teléfono Secreto:</span>
            <span className="text-xs text-[#FFD51A] bg-black/40 px-2 py-0.5 rounded border border-[#FFD51A]/20">
              🔒 Dato sensible cifrado AES
            </span>
          </label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full mt-2 p-2.5 rounded bg-black/30 border border-[#807E82] text-white focus:border-[#FFD51A] focus:outline-none transition-colors"
            placeholder="555-0123"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/40 border border-red-500/50 rounded text-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        {mensaje && (
          <div className="p-3 bg-green-900/40 border border-green-500/50 rounded text-green-200 text-sm">
            {mensaje}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#FFD51A] hover:bg-[#ffe04d] text-[#1B396A] font-['PixelSplitter'] font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {cargando ? 'GUARDANDO DATOS PROTEGIDOS...' : 'GUARDAR PROTEGIDO'}
        </button>
      </form>
    </div>
  );
}