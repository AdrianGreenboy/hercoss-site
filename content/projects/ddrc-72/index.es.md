---
title: "DDRC_72: el controlador de memoria DDR4 que se repara solo"
layout: article
weight: 7
estado: "RTL v0.1 completo · Verificado en simulación · Controlador de memoria del Exxo A1"
hidecover: true
seotitle: "DDRC_72: controlador de memoria DDR4 tolerante a la radiación que se repara solo, para el espacio — Hercoss"
summary: "Memoria que sobrevive al entorno de radiación en el que vuela. DDRC_72 es el controlador de memoria DDR4 de 72 bits propio de Hercoss para el HERCOSS Exxo A1: mantiene los datos correctos cuando muere un chip de memoria completo, repara fallos por sí mismo y, en la variante endurecida contra radiación, repara su propia lógica tras un latch-up. Verificado en simulación: 0 errores de datos, 0 violaciones de timing JEDEC."
datos:
  - "DDR4 de 72 bits, hasta 128 GiB"
  - "Sobrevive a un chip de memoria muerto"
  - "Lógica que se repara sola (rad-hard)"
  - "0 errores de datos en simulación"
---

{{< stats >}}
{{< stat "128 GiB" "de DDR4 detrás de un controlador de 72 bits: 64 bits de datos + 8 de corrección de errores" >}}
{{< stat "1 chip" "puede fallar por completo y los datos siguen regresando correctos" >}}
{{< stat "3,776" "casos de prueba de corrección de errores, incluidos chip muerto y poison: 0 errores" >}}
{{< stat "0" "errores de datos y 0 violaciones de timing JEDEC en simulación del sistema completo" >}}
{{< /stats >}}

## Qué es

DDRC_72 es el **controlador de memoria DDR4 del [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/)**,
escrito en casa en VHDL-2008 y pensado para el tape-out. Maneja un bus de memoria
de 72 bits (64 bits de datos más 8 de corrección de errores) y admite hasta
**128 GiB** de DRAM. Se conecta a la red en chip [NOC_512](/es/projects/noc-512/)
mediante una interfaz AXI4 completa.

{{< fig "ddr-fit.svg" "Cada procesador, el tejido FPGA y toda la E/S llegan a la memoria externa a través de NOC_512 y DDRC_72. Concepto." >}}

**Un diseño, dos productos.** El mismo RTL genera una variante **COTS** para
misiones comerciales y New Space, y una variante **endurecida contra radiación**
para misiones GEO, de espacio profundo e interplanetarias. La elección es una
opción de compilación, no un segundo diseño.

## Por qué la memoria es el punto débil en el espacio

Una computadora satelital guarda en DRAM todo lo que está haciendo, y en el
espacio la DRAM es el componente más expuesto a la radiación:

- **Partículas individuales invierten bits.** Un rayo cósmico o un protón solar
  atraviesa una celda de memoria y un 0 se vuelve 1.
- **Chips de memoria completos pueden fallar.** No un bit, sino todos los bits
  que guarda un chip.
- **Los iones pesados pueden provocar latch-up** en el propio controlador: un
  cortocircuito que, si no se atiende, quema el silicio.
- **En el peor caso, una partícula destruye físicamente circuitería.**

La mayoría de los controladores del mercado corrigen un solo bit invertido, o
dependen del software para notar los problemas después. **DDRC_72 está diseñado
para mantener la memoria disponible por sí mismo.**

## Qué hace diferente DDRC_72

{{< aviso "En proceso de patente" >}}
Las innovaciones de esta sección están en proceso de patente. Describimos lo que
logran; cómo funcionan se publicará cuando ese proceso lo permita.
{{< /aviso >}}

### Sobrevive a un chip de memoria muerto

Una palabra de 72 bits se reparte entre muchos chips DRAM. Si uno de ellos muere
por completo, DDRC_72 sigue devolviendo datos correctos, de forma transparente.
Es protección de clase chipkill: corrige la falla completa de un chip de memoria,
y después un chip que se sabe muerto más un error adicional. Cualquier cosa más
allá se marca con un indicador **poison** exacto, así que **nunca se entregan
datos corruptos en silencio.**

{{< fig "ddr-chipkill.svg" "Un chip de memoria de la palabra falla por completo; el controlador sigue entregando datos correctos. Concepto." >}}

### Distingue un impacto de radiación de una pieza dañada

Un impacto aleatorio de partícula y una pieza de hardware que falla se parecen al
principio. DDRC_72 los distingue y repara cada clase automáticamente: un impacto
se limpia en el momento, una fila de DRAM que sigue fallando se retira y se
sustituye por una de repuesto, y un chip muerto se trata como borrado para que el
resto de la palabra siga protegido. Ningún software tiene que darse cuenta
primero.

### Limpia más rápido cuando el Sol está activo

La memoria tiene que leerse y limpiarse con regularidad antes de que los impactos
se acumulen. DDRC_72 **adapta la intensidad de la limpieza al nivel de radiación
que mide**, y limpia al instante alrededor de cada impacto detectado. Cuando el
espacio está tranquilo, el ancho de banda es para la misión.

