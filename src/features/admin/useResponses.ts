import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { SurveyAnswers } from "../survey/SurveyContext";

export interface SurveyResponse {
  id: string;
  location: {
    comarca: string;
    municipio: string;
  };
  answers: SurveyAnswers;
  timestamp: Timestamp;
}

export function useResponses() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResponses() {
      try {
        const q = query(
          collection(db, "responses"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data: SurveyResponse[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as SurveyResponse);
        });
        setResponses(data);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setError("Error al cargar las respuestas.");
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, []);

  return { responses, loading, error };
}
