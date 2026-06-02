//INTERFACES PARA la ventana principal            Hecho por Gabriel Rojas
//MOLDE
type TypeEstado0 = "Sin seleccionar" | "Seleccionado" | "En ruta"
type TypeName0 = "Plaza Techada" | "Trasbordo" | "Ing. de Petroleo" | "FACES" | "EEPA" | "Tu úbicación" | "Facultad de Arquitectura y Urbanismo"
interface Location0 {
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

// interfaces para bloque de comentarios    Hecho por Diosman Gallardo
                          
//tipos
type tipo_de_comentario ="normal"|"destacado "
 type estado_de_la_ubicacion = "abierto"|"cerrado"
//info más específica en este interface 
 interface reacciones{
        // coloque los likes dentro de reacciones porque puede ser una mausqueherraminta misteriosa que posiblemente usemos mas tarde 
        likes:number}
 interface comentario{
    id:number
    comentario: string
    hora_y_fecha_de_publicacion:string
    tipodecomentario: tipo_de_comentario
    reacciones: reacciones
    
 }

 interface ubicacion_info {
    CoordenadasXyY: number[]
    nombre_de_la_ubicacion:TypeName0
    calificacion: number
    horario:string[]
    estado:estado_de_la_ubicacion
    comentario:comentario[]
}
 
//VARIABLES

const FAU: ubicacion_info={
    CoordenadasXyY:[ 66.0001,33.00],
    nombre_de_la_ubicacion:"Facultad de Arquitectura y Urbanismo",
    calificacion: 5,
    horario:["10:00 am","10:00pm"],
    estado: "abierto", 
    comentario:[{
        
         id:1,
         comentario:"se murio el decano , que mal F",
         hora_y_fecha_de_publicacion:"20/06/2026 10:00 am",
         tipodecomentario:"normal",
         reacciones:{likes:100} },{   
         id:2,
         comentario:"las mejores empanadas",
         hora_y_fecha_de_publicacion:"20/06/2026 11:00 am",
         tipodecomentario:"destacado ",
         reacciones:{likes:500}},{id:3,
         comentario:"excelente servicio",
         hora_y_fecha_de_publicacion:"20/06/2026 12:00 pm",
         tipodecomentario:"normal",
         reacciones:{likes:200} }]
}
     
//INTERFAZ PARA EL USUARIO, REALIZADO POR YENNY ACOSTA 

//MOLDE

interface login_perdidos_ucv {
  usuario: string
  correo: string
  contraseña: string
  intentoFallido: boolean
}

//VARIABLE


const ejemploLogin: login_perdidos_ucv = {
  usuario: "usuarioxd",
  correo: "usuarioxducv@example.com",
  contraseña: "123458",
  intentoFallido: false,
};