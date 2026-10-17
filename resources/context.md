# CONTEXTO GENERAL DEL PROYECTO — APLICACIÓN MÓVIL PARA TÉCNICOS DE CELULARES

## 1. Visión general

Estoy desarrollando una aplicación móvil destinada a técnicos que compran celulares usados o rotos, los reparan y los revenden para obtener ganancias.

La aplicación será una herramienta personal para gestionar mis operaciones de compra, diagnóstico, reparación y reventa de celulares. Su objetivo principal es ayudarme a tomar mejores decisiones económicas, evitar comprar equipos que no sean rentables, calcular cuánto debería pagar por cada teléfono y llevar un registro de cuánto dinero invierto y cuánto gano realmente.

No quiero una aplicación compleja, llena de funciones innecesarias. Quiero una herramienta práctica, visualmente agradable, rápida de utilizar y fácil de entender desde un teléfono celular.

La idea es que pueda utilizarla mientras reviso publicaciones de Marketplace, negocio con vendedores, diagnostico equipos y organizo mis reparaciones.

## 2. Tecnologías y arquitectura

La aplicación está pensada con la siguiente arquitectura:

- **Frontend móvil:** React Native + Expo + TypeScript.
- **Backend futuro:** Java + Spring Boot.
- **Base de datos central futura:** PostgreSQL.
- **Almacenamiento local opcional:** SQLite, para consultar información guardada y trabajar sin conexión cuando sea posible.

En la etapa actual estamos priorizando la interfaz móvil y sus interacciones utilizando datos de prueba. El backend y la base de datos definitiva se desarrollarán posteriormente.

Antes de realizar cambios, siempre se debe inspeccionar la estructura actual del proyecto, reutilizar los componentes existentes y respetar las decisiones técnicas que ya estén implementadas.

No se debe rehacer la aplicación desde cero ni sobrescribir código existente sin necesidad.

## 3. Restricción fundamental: exclusivamente móvil

La aplicación está destinada a smartphones Android e iOS.

Todos los diseños y componentes deben construirse para dispositivos móviles, en orientación vertical, teniendo como referencia una pantalla aproximada de 393 × 852 píxeles.

No quiero:
- Páginas web.
- Dashboards de escritorio.
- Interfaces para PC o laptop.
- Versiones para tablets.
- Diseños de escritorio reducidos para que entren en una pantalla móvil.

La interfaz debe aprovechar bien el espacio vertical, adaptarse a diferentes tamaños de teléfonos, tener áreas táctiles cómodas y respetar las áreas seguras del sistema operativo.

La navegación principal debe ser simple y cómoda para utilizar con una sola mano.

## 4. Identidad visual

La identidad visual elegida se denomina **Soft Blue Tech**.

Busco una estética tranquila, limpia, suave, moderna y profesional, relacionada con la reparación electrónica. La aplicación debe transmitir orden, precisión y confianza.

La paleta de colores es:

| Elemento | Color |
|---|---|
| Fondo general | #F5F9FC |
| Cards y paneles | #FFFFFF |
| Celeste suave | #DFF1FC |
| Azul principal | #378CC4 |
| Texto principal | #263746 |
| Texto secundario | #718398 |
| Bordes sutiles | #DCE7EF |
| Ganancias positivas | #27866E |

Los estados de los proyectos deben utilizar colores pastel:
- En evaluación: fondo #EDE9FE y texto #6D55A1.
- En reparación: fondo #FFF1D6 y texto #946315.
- En venta: fondo #DFF1FC y texto #246B96.
- Vendido: fondo #DDF5E9 y texto #237653.

El blanco debe predominar. El azul es el color principal de las acciones y de la identidad de la aplicación; el celeste se utiliza como acento y para fondos secundarios.

Hay que evitar los colores saturados, sombras fuertes, degradados exagerados, decoraciones innecesarias y las tarjetas excesivamente grandes.

