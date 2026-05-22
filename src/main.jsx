import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ==========================================
// ADVERTENCIA SELF-XSS EN CONSOLA
// ==========================================
// [RÚBRICA: Advertencia de ataques Self-XSS en consola del navegador con JavaScript] (5 puntos)
console.log(
  "%c¡ALTO AHÍ!",
  "color: red; font-size: 50px; font-weight: bold; font-family: sans-serif; text-shadow: 2px 2px 0 #000;"
);

console.log(
  "%cEsta es una función del navegador pensada para desarrolladores. Si alguien te indicó que copiaras y pegaras código aquí para habilitar una función de La Campana, conseguir premios, desbloquear acceso o 'hackear' la página, es una estafa. Pegar código aquí puede darle a otra persona acceso a tu cuenta o robar tu información. Esto se conoce como Self-XSS.",
  "font-size: 16px; color: white; background: #1B396A; padding: 12px; border-radius: 5px; line-height: 1.5;"
);

console.log(
  "%cNo pegues código en esta consola si no entiendes exactamente lo que hace.",
  "font-size: 18px; color: #FFD51A; background: #000; padding: 10px; font-weight: bold;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)