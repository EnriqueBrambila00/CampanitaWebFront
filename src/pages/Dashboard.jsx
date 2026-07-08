import { useState, useEffect } from 'react';
import '@google/model-viewer';

const globFiles = import.meta.glob('/public/modelos3d/*.glb');
const modelosLocales = Object.keys(globFiles).map(path => path.replace('/public/modelos3d/', ''));

export function Dashboard() {
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const URL_BACKEND = 'https://campanitaweb.onrender.com';

  // --- ESTADOS ---
  const [personajes, setPersonajes] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [mapas, setMapas] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [editandoNoticiaId, setEditandoNoticiaId] = useState(null);
  const [tipoNoticia, setTipoNoticia] = useState('Noticia Oficial');
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  // Formulario genérico (reutilizado para las 3 secciones)
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (seccionActiva === 'personajes') obtenerDatos('personajes', setPersonajes);
    if (seccionActiva === 'galeria') obtenerDatos('galeria', setGaleria);
    if (seccionActiva === 'mapas') obtenerDatos('mapas', setMapas);
    if (seccionActiva === 'noticias') obtenerDatos('noticias', setNoticias);
    // Limpiamos los campos al cambiar de pestaña
    setNombre(''); setDescripcion(''); setImagenUrl(''); setMensaje(''); setEditandoNoticiaId(null); setTipoNoticia('Noticia Oficial');
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
        if (endpoint === 'noticias' && id === editandoNoticiaId) cancelarEdicionNoticia();
        obtenerDatos(endpoint, setEstado);
      }
    } catch (err) { console.error(err); }
  };

  const manejarGuardarNoticia = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const url = editandoNoticiaId
        ? `${URL_BACKEND}/api/admin/noticias/${editandoNoticiaId}`
        : `${URL_BACKEND}/api/admin/noticias`;
      const metodo = editandoNoticiaId ? 'PUT' : 'POST';

      const tituloLimpio = nombre.replace(/^\[(.*?)\]\s*/, '').trim();
      const tituloConTag = `[${tipoNoticia}] ${tituloLimpio}`;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titulo: tituloConTag,
          contenido: descripcion,
          imagen_url: imagenUrl || null
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al guardar la noticia');
      }
      setMensaje(editandoNoticiaId ? '✅ ¡Noticia actualizada con éxito!' : '✅ ¡Noticia creada con éxito!');
      setNombre(''); setDescripcion(''); setImagenUrl(''); setEditandoNoticiaId(null); setTipoNoticia('Noticia Oficial');
      obtenerDatos('noticias', setNoticias);
    } catch (err) { setMensaje(`❌ Error: ${err.message}`); }
  };

  const iniciarEdicionNoticia = (item) => {
    setEditandoNoticiaId(item.id_noticia);
    const tit = item.titulo || '';
    const match = tit.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      setTipoNoticia(match[1]);
      setNombre(match[2]);
    } else {
      const cat = tit.toLowerCase().includes('parche') || tit.toLowerCase().includes('update') || tit.toLowerCase().includes('actualización') ? 'Actualización'
        : tit.toLowerCase().includes('devlog') ? 'Devlog' : 'Noticia Oficial';
      setTipoNoticia(cat);
      setNombre(tit);
    }
    setDescripcion(item.contenido || '');
    setImagenUrl(item.imagen_url || '');
    setMensaje('✏️ Modo edición activado. Modifica los campos y guarda.');
  };

  const cancelarEdicionNoticia = () => {
    setEditandoNoticiaId(null);
    setNombre(''); setDescripcion(''); setImagenUrl(''); setTipoNoticia('Noticia Oficial');
    setMensaje('');
  };

  const manejarSubidaArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoArchivo(true);
    setMensaje('⏳ Subiendo archivo al servidor de La Campanita...');
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const res = await fetch(`${URL_BACKEND}/api/admin/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al subir archivo');
      }
      const data = await res.json();
      setImagenUrl(data.url);
      setMensaje('✅ ¡Archivo subido con éxito a /modelos3d/ y listo para guardarse!');
    } catch (err) {
      setMensaje(`❌ Error al subir: ${err.message}`);
    } finally {
      setSubiendoArchivo(false);
      e.target.value = null;
    }
  };

  // ==========================================
  // RENDERIZADO VISUAL
  // ==========================================
  const secciones = [
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥' },
    { id: 'personajes', nombre: 'Personajes', icono: '🗿' },
    { id: 'mapas', nombre: 'Mapas', icono: '🗺️' },
    { id: 'galeria', nombre: 'Galería', icono: '🖼️' },
    { id: 'noticias', nombre: 'Noticias', icono: '📰' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[75vh] mt-6 bg-[#1B396A]/80 rounded-xl shadow-2xl border border-[#807E82]/30 overflow-hidden font-sans text-gray-200">

      {/* BARRA LATERAL */}
      <aside className="w-full md:w-64 bg-[#0D2144] p-6 border-r border-[#807E82]/30">
        <h2 className="text-xl text-[#FFD51A] mb-8 font-['PixelSplitter'] tracking-widest text-center">PANEL ADMIN</h2>
        <nav className="space-y-2">
          {secciones.map((sec) => (
            <button key={sec.id} onClick={() => setSeccionActiva(sec.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-bold transition-colors ${seccionActiva === sec.id ? 'bg-[#FFD51A] text-[#1B396A]' : 'hover:bg-white/10 text-gray-300'
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
                  <input type="text" required={seccionActiva !== 'galeria'} value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1">{seccionActiva === 'personajes' ? 'URL Imagen / Modelo 3D (.glb)' : 'URL de la Imagen'}</label>
                  <div className="flex gap-2">
                    <input type="text" required value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} placeholder={seccionActiva === 'personajes' ? 'ej. /modelos3d/personaje.glb o https://...' : 'https://...'} className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none" />
                    <input type="file" id="subirArchivoLocal" accept=".glb,.gltf,.png,.jpg,.jpeg,.webp" onChange={manejarSubidaArchivo} className="hidden" />
                    <button
                      type="button"
                      disabled={subiendoArchivo}
                      onClick={() => document.getElementById('subirArchivoLocal').click()}
                      className="bg-[#1B396A] border border-[#FFD51A] px-3 py-2 rounded text-xs font-bold text-[#FFD51A] hover:bg-[#FFD51A] hover:text-[#1B396A] transition-colors whitespace-nowrap cursor-pointer shadow-md flex items-center gap-1"
                    >
                      {subiendoArchivo ? '⏳...' : '📂 Mis Archivos'}
                    </button>
                  </div>
                  {seccionActiva === 'personajes' && (
                    <div className="mt-3">
                      <label className="block text-xs mb-1 text-[#FFD51A]">O selecciona un modelo ya subido:</label>
                      <select 
                        onChange={(e) => {
                          if (e.target.value) setImagenUrl(`/modelos3d/${e.target.value}`);
                        }}
                        className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none text-sm"
                      >
                        <option value="">-- Elige un modelo de la carpeta --</option>
                        {modelosLocales.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-gray-400 mt-2 leading-snug">
                        💡 Si eliges uno de la lista o usas <strong>"📂 Mis Archivos"</strong>, se usará automáticamente.
                      </p>
                    </div>
                  )}
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
                      <td className="p-3">
                        {item.imagen_url && (item.imagen_url.toLowerCase().endsWith('.glb') || item.imagen_url.toLowerCase().endsWith('.gltf') || item.imagen_url.toLowerCase().includes('.glb')) ? (
                          <div className="w-14 h-14 bg-[#0D2144] rounded border border-[#FFD51A] overflow-hidden flex items-center justify-center relative">
                            <model-viewer
                              src={item.imagen_url}
                              auto-rotate
                              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                            ></model-viewer>
                            <span className="absolute bottom-0 bg-black/80 text-[#FFD51A] text-[8px] px-1 font-bold font-['PixelSplitter']">3D</span>
                          </div>
                        ) : (
                          <img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded" />
                        )}
                      </td>
                      <td className="p-3 font-bold">{item.nombre}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_personaje, 'personajes', setPersonajes)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                  {seccionActiva === 'mapas' && mapas.map((item) => (
                    <tr key={item.id_mapa} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3"><img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-bold">{item.nombre}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_mapa, 'mapas', setMapas)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                  {seccionActiva === 'galeria' && galeria.map((item) => (
                    <tr key={item.id_imagen} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3"><img src={item.imagen_url} alt="miniatura" className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-3 font-bold">{item.titulo || 'Sin título'}</td>
                      <td className="p-3 text-center"><button onClick={() => manejarBorrar(item.id_imagen, 'galeria', setGaleria)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold">🗑️ Borrar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN NOTICIAS */}
        {seccionActiva === 'noticias' && (
          <div className="space-y-8">
            <h3 className="text-3xl font-['PixelSplitter'] text-[#FFD51A] tracking-wider mb-6 uppercase">
              GESTIÓN DE NOTICIAS
            </h3>

            {mensaje && <div className="bg-white/10 border border-[#FFD51A] p-3 rounded text-center font-bold text-[#FFD51A]">{mensaje}</div>}

            {/* FORMULARIO NOTICIAS */}
            <form
              onSubmit={manejarGuardarNoticia}
              className="bg-black/20 p-6 rounded border border-white/10 space-y-4"
            >
              <h4 className="text-xl font-bold text-white mb-2">
                {editandoNoticiaId ? '✏️ Editar Noticia' : '✨ Publicar Nueva Noticia'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tipo de Noticia</label>
                  <select
                    value={tipoNoticia}
                    onChange={(e) => setTipoNoticia(e.target.value)}
                    className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"
                  >
                    <option value="Noticia Oficial" className="bg-[#0D2144]">Noticia Oficial</option>
                    <option value="Actualización" className="bg-[#0D2144]">Actualización</option>
                    <option value="Devlog" className="bg-[#0D2144]">Devlog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Título (máx. 130 caracteres)</label>
                  <input
                    type="text"
                    required
                    maxLength={130}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"
                    placeholder="Ej. Lanzamiento Beta v0.8.5"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">URL de la Imagen (Opcional)</label>
                  <input
                    type="url"
                    value={imagenUrl}
                    onChange={(e) => setImagenUrl(e.target.value)}
                    className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"
                    placeholder="https://..."
                  />
                  {imagenUrl && (
                    <div className="mt-2 p-2 bg-black/40 rounded border border-white/10 flex items-center gap-3">
                      <img src={imagenUrl} alt="Previsualización" className="w-12 h-12 object-cover rounded border border-[#FFD51A]" onError={(e) => { e.target.src = 'https://via.placeholder.com/150/1B396A/FFD51A?text=Error'; }} />
                      <span className="text-xs text-gray-300">Previsualización activa</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Contenido de la Noticia</label>
                <textarea
                  required
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="4"
                  className="w-full p-2 rounded bg-black/40 border border-gray-600 text-white focus:border-[#FFD51A] outline-none"
                  placeholder="Escribe el contenido completo..."
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold transition-colors">
                  {editandoNoticiaId ? '💾 Guardar Cambios' : '🚀 Publicar Noticia'}
                </button>
                {editandoNoticiaId && (
                  <button type="button" onClick={cancelarEdicionNoticia} className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded font-bold transition-colors">
                    ✕ Cancelar Edición
                  </button>
                )}
              </div>
            </form>

            {/* TABLA NOTICIAS */}
            <div className="bg-black/20 rounded border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D2144] border-b border-white/10">
                    <th className="p-3">Miniatura</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {noticias.map((item) => (
                    <tr key={item.id_noticia} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3">
                        <img
                          src={item.imagen_url || 'https://via.placeholder.com/150/1B396A/FFD51A?text=Sin+Img'}
                          alt="miniatura"
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        {(() => {
                          const tit = item.titulo || '';
                          const match = tit.match(/^\[(.*?)\]\s*(.*)$/);
                          const cat = match ? match[1] : (tit.toLowerCase().includes('update') || tit.toLowerCase().includes('actualización') ? 'Actualización' : tit.toLowerCase().includes('devlog') ? 'Devlog' : 'Noticia Oficial');
                          const tituloLimpio = match ? match[2] : tit;
                          return (
                            <div>
                              <span className="inline-block px-2 py-0.5 bg-[#FFD51A]/20 border border-[#FFD51A] text-[#FFD51A] text-[10px] rounded font-bold mr-2">
                                {cat.toUpperCase()}
                              </span>
                              <span className="font-bold">{tituloLimpio}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-3 text-sm text-gray-300">
                        {new Date(item.fecha_publicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => iniciarEdicionNoticia(item)}
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-bold transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => manejarBorrar(item.id_noticia, 'noticias', setNoticias)}
                          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs font-bold transition-colors"
                        >
                          🗑️ Borrar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {noticias.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-400 italic">No hay noticias publicadas aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}