Todas las pantallas deben mantener coherencia visual entre sí.

## 5. Navegación principal

La aplicación debe tener un navbar inferior fijo con exactamente tres elementos:

**Izquierda: Proyectos**

Permite acceder al listado de todos los proyectos creados.

**Centro: botón +**

Es el acceso principal para crear un proyecto nuevo. Debe ser un botón circular de color azul, con un símbolo + blanco, ligeramente más prominente que los otros elementos.

**Derecha: Ganancias**

Permite consultar las métricas financieras del negocio.

El navbar debe mantener su posición durante el desplazamiento vertical, respetar las áreas seguras y nunca tapar el contenido.

No agregar más pestañas principales sin una necesidad real. La aplicación tiene que seguir siendo sencilla.

## 6. Funcionalidad principal: proyectos de celulares

Cada celular que evalúo o compro se representa mediante un proyecto independiente.

Un proyecto contiene su propio modelo, diagnóstico, gastos, precios estimados, reparaciones, estado y resultado económico.

Puedo crear varios proyectos del mismo modelo sin mezclar sus datos. Por ejemplo, puedo tener tres Samsung Galaxy A03 diferentes, cada uno con sus propias fallas, costos, fechas y ganancias.

Los proyectos deben quedar guardados y poder consultarse posteriormente.

Cada proyecto tiene un número identificador, como:
- Proyecto #001.
- Proyecto #002.
- Proyecto #003.

El número debe mantenerse asociado al mismo proyecto.

### Flujo previsto para crear un proyecto

La creación de proyectos estará organizada en tres etapas.

**Etapa 1: Elección del celular**

Selecciono el modelo que estoy evaluando o que quiero comprar.

Debe existir un catálogo reutilizable de marcas y modelos de celulares, con búsqueda para encontrar rápidamente un equipo.

Cada modelo puede tener su código técnico o variante cuando sea relevante para elegir repuestos compatibles.

**Etapa 2: Diagnóstico**

Una vez elegido el modelo, la aplicación presenta categorías de componentes y fallas seleccionables.

Por ejemplo:

- Pantalla: módulo roto, falla táctil, manchas o líneas, sin imagen.
- Tapa y carcasa: tapa rota, marco doblado, carcasa dañada.
- Cámaras: cámara sin funcionar, vidrio de cámara roto, lente dañado, cámara desenfocada.
- Carga y batería: pin de carga dañado, no carga, batería agotada, flex de carga dañado.
- Botones y flex: botón de encendido roto, botones de volumen dañados, flex dañado.
- Audio y conectividad: parlante sin funcionar, micrófono dañado, problemas con SIM, Wi-Fi o Bluetooth.
- Placa y otros: no enciende, daño por humedad, lector de huella dañado y otras fallas.

Estas opciones son ejemplos iniciales y el catálogo deberá poder ampliarse.

Debe ser posible seleccionar varias fallas dentro de un mismo proyecto.

También debe permitirse señalar problemas que todavía no fueron confirmados. Esto es importante porque al comprar un celular usado no siempre se pueden comprobar todos sus componentes.

Las fallas seleccionadas deben relacionarse con los repuestos necesarios para solucionarlas, considerando compatibilidad, calidad y precio.

La aplicación debe evitar contar dos veces el mismo repuesto cuando una sola reparación solucione varios síntomas.

**Etapa 3: Costos y rentabilidad**

Después del diagnóstico, la aplicación reúne los repuestos necesarios y sus costos, y permite completar los datos económicos de la operación.

Debe permitir establecer:
- Precio de compra solicitado por el vendedor.
- Precio de compra real, una vez realizada la operación.
- Precio estimado de venta del celular reparado.
- Repuestos necesarios y sus costos.
- Mano de obra, traslados, envíos y otros gastos.
- Ganancia neta deseada.
- Reserva para imprevistos o posibles fallas ocultas.

Con esos datos, la aplicación calcula el precio máximo recomendable de compra y la ganancia estimada.

