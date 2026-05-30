import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Mapas } from '../pages/mapas'; // Ajusta la ruta si es con mayúscula
import '@testing-library/jest-dom';

global.fetch = vi.fn();

describe('Pruebas del Frontend - Renderizado Dinámico (Mapas)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Debe solicitar la lista de mapas al backend y dibujarlos en la pantalla', async () => {
    
    const mapasSimulados = [
      { 
        id_mapa: 1, 
        nombre: 'El Río de Sangre', 
        descripcion: 'Primer nivel del Mictlán. Cuidado con las corrientes.', 
        imagen_url: 'http://img.com/mapa1.png' 
      },
      { 
        id_mapa: 2, 
        nombre: 'Pasadizo de Obsidiana', 
        descripcion: 'Vientos cortantes que destrozan todo a su paso.', 
        imagen_url: 'http://img.com/mapa2.png' 
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mapasSimulados
    });

    render(
      <MemoryRouter>
        <Mapas />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verificamos nombres de los niveles
      expect(screen.getByText('El Río de Sangre')).toBeInTheDocument();
      expect(screen.getByText('Pasadizo de Obsidiana')).toBeInTheDocument();
      
      // Verificamos que las descripciones carguen
      expect(screen.getByText(/Primer nivel del Mictlán/i)).toBeInTheDocument();
      expect(screen.getByText(/Vientos cortantes/i)).toBeInTheDocument();
    });

    // Verificamos la ruta de la API
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain('/mapas');
  });
});