{{< fig "ddr-scrub.svg" "Ilustración del comportamiento: el esfuerzo de limpieza sigue al entorno de radiación. No a escala; sin datos de vuelo." >}}

### Repara su propia lógica tras un latch-up

En la variante endurecida contra radiación el controlador **se repara a sí
mismo.** Tras un latch-up o un impacto destructivo en parte de su propia lógica,
aísla el daño, cambia a hardware de repuesto **sin perder datos** y sigue
funcionando. Las partes destruidas de forma definitiva se retiran para siempre.
Se degrada con elegancia en lugar de fallar, y reporta su estado al software en
cada paso.

### Un diseño, COTS y rad-hard

Los productos comerciales y los endurecidos contra radiación salen del mismo RTL
verificado. Los clientes que empiezan con el A1 COTS pasan al A1 rad-hard sin
cambiar su software ni su sistema de memoria.

## Especificaciones principales

| | |
|---|---|
| Memoria | DDR4, diseñado según JEDEC DDR4 (JESD79-4); DIMM registrados (RDIMM) y dispositivos apilados 3DS; dispositivos x4 y x8 |
| Ancho y capacidad | Bus de 72 bits (64 de datos + 8 de ECC); hasta 128 GiB; 8 rangos lógicos |
| Corrección de errores | Por símbolos, a nivel de chip: corrige la falla de un chip de memoria completo, y un chip que se sabe muerto más un error adicional; marcado poison exacto |
| Rendimiento | Motor de timing JEDEC para todas las restricciones DDR4; gestión de refresco; planificador con reordenamiento (emisión de comandos fuera de orden) para el ancho de banda |
| Motor de confiabilidad | Scrubbing de patrulla adaptado al nivel de radiación; limpieza instantánea alrededor de cada impacto; clasificación de fallos con reparación automática (filas de repuesto, borrado de chip); recuperación de interrupciones funcionales de la DRAM |
| Variante rad-hard | Hardware de controlador de repuesto con aislamiento automático de latch-up, recuperación y regreso al servicio; retiro permanente de partes destruidas; registro de estado |
| Interfaces | AXI4 completo hacia NOC_512; registros de configuración AXI4; interfaz PHY tipo DFI |
| Implementación | VHDL-2008, en casa; un solo RTL para COTS y rad-hard, elegido al compilar |

Las cifras de frecuencia y ancho de banda se publicarán cuando existan
resultados de síntesis en FPGA.

## Estado del desarrollo

{{< fig "ddr-status.svg" "Dónde está DDRC_72 al 26 de noviembre de 2026." >}}

| Hito | Estado |
|---|---|
| RTL completo: controlador, corrección de errores, motor de confiabilidad, supervisor rad-hard, autoprueba | **Hecho** · v0.1 |
| Prueba unitaria de corrección de errores: 3,776 casos, incluidos chip muerto y poison | **Hecho** · superada, 0 errores |
| Simulación del sistema completo: inicialización de DRAM, tráfico aleatorio, escrituras parciales, inversiones de bits inyectadas, un chip de memoria muerto, una fila que falla con repuesto automático | **Hecho** · 2,727 escrituras y 4,120 lecturas verificadas, 0 errores de datos, 0 violaciones de timing JEDEC |
| Simulación rad-hard: upset, latch-up y hardware destruido en la lógica propia del controlador | En curso |
| Síntesis en FPGA en AMD Versal (área, frecuencia) | Siguiente |
| Validación en silicio en la placa TE0950, controlador en el lazo con un sustituto de DRAM | Planeado |
| PHY DDR4 y DRAM reales, pruebas de radiación | Futuro, con el chip de prueba del A1 |

*Todos los resultados anteriores están verificados en simulación. DDRC_72 aún no
ha funcionado en silicio, no tiene herencia de vuelo y no está calificado ni
certificado. Está diseñado según JEDEC DDR4; el cumplimiento no se ha probado.*

## Hoja de ruta

1. **Síntesis en FPGA** en AMD Versal: primeras cifras de área y frecuencia.
2. **Autoprueba en silicio en la placa TE0950**, con el controlador en el lazo y
   un sustituto de DRAM.
3. **Chip de prueba del A1 con una PHY DDR4 real** y memoria real.
4. **Campaña de radiación.**

## Parte de la familia IP de Hercoss

DDRC_72 se une a los [núcleos IP de Hercoss](/es/projects/ip-core-family/) que
forman el Exxo A1: el procesador [RV128IMAC](/es/projects/rv128imac/), la red en
chip [NOC_512](/es/projects/noc-512/) y el núcleo
[Ethernet de 1.6 Tb/s](/es/projects/eth-1t6/). Como ellos, está diseñado en
Europa, en casa: un subsistema de memoria para el espacio que no depende de
piezas con control de exportación de EE. UU.

¿Le interesa el HERCOSS Exxo A1 o DDRC_72?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invertir en Hercoss →](/es/invest/)
