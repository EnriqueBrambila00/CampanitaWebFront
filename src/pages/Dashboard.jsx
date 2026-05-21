import { useState, useEffect } from 'react';

export function Dashboard() {
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const URL_BACKEND = 'https://campanitaweb.onrender.com';
  
  // --- ESTADOS ---
  const [personajes, setPersonajes] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [mapas, setMapas] = useState([]);
  
  // Formulario genérico (reutilizado para las 3 secciones)
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (seccionActiva === 'personajes') obtenerDatos('personajes', setPersonajes);
    if (seccionActiva === 'galeria') obtenerDatos('galeria', setGaleria);
    if (seccionActiva === 'mapas') obtenerDatos('mapas', setMapas);
    // Limpiamos los campos al cambiar de pestaña
    setNombre(''); setDescripcion(''); setImagenUrl(''); setMensaje('');
  }, [seccionActiva]);

  // ==========================================
  // FUNCIONES GENÉRICAS CRUD
  // ==========================================
  const obtenerDatos = async (endpoint, setEstado) => {
    try {
      const res = await fetch(`${URL_BACKEND}/${endpoint}`);
      if (res.ok) setEstado(await res.json());
    } catch (err) { console.error(err); }
  };

  const manejarGuardar = async (e, endpoint, setEstado) => {
    e.preventDefault();
    setMensaje('');
    try {
      // Ajustamos los nombres de los campos dependiendo si es galería o no
      const bodyData = endpoint === 'galeria' 
        ? { titulo: nombre, descripcion, imagen_url: imagenUrl }
        : { nombre, descripcion, imagen_url: imagenUrl };

      const res = await fetch(`${URL_BACKEND}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });
      if (!res.ok) throw new Error('Error al guardar');
      setMensaje('✅ ¡Guardado con éxito!');
      setNombre(''); setDescripcion(''); setImagenUrl('');
      obtenerDatos(endpoint, setEstado);
    } catch (err) { setMensaje(`❌ Error: ${err.message}`); }
  };

  const manejarBorrar = async (id, endpoint, setEstado) => {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    try {
      const res = await fetch(`${URL_BACKEND}/api/admin/${endpoint}/${id}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) {
        setMensaje('🗑️ Elemento eliminado.');
        obtenerDatos(endpoint, setEstado);
      }
    } catch (err) { console.error(err); }
  };

  // ==========================================
  // RENDERIZADO VISUAL
  // ==========================================
  const secciones = [
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥' },
    { id: 'personajes', nombre: 'Personajes', icono: '🗿' },
    { id: 'mapas', nombre: 'Mapas', icono: '🗺️' },
    { id: 'galeria', nombre: 'Galería', icono: '🖼️' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[75vh] mt-6 bg-[#1B396A]/80 rounded-xl shadow-2xl border border-[#807E82]/30 overflow-hidden font-sans text-gray-200">
      
      {/* BARRA LATERAL */}
      <aside className="w-full md:w-64 bg-[#0D2144] p-6 border-r border-[#807E82]/30">
        <h2 className="text-xl text-[#FFD51A] mb-8 font-['PixelSplitter'] tracking-widest text-center">PANEL ADMIN</h2>
        <nav className="space-y-2">
          {secciones.map((sec) => (
            <button key={sec.id} onClick={() => setSeccionActiva(sec.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-bold transition-colors ${
                seccionActiva === sec.id ? 'bg-[#FFD51A] text-[#1B396A]' : 'hover:bg-white/10 text-gray-300'
              }`}>
              <span className="text-xl">{sec.icono}</span> {sec.nombre}
            </button>
          ))}
        </nav>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {seccionActiva === 'usuarios' && (
          <div>
            <h3 className="text-3xl font-['PixelSplitter'] text-[#FFD51A] tracking-wider mb-6">GESTIÓN DE USUARIOS</h3>
            <div className="bg-black/20 p-6 rounded border border-white/10 text-center"><p className="opacity-70">Próxima sección a conectar.</p></div>
          </div>
        )}

        {/* PESTAÑAS DE CONTENIDO (Personajes, Mapas, Galería) */}
        {['personajes', 'mapas', 'galeria'].includes(seccionActiva) && (
          <div className="space-y-8">
            <h3 className="text-3xl font-['PixelSplitter'] text-[#FFD51A] tracking-wider mb-6 uppercase">
              GESTIÓN DE {seccionActiva}
            </h3>
            
            {mensaje && <div className="bg-white/10 border border-[#FFD51A] p-3 rounded text-center font-bold text-[#FFD51A]">{mensaje}</div>}
            
            {/* FORMULARIO DINÁMICO */}
            <form 
              onSubmit={(e) => {
                if (seccionActiva === 'personajes') manejarGuardar(e, 'personajes', setPersonajes);
                if (seccionActiva === 'mapas') manejarGuardar(e, 'mapas', setMapas);
                if (seccionActiva === 'galeria') manejarGuardar(e, 'galeria', setGaleria);
              }} 
              className="bg-black/20 p-6 rounded border border-white/10 space-y-4"
            >
              <h4 className="text-xl font-bold text-white mb-2">✨ Subir Nuevo Registro</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{seccionActiva === 'galeria' ? 'Título' : 'Nombre'}</label>
                  <input type="text" required={seccionActiva !== 'galeria'} value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">URL de la Imagen</label>
                  <input type="url" required value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"/>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea required={seccionActiva !== 'galeria'} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"></textarea>
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold transition-colors">💾 Guardar Registro</button>
            </form>

            {/* TABLA DINÁMICA */}
            <div className="bg-black/20 rounded border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D2144] border-b border-white/10">
                    <th className="p-3">Miniatura</th>
                    <th className="p-3">{seccionActiva === 'galeria' ? 'Título' : 'Nombre'}</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {seccionActiva === 'personajes' && personajes.map((item) => (
                    <tr key={item.id_personaje} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3"><img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded"/></td>
                      <td className="p-3 font-bold">{item.nombre}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_personaje, 'personajes', setPersonajes)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                  {seccionActiva === 'mapas' && mapas.map((item) => (
                    <tr key={item.id_mapa} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3"><img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded"/></td>
                      <td className="p-3 font-bold">{item.nombre}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_mapa, 'mapas', setMapas)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                  {seccionActiva === 'galeria' && galeria.map((item) => (
                    <tr key={item.id_imagen} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3"><img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded"/></td>
                      <td className="p-3 font-bold">{item.titulo || 'Sin título'}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_imagen, 'galeria', setGaleria)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}