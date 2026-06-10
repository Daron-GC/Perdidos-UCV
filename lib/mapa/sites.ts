export type Site = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  lat: number;
  lng: number;
};

export const MAP_CENTER: [number, number] = [10.4910, -66.8910];

export const SITES: Site[] = [
  {
    id: "biblioteca",
    name: "Biblioteca Central",
    emoji: "📚",
    description: "El mejor lugar para estudiar.",
    lat: 10.4905,
    lng: -66.8898,
  },
  {
    id: "cafeteria",
    name: "Cafetería",
    emoji: "☕",
    description: "Café barato y empanadas.",
    lat: 10.4912,
    lng: -66.8920,
  },
];