// Utilidad para enviar tokens en peticiones HTTP (Soporte híbrido Cookies + Headers para Safari e iOS)
export function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('token');
  return {
    ...extraHeaders,
    ...(token && { 'Authorization': `Bearer ${token}`, 'x-auth-token': token })
  };
}
