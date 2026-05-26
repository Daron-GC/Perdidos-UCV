// tarea_arrays_mvp.ts — Parte B

// PASO 1: Definición de la interfaz adaptada (añadimos 'id' y 'etiquetas')
interface login_perdidos_ucv {
  id: string;
  usuario: string;
  correo: string;
  intentoFallido: boolean;
  etiquetas: string[];    
}

// PASO 2: Array de datos de prueba
const tusDatos: login_perdidos_ucv[] = [
  { id: "1", usuario: "ana_ucv", correo: "ana@ucv.ve", intentoFallido: false, etiquetas: ["estudiante", "activo"] },
  { id: "2", usuario: "pedro_adm", correo: "pedro@ucv.ve", intentoFallido: true, etiquetas: ["admin", "bloqueado"] },
  { id: "3", usuario: "maria_bio", correo: "maria@ucv.ve", intentoFallido: false, etiquetas: ["estudiante", "nuevo"] },
  { id: "4", usuario: "juan_fau", correo: "juan@ucv.ve", intentoFallido: true, etiquetas: ["estudiante", "bloqueado"] },
  { id: "5", usuario: "lucia_ing", correo: "lucia@ucv.ve", intentoFallido: false, etiquetas: ["estudiante", "activo"] },
  { id: "6", usuario: "carlos_dev", correo: "carlos@ucv.ve", intentoFallido: false, etiquetas: ["admin", "activo"] },
];

// PASO 3: Resolución de ejercicios

// B1. filter() — Filtra los intentos fallidos
const fallidos = tusDatos.filter(u => u.intentoFallido === true);
console.log(" Cantidad de intentos fallidos:", fallidos.length);

// B2. map() — Extrae solo los nombres de usuario
const usuarios = tusDatos.map(u => u.usuario);
console.log("Lista de usuarios:", usuarios);

// B3. find() — Busca un elemento por su id
const elemento = tusDatos.find(u => u.id === "3");
console.log(" Usuario encontrado:", elemento?.usuario);

// B4. includes() — Verifica si el usuario tiene el tag 'bloqueado'
const tieneTag = tusDatos[1].etiquetas.includes("bloqueado");
console.log("¿El segundo usuario está bloqueado?:", tieneTag);

// B5. filter() + map() encadenados
// Filtra los que NO han tenido intentos fallidos y extrae sus correos
const correosSeguros = tusDatos
  .filter(u => u.intentoFallido === false)
  .map(u => u.correo);
console.log(" Correos de usuarios sin fallos:", correosSeguros);
