import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Galeria } from '../pages/galeria'; // Ajusta la ruta si es con mayúscula
import '@testing-library/jest-dom';

global.fetch = vi.fn();

describe('Pruebas del Frontend - Renderizado Dinámico (Galería)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe solicitar las imágenes al backend y dibujarlas en la pantalla', async () => {
    
    // ATENCIÓN: Aquí usamos 'titulo' en lugar de 'nombre' como dicta tu modelo de Prisma
    const galeriaSimulada = [
      { 
        id_imagen: 1, 
        titulo: 'Pirámide Principal La Campana', 
        descripcion: 'Renderizado arquitectónico en Unreal Engine 5.', 
        imagen_url: 'http://img.com/galeria1.png' 
      },
      { 
        id_imagen: 2, 
        titulo: 'Tumba de Tiro Antigua', 
        descripcion: 'Arte conceptual del inframundo.', 
        imagen_url: 'http://img.com/galeria2.png' 
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => galeriaSimulada
    });

    render(
      <MemoryRouter>
        <Galeria />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verificamos títulos de las imágenes
      expect(screen.getByText('Pirámide Principal La Campana')).toBeInTheDocument();
      expect(screen.getByText('Tumba de Tiro Antigua')).toBeInTheDocument();
      
      // Verificamos descripciones
      expect(screen.getByText(/Renderizado arquitectónico en Unreal Engine 5/i)).toBeInTheDocument();
    });

    // Verificamos la ruta de la API
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain('/galeria');
  });
});