La fórmula base es:

Precio máximo de compra = precio de venta estimado − repuestos − otros gastos − ganancia deseada − reserva para imprevistos.

La calculadora debe permitir modificar los valores y actualizar los resultados inmediatamente.

Las estimaciones tienen que distinguirse de los importes efectivamente pagados o recibidos.

Una vez creado, el proyecto debe poder guardarse y consultarse desde la pestaña Proyectos.

## 7. Pestaña Proyectos: diseño y contenido

La pantalla Proyectos ya fue diseñada e implementada y su resultado visual es satisfactorio. Por lo tanto, debe respetarse y reutilizarse como referencia de identidad visual para las demás pantallas.

La pestaña contiene:
- Encabezado con el título “Proyectos”.
- Subtítulo “Tus compras y reparaciones”.
- Contador de proyectos.
- Buscador por nombre o número de proyecto.
- Filtros por estado.
- Lista vertical de cards.
- Navbar inferior.

### Estructura obligatoria de cada card

Cada proyecto se representa mediante una única tarjeta.

La estructura es:

**Primera fila:** número del proyecto, por ejemplo, “PROYECTO #001”.

**Contenido central en dos columnas:**

A la izquierda:
- Fotografía identificable del modelo de celular.

A la derecha, en este orden:
1. Nombre del modelo.
2. Ganancia estimada o real.
3. Diagnóstico con las fallas seleccionadas.

**Parte inferior de la card:**

El estado de la operación, ubicado debajo de las dos columnas y separado mediante una línea divisoria sutil.

Los estados posibles son:
- En evaluación.
- En reparación.
- En venta.
- Vendido.

El estado siempre debe aparecer abajo de todo, no al lado del nombre del celular ni debajo de la fotografía solamente.

Cada card puede tocarse para abrir el detalle del proyecto.

Los importes deben distinguir claramente la ganancia estimada de la ganancia real.

## 8. Pestaña Ganancias: objetivo

La pestaña Ganancias es la segunda pantalla principal y debe funcionar como un resumen financiero sencillo del negocio.

Su propósito es responder rápidamente estas preguntas:

- ¿Cuánto gané este mes?
- ¿Cuánto llevo ganado desde que empecé?
- ¿Cuánto podría ganar vendiendo los celulares que ya tengo publicados?
- ¿Cuánto invertí históricamente?
- ¿Cuánto dinero tengo actualmente comprometido en celulares sin vender?
- ¿Cuánto gasté durante el período seleccionado?

Debe tener un diseño móvil limpio, con métricas fáciles de encontrar, importes legibles y sin gráficos financieros complejos.

### Encabezado y período

Mostrar el título “Ganancias” y un subtítulo como “Resumen de tu negocio”.

Incluir un selector compacto con:
- Este mes.
- Mes anterior.
- Todo el tiempo.

El selector debe actualizar las métricas correspondientes al período. Los indicadores históricos deben conservar su significado al cambiarlo.

### Indicador circular principal: ganancia de este mes

La métrica visual principal es la ganancia neta realizada durante el mes seleccionado.

Debe mostrarse dentro de un indicador circular tipo anillo, de tamaño moderado y con una estética coherente con Soft Blue Tech.

El indicador utiliza azul y celeste suaves y presenta claramente el importe, el período y la etiqueta “Ganancia este mes”.

La cifra debe incluir únicamente las ganancias de las operaciones vendidas dentro del período, descontando los costos atribuibles a cada operación.

No debe incluir ganancias estimadas de celulares sin vender.

Si no existe una meta mensual configurada, el anillo será un recurso visual y no deberá mostrar porcentajes de progreso inventados.

### Métricas secundarias

Debajo del indicador circular, mostrar tarjetas compactas para estas métricas:

**Ganancia total**

Ganancia neta acumulada históricamente en todas las operaciones vendidas.

Solo incluye resultados realizados, no beneficios estimados.

