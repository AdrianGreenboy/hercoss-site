---
title: "Tejido eFPGA"
weight: 9
estado: "Funciona en FPGA · GDS listo"
summary: "El tejido de lógica programable propio de Hercoss: la parte reconfigurable del Exxo A1, ya funcionando y llevado hasta el layout físico."
datos:
  - "Reconfiguración en ejecución"
  - "IHP SG13G2"
  - "Revisión previa de IHP: limpia"
  - "Flujo de código abierto"
seotitle: "Tejido FPGA embebido (eFPGA) en IHP SG13G2 130 nm — Hercoss"
---

## Qué es

Una FPGA está hecha de miles de pequeñas celdas lógicas idénticas unidas por
cableado programable. Esa cuadrícula de celdas y cables es el **tejido**. Una
**eFPGA** ("FPGA embebida") es un tejido diseñado para colocarse dentro de otro
chip, en lugar de venderse como un chip propio.

Hercoss diseña su propio tejido en lugar de licenciar uno. Eso es lo que permite
que el Exxo A1 incluya lógica reconfigurable sin depender de un fabricante de
FPGA.

## Qué se ha logrado

**Funciona.** La primera versión del tejido, `efpga_v0`, se cargó en una FPGA
comercial AMD Versal y corrió a 25 MHz. Pasó una autoprueba de reconfiguración
en ejecución por JTAG: el tejido se reprogramó mientras funcionaba y se comportó
correctamente cada vez.

**Tiene un layout físico.** Después, el mismo tejido se llevó hasta GDS, el
formato de archivo con el que fabrica una fundición, en el proceso SG13G2 de
IHP, una tecnología de 130 nm hecha en Alemania. El resultado pasa la revisión
previa oficial de IHP con cero errores: LVS, antena y timing están limpios, y el
GDS está listo para enviarse.

{{< detalle "¿Por qué emular una FPGA dentro de otra FPGA?" >}}
Fabricar un chip toma meses y no se puede deshacer. Ejecutar primero el tejido
dentro de una FPGA comercial demuestra la lógica, la cadena de configuración y
las herramientas de software en hardware real en días, antes de pedir silicio.
{{< /detalle >}}

{{< detalle "¿Qué significan LVS, antena y timing?" >}}
Son las comprobaciones que un layout debe pasar antes de que una fundición lo
acepte. **LVS** confirma que el layout dibujado coincide con el circuito
previsto. Las reglas de **antena** protegen a los transistores de daños durante
la fabricación. **Timing** confirma que las señales llegan a tiempo a la
frecuencia de reloj objetivo.
{{< /detalle >}}

{{< detalle "¿Qué herramientas se usaron?" >}}
Un flujo de código abierto: el framework FABulous genera el tejido y LibreLane
lo lleva al layout con el kit de diseño abierto del proceso IHP SG13G2.
{{< /detalle >}}

## Qué sigue

Un modelo de timing del tejido como macro reutilizable, la integración con el
procesador y recuperar área en la columna DSP.
