Contexto del backend — Aplicación de gestión de celulares
Propósito de este archivo: dar contexto a asistentes de IA y desarrolladores que trabajen en este repositorio. Describe el objetivo del backend, el diseño conocido, las reglas de implementación y los puntos que deben verificarse en el código real.

Importante: este documento se basa en el diseño definido para el proyecto. Antes de modificar código, verificar siempre el pom.xml, el código fuente, las migraciones y la configuración existentes. No asumir que una funcionalidad está implementada solo porque figure aquí.

1. ¿De qué se trata el proyecto?
Este backend forma parte de una aplicación móvil para administrar la compra, el diagnóstico, la reparación y la reventa de celulares usados.

La aplicación permite registrar proyectos asociados a celulares, seleccionar fallas por componente, estimar la ganancia y seguir el estado de cada operación. El frontend móvil está desarrollado con React Native, Expo y TypeScript; este repositorio corresponde al backend.

El backend expone una API REST que el frontend consume por HTTP. Se encarga de validar las solicitudes, ejecutar la lógica de negocio, consultar PostgreSQL y devolver respuestas JSON estables.
2. Tecnologías y dependencias
Tecnologías previstas para este backend
- Java: lenguaje principal. Confirmar la versión real en pom.xml y la configuración de Maven.
- Spring Boot: aplicación y configuración del backend.
- Spring Web: controladores y endpoints REST.
- Spring Data JPA / Hibernate: persistencia y acceso a datos cuando corresponda.
- PostgreSQL: base de datos relacional.
- PostgreSQL JDBC Driver: conexión JDBC con PostgreSQL.
- Maven: gestión de dependencias y compilación; comprobar si el repositorio incluye mvnw.
- Jakarta Bean Validation / Spring Boot Validation: validación de entradas, si está incorporada.
No asumir versiones ni afirmar que una dependencia está instalada sin revisar pom.xml. No agregar Lombok, Spring Security, herramientas de migración ni otras dependencias por defecto; primero evaluar si son necesarias y si el proyecto ya las utiliza.
Configuración
- La base de datos PostgreSQL ya existe y la administra el desarrollador mediante pgAdmin 4.
- El nombre usado en el entorno local es phone_business_db, pero se debe confirmar en la configuración local del proyecto.
- No subir credenciales a Git ni incluir contraseñas en este archivo.
- Preferir variables de entorno o configuración externa para credenciales y valores específicos de cada entorno.
- No crear ni borrar bases de datos, ni alterar el esquema, sin una solicitud y autorización explícitas.
3. Arquitectura esperada
Mantener una arquitectura por capas, consistente con la organización ya existente:
1. Controller: define rutas HTTP, recibe parámetros, devuelve DTO y códigos de estado adecuados. No debe contener SQL ni lógica compleja de negocio.
2. Service: coordina el caso de uso, aplica reglas de negocio y reúne los datos necesarios para las respuestas.
3. Repository: accede a PostgreSQL mediante Spring Data JPA, proyecciones o consultas SQL nativas cuando sean apropiadas.
4. DTO: define el contrato JSON que recibe el frontend. No exponer entidades JPA directamente como respuesta pública.
5. Entity: representa las tablas que corresponda mapear en JPA.
Respetar los nombres de paquetes, convenciones y estilo existentes. No reorganizar todo el proyecto si una modificación puntual es suficiente.
4. Esquema conocido de PostgreSQL
El esquema conocido para los proyectos y los diagnósticos consta de tres tablas.
4.1 public.projects
- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
- project_number BIGINT NOT NULL UNIQUE, asignado por la secuencia configurada en la base.
- phone_model VARCHAR(150) NOT NULL
- estimated_profit NUMERIC(14,2)
- status VARCHAR(30) NOT NULL, por defecto PENDING, con restricción para aceptar los estados definidos abajo.
- created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
Estados actualmente definidos:
- PENDING
- IN_REPAIR
- READY_TO_SELL
- FOR_SALE
- SOLD
La tabla projects no tiene una columna diagnosis. Tampoco contiene columnas para variante del teléfono, precio de compra, precio de venta, costes reales, ganancia real ni compatibilidad con UnlockTool. No inventar esos datos ni consultarlos como si existieran.
4.2 public.diagnostic_fault_catalog
Catálogo de fallas disponibles:
- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
- component_code VARCHAR(50) NOT NULL
- component_name VARCHAR(100) NOT NULL
- fault_code VARCHAR(80) NOT NULL
- fault_name VARCHAR(150) NOT NULL
- description TEXT NOT NULL
- image_uri TEXT NULL
- sort_order INTEGER NOT NULL DEFAULT 0
- is_active BOOLEAN NOT NULL DEFAULT TRUE
La combinación (component_code, fault_code) es única.

