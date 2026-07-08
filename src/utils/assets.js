/**
 * Utilidad para manejar recursos y assets.
 * 
 * Convierte URLs absolutas del backend que contengan '/modelos3d/' 
 * a URLs relativas. Esto asegura que el frontend cargue los assets desde 
 * su propio servidor (ya sea en desarrollo o en producción vía git),
 * evitando problemas con almacenamientos efímeros en plataformas como Render.
 */
export const obtenerUrlRecurso = (url) => {
  return url || '';
};
