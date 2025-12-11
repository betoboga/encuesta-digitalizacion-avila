import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useResponses } from '../features/admin/useResponses';
import { avilaLocations } from '../data/avila-locations';
import { Select } from '../components/ui/Select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {  Map, Users, Cpu, FileText } from 'lucide-react';

const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#db2777', '#ea580c'];

export default function LandingPage() {
  const { responses, loading } = useResponses();
  const [filterComarca, setFilterComarca] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // --- Data Transformation & Filtering ---
  const filteredData = useMemo(() => {
    return responses.filter(r => {
      const matchComarca = filterComarca ? r.location.comarca === filterComarca : true;
      const matchSector = filterSector ? r.answers.sector === filterSector : true;
      return matchComarca && matchSector;
    });
  }, [responses, filterComarca, filterSector]);

  // KPIs
  const totalResponses = filteredData.length;
  const uniqueMunicipios = new Set(filteredData.map(r => r.location.municipio)).size;
  
  const techUsers = filteredData.filter(r => {
      const iaTechs = r.answers['tecnologias_ia'] as string[];
      return Array.isArray(iaTechs) && iaTechs.length > 0 && !iaTechs.includes('no_uso');
  });
  const percentTech = totalResponses ? Math.round((techUsers.length / totalResponses) * 100) : 0;

  const avgDigitalScore = useMemo(() => {
    if (!totalResponses) return 0;
    const sum = filteredData.reduce((acc, r) => {
        // Map string values to numbers if they differ
        const val = r.answers['competencia_digital'];
        // Assuming survey stores "muy_bajo"..."muy_alto", we map to 1-5 for avg
        const map: Record<string, number> = { 
            "muy_bajo": 1, "bajo": 2, "medio": 3, "alto": 4, "muy_alto": 5 
        };
        return acc + (typeof val === 'string' ? (map[val] || 0) : 0);
    }, 0);
    return (sum / totalResponses).toFixed(1);
  }, [filteredData, totalResponses]);

  // Charts Data Helpers
  // getChartData removed as it was unused

  const iaUsageData = useMemo(() => {
     const counts = { Si: 0, No: 0 };
     filteredData.forEach(r => {
         // val was unused, just checking structure or we could check explicit fields
         // Actually "tecnologias_ia" is multiselect. Let's use "uses IA vs doesn't".
         const techs = r.answers['tecnologias_ia'] as string[];
         if (Array.isArray(techs) && techs.length > 0 && !techs.includes('no_uso')) {
             counts.Si++;
         } else {
             counts.No++;
         }
     });
     return [
         { name: 'Usa IA', value: counts.Si },
         { name: 'No usa IA', value: counts.No }
     ];
  }, [filteredData]);

  const barriersData = useMemo(() => {
      const counts: Record<string, number> = {};
      filteredData.forEach(r => {
          const barriers = r.answers['barreras_ia'] as string[];
          if (Array.isArray(barriers)) {
              barriers.forEach(b => {
                   // Shorten labels for chart
                   const label = b === 'falta_internet' ? 'Internet' : b === 'coste' ? 'Coste' : b;
                   counts[label] = (counts[label] || 0) + 1;
              });
          }
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // Sort desc
        .slice(0, 5) // Top 5
        .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const getComarcaName = (id: string) => avilaLocations.find(c => c.id === id)?.name || id;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
         <p className="mt-4 text-gray-500">Cargando datos en tiempo real...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Digitalización e IA en el Sector Primario de Ávila
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Ayúdanos a comprender el presente y diseñar el futuro de la agricultura y ganadería en nuestra provincia. 
            Tu participación es anónima y vital.
          </p>
          <div className="pt-4">
             <Link 
              to="/survey" 
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold py-4 px-8 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
            >
              Responder encuesta
              {/* Simple arrow icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 space-y-12">
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-end">
             <div className="flex-1 w-full">
                <Select 
                  label="Filtrar por Comarca"
                  placeholder="Todas las comarcas"
                  options={avilaLocations.map(c => ({ value: c.id, label: c.name }))}
                  value={filterComarca}
                  onChange={(e) => setFilterComarca(e.target.value)}
                />
             </div>
             <div className="flex-1 w-full">
                <Select 
                   label="Filtrar por Sector"
                   placeholder="Todos los sectores"
                   options={[
                       {value: 'agricultura', label: 'Agricultura'}, 
                       {value: 'ganaderia', label: 'Ganadería'},
                       {value: 'mixto', label: 'Mixto'}
                   ]}
                   value={filterSector}
                   onChange={(e) => setFilterSector(e.target.value)}
                />
             </div>
        </div>

        {/* Empty State */}
        {responses.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl shadow-sm">
               <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
               <h3 className="text-xl font-bold text-gray-700">Aún no hay datos suficientes</h3>
               <p className="text-gray-500">Sé el primero en participar para activar el panel de resultados.</p>
           </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    icon={<FileText className="text-blue-600" size={24} />}
                    label="Total Encuestas"
                    value={totalResponses}
                    color="bg-blue-50"
                />
                <KpiCard 
                    icon={<Map className="text-purple-600" size={24} />}
                    label="Municipios"
                    value={uniqueMunicipios}
                    color="bg-purple-50"
                />
                <KpiCard 
                    icon={<Cpu className="text-green-600" size={24} />}
                    label="Uso de IA"
                    value={`${percentTech}%`}
                    subtext="de las explotaciones"
                    color="bg-green-50"
                />
                <KpiCard 
                    icon={<Users className="text-orange-600" size={24} />}
                    label="Competencia Digital"
                    value={`${avgDigitalScore}/5`}
                    subtext="Promedio declarado"
                    color="bg-orange-50"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Adopción de Inteligencia Artificial">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={iaUsageData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {iaUsageData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Top 5 Barreras para adoptar IA">
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barriersData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} name="Respuestas" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Recent Responses Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Últimas Participaciones</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Comarca</th>
                                <th className="p-4">Sector</th>
                                <th className="p-4">Tamaño</th>
                                <th className="p-4">IA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.slice(0, 5).map((r) => {
                                const techs = r.answers['tecnologias_ia'] as string[];
                                const usesIA = Array.isArray(techs) && techs.length > 0 && !techs.includes('no_uso');
                                
                                return (
                                <tr key={r.id}>
                                    <td className="p-4">{r.timestamp?.toDate().toLocaleDateString()}</td>
                                    <td className="p-4">{getComarcaName(r.location.comarca)}</td>
                                    <td className="p-4 capitalize">{r.answers['sector'] as string}</td>
                                    <td className="p-4 capitalize">{(r.answers['superficie'] as string || '').replace('mayor_', '> ').replace('menor_', '< ')}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${usesIA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {usesIA ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
          <p>© 2024 Proyecto de Investigación - Diputación de Ávila</p>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function KpiCard({ icon, label, value, subtext, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                <h3 className="text-gray-500 font-medium">{label}</h3>
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </div>
    )
}

function ChartCard({ title, children }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            {children}
        </div>
    )
}
