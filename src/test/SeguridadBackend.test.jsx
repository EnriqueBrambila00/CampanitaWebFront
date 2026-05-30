import { describe, it, expect } from 'vitest';

// Apuntamos directamente a tu servidor vivo en Render
const URL_BACKEND = 'https://campanitaweb.onrender.com';

describe('Pruebas del Backend (En la Nube) - Escudos de Seguridad', () => {
  
  it('1. Debe bloquear peticiones POST si no tienen Token CSRF (Escudo Anti-Falsificación)', async () => {
    // Intentamos iniciar sesión pero NO enviamos la cabecera 'X-CSRF-Token'
    const respuesta = await fetch(`${URL_BACKEND}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo: 'hacker@correo.com', contrasena: '123456' })
    });

    // Tu middleware validarCsrf debe detectar la trampa y patearnos con un 403 (Forbidden)
    expect(respuesta.status).toBe(403);
    
    const data = await respuesta.json();
    expect(data.error).toContain('Falta la cookie CSRF');
    
  }, 60000); // <--- LÍMITE DE 60 SEGUNDOS

  it('2. Debe bloquear el acceso a la creación de personajes si no hay sesión de Administrador', async () => {
    // Intentamos crear un personaje falso en la base de datos de Aiven sin enviar una cookie JWT
    const respuesta = await fetch(`${URL_BACKEND}/api/admin/personajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        nombre: 'Personaje Hackeado', 
        descripcion: 'Intruso', 
        imagen_url: 'http://hack.com/img.png' 
      })
    });

    // Tu middleware verificarAdmin debe bloquearnos con un 401 (Unauthorized)
    expect(respuesta.status).toBe(401);

    const data = await respuesta.json();
    expect(data.error).toContain('Acceso denegado');
    
  }, 60000); // <--- LÍMITE DE 60 SEGUNDOS

  it('3. Debe permitir leer la ruta pública de mapas sin bloqueos', async () => {
    const respuesta = await fetch(`${URL_BACKEND}/mapas`, {
      method: 'GET'
    });

    // Como es pública, el servidor debe responder 200 OK
    expect(respuesta.status).toBe(200);
    
  }, 60000); // <--- LÍMITE DE 60 SEGUNDOS


  it('4. Debe rechazar accesos si el Token JWT es inventado o manipulado (Escudo de Autenticación)', async () => {
    // Simulamos un atacante que crea su propio JWT falso
    const tokenFalso = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGFja2VyIn0.firma_falsa_invalida';

    const respuesta = await fetch(`${URL_BACKEND}/api/admin/personajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Inyectamos el token falso directamente en las cookies de la petición
        'Cookie': `auth_token=${tokenFalso}`
      },
      body: JSON.stringify({ 
        nombre: 'Infiltrado', 
        descripcion: 'Intento de hackeo', 
        imagen_url: 'http://hack.com/img.png' 
      })
    });

    // Tu middleware (jwt.verify) debe detectar que la firma final del token no coincide con tu JWT_SECRET
    // y debe rebotar la petición con un 401.
    expect(respuesta.status).toBe(401);

    const data = await respuesta.json();
    // Verificamos que tu index.js devuelva exactamente el mensaje que programaste en el catch de verificarAdmin
    expect(data.error).toContain('Token inválido o expirado');
    
  }, 60000);
  it('5. Debe incluir encabezados de seguridad (Helmet) para mitigar XSS y Clickjacking', async () => {
    // Hacemos una petición a una ruta pública
    const respuesta = await fetch(`${URL_BACKEND}/mapas`, {
      method: 'GET'
    });

    // 1. Verificamos que Express no esté revelando qué tecnología usamos (evita dar pistas a hackers)
    expect(respuesta.headers.get('x-powered-by')).toBeNull();

    // 2. Verificamos que esté activo el escudo contra Clickjacking (evita que clonen tu web en iframes invisibles)
    expect(respuesta.headers.get('x-frame-options')).toBe('SAMEORIGIN');

    // 3. Verificamos que esté forzando conexiones seguras HTTPS (Strict-Transport-Security)
    // Usamos .toBeTruthy() porque el valor exacto puede variar, pero sabemos que debe existir
    expect(respuesta.headers.get('strict-transport-security')).toBeTruthy();
    
  }, 60000);
});

