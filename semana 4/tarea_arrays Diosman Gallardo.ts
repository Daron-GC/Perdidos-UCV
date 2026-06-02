// tarea_arrays.ts — Parte A Diosman Gallardo

// Interface base
interface Producto {
  id:         string
  nombre:     string
  precio:     number
  categoria:  string
  disponible: boolean
  tags:       string[]
}


const productos: Producto[] = [
  { id: "p1", nombre: "Café negro",     precio: 2.5,  categoria: "bebidas",  disponible: true,  tags: ["caliente", "popular"]      },
  { id: "p2", nombre: "Jugo de naranja",precio: 3.0,  categoria: "bebidas",  disponible: true,  tags: ["frío", "natural"]          },
  { id: "p3", nombre: "Empanada queso", precio: 1.5,  categoria: "comidas",  disponible: false, tags: ["salado", "popular"]        },
  { id: "p4", nombre: "Agua mineral",   precio: 1.0,  categoria: "bebidas",  disponible: true,  tags: ["frío"]                     },
  { id: "p5", nombre: "Arepa reina",    precio: 4.0,  categoria: "comidas",  disponible: true,  tags: ["salado", "popular", "hot"] },
  { id: "p6", nombre: "Tequeño",        precio: 0.75, categoria: "snacks",   disponible: true,  tags: ["salado", "popular"]        },
  { id: "p7", nombre: "Brownie",        precio: 2.0,  categoria: "snacks",   disponible: false, tags: ["dulce"]                    },
  { id: "p8", nombre: "Smoothie mango", precio: 3.5,  categoria: "bebidas",  disponible: true,  tags: ["frío", "natural", "hot"]   },
]


// ══════════════════════════════════════════════════
// EJERCICIO 1 — filter()
// ══════════════════════════════════════════════════

// 1a. Filtra solo los productos que están disponibles
const disponibles:Producto[]= productos.filter((ra)=> ra.disponible===true)
console.log("1a. Disponibles:", disponibles.length) // debe ser 6

// 1b. Filtra los productos de la categoría "bebidas"
const bebidas: Producto[] = productos.filter((fo)=> fo.categoria==="bebidas")
console.log("1b. Bebidas:", bebidas.map(p => p.nombre))

// 1c. Filtra los productos que cuestan menos de 2 dólares Y están disponibles
const economicos: Producto[] = productos.filter((cha)=> cha.precio<=2)
console.log("1c. Económicos y disponibles:", economicos.map(p => p.nombre))
// resultado esperado: ["Agua mineral", "Tequeño"]


// ══════════════════════════════════════════════════
// EJERCICIO 2 — map()
// ══════════════════════════════════════════════════

// 2a. Crea un array con solo los nombres de todos los productos
const nombres: string[] = productos.map((achu)=> achu.nombre)
console.log("2a. Nombres:", nombres)

// 2b. Crea un array de objetos con solo { id, nombre, precio }
//     (sin categoría, tags ni disponible)
const resumen = productos.map((waza)=> {return{id:waza.id,
    nombre:waza.nombre,
    precio:waza.precio
}})
console.log("2b. Resumen[0]:", resumen[0])
// resultado esperado: { id: "p1", nombre: "Café negro", precio: 2.5 }

// 2c. Crea un array con los precios aumentados un 10%
//     Usa toFixed(2) para redondear a 2 decimales
const preciosNuevos: number[] = productos.map((lol)=> Number((lol.precio * 1.10).toFixed(2)))
console.log("2c. Precios con 10% aumento:", preciosNuevos)
// resultado esperado: [2.75, 3.30, 1.65, 1.10, 4.40, 0.83, 2.20, 3.85]


// ══════════════════════════════════════════════════
// EJERCICIO 3 — find()
// ══════════════════════════════════════════════════

// 3a. Encuentra el producto con id "p5"
const producto = productos.find((papu)=> papu.id==="p5")
console.log("3a. Producto p5:", producto?.nombre) // "Arepa reina"

// 3b. Encuentra el primer producto de la categoría "snacks"
const primerSnack = productos.find((hola)=> hola.categoria==="snacks")
console.log("3b. Primer snack:", primerSnack?.nombre) // "Tequeño"

// 3c. Busca un producto que no existe (id "p99")
//     Imprime un mensaje si no se encuentra
const noExiste = productos.find((fah)=> fah.id==="peRu")
if (noExiste) {
  console.log("3c. Encontrado:", noExiste.nombre)
} else {
  console.log("3c. Producto no encontrado") // debe imprimir esto
}


// ══════════════════════════════════════════════════
// EJERCICIO 4 — includes()
// ══════════════════════════════════════════════════

// 4a. Verifica si el producto p1 tiene el tag "popular"
const tienePopular = productos[0]?.tags.includes("popular")
console.log("4a. p1 tiene tag 'popular':", tienePopular) // true

// 4b. Crea un array con los nombres de los productos que tienen el tag "natural"
//     Pista: usa filter() + includes() juntos
const naturales = productos.filter((ra)=> ra.tags.includes("natural"))
console.log("4b. Productos naturales:", naturales)
// resultado esperado: ["Jugo de naranja", "Smoothie mango"]

// 4c. Un usuario tiene estos productos en su carrito:
const carrito: string[] = ["p2", "p6", "p8"]
// Verifica si el producto "p3" está en el carrito
const estaEnCarrito: boolean = carrito.includes("p3")
console.log("4c. p3 en carrito:", estaEnCarrito) // false


// ══════════════════════════════════════════════════
// EJERCICIO 5 — COMBINADOS (el más importante)
// ══════════════════════════════════════════════════

// 5a. Obtén los nombres de los productos disponibles de la categoría "bebidas"
//     Pista: filter() + map() encadenados
const bebidasDisponibles= productos.filter((wii)=> wii.categoria==="bebidas"&& wii.disponible).map((wii)=> wii.nombre)
console.log("5a. Bebidas disponibles:", bebidasDisponibles)
// resultado esperado: ["Café negro", "Jugo de naranja", "Agua mineral", "Smoothie mango"]

// 5b. Encuentra el producto MÁS CARO que esté disponible
//     Pista: filter() primero, luego find() o reduce()
const masCaro: Producto | undefined =productos.filter((qazo)=> qazo.disponible).reduce<Producto | undefined>((pe, ru ) => !pe||ru.precio > pe.precio? pe :ru , undefined)
console.log("5b. Más caro disponible:", masCaro?.nombre, "$" + masCaro?.precio)
// resultado esperado: "Arepa reina" $4

// 5c. ¿Hay algún producto disponible en la categoría "snacks" con el tag "popular"?
//     Pista: filter() + includes() + algunos().
//     Devuelve boolean
const haySnackPopular: boolean = productos.filter((xD)=> xD.categoria==="snacks"&& xD.disponible).some((xD)=> xD.tags.includes("popular"))
console.log("5c. Snack popular disponible:", haySnackPopular) // true