# TAREA BACKEND 01 — Implementar GET /api/v1/projects

Actuá como un desarrollador backend senior especializado en Java, Spring Boot, PostgreSQL, Maven y diseño de APIs REST mantenibles.

Estás trabajando en el backend de una aplicación móvil real. Tu responsabilidad es implementar código limpio, organizado, legible y preparado para ampliarse progresivamente.

La tarea de esta etapa es implementar el primer endpoint del módulo Projects, siguiendo estrictamente la arquitectura Controller → Service → Repository.

**IMPORTANTE: trabajá en una rama Git independiente llamada `01-ProjectsEndpoints`. Cuando termines, dejá todos los cambios sin commit para que pueda revisarlos personalmente. No hagas commit, push, merge ni pull request.**

---

## 1. CONTEXTO GENERAL DEL PROYECTO

Estoy desarrollando una aplicación móvil para ayudarme a gestionar mi actividad como técnico de celulares, especialmente la compra de teléfonos usados o rotos, su diagnóstico, reparación y posterior reventa para obtener ganancias.

La aplicación está pensada para utilizarse desde smartphones Android e iOS y su frontend está desarrollado con React Native, Expo y TypeScript.

El backend se desarrollará utilizando:

- **Java:** lenguaje principal.
- **Spring Boot:** framework del backend.
- **Spring Web:** creación de la API REST.
- **Spring Data JPA:** acceso a los datos mediante entidades y repositorios.
- **PostgreSQL:** base de datos relacional.
- **Maven:** gestión del proyecto y sus dependencias.

La aplicación móvil consume la API REST mediante solicitudes HTTP. No estamos desarrollando una página web: Spring Boot proporciona los servicios y la lógica de negocio que utiliza la aplicación móvil.

La base de datos se ejecutará inicialmente en mi entorno local de desarrollo.

## 2. ¿QUÉ HACE LA APLICACIÓN?

La aplicación permite gestionar todo el ciclo de una operación de compra y reventa de celulares.

El funcionamiento general es el siguiente:

**Etapa 1 — Elegir el celular**

El usuario selecciona el modelo y, cuando sea posible, la variante exacta del teléfono que está evaluando comprar.

**Etapa 2 — Diagnosticar el teléfono**

El usuario selecciona los componentes y las fallas detectadas. Por ejemplo:

- Módulo roto.
- Cámara dañada.
- Tapa trasera rota.
- Batería agotada.
- Pin de carga dañado.
- Botones que no funcionan.
- Problemas de audio o placa.

Un teléfono puede tener múltiples fallas. Algunas pueden estar confirmadas y otras ser síntomas pendientes de revisión.

**Etapa 3 — Analizar la rentabilidad**

La aplicación calcula o estima los costos de reparación, el precio de venta esperado, cuánto conviene pagar por el teléfono y la ganancia que podría obtenerse.

El análisis económico considera:
- Precio de compra.
- Costos de repuestos.
- Mano de obra y otros gastos.
- Precio estimado de venta.
- Ganancia deseada.
- Reserva para imprevistos, si corresponde.

**Etapa 4 — Crear y guardar el proyecto**

Cuando el usuario guarda el análisis, se crea un proyecto individual asociado a ese teléfono.

Un proyecto representa una operación concreta de compra, reparación y reventa, o una oportunidad que todavía se está evaluando.

Por ejemplo:

- Proyecto #001: Samsung Galaxy A03 con módulo roto.
- Proyecto #002: Motorola Moto E13 con problemas de carga.
- Proyecto #003: Samsung Galaxy A10 con flex dañado.

Pueden existir múltiples proyectos del mismo modelo. Cada uno debe mantener sus propios datos, costos, fechas, diagnóstico y resultados económicos.

**Etapa 5 — Gestionar el proyecto**

Una vez guardado, el usuario puede consultar y gestionar el proyecto hasta finalizar la operación.

Los estados previstos son:

- `PENDING`: operación en evaluación; todavía no se ha confirmado la compra.
- `IN_REPAIR`: teléfono comprado que se encuentra en reparación.
- `FOR_SALE`: teléfono reparado o preparado para vender.
- `SOLD`: teléfono vendido y operación finalizada.

Estos estados deben mantenerse consistentes en toda la aplicación y no deben utilizarse como texto libre.

