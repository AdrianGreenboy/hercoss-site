---
title: "Ethernet de 1.6 Tb/s: corrección de errores funcionando en silicio"
layout: article
weight: 6
estado: "Validado en silicio · MAC, PCS, corrección de errores RS(544,514), alineación de carriles"
hidecover: true
seotitle: "Núcleo IP Ethernet MAC, PCS y FEC de 1.6 Tb/s, europeo y propio — Hercoss"
summary: "La implementación propia de Hercoss de la velocidad Ethernet más rápida que se estandariza hoy: una capa de enlace completa de 1.6 Tb/s (MAC, PCS, corrección de errores Reed-Solomon y alineación de carriles) diseñada desde cero para el HERCOSS Exxo A1. Funcionando en silicio FPGA: 312 mil millones de tramas en una hora, cero errores."
datos:
  - "Objetivo de 1.6 Tb/s"
  - "312 mil millones de tramas, 0 errores"
  - "1–15 errores de símbolo: todos corregidos"
  - "Ráfagas de errores reparadas a velocidad completa"
  - "Idéntico bit a bit a los vectores IEEE 802.3"
---

{{< stats >}}
{{< stat "312 mil mill." "de tramas en una corrida de una hora en silicio, cero errores" >}}
{{< stat "108 mil mill." "de palabras de código de corrección de errores revisadas en esa hora, cero malas" >}}
{{< stat "20 / 20" "palabras de código reparadas cuando se dañan de dos en dos, diez veces seguidas" >}}
{{< stat "0" "veces que se entregaron datos corruptos como válidos" >}}
{{< /stats >}}

{{< aviso "En proceso de patente" >}}
La arquitectura del receptor de corrección de errores es nueva, y su patente
está en proceso. Esta página muestra lo que logra el núcleo; los detalles de la
tecnología se reservan hasta que ese proceso lo permita.
{{< /aviso >}}

## Qué es

El núcleo Ethernet 1.6T de HERCOSS es nuestra propia implementación de la
velocidad Ethernet más rápida que se estandariza hoy: **1.6 terabits por
segundo**. Es una capa de enlace completa, diseñada en casa desde cero para el
chip [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/).

{{< fig "eth-stack.svg" "Todo lo que hay entre la red interna del chip y los 16 carriles de línea es diseño propio de Hercoss." >}}

- **MAC:** generación y verificación de tramas.
- **PCS:** codificación de línea, aleatorización y distribución entre carriles.
- **FEC:** corrección de errores hacia adelante Reed-Solomon RS(544,514):
  codificador, detección de errores y corrección completa.
- **Alineación de carriles:** enganche, corrección de desfase y reordenamiento
  automáticos de los carriles.
- **Interfaz de software:** un banco de registros con contadores, eventos e
  interrupciones.

**No es un envoltorio de IP de terceros. Cada bloque es nuestro**, y la
arquitectura de su receptor de corrección de errores es nueva.

## Por qué importa

Los clústeres de IA y los centros de datos pasan de enlaces de 400G y 800G a
1.6T. A esa velocidad, la lógica que forma, protege y alinea los datos es uno de
los bloques digitales más difíciles de un chip, y hoy solo lo ofrecen unos pocos
proveedores. Un núcleo 1.6T europeo y desarrollado de forma independiente da al
HERCOSS Exxo A1 su propia red de alta velocidad, **sin depender de licencias**.

A 1.6 Tb/s un controlador ya no puede manejar una trama a la vez: cada ciclo de
reloj lleva 4,096 bits, suficiente para que varias tramas completas empiecen y
terminen dentro del mismo ciclo. El núcleo está hecho para eso desde el
principio, y su ancho coincide con ocho carriles de la red
[NOC_512](/es/projects/noc-512/), así que los datos pasan entre el puerto y el
resto del chip sin conversión.

{{< fig "eth-cycle.svg" "Un ciclo de reloj a 1.6 Tb/s: 4,096 bits, ocho carriles de red, varias tramas. Conceptual." >}}

## Medido, no prometido

El núcleo funciona hoy en silicio real, una FPGA AMD Versal, en una
configuración a escala que cabe en el dispositivo (un flujo FEC, 8 carriles), con
un reloj de sistema de 300 MHz y margen de timing medido. La cadena completa
funciona a la vez: MAC, PCS, FEC y alineación de carriles.

{{< fig "eth-hour.svg" "Una hora a plena carga en la placa FPGA, con contadores independientes en ambos extremos del enlace." >}}

| Resultado | Medido en silicio |
|---|---|
| Carga útil sostenida | **129 Gb/s** a través de MAC + PCS + FEC + alineación de carriles |
| Corrida de resistencia de una hora | **312 mil millones de tramas, cero errores** |
| Palabras de código revisadas en esa hora | **108 mil millones, cero malas** |
| Corrección de errores | **De 1 a 15 errores de símbolo por palabra de código: todos corregidos, ninguna trama perdida** |
| Más allá del límite del código | 16 errores de símbolo: detectados y señalados, nunca entregados como datos buenos |
| Varias palabras de código dañadas a la vez | **Reparadas juntas, a velocidad completa** |
| Manejo de carriles | Carriles mezclados, desplazados y desfasados a propósito: enganchados y reordenados automáticamente |
| Timing | Cierra a 300 MHz con margen medido |

