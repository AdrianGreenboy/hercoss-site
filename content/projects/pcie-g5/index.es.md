---
title: "PCIE_G5: PCIe Gen5 para el espacio, un enlace que se repara solo"
layout: article
weight: 8
estado: "En desarrollo · capa física funcionando en silicio a 4 × 16 Gb/s, una hora sin errores (27 nov 2026)"
hidecover: true
seotitle: "PCIE_G5: IP de controlador PCI Express Gen4 / Gen5 europeo para el espacio — Hercoss"
summary: "El controlador PCI Express propio de Hercoss para el HERCOSS Exxo A1, escrito desde cero en VHDL-2008. Un solo núcleo cubre Gen4 y Gen5, de 1 a 16 carriles, en una versión comercial y otra endurecida contra radiación a partir del mismo código, y está diseñado para que las perturbaciones más comunes por partículas se reparen en el lugar mientras los datos siguen fluyendo. En su primer día corrió en transceptores reales: cuatro carriles a 16 Gb/s, una hora, cero errores."
datos:
  - "Gen4 + Gen5 · 16 / 32 GT/s"
  - "De 1 a 16 carriles"
  - "COTS y rad-hard del mismo código"
  - "Silicio: 4 × 16 Gb/s, 1 hora, 0 errores"
  - "45 / 45 corridas de simulación pasan"
  - "286 MHz en FPGA; Gen5 necesita ~246"
---

{{< stats >}}
{{< stat "0" "errores en una hora en silicio: 389,812,475,855 palabras de prueba a 4 × 16.0 Gb/s, todas recibidas correctas" >}}
{{< stat "~4 µs" "para reparar una perturbación en un receptor en silicio, sin salir del modo de datos; la cura estándar toma milisegundos" >}}
{{< stat "~504 Gb/s" "de carga útil en cada sentido por un puerto Gen5 x16; tres planeados en el Exxo A1" >}}
{{< stat "286 MHz" "en la FPGA tras una ronda de rediseño, por encima de los ~246 MHz que necesita Gen5" >}}
{{< /stats >}}

{{< aviso "Análisis de patente en curso" >}}
Las funciones de autorreparación de PCIE_G5 están en análisis de patente. Esta
página muestra lo que buscan lograr y dónde están; cómo funcionan no se
publica.
{{< /aviso >}}

## Qué es

**PCIE_G5 es el núcleo controlador PCI Express propio de Hercoss** para el FPGA
SoC [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/), escrito desde cero en
VHDL-2008. Un solo núcleo cubre **Gen4 (16 GT/s) y Gen5 (32 GT/s), de 1 a 16
carriles**, y se construye en dos versiones a partir del mismo código: una
comercial (COTS) y otra endurecida contra radiación para el espacio. El plan del
Exxo A1 tiene **tres puertos PCIe Gen5 x16.**

El desarrollo empezó el 27 de noviembre de 2026. **Ese mismo día** la parte lógica de la capa física y su interfaz con los transceptores quedaron escritas, pasaron la simulación **y corrieron en transceptores reales: cuatro carriles a 16 Gb/s cada uno en una placa AMD Versal, una hora con cero errores.**

{{< fig "pcie-a1.es.svg" "Dónde va PCIE_G5 en el HERCOSS Exxo A1: tres puertos Gen5 x16 entre la red de 512 bits del chip y el mundo exterior. Plan." >}}

## Por qué construimos el nuestro

**PCIe es la forma en que un chip habla con el resto de la computadora:**
almacenamiento, aceleradores, tarjetas de red y otros procesadores. Un puerto
Gen5 x16 lleva unos **504 Gb/s de carga útil en cada sentido.** Para la
computadora de una nave espacial, eso significa grabadores de estado sólido,
aceleradores de IA y procesadores de carga útil conectados a toda velocidad.

**Tener el controlador propio cambia la economía y el riesgo:**

- **Sin licencia por chip.** Cada Exxo A1 que se venda lleva tres de estos
  puertos sin volver a pagarlos.
- **Control total de la versión endurecida contra radiación.** Un controlador
  comprado es una caja negra; el nuestro se puede endurecer donde el espacio lo
  pide.
- **Una fuente europea** para un bloque que normalmente se compra a un puñado
  de proveedores de IP.

## Un enlace que se repara solo

En el espacio, una sola partícula puede sacar de paso a un carril de un enlace
de alta velocidad. **Un enlace estándar entonces se detiene y se reentrena:**
todos los carriles se callan, el dispositivo del otro extremo lo nota y el
sistema espera.