image_uri corresponde a la imagen de una falla del catálogo. No representa la imagen del modelo de celular. is_active = false indica que una falla ya no está disponible para nuevas selecciones; no significa que deba ocultarse automáticamente de un diagnóstico histórico.
4.3 public.project_faults
Relaciona un proyecto con las fallas seleccionadas:
- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
- project_id BIGINT NOT NULL, FK a projects.id, con ON DELETE CASCADE.
- fault_id BIGINT NOT NULL, FK a diagnostic_fault_catalog.id, con ON DELETE RESTRICT.
- confirmed BOOLEAN NOT NULL DEFAULT FALSE
- notes TEXT NULL
- created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
La combinación (project_id, fault_id) es única.

Relaciones:
- projects.id → project_faults.project_id
- diagnostic_fault_catalog.id → project_faults.fault_id
Un proyecto puede tener cero, una o varias fallas relacionadas.
4.4 Índices conocidos
- Índice sobre projects.status.
- Índice sobre project_faults.project_id.
- Índice sobre (diagnostic_fault_catalog.component_code, is_active, sort_order).
Antes de proponer índices nuevos, inspeccionar el esquema real y justificar la mejora esperada.

4.5 public.phone_models
Catálogo de dispositivos administrado en PostgreSQL. La tabla se crea manualmente en pgAdmin 4 con el SQL acordado (no hay scripts de migración en el repositorio). El repositorio no ejecuta migraciones (ddl-auto: validate): si el esquema no coincide, la aplicación no arranca.

Estructura:
- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
- brand VARCHAR(100) NOT NULL
- commercial_name VARCHAR(150) NOT NULL
- image_uri TEXT NULL
- unlocktool_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN', con CHECK en ('SUPPORTED', 'UNSUPPORTED', 'UNKNOWN')
- is_active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
- UNIQUE (brand, commercial_name)
- Índice sobre is_active

image_uri es la URL de la imagen del modelo de celular y puede ser NULL (el frontend muestra un placeholder). No confundir con diagnostic_fault_catalog.image_uri, que es la imagen de una falla.

El soporte de UnlockTool se guarda por modelo en unlocktool_status. UNKNOWN significa sin verificar: no debe convertirse en UNSUPPORTED por falta de información ni asumirse SUPPORTED sin verificación.
No existen tablas de variantes ni de operaciones de UnlockTool; no inventarlas ni consultarlas.
5. Contrato HTTP previsto para proyectos
El prefijo de las rutas es /api/v1.
5.1 Listado: GET /api/v1/projects
Devuelve una colección ligera para las tarjetas de la pantalla principal. Los campos previstos son:
- id
- projectNumber
- phoneModel
- estimatedProfit
- diagnosis
- status
Ejemplo ilustrativo:
[
  {
    "id": 1,
    "projectNumber": 1,
    "phoneModel": "Samsung Galaxy A03",
    "estimatedProfit": 25000.00,
    "diagnosis": "Módulo: Módulo roto, Tapa trasera: Tapa dañada",
    "status": "PENDING"
  }
]
El ejemplo define la forma deseada de la respuesta, pero los valores reales deben provenir de PostgreSQL.

El resumen diagnosis se construye consultando las relaciones con project_faults y diagnostic_fault_catalog; no debe leerse de projects.

Una estrategia apropiada para el listado es una consulta LEFT JOIN que agregue las fallas por proyecto, por ejemplo con STRING_AGG de PostgreSQL, agrupando los campos del proyecto. Debe incluir también los proyectos sin fallas y evitar la duplicación del proyecto o de los nombres de las fallas.

Si el listado necesita una consulta nativa, mapear el resultado mediante una proyección o DTO de forma explícita y comprobable.
5.2 Detalle: GET /api/v1/projects/{id}
Recupera el proyecto seleccionado y sus datos de diagnóstico. La respuesta debe incluir los campos principales del proyecto y una colección estructurada de fallas; cada elemento puede incluir:
- componentCode
- componentName
- faultCode
- faultName
- description
- imageUri
- confirmed
- notes
Como la base tiene varias tablas relacionadas, el backend puede usar una consulta con LEFT JOIN o una consulta del proyecto más otra consulta en bloque de sus fallas. No debe hacer una consulta individual por cada falla.