## 3. ¿PARA QUÉ SIRVE EL BACKEND?

El backend es la parte central que permite que la aplicación guarde y recupere sus datos de manera persistente.

Sus responsabilidades a futuro incluirán:

- Crear, consultar y actualizar proyectos.
- Mantener un catálogo de modelos y variantes de celulares.
- Administrar los componentes, repuestos y sus compatibilidades.
- Registrar diagnósticos y fallas.
- Gestionar precios de compra, costos de reparación y precios de venta.
- Calcular ganancias estimadas y reales.
- Registrar compras, gastos y ventas.
- Mantener el historial de cada operación.
- Proporcionar los datos necesarios para las pantallas Proyectos y Ganancias.
- Permitir posteriormente estadísticas mensuales y cálculos del capital invertido.

La aplicación tendrá dos conceptos financieros que deben mantenerse separados:

**Ganancia estimada:** beneficio que se espera obtener en una operación que todavía no finalizó.

**Ganancia real:** beneficio neto de una operación una vez vendida, descontando el precio de compra, los repuestos y los demás gastos atribuibles registrados.

También se distinguirán la inversión histórica y el capital actualmente comprometido en celulares que todavía no se vendieron.

En el futuro, la API deberá proporcionar los datos necesarios para calcular esas métricas. Sin embargo, **esta tarea no consiste en implementar todo el backend**, sino solamente el primer endpoint para consultar los proyectos existentes.

## 4. ALCANCE EXACTO DE ESTA TAREA

Implementá exclusivamente:

`GET /api/v1/projects`

Este endpoint debe permitir que la aplicación móvil obtenga la lista de proyectos almacenados en PostgreSQL y los muestre en su pantalla Proyectos.

En esta primera etapa quiero establecer una base sólida sobre la que pueda ir agregando funcionalidades endpoint por endpoint.

No implementes todavía la creación de proyectos ni los módulos de diagnósticos, repuestos, ventas o finanzas.

---

## 5. GIT: CREAR UNA RAMA INDEPENDIENTE

Antes de modificar archivos:

1. Ejecutá `git status` para comprobar el estado del repositorio.
2. Identificá la rama actual.
3. Revisá el historial reciente y la existencia de la rama solicitada.
4. Creá y utilizá una rama llamada exactamente `01-ProjectsEndpoints`.

Restricciones obligatorias:

- Si existen cambios locales, no los borres, reviertas ni sobrescribas.
- Si cambiar de rama puede poner en riesgo trabajo existente, detenete y explicame el problema.
- Si `01-ProjectsEndpoints` ya existe, no la elimines, resetees ni sobrescribas su historial. Inspeccioná su estado antes de decidir cómo continuar.
- No cambies a otra rama para implementar la tarea.
- No hagas ningún commit bajo ninguna circunstancia.
- No hagas push, merge ni pull request.
- No modifiques la configuración de Git para alterar el comportamiento de los commits.

Quiero revisar personalmente todos los cambios antes de confirmarlos.

---

## 6. INSPECCIONAR EL PROYECTO EXISTENTE

Antes de escribir código, inspeccioná la estructura del backend.

Identificá:

- Versión de Java.
- Versión de Spring Boot.
- Sistema de compilación y dependencias.
- Paquete raíz del proyecto.
- Configuración de PostgreSQL.
- Configuración de Spring Data JPA.
- Entidades y repositorios existentes.
- Convenciones de nombres y organización.
- Estrategia de migraciones de base de datos, si existe.
- Configuración y pruebas ya implementadas.

Respetá las convenciones existentes cuando sean razonables.

No rehagas el proyecto, no reemplaces la configuración funcional y no agregues dependencias innecesarias.

Adaptá la implementación al código que realmente exista. No asumas nombres de paquetes, clases o archivos que no hayas inspeccionado.

---

## 7. ARQUITECTURA OBLIGATORIA: CONTROLLER, SERVICE Y REPOSITORY

Quiero una arquitectura sencilla, profesional y legible, con responsabilidades separadas.

La organización conceptual del módulo Projects debe ser:

```text
projects/
├── controller/
│   └── ProjectController.java
├── service/
│   └── ProjectService.java
├── repository/
│   └── ProjectRepository.java
├── entity/
│   └── Project.java
├── dto/
│   └── ProjectResponse.java
└── enums/
    └── ProjectStatus.java
```

