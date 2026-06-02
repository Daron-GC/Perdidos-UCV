type TypeEstado0 = "Sin seleccionar" | "Seleccionado" | "En ruta"
type TypeName0 = "Plaza Techada" | "Trasbordo" | "Ing. de Petroleo" | "FACES" | "EEPA" | "Tu úbicación" | "Facultad de Arquitectura y Urbanismo"
export interface Location0 {
    location: TypeEstado0;
    name: TypeName0;
    CoordenadasXyY: number[];
    min_Recorrido?: number;
}

//VARIABLES

let Location01: Location0 = {
    location: "Seleccionado",
    name: "Plaza Techada",
    CoordenadasXyY: [1000, 239],
    min_Recorrido: 20,
    }

let Location02: Location0 = {
    location: "Sin seleccionar",
    name: "Trasbordo",
    CoordenadasXyY: [-2000, 400],
    min_Recorrido: 45,
    }

let Location03: Location0 = {
    location: "Seleccionado",
    name: "Tu úbicación",
    CoordenadasXyY: [500, 20],
    min_Recorrido: 0,   
    }

const Ubicaciones0: Location0[] = [Location01, Location02, Location03]