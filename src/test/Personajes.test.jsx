import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Personajes } from '../pages/personajes'; // <-- Ajusta la ruta si tu archivo se llama distinto
import '@testing-library/jest-dom';

// Interceptamos la función fetch nativa del navegador
global.fetch = vi.fn();

describe('Pruebas del Frontend - Renderizado Dinámico', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe solicitar la lista de personajes al backend y dibujarlos en la pantalla', async () => {
    
    // 1. EL ENGAÑO (Mock): 
    // Cuando el componente Personajes haga su fetch('/personajes'), le responderemos 
    // con esta lista falsa de inmediato, sin tocar la base de datos de Aiven.
    const personajesSimulados = [
      { 
        id_personaje: 1, 
        nombre: 'Guerrero Águila', 
        descripcion: 'Protector de las ruinas de La Campana', 
        imagen_url: 'http://img.com/aguila.png' 
      },
      { 
        id_personaje: 2, 
        nombre: 'Xoloitzcuintle', 
        descripcion: 'Guía de las almas en el Mictlán', 
        imagen_url: 'http://img.com/xolo.png' 
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => personajesSimulados
    });

    // 2. RENDERIZADO: Montamos la página
    render(
      <MemoryRouter>
        <Personajes />
      </MemoryRouter>
    );

    // 3. VERIFICACIÓN: Esperamos a que React procese los datos y revise si el texto 
    // de nuestro Mock apareció en el HTML de la página.
    await waitFor(() => {
      // Verificamos que los nombres de los personajes se renderizaron
      expect(screen.getByText('Guerrero Águila')).toBeInTheDocument();
      expect(screen.getByText('Xoloitzcuintle')).toBeInTheDocument();
      
      // Verificamos que las descripciones también están ahí
      expect(screen.getByText(/Protector de las ruinas de La Campana/i)).toBeInTheDocument();
      expect(screen.getByText(/Guía de las almas/i)).toBeInTheDocument();
    });

    // 4. Asegurarnos de que el frontend sí le llamó a la ruta correcta
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain('/personajes');
  });
});