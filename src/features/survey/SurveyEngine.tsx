import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useSurvey } from './SurveyContext';
import { type Section, type Question } from '../../data/survey-config';
import clsx from 'clsx';

function QuestionRenderer({ question }: { question: Question }) {
  const { answers, setAnswer } = useSurvey();
  const value = answers[question.id] || '';

  const handleChange = (val: string | number | string[]) => {
    setAnswer(question.id, val);
  };

  if (question.type === 'select' && question.options) {
    return (
      <Select
        label={question.label}
        options={question.options}
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        required={question.required}
      />
    );
  }

  if (question.type === 'radio' && question.options) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => handleChange(opt.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'multiselect' && question.options) {
    const selectedValues = Array.isArray(value) ? value : [];
    
    const handleCheck = (checkedValue: string) => {
      if (selectedValues.includes(checkedValue)) {
        handleChange(selectedValues.filter(v => v !== checkedValue));
      } else {
        handleChange([...selectedValues, checkedValue]);
      }
    };

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value={opt.value}
                checked={selectedValues.includes(opt.value)}
                onChange={() => handleCheck(opt.value)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
              />
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'scale') {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleChange(num)}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors border",
                value === num 
                  ? "bg-green-600 text-white border-green-600" 
                  : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
              )}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1 max-w-[240px]">
          <span>Nada</span>
          <span>Mucho</span>
        </div>
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{question.label}</label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 min-h-[100px]"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={question.placeholder}
          required={question.required}
        />
      </div>
    );
  }

  return (
    <Input
      label={question.label}
      value={value as string}
      onChange={(e) => handleChange(e.target.value)}
      required={question.required}
      placeholder={question.placeholder}
    />
  );
}

export function SurveyEngine({ config }: { config: Section[] }) {
  return (
    <div className="space-y-8">
      {config.map((section) => (
        <div key={section.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">{section.title}</h3>
          <div className="space-y-6">
            {section.questions.map((q) => (
              <QuestionRenderer key={q.id} question={q} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
