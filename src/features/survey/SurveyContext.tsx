import { createContext, useContext, useState, type ReactNode } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface SurveyAnswers {
  [key: string]: string | number | boolean | string[];
}

interface Location {
  comarca: string;
  municipio: string;
}

interface SurveyContextType {
  location: Location;
  setLocation: (loc: Location) => void;
  answers: SurveyAnswers;
  setAnswer: (key: string, value: string | number | boolean | string[]) => void;
  submitSurvey: () => Promise<void>;
  isSubmitting: boolean;
  isCompleted: boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>({ comarca: '', municipio: '' });
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const setLocation = (loc: Location) => {
    setLocationState(loc);
  };

  const setAnswer = (key: string, value: string | number | boolean | string[]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const submitSurvey = async () => {
    if (!location.comarca || !location.municipio) {
      throw new Error("Localización incompleta");
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'responses'), {
        location,
        answers,
        timestamp: serverTimestamp(),
        surveyId: 'v1_MVP' // Hardcoded version for now
      });
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting survey:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SurveyContext.Provider value={{
      location,
      setLocation,
      answers,
      setAnswer,
      submitSurvey,
      isSubmitting,
      isCompleted
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