### Corrige errores, en hardware, a toda velocidad

Inyectamos errores a propósito en el enlace en funcionamiento, desde software,
con control total sobre cuántos símbolos se dañan y dónde. Con la corrección
activa, los daños que destruirían tramas se reparan al vuelo: el receptor reporta
las palabras de código reparadas y la aplicación no pierde nada. El rendimiento
no cambia.

### Conoce su propio límite

{{< fig "eth-fec.svg" "Errores de símbolo inyectados por palabra de código en el enlace en funcionamiento. De 1 a 15: reparados. 16: declarada incorregible, nunca entregada." >}}

El código puede reparar hasta 15 errores de símbolo por palabra de código.
Probamos cada caso, 1, 2, 3 … 15: todos reparados. Con 16 el núcleo hace
exactamente lo que debe: declara la palabra de código incorregible y marca los
datos como inválidos. **En ninguna prueba se entregaron datos corruptos como
válidos.**

### Aguanta cuando los errores llegan en ráfagas

Los enlaces reales no fallan una palabra de código a la vez. En silicio dañamos
dos palabras de código en el mismo instante y lo repetimos diez veces seguidas:
**cada palabra de código se reparó, sin perder ninguna trama.** Un receptor
compacto que aguanta las ráfagas tolera muchos más errores de lo que su tamaño
sugiere.

{{< fig "eth-burst.svg" "Dos palabras de código dañadas en el mismo instante, diez rondas seguidas, en el enlace en funcionamiento en silicio." >}}

### Sigue el estándar bit a bit

{{< fig "eth-vectors.svg" "La ruta de transmisión reproduce exactamente los vectores de prueba de referencia oficiales." >}}

La ruta de transmisión reproduce exactamente los vectores de prueba de
referencia oficiales del IEEE 802.3 para 200G, 400G y 800G, y los vectores de
ejemplo publicados del borrador del estándar 1.6T (P802.3dj).

## Cómo llegamos aquí

| Paso | Hito |
|---|---|
| MAC | Controlador de tramas completo y verificado en simulación con cuatro anchos de ruta de datos, incluido el ancho completo de 1.6 Tb/s; de la primera línea a un diseño limpio en timing en una sola sesión de trabajo |
| MAC + PCS en silicio | A un cuarto del ancho final: 258.3 Gb/s de carga útil, exactamente la cifra teórica; 625 mil millones de tramas en una hora, cero errores |
| Capa de enlace completa en silicio | Corrección de errores y alineación de carriles añadidas: 129 Gb/s a través de la cadena completa, 312 mil millones de tramas en una hora, cero errores |
| Ráfagas de errores en silicio | Dos palabras de código dañadas a la vez, diez veces seguidas: todas reparadas a velocidad completa, ninguna trama perdida |

{{< detalle "¿Por qué el rendimiento más reciente es menor que el anterior?" >}}
La corrida anterior de 258.3 Gb/s llevaba el controlador de tramas y las
primeras etapas del PCS. La corrida más reciente lleva la capa de enlace
completa, incluidos el decodificador Reed-Solomon y la alineación de carriles, en
una configuración a escala para caber en la misma FPGA. Ambas se miden a 300 MHz
en la misma placa. La tasa de la ruta de datos completa de 1.6 Tb/s se
establecerá en el propio chip A1.
{{< /detalle >}}

## Lo que aún falta

Creemos en decir lo que todavía no está hecho.

- Los resultados en silicio vienen de una **configuración a escala** (un flujo
  FEC, 8 carriles). La estructura 1.6T completa, dos flujos FEC y 16 carriles,
  está verificada en simulación y es más grande que nuestra FPGA de evaluación.
  Se validará en silicio en un dispositivo más grande o en el propio chip A1,
  que es también donde se establecerá su velocidad completa.
- El enlace de prueba es un **canal interno** dentro del dispositivo. La conexión
  a transceptores ópticos o eléctricos es el siguiente paso de integración.

## El método

Cada resultado de esta página sigue la misma regla: **simularlo, sintetizarlo y
luego probarlo en la placa.** Nada se reporta como funcionando hasta que haya
corrido en silicio con contadores independientes en ambos extremos del enlace, y
cada cambio corre al menos una hora de tráfico continuo antes de contar.

## Construido sobre Ethernet probado

El núcleo 1.6T se basa en la familia Ethernet de Hercoss que ya funciona en
silicio FPGA: un MAC y PCS de 40G que interoperan con una tarjeta de red
comercial en una prueba de una hora con cero errores, Ethernet de 25G y un enlace
SerDes de 103 Gb/s. Vea [Enlaces de alta velocidad](/es/projects/high-speed-links/).

## En el Exxo A1

En el [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/), este núcleo maneja el
puerto 1.6TbE en ocho carriles PAM4 de 224 Gb/s, parte de los hasta ~2 Tbps de
Ethernet que el chip puede llevar a la vez.

Para consultas técnicas o de inversión:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invertir en Hercoss →](/es/invest/)
