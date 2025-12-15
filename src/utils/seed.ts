import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { avilaLocations } from "../data/avila-locations";

const SECTORS = ["agricultura", "ganaderia", "mixto"];
const AGES = ["menor_35", "35_54", "55_64", "mayor_65"];
const IA_TECHS = [
  "riego_ia",
  "prediccion_cosecha",
  "plagas_imagen",
  "opt_alimentacion",
  "meteo_avanzada",
  "analisis_suelos",
  "chatbots",
];
const BARRIERS = [
  "falta_internet",
  "coste",
  "formacion", // User asked for 'formacion' to be main
  "tiempo",
  "desconfianza",
  "falta_jovenes",
  "utilidad",
  "incompatible",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function seedDatabase(count: number = 20) {
  const promises = [];

  for (let i = 0; i < count; i++) {
    // 1. Random Location
    const comarca = randomItem(avilaLocations);
    const municipio = randomItem(comarca.municipios);

    // 2. Mock Answers
    const age = randomItem(AGES);
    const sector = randomItem(SECTORS);

    // User Constraint: "Mayoría usa IA"
    // Let's say 80% use IA (si), 20% don't (no).
    const usesIA = Math.random() < 0.8;

    // User Constraint: "Principal barrera es formacion"
    // We'll ensure 'formacion' is in the barriers list for 90% of people.
    const hasFormacionBarrier = Math.random() < 0.9;
    const otherBarriers = randomSubset(BARRIERS, 0, 2);
    const finalBarriers = hasFormacionBarrier
      ? Array.from(new Set(["formacion", ...otherBarriers]))
      : otherBarriers;

    const answers: any = {
      // Perfil
      edad_rango: age,
      formacion: randomItem([
        "primaria",
        "secundaria",
        "fp_agraria",
        "universitaria",
      ]),
      tipo_explotacion: sector,
      superficie: randomItem(["menor_10", "10_50", "50_100", "mayor_100"]),
      orientacion_principal: sector === "ganaderia" ? "Vacuno" : "Cereal",

      // Digitalización
      tipo_internet: randomItem(["fibra", "4g_5g", "adsl", "no_limitada"]),
      herramientas_digitales: randomSubset(
        ["apps_cuaderno", "gps", "drones"],
        1,
        3
      ),
      frecuencia_uso: randomItem(["diario", "semanal", "ocasional"]),
      competencia_digital: randomItem(["medio", "alto", "muy_alto"]), // Skewed higher

      // IA
      tecnologias_ia: usesIA ? randomSubset(IA_TECHS, 1, 3) : ["no_uso"],
      conocimiento_ia: usesIA
        ? randomItem(["basico", "medio", "alto"])
        : "nulo",
      ia_mejora_prod: usesIA ? "si" : "no",
      mejoras_ia: usesIA
        ? randomSubset(["tiempo", "produccion", "planificacion"], 1, 2)
        : ["ninguna"],

      // Barreras
      barreras_ia: finalBarriers,
      adoptaria_con_ayudas: "si",

      // Prod
      evolucion_prod: randomItem(["aumentado", "mantiene"]),
      impacto_ia_potencial: "muy_positivo",
      sector, // Keeping legacy field for dashboard compatibility if needed, though 'tipo_explotacion' is the new one
    };

    promises.push(
      addDoc(collection(db, "responses"), {
        location: {
          comarca: comarca.id,
          municipio: municipio.id,
        },
        answers,
        timestamp: serverTimestamp(),
        surveyId: "v1_MVP_SEED",
      })
    );
  }

  await Promise.all(promises);
  return count;
}
