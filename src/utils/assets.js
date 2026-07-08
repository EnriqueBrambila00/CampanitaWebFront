/**
 * Utilidad para manejar recursos y assets.
 * 
 * Convierte URLs absolutas del backend que contengan '/modelos3d/' 
 * a URLs relativas. Esto asegura que el frontend cargue los assets desde 
 * su propio servidor (ya sea en desarrollo o en producción vía git),
 * evitando problemas con almacenamientos efímeros en plataformas como Render.
 */
export const obtenerUrlRecurso = (url) => {
  if (!url) return '';
  if (url.includes('/modelos3d/')) {
    const parts = url.split('/modelos3d/');
    return `/modelos3d/${parts[parts.length - 1]}`;
  }
  return url;
};
