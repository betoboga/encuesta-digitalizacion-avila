import { useState } from 'react';
import { useResponses } from '../features/admin/useResponses';
import { avilaLocations } from '../data/avila-locations';
import { Download, Filter, Map } from 'lucide-react';
import { Select } from '../components/ui/Select';

export default function AdminDashboard() {
  const { responses, loading, error } = useResponses();
  const [filterComarca, setFilterComarca] = useState('');

  // Filtering
  const filteredResponses = filterComarca 
    ? responses.filter(r => r.location.comarca === filterComarca)
    : responses;

  // KPIs
  const totalResponses = filteredResponses.length;
  const uniqueMunicipios = new Set(filteredResponses.map(r => r.location.municipio)).size;
  
  // Helper to get names
  const getComarcaName = (id: string) => avilaLocations.find(c => c.id === id)?.name || id;
  const getMunicipioName = (comarcaId: string, munId: string) => {
    const comarca = avilaLocations.find(c => c.id === comarcaId);
    return comarca?.municipios.find(m => m.id === munId)?.name || munId;
  };

  const handleExport = () => {
    if (filteredResponses.length === 0) return;

    const headers = ['ID', 'Fecha', 'Comarca', 'Municipio', 'Edad', 'Sector Digitalización', 'Barreras'];
    const csvContent = [
      headers.join(','),
      ...filteredResponses.map(r => [
        r.id,
        r.timestamp?.toDate().toLocaleDateString() || '',
        getComarcaName(r.location.comarca),
        getMunicipioName(r.location.comarca, r.location.municipio),
        r.answers['edad'] || '',
        r.answers['nivel_digital'] || '',
        `"${(r.answers['barreras'] as string || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `encuestas_avila_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resultados de Encuestas</h1>
          <p className="text-gray-500">Visualización de datos en tiempo real</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Filter size={20} />
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Respuestas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalResponses}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Map size={20} />
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Municipios Alcanzados</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{uniqueMunicipios}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex-1">
             <label className="text-sm font-medium text-gray-700 block mb-1">Filtrar por Comarca</label>
             <Select 
               options={avilaLocations.map(c => ({ value: c.id, label: c.name }))}
               value={filterComarca}
               onChange={(e) => setFilterComarca(e.target.value)}
               placeholder="Todas las comarcas"
               className="text-sm"
             />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Municipio</th>
                <th className="p-4">Comarca</th>
                <th className="p-4">Edad</th>
                <th className="p-4 text-center">Nivel Digital</th>
                <th className="p-4">Sector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No hay respuestas registradas aún.
                  </td>
                </tr>
              ) : (
                filteredResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-4">{r.timestamp?.toDate().toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {getMunicipioName(r.location.comarca, r.location.municipio)}
                    </td>
                    <td className="p-4">{getComarcaName(r.location.comarca)}</td>
                    <td className="p-4">{r.answers['edad']}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-bold">
                        {r.answers['nivel_digital']}/5
                      </span>
                    </td>
                    <td className="p-4 capitalize">{r.answers['sector']}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
