import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/login'; // Asegúrate de que el nombre coincida con tu archivo real
import '@testing-library/jest-dom';

// Simulamos el navegador para que React Router no marque error
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Interceptamos fetch para no depender del internet en esta prueba visual
global.fetch = vi.fn();

describe('Pruebas del Frontend - Flujo de Seguridad', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe mostrar el simulador de MFA (Modo Evaluación) al ingresar credenciales correctas', async () => {
    
    // 1. Simulamos que el backend nos da el Token CSRF
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrfToken: 'token-falso-seguro' })
    });

    // 2. Simulamos que el backend valida la contraseña y manda el código MFA
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ requiereMfa: true, codigoDemo: '777888' })
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Escribimos en los inputs
    fireEvent.change(screen.getByPlaceholderText('12345@gmail.com'), { target: { value: 'profe@correo.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });

    // Clic en el botón
    fireEvent.click(screen.getByText('INICIAR SESIÓN'));

    // Verificamos que la pantalla cambie y muestre el código secreto
    await waitFor(() => {
      expect(screen.getByText('🎓 MODO EVALUACIÓN')).toBeInTheDocument();
      expect(screen.getByText('777888')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000000')).toBeInTheDocument(); // El input del NIP
    });
  });
});