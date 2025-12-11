import { useSurvey } from './SurveyContext';
import { avilaLocations } from '../../data/avila-locations';
import { Select } from '../../components/ui/Select';

export function LocationSelector() {
  const { location, setLocation } = useSurvey();

  const handleComarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation({ comarca: e.target.value, municipio: '' });
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation({ ...location, municipio: e.target.value });
  };

  const comarcaOptions = avilaLocations.map(c => ({ value: c.id, label: c.name }));
  
  const selectedComarcaData = avilaLocations.find(c => c.id === location.comarca);
  const municipioOptions = selectedComarcaData 
    ? selectedComarcaData.municipios.map(m => ({ value: m.id, label: m.name }))
    : [];

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Localización de la Explotación</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          label="Comarca Agraria"
          placeholder="Selecciona Comarca..."
          options={comarcaOptions}
          value={location.comarca}
          onChange={handleComarcaChange}
        />
        
        <Select 
          label="Municipio"
          placeholder="Selecciona Municipio..."
          options={municipioOptions}
          value={location.municipio}
          onChange={handleMunicipioChange}
          disabled={!location.comarca}
        />
      </div>
    </div>
  );
}
