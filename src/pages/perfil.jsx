import { useState, useEffect } from 'react';

export function Perfil() {
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const URL_BACKEND = 'https://campanitaweb.onrender.com';

  // 1. Cargar el teléfono al abrir la página
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${URL_BACKEND}/api/perfil/telefono`, { credentials: 'include' });
        const data = await res.json();
        if (data.telefono) setTelefono(data.telefono);
      } catch (e) { console.error("Error cargando perfil"); }
    };
    cargarDatos();
  }, []);

  // 2. Guardar el teléfono (¡Aquí ocurre el cifrado en el backend!)
  const manejarGuardar = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    // Obtenemos el token CSRF primero
    const resCsrf = await fetch(`${URL_BACKEND}/api/csrf-token`, { credentials: 'include' });
    const { csrfToken } = await resCsrf.json();

    const res = await fetch(`${URL_BACKEND}/api/perfil/telefono`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
      credentials: 'include',
      body: JSON.stringify({ telefono, csrfToken })
    });

    if (res.ok) setMensaje('✅ Teléfono cifrado y guardado correctamente.');
    else setMensaje('❌ Error al guardar.');
    setCargando(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-[#1B396A]/90 p-8 rounded-xl border border-[#FFD51A]/30">
      <h2 className="text-2xl text-[#FFD51A] font-['PixelSplitter'] mb-6">MI PERFIL</h2>
      <form onSubmit={manejarGuardar} className="space-y-4">
        <div>
          <label className="text-white text-sm">Teléfono (Dato sensible):</label>
          <input 
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full mt-2 p-2 rounded bg-black/30 border border-[#807E82] text-white"
            placeholder="555-0123"
          />
        </div>
        <button className="w-full bg-[#FFD51A] text-[#1B396A] font-bold py-2 rounded">
          {cargando ? 'Cifrando...' : 'GUARDAR PROTEGIDO'}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-white text-sm">{mensaje}</p>}
    </div>
  );
}