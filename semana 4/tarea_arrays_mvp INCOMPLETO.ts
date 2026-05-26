type Tags = "popular" | "recientes" | "más visitados" | "favoritos"
type TypeName0 = "Plaza Techada" | "Trasbordo" | "Ing. de Petroleo" | "FACES" | "EEPA" | "Tu úbicación" | "Facultad de Arquitectura y Urbanismo"
export interface Location0 {
    ID: number;
    Selección: boolean;
    tag: Tags;
    name: TypeName0;
    CoordenadasXyY: number[];
    min_Recorrido?: number;
}

//VARIABLES

let Location01: Location0 = {
    ID: 1,
    Selección: true,
    tag: "popular",
    name: "Plaza Techada",
    CoordenadasXyY: [1000, 239],
    min_Recorrido: 20,
    }

let Location02: Location0 = {
    ID: 2,
    Selección: false,
    tag: "recientes",
    name: "Trasbordo",
    CoordenadasXyY: [-2000, 400],
    min_Recorrido: 45,
    }

let Location03: Location0 = {
    ID: 3,
    Selección: true,
    tag: "más visitados",
    name: "Tu úbicación",
    CoordenadasXyY: [500, 20],
    min_Recorrido: 0,   
    }

let Location04: Location0 = {
    ID: 4,
    Selección: false,
    tag: "favoritos",
    name: "EEPA",
    CoordenadasXyY: [1500, 300],
    min_Recorrido: 30,   
    }

let Location05: Location0 = {
    ID: 5,
    Selección: false,
    tag: "recientes",
    name: "Facultad de Arquitectura y Urbanismo",
    CoordenadasXyY: [-1000, -500],
    min_Recorrido: 60,   
    }

let Location06: Location0 = {
    ID: 6,
    Selección: true,
    tag: "popular",
    name: "Ing. de Petroleo",
    CoordenadasXyY: [2000, 100],
    min_Recorrido: 15,   
    }



const Ubicaciones0: Location0[] = [Location01, Location02, Location03, Location04, Location05, Location06]



// B1. filter() — filtra por el campo boolean de tu interface
const seleccionados = Ubicaciones0.filter(index => index.Selección === true)
console.log("B1. Seleccionados:", seleccionados.length)

// B2. map() — extrae solo los nombres o títulos
const name = Ubicaciones0.map(index => index.name)
console.log("B2. Nombres:", name)

// B3. find() — busca un elemento por su id
const elemento = Ubicaciones0.find(index => index.ID === 3)
console.log("B3. Encontrado:", elemento)

// B4. includes() — verifica si un tag o valor existe en un elemento
const tieneTag = Ubicaciones0[0].tag.includes("popular") // ejemplo, verifica si el primer elemento tiene un tag específico
console.log("B4. Tiene tag:", tieneTag)

// B5. filter() + map() encadenados
//     Filtra los activos y extrae sus nombres
const nombresActivos = Ubicaciones0
  .filter(index => index.Selección === true)
  .map(index => index.name)
console.log("B5. Nombres activos:", nombresActivos)

// bloque de comentarios
type TypeName0 =| "Plaza Techada"| "Trasbordo"| "Ing. de Petroleo"| "FACES"| "EEPA"| "Tu úbicación" | "Facultad de Arquitectura y Urbanismo"

type tipo_de_comentario = "normal" | "destacado"

// Interfaces
interface reacciones {
  likes: number
}

interface comentario {
  id: number
  comentario: string
  hora_y_fecha_de_publicacion: string
  tipodecomentario: tipo_de_comentario
  reacciones: reacciones
}

interface ubicacion_info {
  coordenadasXyY: number[]
  nombre_de_la_ubicacion: TypeName0
  calificacion: number
  horario: string[]
  esta_abierto: boolean
  comentario: comentario[]
}

// Array de datos
const ubication: ubicacion_info[] = [
  {
    coordenadasXyY: [-34.603722, -58.381592],
    nombre_de_la_ubicacion: "Plaza Techada",
    calificacion: 4.5,
    horario: ["10am - 8pm"],
    esta_abierto: true,
    comentario: [
      {
        id: 1,
        comentario: "Excelente lugar para estudiar y relajarse.",
        hora_y_fecha_de_publicacion: "2024-06-01T14:30:00Z",
        tipodecomentario: "destacado",
        reacciones: {
          likes: 120
        }
      }
    ]
  },

  {
    coordenadasXyY: [-34.609722, -58.381592],
    nombre_de_la_ubicacion: "Trasbordo",
    calificacion: 4.0,
    horario: ["9am - 6pm"],
    esta_abierto: false,
    comentario: [
      {
        id: 2,
        comentario: "Buen lugar para tomar un café y trabajar.",
        hora_y_fecha_de_publicacion: "2024-06-02T10:15:00Z",
        tipodecomentario: "normal",
        reacciones: {
          likes: 80
        }
      }
    ]
  }
]

// B1
const activos = ubication.filter(
  (lugar) => lugar.esta_abierto
)

console.log("B1. Activos:", activos.length)

// B2
const nombres = ubication.map(
  (lugar) => lugar.nombre_de_la_ubicacion
)

console.log("B2. Nombres:", nombres)

// B3
const elemento = ubication.find(
  (lugar) => lugar.nombre_de_la_ubicacion === "FACES"
)

console.log("B3. Encontrado:", elemento)

// B4
const tieneHorario = ubication[0].horario.includes("10am - 8pm")

console.log("B4. Tiene horario:", tieneHorario)

// B5
const nombresActivos = ubication
  .filter((lugar) => lugar.esta_abierto)
  .map((lugar) => lugar.nombre_de_la_ubicacion)

console.log("B5. Nombres activos:", nombresActivos)


