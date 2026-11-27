---
title: "Núcleos de procesador RISC-V"
weight: 9
estado: "Validado en FPGA · En desarrollo"
summary: "Núcleos de procesador escritos desde cero en VHDL: un núcleo de 64 bits y el RV128IMAC de 128 bits, el procesador del Exxo A1, que ya ejecuta Linux en hardware real con llamadas entre núcleos en 1.35 µs y SHA-3 en hardware a 129 MB/s, ~140× el software."
datos:
  - "RV64IMAC"
  - "RV128IMAC (modo dual)"
  - "Linux en FPGA"
  - "VHDL-2008"
seotitle: "Núcleos de procesador RISC-V en VHDL para el espacio — Hercoss"
---

## Qué son

Un núcleo de procesador es la parte de un chip que ejecuta las instrucciones del
software. Hercoss escribe los suyos siguiendo el estándar abierto **RISC-V**,
para poder adaptarlos, endurecerlos e integrarlos sin licencia de un fabricante
de procesadores.

{{< detalle "¿Qué significa RV64IMAC?" >}}
Es la forma en que RISC-V nombra lo que un procesador puede hacer:

- **RV64**: registros y direcciones de 64 bits.
- **I**: el conjunto base de instrucciones enteras.
- **M**: multiplicación y división en hardware.
- **A**: operaciones atómicas, necesarias para software multinúcleo.
- **C**: instrucciones comprimidas de 16 bits, que hacen los programas más pequeños.

Esa combinación basta para ejecutar Linux y sistemas operativos de tiempo real.
{{< /detalle >}}

## RV64IMAC

El núcleo de 64 bits, en desarrollo y pensado para producción. Es la base de la
familia: se comunica directamente con el resto de los núcleos IP de Hercoss.

## RV128IMAC

{{< stats >}}
{{< stat "129 MB/s" "SHA-3 en hardware desde un proceso de Linux, sin driver" >}}
{{< stat "1.35 µs" "un programa de Linux llama a una función en otra CPU" >}}
{{< stat "64" "hilos de hardware direccionables en el anillo de núcleos" >}}
{{< stat "214 / 214" "programas autoverificables pasan en la placa" >}}
{{< /stats >}}

El núcleo de 128 bits, y el procesador elegido para el Exxo A1. Funciona como
CPU de 128 bits, como CPU estándar de 64 bits o como dos CPUs de 64 bits, arranca
Linux en un prototipo FPGA, permite que una CPU llame a funciones en otra en
1.35 µs y da a los programas de Linux SHA-3 en hardware a 129 MB/s, ~140× el
software, sin driver. Sus núcleos y aceleradores comparten su propio anillo,
ahora escalado a 64 hilos de hardware y verificado a plena carga con 16
estaciones en simulación, justo con cada estación. Tiene su propia página:
[RV128IMAC, el núcleo del Exxo A1](/es/projects/rv128imac/).

{{< detalle "¿Por qué 128 bits?" >}}
No por el tamaño de la memoria: ninguna aplicación necesita un espacio de
direcciones de 128 bits. La ganancia está en la aritmética. La criptografía y
las matemáticas exactas con números grandes procesan el doble de bits por paso,
y en el prototipo eso hizo un cálculo grande 1.63× más rápido que el mismo
algoritmo con palabras de 64 bits.
{{< /detalle >}}

{{< detalle "¿Cómo se verifican los núcleos?" >}}
En dos pasos. Primero en simulación, donde cada programa corre tanto en el
diseño VHDL como en un modelo de software del conjunto de instrucciones, y se
comparan los resultados. Después en hardware real, ejecutando los mismos
programas en una FPGA. Un núcleo cuenta como validado solo después del segundo
paso.
{{< /detalle >}}
