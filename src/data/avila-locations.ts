export interface Municipio {
  id: string;
  name: string;
}

export interface Comarca {
  id: string;
  name: string;
  municipios: Municipio[];
}

export const avilaLocations: Comarca[] = [
  {
    id: "morana",
    name: "La Moraña",
    municipios: [
      { id: "arevalo", name: "Arévalo" },
      { id: "madrigal", name: "Madrigal de las Altas Torres" },
      { id: "fontiveros", name: "Fontiveros" },
      { id: "adraneros", name: "Adanero" },
      // ... more can be added
    ],
  },
  {
    id: "avila",
    name: "Ávila (Valle de Amblés y Sierra de Ávila)",
    municipios: [
      { id: "avila_cap", name: "Ávila (Capital)" },
      { id: "mingorria", name: "Mingorría" },
      { id: "solosancho", name: "Solosancho" },
    ],
  },
  {
    id: "tietar",
    name: "Valle del Tiétar",
    municipios: [
      { id: "arenas", name: "Arenas de San Pedro" },
      { id: "candeleda", name: "Candeleda" },
      { id: "sotillo", name: "Sotillo de la Adrada" },
      { id: "adrada", name: "La Adrada" },
    ],
  },
  {
    id: "alberche",
    name: "Alberche-Pinares",
    municipios: [
      { id: "tiemblo", name: "El Tiemblo" },
      { id: "cebreros", name: "Cebreros" },
      { id: "hoyo", name: "Hoyo de Pinares" },
      { id: "navaluenga", name: "Navaluenga" },
    ],
  },
  {
    id: "gredos",
    name: "Barco-Piedrahíta-Gredos",
    municipios: [
      { id: "barco", name: "El Barco de Ávila" },
      { id: "piedrahita", name: "Piedrahíta" },
      { id: "hoyos_espino", name: "Hoyos del Espino" },
    ],
  },
];