**Ganancia proyectada**

Ganancia potencial de los celulares que actualmente están en estado “En venta”.

Para cada uno se calcula el precio de venta estimado menos su compra, repuestos y demás costos registrados.

No se suma a la ganancia realizada ni a la ganancia total.

Los proyectos en evaluación o reparación no se incluyen en esta métrica principal.

**Total invertido**

Suma histórica del dinero destinado a compras, repuestos y demás gastos de todas las operaciones, incluidas las que ya se cerraron.

Representa la inversión acumulada a lo largo de la actividad, no el dinero que permanece inmovilizado actualmente.

**Capital de inversión actual**

Importe que sigue comprometido en celulares no vendidos.

Incluye el precio de compra y los costos atribuibles registrados en proyectos abiertos: en evaluación, en reparación y en venta.

Excluye proyectos vendidos.

**Gastos del período**

Gastos efectivamente registrados dentro del período seleccionado, según sus fechas y conceptos.

Se deben distinguir las operaciones reales de las estimaciones y evitar duplicar movimientos.

Las métricas pueden organizarse en una cuadrícula de dos columnas cuando el espacio disponible lo permita.

### Estado de los proyectos

Agregar una sección compacta que muestre cuántos proyectos están:
- En evaluación.
- En reparación.
- En venta.
- Vendidos.

Los contadores deben derivarse de los proyectos registrados.

### Últimas ventas

Incluir una lista compacta de las ventas más recientes, mostrando:
- Modelo del celular.
- Número de proyecto.
- Fecha de venta, si está disponible.
- Precio final.
- Ganancia neta real.

Debe ser posible identificar rápidamente las operaciones más recientes y abrir el proyecto correspondiente si existe la navegación necesaria.

Si no hay ventas, debe mostrarse un estado vacío claro, sin inventar operaciones.

## 9. Reglas financieras fundamentales

Toda métrica tiene que derivarse de los datos disponibles, no de importes escritos directamente en los componentes visuales.

Las definiciones son:

- **Ganancia realizada:** precio final de venta menos precio de compra, repuestos y todos los gastos atribuibles registrados.
- **Ganancia mensual:** suma de las ganancias realizadas de las operaciones cuya fecha de venta pertenece al período seleccionado.
- **Ganancia total:** suma histórica de los beneficios netos de todas las operaciones vendidas.
- **Ganancia proyectada:** ganancia estimada exclusivamente de los proyectos actualmente en estado “En venta”.
- **Total invertido:** inversión y gastos acumulados históricamente, incluso en operaciones ya cerradas.
- **Capital de inversión actual:** costos comprometidos en proyectos todavía no vendidos.
- **Gastos del período:** gastos registrados cuya fecha cae dentro del período seleccionado.

No confundir facturación con beneficio neto. No sumar la ganancia potencial a las ganancias reales. No contabilizar dos veces los mismos gastos.

Al cerrar una venta, la operación debe dejar de formar parte del capital comprometido en inventario y su resultado neto debe pasar a las ganancias realizadas.

Si faltan datos para calcular una métrica, mostrar el dato como incompleto o no disponible, en lugar de inventar resultados que parezcan reales.

Los importes monetarios se expresan en pesos argentinos, por ejemplo: $125.000.

## 10. Catálogo de celulares y repuestos

La aplicación debe permitir gestionar un catálogo reutilizable de modelos, variantes y repuestos.

Cada modelo puede asociarse con distintos componentes, por ejemplo:
- Módulos.
- Baterías.
- Pines de carga.
- Flex.
- Cámaras y vidrios de cámara.
- Tapas traseras.
- Otros componentes.

Un mismo modelo puede tener distintos repuestos compatibles, diferentes calidades y diversos proveedores.

Los precios deben poder actualizarse y tener una fecha de referencia.

El catálogo debe separarse de los proyectos: modificar el precio de un repuesto no debe alterar automáticamente los importes históricos ya registrados en compras y reparaciones cerradas.

