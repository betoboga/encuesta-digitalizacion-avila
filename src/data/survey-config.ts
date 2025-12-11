export type QuestionType =
  | "text"
  | "select"
  | "scale"
  | "textarea"
  | "multiselect"
  | "radio";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export const surveyConfig: Section[] = [
  {
    id: "perfil",
    title: "Bloque 1 — Perfil del agricultor/ganadero",
    questions: [
      {
        id: "edad_rango",
        type: "select",
        label: "Edad",
        required: true,
        options: [
          { value: "menor_35", label: "< 35 años" },
          { value: "35_54", label: "35–54 años" },
          { value: "55_64", label: "55–64 años" },
          { value: "mayor_65", label: "≥ 65 años" },
        ],
      },
      {
        id: "formacion",
        type: "select",
        label: "Nivel de formación",
        required: true,
        options: [
          { value: "primaria", label: "Primaria" },
          { value: "secundaria", label: "Secundaria" },
          { value: "fp_agraria", label: "FP Agraria" },
          { value: "universitaria", label: "Universitaria" },
          { value: "otra", label: "Otra" },
        ],
      },
      {
        id: "tipo_explotacion",
        type: "select",
        label: "Tipo de explotación",
        required: true,
        options: [
          { value: "agricola", label: "Agrícola" },
          { value: "ganadera", label: "Ganadera" },
          { value: "mixta", label: "Mixta" },
        ],
      },
      {
        id: "superficie",
        type: "select",
        label: "Superficie o tamaño de la explotación",
        required: true,
        options: [
          { value: "menor_10", label: "< 10 ha" },
          { value: "10_50", label: "10–50 ha" },
          { value: "50_100", label: "50–100 ha" },
          { value: "mayor_100", label: "> 100 ha" },
        ],
      },
      {
        id: "orientacion_principal",
        type: "text",
        label: "Orientación principal",
        placeholder: "Ej: Cereal, vacuno de leche, viñedo...",
        required: true,
      },
    ],
  },
  {
    id: "digitalizacion",
    title: "Bloque 2 — Nivel de digitalización",
    questions: [
      {
        id: "tipo_internet",
        type: "select",
        label: "Conexión a Internet estable",
        required: true,
        options: [
          { value: "fibra", label: "Fibra" },
          { value: "4g_5g", label: "4G/5G" },
          { value: "adsl", label: "ADSL" },
          { value: "no_limitada", label: "No tengo / Limitada" },
        ],
      },
      {
        id: "herramientas_digitales",
        type: "multiselect",
        label:
          "Herramientas digitales usadas (Seleccione todas las que apliquen)",
        options: [
          { value: "apps_cuaderno", label: "Apps cuaderno de campo" },
          { value: "software_gestion", label: "Software de gestión" },
          { value: "riego_auto", label: "Riego automatizado" },
          { value: "gps", label: "GPS en maquinaria" },
          { value: "drones", label: "Drones" },
          { value: "sensores", label: "Sensores en suelo/cultivo" },
          { value: "plataformas_precios", label: "Plataformas de precios" },
          { value: "ninguna", label: "Ninguna" },
        ],
      },
      {
        id: "frecuencia_uso",
        type: "select",
        label: "Frecuencia de uso de herramientas digitales",
        required: true,
        options: [
          { value: "diario", label: "Diariamente" },
          { value: "semanal", label: "Semanalmente" },
          { value: "ocasional", label: "Ocasionalmente" },
          { value: "nunca", label: "Nunca" },
        ],
      },
      {
        id: "competencia_digital",
        type: "select", // Changed from scale to select to match user provided options text
        label: "Nivel de competencia digital",
        required: true,
        options: [
          { value: "muy_bajo", label: "Muy bajo" },
          { value: "bajo", label: "Bajo" },
          { value: "medio", label: "Medio" },
          { value: "alto", label: "Alto" },
          { value: "muy_alto", label: "Muy alto" },
        ],
      },
    ],
  },
  {
    id: "ia_uso",
    title: "Bloque 3 — Uso actual de IA",
    questions: [
      {
        id: "tecnologias_ia",
        type: "multiselect",
        label: "Tecnologías de IA utilizadas",
        options: [
          { value: "riego_ia", label: "Recomendaciones automáticas de riego" },
          { value: "prediccion_cosecha", label: "Predicción de cosecha" },
          { value: "plagas_imagen", label: "Detección de plagas por imagen" },
          {
            value: "opt_alimentacion",
            label: "Optimización alimentación de ganado",
          },
          {
            value: "meteo_avanzada",
            label: "Predicción meteorológica avanzada",
          },
          { value: "analisis_suelos", label: "Análisis de suelos" },
          { value: "chatbots", label: "Chatbots o asistentes técnicos" },
          { value: "no_uso", label: "No utilizo IA" },
        ],
      },
      {
        id: "conocimiento_ia",
        type: "select",
        label: "Nivel de conocimiento sobre IA",
        required: true,
        options: [
          { value: "nulo", label: "Nulo" },
          { value: "basico", label: "Básico" },
          { value: "medio", label: "Medio" },
          { value: "alto", label: "Alto" },
        ],
      },
      {
        id: "ia_mejora_prod",
        type: "radio",
        label: "¿Cree que la IA podría mejorar la productividad?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "mejoras_ia",
        type: "multiselect",
        label: "Mejoras observadas gracias a IA (si aplica)",
        options: [
          { value: "tiempo", label: "Ahorro de tiempo" },
          { value: "agua", label: "Ahorro de agua" },
          { value: "insumos", label: "Reducción de insumos" },
          { value: "planificacion", label: "Mejor planificación" },
          { value: "produccion", label: "Mayor producción" },
          { value: "riesgo_plagas", label: "Menor riesgo de plagas" },
          { value: "ninguna", label: "Ninguna" },
        ],
      },
    ],
  },
  {
    id: "barreras",
    title: "Bloque 4 — Barreras",
    questions: [
      {
        id: "barreras_ia",
        type: "multiselect",
        label: "Barreras para adoptar IA",
        options: [
          { value: "falta_internet", label: "Falta de Internet" },
          { value: "coste", label: "Coste elevado" },
          { value: "formacion", label: "Falta de formación" },
          { value: "tiempo", label: "Falta de tiempo" },
          { value: "desconfianza", label: "Desconfianza" },
          { value: "falta_jovenes", label: "Falta de personal joven" },
          { value: "utilidad", label: "No veo utilidad" },
          { value: "incompatible", label: "Maquinaria incompatible" },
          { value: "desconocimiento", label: "No conozco soluciones" },
        ],
      },
      {
        id: "adoptaria_con_ayudas",
        type: "radio",
        label: "¿Adoptaría IA con formación o ayudas?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
          { value: "depende", label: "Depende" },
        ],
      },
    ],
  },
  {
    id: "productividad",
    title: "Bloque 5 — Productividad y percepción",
    questions: [
      {
        id: "evolucion_prod",
        type: "select",
        label: "Evolución de productividad en 5 años",
        required: true,
        options: [
          { value: "aumentado", label: "Aumentado" },
          { value: "mantiene", label: "Se mantiene" },
          { value: "disminuido", label: "Disminuido" },
        ],
      },
      {
        id: "causas_cambio_prod",
        type: "textarea",
        label: "Causas del cambio de productividad",
        placeholder: "Explique brevemente...",
        required: true,
      },
      {
        id: "impacto_ia_potencial",
        type: "select",
        label: "Impacto potencial de la IA",
        required: true,
        options: [
          { value: "muy_positivo", label: "Muy positivo" },
          { value: "positivo", label: "Positivo" },
          { value: "neutro", label: "Neutro" },
          { value: "negativo", label: "Negativo" },
          { value: "muy_negativo", label: "Muy negativo" },
        ],
      },
    ],
  },
  {
    id: "final",
    title: "Bloque 6 — Pregunta abierta final",
    questions: [
      {
        id: "necesidades_ideas",
        type: "textarea",
        label: "Necesidades o ideas para mejorar digitalización e IA en Ávila",
        placeholder: "Sus comentarios...",
      },
    ],
  },
];
