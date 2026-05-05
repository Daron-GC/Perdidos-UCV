# Perdidos-UCV
...

# Problema

Al ingresar por primera vez a la Universidad Central de Venezuela, muchos estudiantes se enfrentan a un entorno amplio, desconocido y poco intuitivo. La falta de orientación dentro del campus dificulta ubicar espacios importantes como aulas, servicios o puntos de interés.

Además, existe una barrera social: al llegar a un ambiente nuevo, para muchos resulta complicado acercarse a otras personas para pedir ayuda. Esto puede generar experiencias negativas, como recibir indicaciones incorrectas o tener que preguntar varias veces, provocando incomodidad y pérdida de tiempo.



# Público objetivo y justificación

Perdidos-UCV está dirigido principalmente a estudiantes de nuevo ingreso de la Universidad Central de Venezuela. También incluye, en menor medida, a participantes de cursos propedéuticos, pasantes y personas que asisten temporalmente al campus.

Esto se debe a que la universidad es un espacio amplio, con múltiples facultades, servicios y zonas distribuidas en distintas áreas, lo que puede resultar confuso para quienes no están familiarizados con el entorno.

Además, no solo existe la necesidad de ubicarse académicamente, sino también de resolver aspectos cotidianos, como encontrar opciones económicas de comida o servicios accesibles como fotocopiadoras. Por ello, este público se beneficia directamente de una herramienta que facilite la orientación y proporcione información útil basada en la experiencia de otros estudiantes.

# Funciones core de la aplicación

Entre las funciones indispensables de la app, Perdidos UCV tiene: un sistema de Gps en tiempo real, Un muro de reseñas en el cual se pueden compartir opiniones de los lugares icónicos de la UCV, y todo esto buscando conservar el anonimato, al no necesitar de un login para acceder a sus servicios.


# Que no incluye

+ Seguimiento de terceros en tiempo real:
No se implementará el seguimiento de otros usuarios en tiempo real ni funcionalidades tipo red social en vivo.

+ Gestión académica: No se incluirán funcionalidades relacionadas con notas, inscripciones o trámites administrativos de la universidad.

+ Sistema de autenticación y registro: La aplicación será de acceso libre, por lo que no se desarrollarán módulos de inicio de sesión, perfiles de usuario ni almacenamiento de datos personales.

+ Plataforma de pagos: No se integrarán sistemas de pago ni transacciones dentro de la aplicación.





# Valor para la comunidad

Facilitación de la adaptación universitaria: La aplicación ayuda a los estudiantes de nuevo ingreso de la Universidad Central de Venezuela a ubicarse dentro del campus, reduciendo la desorientación y la dependencia de terceros.

Acceso a información útil: Permite identificar lugares relevantes dentro de la universidad, como espacios de estudio, comida o servicios, basándose en experiencias reales de otros estudiantes.

Fomento de la interacción indirecta: A través de las reseñas, los usuarios pueden compartir información útil sin necesidad de interacción directa, facilitando la integración de personas más reservadas en el entorno universitario.





# Stack tecnológico

El desarrollo de Perdidos-UCV se basa en un stack tecnológico enfocado en la simplicidad y funcionalidad.

+ Frontend: Se emplean TypeScript, HTML y CSS para construir una interfaz interactiva.

+ Mapas: Se utiliza la librería Leaflet para la visualización del mapa y la gestión de marcadores dentro del campus.

+ Almacenamiento: Se implementa LocalStorage para guardar y recuperar reseñas de forma local, sin necesidad de un backend en esta etapa.



