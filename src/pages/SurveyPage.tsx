import { useState } from 'react';
import { SurveyProvider, useSurvey } from '../features/survey/SurveyContext';
import { LocationSelector } from '../features/survey/LocationSelector';
import { SurveyEngine } from '../features/survey/SurveyEngine';
import { surveyConfig } from '../data/survey-config';
import { CheckCircle } from 'lucide-react';
import { Alert } from '../components/ui/Alert';

function SurveyContent() {
  const { submitSurvey, isSubmitting, isCompleted, location } = useSurvey();
  const [error, setError] = useState('');

  const canSubmit = location.comarca && location.municipio;

  const handleSubmit = async () => {
    try {
      setError('');
      await submitSurvey();
    } catch (e) {
      setError('Hubo un error al enviar la encuesta. Por favor inténtalo de nuevo.');
      console.error(e);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-green-50 rounded-full p-6 inline-block mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Gracias por participar!</h2>
        <p className="text-gray-600 text-lg">
          Sus respuestas han sido registradas correctamente y ayudarán a mejorar el sector primario de Ávila.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Encuesta de Digitalización</h1>
        <p className="text-gray-500 mt-2">Sector Primario de la Provincia de Ávila</p>
      </div>

      {error && <Alert message={error} />}

      <LocationSelector />
      
      <SurveyEngine config={surveyConfig} />

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full bg-green-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? 'Enviando respuestas...' : 'Enviar Encuesta'}
        </button>
        {!canSubmit && (
          <p className="text-center text-sm text-amber-600 mt-2">
            * Por favor selecciona comarca y municipio para continuar
          </p>
        )}
      </div>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <SurveyProvider>
      <SurveyContent />
    </SurveyProvider>
  );
}
