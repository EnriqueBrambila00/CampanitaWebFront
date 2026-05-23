import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login'; // Ajusta la ruta si tu Login.jsx está en otra carpeta
import '@testing-library/jest-dom';

// 1. SIMULAMOS LA NAVEGACIÓN (Para que no marque error al usar useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. SIMULAMOS EL BACKEND (Interceptamos la función fetch)
global.fetch = vi.fn();

describe('Pruebas del Componente Login - La Campanita', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); // Limpiamos la memoria antes de cada prueba
  });

  it('1. Renderiza los campos del formulario correctamente', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    // Verificamos que el título y los inputs existan en la pantalla
    expect(screen.getByText('ACCESO')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12345@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('2. Muestra un mensaje de error si el servidor rechaza las credenciales', async () => {
    // Simulamos la respuesta del backend: 
    // Primera llamada (CSRF) -> Falla intencionalmente para disparar el catch
    fetch.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Escribimos en los inputs
    const inputCorreo = screen.getByPlaceholderText('12345@gmail.com');
    const inputContrasena = screen.getByPlaceholderText('••••••••');
    
    fireEvent.change(inputCorreo, { target: { value: 'hacker@correo.com' } });
    fireEvent.change(inputContrasena, { target: { value: 'claveFalsa123' } });

    // Hacemos clic en el botón
    const btnLogin = screen.getByText('INICIAR SESIÓN');
    fireEvent.click(btnLogin);

    // Esperamos a que el componente actualice el estado de error y lo muestre
    const mensajeError = await screen.findByText('Credenciales inválidas');
    expect(mensajeError).toBeInTheDocument();
  });
});