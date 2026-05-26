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