**PCIE_G5 está diseñado para que las perturbaciones más comunes se reparen en
el lugar**, en el carril afectado, **mientras los datos siguen fluyendo por los
demás carriles y sin que el dispositivo del otro extremo lo note.** Esa es la intención, y **en silicio ya se cumple con los fallos probados hasta ahora.**

{{< fig "pcie-upset.es.svg" "La intención, lado a lado. Izquierda: un enlace estándar se detiene en todos los carriles. Derecha: PCIE_G5 repara en el lugar el carril afectado mientras los demás siguen, como se midió en silicio. Concepto, no a escala." >}}

## Primer silicio: una hora, cero errores

El 27 de noviembre de 2026, el mismo día en que empezó el desarrollo, PCIE_G5
corrió en una placa Trenz TE0950 con un dispositivo AMD Versal: **cuatro
carriles a 16.0000 Gb/s cada uno (medido)**, con los transceptores en lazo
interno.

{{< fig "pcie-hour.es.svg" "La corrida de una hora en silicio: 389,812,475,855 palabras de prueba enviadas y el mismo número recibidas correctas, en los cuatro carriles." >}}

- **389,812,475,855 palabras de prueba** enviadas en una hora, y el mismo
  número recibidas correctas. **Cero malas, cero perdidas, cero errores de
  ningún tipo en ningún carril.**
- Unos **200 terabits de carga útil revisada a 55.4 Gb/s**, y 2.3 × 10¹⁴ bits en
  la línea: una **tasa de error de bit menor a 1.3 × 10⁻¹⁴** (95 % de
  confianza).
- La compilación en la FPGA cumplió timing con 1.5 ns de margen a 125 MHz.

### Después lo golpeamos a propósito

{{< fig "pcie-inject.es.svg" "Fallos inyectados en silicio mientras el enlace llevaba datos. En cada inyección solo el carril afectado reportó algo; los otros tres se quedaron en cero." >}}

| Fallo inyectado en silicio | Resultado |
|---|---|
| Un bit invertido | Detectado, atribuido al carril correcto, el enlace sigue arriba |
| Perturbación en el estado del desaleatorizador de un receptor | **Reparada por el propio receptor**; 438 palabras afectadas (unos 4 µs); el enlace nunca salió del modo de datos |
| Deslizamiento de bit en la recuperación de reloj de un carril | **Reparado por el propio receptor**; 724 palabras perdidas (unos 7 µs); el enlace nunca salió del modo de datos |
| Reentrenamiento con tráfico | 54 millones de palabras, ninguna mala ni perdida |

**En cada inyección solo el carril afectado reportó algo; los otros tres se
quedaron en cero.** La cura estándar para la perturbación del desaleatorizador
y el deslizamiento de bit es una recuperación del enlace, que toma
milisegundos. PCIE_G5 los reparó en microsegundos y mantuvo el enlace en modo
de datos. Las palabras afectadas durante una interrupción son la única pérdida;
la capa de enlace de datos, que todavía no está escrita, las reenviará.

## Probado también en simulación

{{< stats >}}
{{< stat "45 / 45" "corridas de simulación automatizadas, todas pasan, incluido el diseño de prueba que corre en la placa" >}}
{{< stat "1–16" "carriles cubiertos: 1, 2, 4, 8 y 16, a 8, 16 y 32 GT/s" >}}
{{< stat "±5000 ppm" "de diferencia de frecuencia entre dos relojes independientes" >}}
{{< stat "128 / 128" "alineaciones de bit posibles de un carril, recorridas" >}}
{{< /stats >}}

Las corridas de simulación también cubren el desfase entre carriles y los
errores de bit inyectados, y las mismas tres inyecciones de fallos pasan en
simulación igual que en silicio.

## Rápido desde el primer rediseño

{{< fig "pcie-timing.es.svg" "Timing en la FPGA, 4 carriles: de 138 MHz en la primera versión a 286 MHz tras una ronda de rediseño, con menos lógica. En esta arquitectura Gen5 necesita unos 246 MHz y Gen4 unos 123 MHz." >}}

Tras una ronda de rediseño, el núcleo pasó **de 138 MHz a 286 MHz** a nivel de
bloque (284 MHz con la interfaz con los transceptores, frente a un objetivo de
250 MHz), y la lógica **se redujo de 10.7k a 8.3k LUT.** En esta arquitectura
Gen5 necesita unos 246 MHz y Gen4 unos 123 MHz, así que el timing ya tiene
espacio para Gen5 en la FPGA.