En futuras etapas se podrán incorporar herramientas para importar modelos y precios mediante archivos CSV, y sincronizar los datos mediante el backend.

No se debe asumir que existe una API pública con todos los precios de repuestos y reventa de Argentina. El sistema debe permitir mantener estos valores de forma manual o mediante importaciones que se desarrollen posteriormente.

## 11. Organización de datos y persistencia

La información de los proyectos y sus resultados debe mantenerse consistente.

A futuro, la arquitectura del backend tendrá:
- Modelos de dispositivos.
- Repuestos y compatibilidades.
- Proveedores y precios de repuestos.
- Precios estimados de reventa.
- Proyectos individuales.
- Diagnósticos y fallas.
- Compras y gastos.
- Ventas.
- Movimientos financieros.

Es importante guardar por separado los precios actuales del catálogo y los costos históricos de cada operación.

El sistema debe permitir reconstruir cuánto costó realmente una reparación y cuánto beneficio produjo una venta.

Durante la etapa de desarrollo visual, los datos pueden ser ficticios, pero deben estar estructurados de forma que posteriormente puedan sustituirse por datos reales sin reescribir todas las pantallas.

## 12. Prioridades generales de desarrollo

La prioridad es tener una aplicación que realmente me sirva para gestionar mi negocio de reparación y reventa de celulares.

El orden de prioridades es:

1. Experiencia móvil clara y rápida.
2. Flujo de creación de proyectos y diagnóstico.
3. Cálculo fiable de precios máximos de compra y ganancias.
4. Catálogo de modelos y repuestos.
5. Seguimiento del estado de cada proyecto.
6. Resumen de ganancias, gastos e inversión.
7. Persistencia fiable e integración con el backend.
8. Estadísticas y mejoras posteriores.

No desarrollar funcionalidades complejas antes de que las fundamentales funcionen correctamente.

No agregar secciones solo para aumentar la cantidad de funcionalidades. Cada elemento debe tener una utilidad clara.

## 13. Instrucciones permanentes para trabajar en el proyecto

Siempre que continúes desarrollando la aplicación:

- Inspeccioná el código existente antes de modificarlo.
- Conservá las decisiones técnicas y visuales que ya funcionan.
- Mantené la aplicación exclusivamente móvil.
- Reutilizá componentes, estilos y tipos compartidos.
- No rehagas la pantalla Proyectos sin una razón concreta.
- No agregues librerías innecesarias.
- Mantené tipado estricto con TypeScript.
- No inventes datos financieros ni trates estimaciones como valores reales.
- Priorizá claridad y simplicidad por encima de la cantidad de funciones.
- Comprobá los cambios y corregí los errores antes de dar una tarea por finalizada.
- Al terminar cada etapa, indicá qué se implementó, qué archivos se modificaron y cómo comprobar el resultado.

El resultado final debe ser una aplicación móvil sólida, coherente y práctica que me permita evaluar compras, reparar celulares, controlar el capital invertido y medir las ganancias reales de mi negocio.


seguir esta forma de directorios:
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── proyectos.tsx
│       ├── ganancias.tsx
│       └── crear-proyecto.tsx
│
└── components/
    ├── proyectos/
    │   ├── ProyectoCard.tsx
    │   ├── ProyectosSearch.tsx
    │   └── ProyectosFilters.tsx
    │
    ├── ganancias/
    │   ├── GananciaMensual.tsx
    │   ├── ResumenFinanciero.tsx
    │   └── UltimasVentas.tsx
    │
    └── crear-proyecto/
        ├── SelectorModelo.tsx
        ├── DiagnosticoForm.tsx
        └── CalculadoraCompra.tsx


**Este contexto define la visión general del proyecto. Para cada tarea nueva, implementá solamente el alcance solicitado, respetando la arquitectura y el diseño existentes. reutiliza componentes**