Adaptá esta estructura al paquete raíz y a las convenciones existentes en el proyecto.

No crees estructuras duplicadas si ya hay una organización equivalente.

### Controller

`ProjectController.java`

Responsabilidades:
- Exponer el endpoint HTTP.
- Recibir la solicitud.
- Delegar el trabajo al Service.
- Devolver el DTO de respuesta y el estado HTTP correspondiente.

El Controller no debe contener consultas a la base de datos ni lógica de negocio.

### Service

`ProjectService.java`

Responsabilidades:
- Coordinar la recuperación de proyectos.
- Utilizar el Repository.
- Convertir los datos en el DTO de respuesta mediante un mapper, si existe ese patrón en el proyecto.
- Mantener la lógica de aplicación fuera del Controller.

No agregues interfaces e implementaciones de Service separadas si no existe una razón concreta para hacerlo.

### Repository

`ProjectRepository.java`

Debe utilizar Spring Data JPA, preferentemente extendiendo `JpaRepository<Project, Long>` si `Project` usa un identificador `Long`.

Su responsabilidad es recuperar los proyectos almacenados en PostgreSQL.

No debe contener lógica de presentación ni cálculos financieros.

### Entity

`Project.java`

Representa la entidad persistida del proyecto.

Debe reflejar el modelo existente del dominio y utilizar tipos de datos adecuados para identificadores, fechas, estados e importes.

### DTO

`ProjectResponse.java`

Define los datos que recibe la aplicación móvil.

No devolver directamente la entidad JPA desde el Controller.

### Enum

`ProjectStatus.java`

Representa los estados permitidos de un proyecto mediante valores tipados y consistentes.

No usar cadenas arbitrarias como estado.

---

## 8. MODELO INICIAL DE PROYECTO

Si todavía no existe una entidad Project, prepará un modelo inicial que pueda cubrir las necesidades actuales de la pantalla Proyectos.

Como mínimo, considerá los siguientes campos:

| Campo | Tipo conceptual | Función |
|---|---|---|
| `id` | Identificador generado | Identidad interna del proyecto |
| `projectNumber` | Número entero | Número visible del proyecto |
| `phoneModel` | Texto | Nombre del modelo del teléfono |
| `variant` | Texto nullable | Variante técnica, si se conoce |
| `diagnosis` | Texto o resumen derivado | Descripción de las fallas |
| `estimatedProfit` | `BigDecimal` | Ganancia estimada |
| `actualProfit` | `BigDecimal`, nullable | Ganancia real después de la venta |
| `status` | `ProjectStatus` | Estado del proyecto |
| `createdAt` | Fecha y hora | Fecha de creación |

Este modelo es una base inicial, no el diseño definitivo de toda la aplicación.

Si ya existe una entidad Project, reutilizala y adaptá el DTO al modelo actual en lugar de crear una entidad paralela.

Si los diagnósticos ya están modelados mediante entidades relacionadas, no dupliques esa información en un campo de texto. En ese caso, devolvé un resumen adecuado para la interfaz o reutilizá la estrategia de DTO que ya exista.

### Reglas de los datos

- Utilizá `BigDecimal` para los importes monetarios.
- No utilices `double` ni `float` para representar dinero.
- `actualProfit` debe admitir `null` mientras no exista una venta finalizada.
- No confundas la ganancia estimada con la ganancia real.
- El estado debe pertenecer al enum definido.
- No inventes precios ni beneficios para completar información desconocida.
- No agregues campos innecesarios que no se puedan justificar con las necesidades actuales o el modelo existente.

El número de proyecto visible debe distinguirse del ID interno de la base de datos. Si todavía no existe una estrategia para asignar números de forma segura, documentá esa decisión pendiente en lugar de introducir una solución frágil.

---

## 9. ENDPOINT: GET /api/v1/projects

Implementá la ruta exacta:

`GET /api/v1/projects`

El flujo debe ser:

1. React Native realiza la solicitud HTTP.
2. `ProjectController` recibe la petición.
3. El Controller invoca `ProjectService`.
4. El Service consulta `ProjectRepository`.
5. El Repository obtiene los proyectos de PostgreSQL.
6. Los datos se convierten a `ProjectResponse`.
7. La API devuelve HTTP 200 con un array JSON.

