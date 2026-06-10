# 🗺️ Cómo armar un mapa con sitios en tu app Next.js

Guía rápida para que cualquier estudiante pueda copiar el patrón del mapa del campus UCV y armar **su propio mapa** (de su universidad, su barrio, sus cafés favoritos, lo que sea) en una app Next.js + Tailwind.

Stack: **React Leaflet + OpenStreetMap** → 100% gratis, sin API keys, sin tarjeta de crédito.

---

## 1. Lo que vamos a construir

- Un mapa interactivo a pantalla completa.
- Marcadores personalizados con emoji por cada sitio.
- Tarjetas debajo del mapa que al tocar centran el mapa en ese sitio.
- (Opcional) Mostrar **tu ubicación** y **a cuántos minutos caminando estás** de cada sitio.

---

## 2. Lo que necesitas

- Un proyecto Next.js 14+ (App Router) ya creado.
- Tailwind CSS configurado.
- Conexión a internet (los tiles del mapa se cargan desde OpenStreetMap).

---

## 3. Instalar las dependencias

Una sola línea:

```bash
npm install react-leaflet leaflet @types/leaflet
```

- `leaflet` → la librería del mapa.
- `react-leaflet` → wrapper de React para usar Leaflet con componentes.
- `@types/leaflet` → tipos de TypeScript (omite si usas JS puro).

---

## 4. Crear tu archivo de datos

Aquí pones tus sitios. Es lo único que vas a editar cuando quieras agregar lugares nuevos.

📄 **`src/lib/campus/sites.ts`**

```ts
export type Site = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  lat: number;  // latitud
  lng: number;  // longitud
};

// Centro del mapa cuando carga. Cambia esto al centro de TU zona.
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
  // ➕ Agrega los tuyos aquí
];
```

### 🧭 ¿Cómo saco las coordenadas (lat/lng) de un lugar?

1. Abre [Google Maps](https://www.google.com/maps) o [OpenStreetMap](https://www.openstreetmap.org).
2. Click derecho sobre el sitio exacto.
3. Te aparecen dos números: `10.4905, -66.8898` → ese es `lat, lng`.
4. Cópialos al objeto en `SITES`.

---

## 5. Crear el componente del mapa

📄 **`src/components/campus/CampusMap.tsx`**

```tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SITES, MAP_CENTER, type Site } from "@/lib/campus/sites";

// Marcador redondo con emoji (en vez del pin azul aburrido de Leaflet)
function iconFor(site: Site) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:linear-gradient(135deg,#7C3AED,#06B6D4);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;border:2px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.4);
    ">${site.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export default function CampusMap() {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {SITES.map((site) => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={iconFor(site)}>
          <Popup>
            <strong>{site.emoji} {site.name}</strong>
            <p>{site.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

---

## 6. Crear la página que muestra el mapa

⚠️ **Importante:** Leaflet usa `window`, que no existe en el servidor. Hay que cargarlo **solo en el cliente** con `dynamic` y `ssr: false`. Si no, Next.js explota con un error feo.

📄 **`src/app/campus/page.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";

const CampusMap = dynamic(() => import("@/components/campus/CampusMap"), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
});

export default function CampusPage() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <CampusMap />
    </div>
  );
}
```

Listo. Corre `npm run dev` y entra a **http://localhost:3000/campus**.

---

## 7. Agregar tu ubicación + distancia a cada sitio (opcional)

Si quieres mostrar **"estás a 5 min caminando"** de cada sitio:

### a) Función para calcular distancia

Pega esto en `sites.ts`:

```ts
export function haversineMeters(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ~5 km/h caminando
export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 83.3));
}
```

### b) Pedir la ubicación al navegador

Dentro del componente de la página:

```tsx
import { useEffect, useState } from "react";

const [userPos, setUserPos] = useState<[number, number] | null>(null);

useEffect(() => {
  navigator.geolocation.watchPosition(
    (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
    (err) => console.warn(err)
  );
}, []);
```

Después calculas:

```ts
const distancia = userPos ? haversineMeters(userPos, [site.lat, site.lng]) : null;
const minutos = distancia ? walkingMinutes(distancia) : null;
```

Y lo muestras en pantalla 🎉

> ⚠️ La geolocalización **solo funciona en HTTPS o localhost**. En producción asegúrate de tener HTTPS.

---

## 8. Cuando estés listo para producción

- 📦 **Mueve `SITES` al backend** (Supabase, Firebase, una API tuya). Hoy es un array hardcoded. Crea una tabla con las mismas columnas (`id`, `name`, `emoji`, `description`, `lat`, `lng`) y reemplaza el import por un `fetch`.
- 🎨 **Personaliza los colores** del marcador en `iconFor()` cambiando el `linear-gradient`.
- 📂 **Agrega categorías** (deportes, comida, estudio…) para poder filtrar.
- 🛣️ **Ruta caminando real**: para no solo línea recta sino seguir las calles, agrega `leaflet-routing-machine` + servidor OSRM público.

---

## 9. Problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| El mapa aparece en gris | El contenedor no tiene altura | Asegúrate que el padre tenga `height: 100vh` o similar |
| Error `window is not defined` | Leaflet se ejecutó en SSR | Usa `dynamic` con `ssr: false` (paso 6) |
| Los marcadores no aparecen | No importaste `leaflet/dist/leaflet.css` | Agrégalo arriba del componente del mapa |
| No me pide ubicación | No estás en HTTPS ni localhost | Despliega con HTTPS (Vercel ya viene con HTTPS) |

---

## 10. Recursos

- [Docs de React Leaflet](https://react-leaflet.js.org/)
- [Docs de Leaflet](https://leafletjs.com/reference.html)
- [OpenStreetMap](https://www.openstreetmap.org) — para sacar coordenadas

¡A construir tu mapa! 🚀