## Dónde está

{{< fig "pcie-status.es.svg" "Cada capa de PCIE_G5 y su estado al 27 de noviembre de 2026." >}}

| Capa | Estado al 27 nov 2026 |
|---|---|
| Capa física, parte lógica (codificación 128b/130b, 1–16 carriles, 8 / 16 / 32 GT/s) | Escrita, pasa simulación |
| Interfaz con los transceptores (alineación de bits, cruce de dominios de reloj, alineación de carriles) | Escrita, pasa simulación |
| Timing en FPGA (AMD Versal xcve2302-1LP, 4 carriles, fuera de contexto) | 286 MHz para la parte a nivel de bloque, 284 MHz con la interfaz con los transceptores; el objetivo era 250 MHz |
| Prueba en transceptores reales (placa TE0950, 4 carriles × 16.0 Gb/s, lazo interno) | **Superada**: autoprueba con inyección de fallos y una corrida de una hora con cero errores |
| Máquina de estados de entrenamiento del enlace (LTSSM), arranque a 2.5 GT/s | Sin empezar |
| Capa de enlace de datos (reenvío, control de flujo) | Sin empezar |
| Capa de transacciones, espacio de configuración, roles Root Complex / Endpoint | Sin empezar |
| Prueba contra un dispositivo PCIe comercial | Hito posterior, necesita otra placa |

Hasta ahora, unas 2,700 líneas de VHDL-2008, más los testbenches.

## Límites, con honestidad

- **Solo existe la capa física.** Un controlador PCIe completo necesita las
  tres capas restantes: entrenamiento del enlace, enlace de datos y
  transacciones.
- **La prueba en placa revisa el núcleo contra sí mismo** por el lazo interno
  de los transceptores: sin conector, sin cable, sin dispositivos de otro
  fabricante. Demuestra la ruta de datos y las funciones de autorreparación en
  transceptores reales; no demuestra la compatibilidad con dispositivos de
  otros fabricantes.
- **El arranque del enlace en la prueba en placa es un pequeño secuenciador de
  prueba**, no la máquina completa de entrenamiento del enlace.
- **Diseñado para PCI Express Gen4 / Gen5; las pruebas de compatibilidad con
  dispositivos comerciales son un hito posterior.**
- **La placa disponible hoy** (Trenz TE0950) limita la prueba en silicio a
  cuatro carriles y a velocidad Gen4. Gen5 y los 16 carriles se quedan en
  simulación hasta tener una placa más grande; el mismo código sirve para
  ambas.
- **Los retimers** en el camino todavía no están soportados.

## Hoja de ruta

1. **Hecho el 27 nov 2026, primer silicio:** 4 carriles a 16 Gb/s en la TE0950,
   autoprueba y una corrida de una hora con cero errores. Lo siguiente en la
   placa: la misma prueba por un cable externo.
2. **Máquina de estados de entrenamiento del enlace**, incluida la negociación
   de velocidad y ancho.
3. **Capa de enlace de datos con reenvío tolerante a la radiación.**
4. **Capa de transacciones** sobre la red de 512 bits del chip
   ([NOC_512](/es/projects/noc-512/)), Root Complex y Endpoint en un solo núcleo.
5. **Más funciones contra la radiación:** retirar un carril dañado sin tirar el
   enlace, monitoreo de salud por carril, reenlace rápido tras una
   perturbación.
6. **Membresía en PCI-SIG y especificación;** pruebas contra dispositivos
   comerciales en una placa con conector PCIe y reloj de referencia de 100 MHz.
7. **Gen5 y 16 carriles en una placa FPGA más grande**, y después el silicio
   del Exxo A1.

## Parte de la familia IP de Hercoss

PCIE_G5 se une a los [núcleos IP de Hercoss](/es/projects/ip-core-family/) que
forman el Exxo A1: el procesador [RV128IMAC](/es/projects/rv128imac/), la red en
chip que se repara sola [NOC_512](/es/projects/noc-512/), el núcleo
[Ethernet de 1.6 Tb/s](/es/projects/eth-1t6/) y el controlador de memoria que se
repara solo [DDRC_72](/es/projects/ddrc-72/). La misma idea los une a todos:
**un chip para el espacio que sigue funcionando cuando lo golpea una
partícula**, diseñado en Europa, en casa.

¿Le interesa el HERCOSS Exxo A1 o PCIE_G5?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invertir en Hercoss →](/es/invest/)
