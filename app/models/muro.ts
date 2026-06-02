

type tipo_de_comentario ="normal"|"destacado "
 type estado_de_la_ubicacion = "abierto"|"cerrado"
//info más específica en este interface 
 export interface reacciones{
        // coloque los likes dentro de reacciones porque puede ser una mausqueherraminta misteriosa que posiblemente usemos mas tarde 
        likes:number}
 export interface comentario{
    id:number
    comentario: string
    hora_y_fecha_de_publicacion:string
    tipodecomentario: tipo_de_comentario
    reacciones: reacciones
    
 }

  export interface ubicacion_info {
    CoordenadasXyY: number[]
    nombre_de_la_ubicacion:string
    calificacion: number
    horario:string[]
    estado:estado_de_la_ubicacion
    comentario:comentario[]}