La ruta debe contener `/api/v1`.

No crear `/api/projects`, `/v1/projects` ni rutas duplicadas.

Si ya existe una configuración central de prefijos, utilizala correctamente.

### Respuesta de ejemplo

La respuesta de la API debe tener una estructura compatible con este ejemplo ilustrativo:

```json
[
  {
    "id": 1,
    "projectNumber": 1,
    "phoneModel": "Samsung Galaxy A03",
    "variant": "SM-A035M",
    "diagnosis": "Módulo roto, tapa dañada",
    "estimatedProfit": 25000,
    "actualProfit": null,
    "status": "PENDING",
    "createdAt": "2026-10-19T10:30:00"
  }
]
```

Los valores son ficticios y representan el contrato de respuesta esperado, no datos que deban insertarse automáticamente.

Los importes deben viajar como números JSON, sin el símbolo `$` ni separadores de miles.

Las fechas deben utilizar un formato coherente con la configuración temporal del proyecto.

No exponer propiedades internas que el frontend no necesita.

### Comportamiento esperado

**Si existen proyectos:** devolver HTTP 200 y un array JSON con los resultados almacenados.

**Si no existen proyectos:** devolver HTTP 200 y un array vacío:

```json
[]
```

No utilizar HTTP 404 únicamente porque todavía no se hayan creado proyectos.

**Si ocurre un error:** utilizar el mecanismo de manejo de excepciones existente y devolver una respuesta de error coherente. No exponer trazas, contraseñas ni detalles internos de PostgreSQL al cliente.

No implementar paginación en esta tarea si el proyecto todavía no tiene ese patrón establecido, pero mantené la solución preparada para agregarla posteriormente si el volumen de proyectos crece.

---

## 10. CONEXIÓN CON POSTGRESQL

El endpoint debe recuperar información de la base de datos configurada en el proyecto.

No quiero que devuelva una lista estática hardcodeada en Java.

Verificá que:
- El Repository consulte correctamente la base de datos.
- Spring Data JPA esté configurado de acuerdo con el proyecto.
- Las tablas necesarias existan o se gestionen mediante el mecanismo actual de persistencia.
- No se eliminen ni sobrescriban datos existentes.
- Las credenciales no estén hardcodeadas en el código fuente.

Si ya se utiliza Flyway o Liquibase, seguí esa estrategia para las modificaciones de esquema.

Si todavía no existe una estrategia de migraciones, inspeccioná la configuración actual antes de introducir dependencias o cambios. Elegí una solución mínima y compatible con el estado real del proyecto.

Si PostgreSQL no está disponible durante las pruebas, no afirmes que la integración fue validada. Comprobá lo que puedas mediante compilación y pruebas aisladas, y documentá qué queda pendiente.

No insertes registros ficticios de forma automática en la base de datos de producción ni cambies el esquema de manera destructiva.

---

## 11. CALIDAD Y LEGIBILIDAD DEL CÓDIGO

Quiero que el backend sea fácil de comprender y mantener.

Aplicá estas reglas:

- Nombres descriptivos y consistentes.
- Métodos pequeños, con una responsabilidad clara.
- Lógica de negocio fuera del Controller.
- Acceso a datos centralizado en Repository.
- DTO tipados, no `Map<String, Object>`.
- `BigDecimal` para importes monetarios.
- Manejo de errores apropiado.
- Sin consultas a PostgreSQL dentro de los Controllers.
- Sin captura genérica de excepciones para ocultar errores.
- Sin `System.out.println` para registrar errores.
- Sin comentarios obvios ni abstracciones innecesarias.
- Sin dependencias nuevas que no sean realmente necesarias.

Respetá las convenciones del proyecto existente y evitá modificar archivos fuera del módulo Projects salvo que sea imprescindible para la integración.

No implementes seguridad, autenticación ni otros módulos en esta etapa.

---

## 12. PRUEBAS Y VALIDACIÓN

Una vez implementado el endpoint:

1. Ejecutá las pruebas que ya existen.
2. Compilá el proyecto.
3. Corregí los errores introducidos por los cambios.
4. Agregá pruebas del Controller o Service de acuerdo con la estructura existente.
5. Verificá que la respuesta sea correcta cuando existen proyectos.
6. Verificá que la respuesta sea un array vacío cuando no existen proyectos.
7. Si PostgreSQL está disponible, comprobá la integración real con la base de datos.

