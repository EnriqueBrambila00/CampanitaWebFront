import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { Registro } from './pages/registro.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { Personajes } from './pages/personajes.jsx';
import { Galeria } from './pages/galeria.jsx';
import { Mapas } from './pages/mapas.jsx';
import { Login } from './pages/login.jsx';
import fondoPiedra from './assets/piedra-musgo.jpg';
import { Dashboard } from './pages/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <div 
        className="flex flex-col min-h-screen text-gray-200"
        style={{
          backgroundImage: `linear-gradient(rgba(27, 57, 106, 0.85), rgba(27, 57, 106, 0.85)), url(${fondoPiedra})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Navbar />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/personajes" element={<Personajes />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/mapas" element={<Mapas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={
              <div className="text-center mt-20">
                <h2 className="text-[#FFD51A] text-4xl font-bold tracking-widest">404</h2>
                <p className="text-gray-300 mt-4 text-xl">Este sendero arqueológico no existe.</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;