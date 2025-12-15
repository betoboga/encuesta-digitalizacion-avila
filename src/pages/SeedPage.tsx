import { useState } from 'react';
import { seedDatabase } from '../utils/seed';
import { Link } from 'react-router-dom';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setStatus('Generando 20 respuestas...');
    try {
      await seedDatabase(20);
      setStatus('¡Éxito! 20 respuestas creadas. Recarga el Dashboard.');
    } catch (e) {
      console.error(e);
      setStatus('Error al generar datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Generador de Datos</h1>
        <p className="text-gray-600 mb-6">
          Esta herramienta generará 20 encuestas simuladas siguiendo los patrones solicitados (Barrera: Formación, Uso IA: Alto).
        </p>
        
        {status && (
          <div className={`p-4 mb-6 rounded ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generando...' : 'Generar Datos Semilla'}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-100">
           <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
             ← Volver al Dashboard
           </Link>
        </div>
      </div>
    </div>
  );
}
