---
title: "Inteligencia a bordo: NPU, AI Engine y aceleradores AOCS"
layout: article
weight: 4
estado: "NPU y acelerador AOCS validados en FPGA · AI Engine en diseño"
hidecover: true
seotitle: "IA a bordo para satélites: NPU, AI Engine y aceleradores AOCS — Hercoss"
summary: "Tres motores que permiten a una nave ver, pensar y orientarse por sí misma. Una NPU que clasifica imágenes en un tercio de milisegundo, un gran AI Engine para modelos más pesados y un acelerador de control de actitud que resuelve el problema de control en hardware. Dos de los tres ya funcionan en silicio FPGA."
datos:
  - "0.333 ms por imagen"
  - "~3,000 inferencias / s"
  - "MPC resuelto en hardware"
  - "Idéntico bit a bit simulación → silicio"
---

{{< stats >}}
{{< stat "0.333 ms" "para clasificar una imagen, medido en silicio FPGA" >}}
{{< stat "~3,000" "inferencias por segundo con una sola NPU" >}}
{{< stat "70 × 70" "problema de control resuelto en hardware, en punto flotante de 32 bits" >}}
{{< stat "128×" "más unidades de cómputo en el AI Engine del A1 que en la NPU actual" >}}
{{< /stats >}}

## Por qué importa

Un satélite moderno produce muchos más datos de los que puede enviar a tierra,
y a menudo tiene que reaccionar más rápido de lo que una estación terrestre
puede responder. El valor se traslada a bordo: **decidir en órbita, bajar solo
lo que importa y orientarse sin esperar.**

Eso requiere tres tipos distintos de cómputo, y el HERCOSS Exxo A1 pone los tres
en el mismo chip que sus dieciséis procesadores:

{{< fig "onboard-ai.svg" "Percepción, IA pesada y control, de los sensores a los actuadores, en un solo chip." >}}

## NPU: percepción en el borde

**Para qué sirve:** mirar las imágenes conforme llegan y decidir qué muestran,
como nubes, barcos, incendios, daños o anomalías, para que solo se guarden o se
envíen los datos útiles.

**Qué existe hoy:** un acelerador de redes neuronales convolucionales INT8,
escrito en VHDL-2008 alrededor de un arreglo sistólico de 8 × 8. Ejecuta una red
completa (dos capas de convolución, pooling, una capa totalmente conectada y la
decisión final) enteramente en hardware. Busca sus propios pesos e imágenes en
memoria, así que el procesador solo la arranca y lee la respuesta.

| Medido en silicio FPGA (AMD Versal VE2302) | Resultado |
|---|---|
| Tiempo por inferencia | **0.333 ms** |
| Rendimiento | **~3,000 inferencias por segundo** |
| Exactitud | La misma firma en el modelo de Python, cada capa del RTL, la integración AXI y el silicio |
| Tamaño | Cerca de un tercio de la lógica de esta FPGA; columnas DSP y casi toda la block RAM libres |
| Reloj | 87.1 MHz en la FPGA, timing cumplido con margen positivo |

## Acelerador AOCS: control en hardware

**Para qué sirve:** mantener la nave apuntando adonde debe. El control moderno de
actitud y órbita usa **control predictivo por modelo (MPC)**: en cada paso de
control resuelve un pequeño problema de optimización que respeta los límites de
las ruedas de reacción y los magnetopares. Esa solución es un cálculo pesado y
repetitivo con un plazo estricto de tiempo real, justo el tipo de trabajo que
corresponde al hardware.

**Qué existe hoy:** un acelerador que resuelve ese problema por sí solo. El
procesador escribe unos punteros y un bit de inicio; el acelerador carga el
problema desde memoria, itera hasta la solución en punto flotante de 32 bits y
escribe el resultado de vuelta, mientras el procesador queda libre.

| Medido en silicio FPGA (AMD Versal VE2302) | Resultado |
|---|---|
| Tamaño del problema | Matriz de 70 × 70, punto flotante IEEE-754 de 32 bits |
| Paralelismo | 8 carriles trabajando a la vez |
| Exactitud | Unidad de punto flotante idéntica bit a bit al operador de referencia de AMD; firma idéntica de la simulación al silicio |
| Tamaño | ~13 % de la lógica, 22 % de la block RAM, ~40 bloques DSP |
| Timing | Cumplido con +2.8 ns de margen |

## AI Engine: IA pesada para el Exxo A1

**Para qué sirve:** modelos más grandes de los que cabe en una sola NPU: redes
convolucionales mayores, redes neuronales de impulsos, transformers y las
matemáticas matriciales detrás de la estimación y el control.

**Dónde está:** el AI Engine es el gran arreglo de cómputo del A1. Su
arquitectura está definida y su RTL es el siguiente paso: **8 bloques de 1,024
unidades de multiplicación-acumulación cada uno, con 512 KiB de memoria local por
bloque, unos 12 TMAC/s a la frecuencia objetivo del A1.** Cada bloque se puede
apagar cuando la misión no lo necesita.

{{< fig "mac-scale.svg" "De la NPU probada de 64 MAC al AI Engine de 8,192 MAC del Exxo A1." >}}

La NPU y el acelerador AOCS son sus bloques ya probados: los mismos métodos de
diseño y la misma verificación, a mayor escala.

## Hecho para ser confiable

Cada uno de estos motores se verifica de la misma forma:

- **Primero un modelo de referencia independiente,** escrito antes que el
  hardware.
- **Capa por capa,** cada capa termina en una sola firma que debe coincidir con
  el modelo bit a bit.
- **Pruebas que demuestran que detectan:** cada capa se rompe a propósito de
  varias formas, y cada rotura debe detectarse.
- **Después, silicio real,** donde debe aparecer de nuevo la misma firma.

{{< detalle "¿Qué falta por hacer?" >}}
- La NPU ejecuta una red compacta sobre imágenes pequeñas (16 × 16); modelos y
  tamaños de imagen mayores son el siguiente paso, y el AI Engine del A1 es
  donde correrán.
- El acelerador AOCS resuelve hoy el problema MPC; un segundo modo para
  estimación de estado está reservado para la fase 2.
- El AI Engine está en diseño: su RTL y la integración de los tres motores con
  los núcleos RV128IMAC y la red NOC_512.
- Todas las cifras vienen de una FPGA. En el A1, reloj y velocidad serán los del
  nodo de producción.
{{< /detalle >}}

## Invierta en inteligencia a bordo

La IA a bordo y el control autónomo son hacia donde se mueve el valor de una nave
espacial moderna. El HERCOSS Exxo A1 los lleva al mismo chip europeo que los
procesadores, el tejido FPGA y las interfaces espaciales.
[Invertir en Hercoss →](/es/invest/)