No agregues dependencias de prueba innecesarias si el proyecto ya contiene las herramientas requeridas.

Si alguna prueba no puede ejecutarse debido al entorno local o a una dependencia externa, informá ese bloqueo explícitamente. No declares como exitosas pruebas que no ejecutaste.

Documentá cómo comprobar el endpoint, incluyendo:
- Método HTTP.
- URL completa.
- Requisitos para ejecutarlo.
- Respuesta esperada cuando existen proyectos.
- Respuesta esperada cuando no existen proyectos.

---

## 13. LÍMITES DEL ALCANCE

En esta tarea implementá únicamente `GET /api/v1/projects` y la infraestructura mínima que necesita para funcionar.

No implementes todavía:

- `POST /api/v1/projects`.
- `GET /api/v1/projects/{id}`.
- Actualización ni eliminación de proyectos.
- Endpoints de dispositivos o variantes.
- Endpoints de diagnósticos.
- Endpoints de repuestos.
- Endpoints de ventas.
- Endpoints financieros.
- Autenticación ni autorización.
- Funcionalidades del frontend.
- Servicios futuros sin uso en el alcance actual.

El objetivo es establecer una primera base correcta sobre la que podamos continuar desarrollando el backend endpoint por endpoint.

---

## 14. FINALIZACIÓN: DEJAR LOS CAMBIOS SIN COMMIT

Cuando termines:

1. Confirmá que seguís trabajando en la rama `01-ProjectsEndpoints`.
2. Revisá todos los archivos creados y modificados.
3. Comprobá que los cambios correspondan exclusivamente a esta tarea.
4. Ejecutá las pruebas y la compilación disponibles.
5. Ejecutá nuevamente `git status`.
6. Asegurate de que todos los cambios sigan locales y sin confirmar.

**No hagas commit, push, merge ni pull request. Quiero revisar personalmente la implementación antes de decidir si confirmo los cambios.**

Entregame un resumen que incluya:

- Qué archivos creaste.
- Qué archivos modificaste.
- Cómo quedó organizada la arquitectura Controller → Service → Repository.
- Cómo funciona `GET /api/v1/projects`.
- Ejemplo de respuesta JSON.
- Pruebas realizadas y sus resultados.
- Estado real de la integración con PostgreSQL.
- Cualquier limitación o decisión pendiente.
- Rama Git en la que quedaron los cambios.
- Confirmación de que no realizaste ningún commit.

**Comenzá inspeccionando el repositorio, prepará la rama y después implementá el endpoint. No te limites a describir los pasos: trabajá directamente sobre el código existente respetando todas estas instrucciones.** ## IMPORTANTE: LA BASE DE DATOS LA ADMINISTRO YO

PostgreSQL se ejecutará localmente en mi computadora y yo me encargaré personalmente de iniciarlo, crear la base de datos y administrar su disponibilidad.

**No debes crear, iniciar, instalar, reiniciar ni administrar la instancia de PostgreSQL.**

- No ejecutes `createdb`, `initdb`, `CREATE DATABASE` ni comandos equivalentes.
- No ejecutes `docker compose up` ni inicies contenedores o servicios de bases de datos.
- No elimines, resetees ni modifiques destructivamente bases de datos existentes.
- No insertes datos ficticios en mi base de datos.
- No inventes credenciales ni escribas contraseñas directamente en el código.
- Configurá Spring Boot para conectarse a una base de datos PostgreSQL local mediante variables de entorno o la configuración existente del proyecto.
- Si la base de datos no está disponible, continuá con la implementación del código que puedas realizar y documentá qué pruebas quedan pendientes.

Podés desarrollar las entidades, repositorios, servicios, controllers y DTO necesarios para el endpoint. Si el proyecto utiliza migraciones, podés preparar los archivos de migración necesarios, pero **no los ejecutes automáticamente ni realices cambios de esquema sobre mi base de datos**.

Si necesitás que cree la base de datos o prepare alguna tabla manualmente, indicame el nombre y los comandos SQL necesarios para que yo lo haga.

La administración de PostgreSQL y la ejecución de cualquier cambio sobre la base de datos quedan bajo mi control.