Si el proyecto no existe, devolver 404 Not Found siguiendo las convenciones existentes del proyecto.
5.3 Una petición HTTP no equivale a una consulta SQL
El frontend debe realizar una petición HTTP para recuperar el listado y otra para cargar el detalle cuando se abra un proyecto. El backend puede consultar varias tablas internamente para construir una única respuesta. No hace falta exponer un endpoint HTTP separado por cada tabla.
6. Contrato HTTP del catálogo de dispositivos
El prefijo es /api/v1, con las mismas convenciones que los endpoints de proyectos. Implementado en el paquete com.phoneTech.demo.devices.

6.1 Listado: GET /api/v1/devices?query=&page=&size=
- query: filtro opcional; busca por marca o nombre comercial (ejecutado en PostgreSQL).
- page: base 0, por defecto 0. size: por defecto 20, máximo 100 (valores fuera de rango se ajustan en el service).
Ejemplo ilustrativo de respuesta:
{
  "items": [
    {
      "id": 1,
      "brand": "Samsung",
      "commercialName": "Galaxy A03",
      "imageUri": null,
      "unlockToolStatus": "UNKNOWN"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1,
  "hasNext": false
}
unlockToolStatus es el estado directo de la columna phone_models.unlocktool_status: "SUPPORTED", "UNSUPPORTED" o "UNKNOWN". Nunca se infiere UNSUPPORTED por falta de datos.
El listado es una sola consulta ligera con LIMIT/OFFSET y un COUNT separado; sin N+1.

6.2 Detalle: GET /api/v1/devices/{id}
Devuelve los mismos campos del modelo (id, brand, commercialName, imageUri, unlockToolStatus).
Si el id no existe o el modelo tiene is_active = false → 404 con ProblemDetail: "Device not found: {id}".

6.3 Subida de imagen: POST /api/v1/devices/{id}/image
- Consumo: multipart/form-data con el parámetro "file".
- Valida que el archivo no esté vacío y pertenezca a tipos de imagen soportados (image/jpeg, image/png, image/webp, image/gif).
- Almacena el archivo en la carpeta configurada (app.storage.upload-dir) con nombre único UUID.
- Actualiza la columna image_uri con "/uploads/{fileName}" y updated_at en phone_models.
- Si el modelo ya contaba con una imagen previa en /uploads/, elimina el archivo anterior del disco para evitar archivos huérfanos.
- Devuelve 200 OK con el DeviceDetailResponse actualizado (id, brand, commercialName, imageUri, unlockToolStatus).
- Si el id no existe o is_active = false → 404 con ProblemDetail.
- Si el archivo es inválido o no soportado → 400 Bad Request.

Estados de compatibilidad (enum UnlockToolSupportStatus): SUPPORTED, UNSUPPORTED, UNKNOWN.
7. Reglas de eficiencia y persistencia
- Evitar el problema N+1: no consultar por separado las fallas de cada proyecto del listado.
- En el listado, devolver solamente los campos que necesita la pantalla. No serializar entidades completas innecesariamente.
- En el detalle, obtener las fallas de forma eficiente y agrupar correctamente las filas resultantes de los JOIN.
- Usar LEFT JOIN si deben aparecer proyectos sin diagnóstico.
- Utilizar parámetros enlazados para los valores proporcionados por el usuario; nunca concatenar directamente parámetros en SQL.
- Mantener las consultas compatibles con PostgreSQL.
- Representar NUMERIC(14,2) con BigDecimal en Java, no double ni float.
- Mantener las consultas de lectura como solo lectura (@Transactional(readOnly = true)) cuando encaje con el diseño existente.
- Manejar correctamente los resultados vacíos, valores nulos y errores de recurso inexistente.
- Revisar cuidadosamente las restricciones de agregación, por ejemplo el uso de DISTINCT y el orden en STRING_AGG, para evitar fallas o diagnósticos duplicados.
- Preservar la codificación UTF-8. Los textos deben mostrarse correctamente, por ejemplo Módulo, y no como MÃ³dulo. Corregir el origen de un problema de codificación; no reemplazar cadenas manualmente en el frontend como parche.
8. Imágenes de celulares
El catálogo phone_models tiene image_uri TEXT NULL para la imagen del modelo de celular (ver 4.5). Si es NULL, el frontend debe mostrar un placeholder; no inventar URLs ni asignar imágenes arbitrarias.

Antes de modificar imágenes, inspeccionar cómo lo resuelve el frontend:
- Si el frontend usa assets locales o un catálogo de modelos, verificar cómo identifica el modelo y cómo resuelve su imagen.
- No confundir diagnostic_fault_catalog.image_uri con la fotografía del teléfono.
- No modificar la base de datos sin autorización explícita.
La asociación de imágenes debe seguir funcionando al reiniciar la aplicación y volver a cargar los proyectos guardados.
9. Integración con el frontend
El frontend usa React Native, Expo, TypeScript y Expo Router. Cuando se trabaje en integración, comprobar:
- URL base real del backend para el entorno de ejecución (emulador, dispositivo físico o entorno web).
- Coincidencia entre las rutas HTTP del frontend y las definidas en los controllers.
- Coincidencia entre los nombres y tipos del JSON y los tipos/interfaces TypeScript.
- Renderizado correcto de modelo, imagen, ganancia estimada, diagnóstico y estado.
- Navegación al detalle utilizando el id real del proyecto.
- Estados de carga, error, lista vacía y valores nulos.
- Ausencia de mocks como sustituto de los datos reales en el flujo de producción.
- Configuración CORS cuando realmente sea necesaria para el cliente o el entorno utilizado.
No asumir que localhost desde un dispositivo móvil apunta a la computadora que ejecuta Spring Boot. Identificar el entorno antes de cambiar URLs o configurar el servidor.
10. Convenciones de desarrollo para asistentes de IA
Antes de modificar el código:
1. Inspeccionar el árbol del repositorio, pom.xml, configuración de Spring, paquetes, entities, repositories, services, controllers, DTO y pruebas existentes.
2. Identificar qué está implementado y qué falta; distinguir hechos del código de recomendaciones.
3. Mantener el alcance solicitado. Evitar refactorizaciones grandes sin necesidad.
4. No dar por existentes columnas, tablas, endpoints ni dependencias que no se hayan verificado.
5. No crear, borrar ni modificar el esquema de la base de datos, ni sembrar datos, salvo autorización expresa.
6. No modificar ni exponer secretos o credenciales.
7. No hacer commits ni push, salvo que se solicite explícitamente.
8. Usar la rama 01-ProjectsEndpoints para el trabajo relacionado con el endpoint de proyectos, si esa rama existe y corresponde a la tarea. Confirmar el estado actual antes de cambiar de rama.
9. Explicar los archivos modificados y justificar las decisiones relevantes.
11. Verificación antes de declarar una tarea terminada
Ejecutar las verificaciones que estén disponibles y reportar sus resultados reales:
- Compilación Maven (preferir el wrapper si existe).
- Pruebas automatizadas relevantes.
- Verificación de las consultas y del mapeo de proyecciones/DTO.
- Pruebas de GET /api/v1/projects y GET /api/v1/projects/{id} con datos reales, si PostgreSQL está disponible.
- Pruebas de GET /api/v1/devices y GET /api/v1/devices/{id} con datos reales, si PostgreSQL está disponible y la tabla phone_models fue creada.
- Proyecto sin fallas, proyecto con varias fallas y id inexistente.
- Comprobación de ausencia de consultas N+1.
- Compilación y pruebas del frontend cuando la tarea incluya integración.
No afirmar que una prueba fue ejecutada si no se ejecutó. Si un servicio o base de datos no está disponible, indicar exactamente qué quedó sin comprobar.
12. Estado y alcance conocido
El esquema de proyectos y diagnósticos está definido y se ha preparado una prueba de datos con un Samsung Galaxy A03, una falla de módulo y una falla de tapa trasera. En una consulta visual del catálogo, las fallas aparecen con los ID 5 y 6. Esto confirma únicamente que esas filas existen en diagnostic_fault_catalog; no confirma por sí mismo que el proyecto esté guardado en projects, que las filas existan en project_faults ni que los endpoints funcionen.

El catálogo de dispositivos (paquete devices, endpoints GET /api/v1/devices y /{id}) está implementado en Java con tests unitarios sobre la tabla phone_models; la tabla y la semilla se crean manualmente en pgAdmin 4 con el SQL acordado (no está en el repo). Hasta crearla, los endpoints de dispositivos fallarán al arrancar la aplicación por ddl-auto: validate. La semilla trae 3 modelos con soporte UNKNOWN y sin URLs de imagen: esos datos quedan pendientes de completar en PostgreSQL.

El alcance de los endpoints de proyectos debe mantenerse acotado a los datos que existen actualmente. El almacenamiento de variante, costes, precio de compra/venta y ganancia real requiere verificar o ampliar el modelo antes de exponer esos datos.
Regla general: verificar primero, implementar lo necesario, probarlo y reportar con honestidad qué funciona y qué queda pendiente. No presentar una suposición como resultado comprobado.