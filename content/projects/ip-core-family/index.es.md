---
title: "Familia de núcleos IP"
layout: article
weight: 12
estado: "La mayoría de los núcleos validados en silicio FPGA · En camino a ser el Exxo A1"
summary: "La biblioteca propia de bloques de hardware de Hercoss, escrita en VHDL-2008: un procesador RISC-V de 128 bits, una red en chip que se repara sola, un núcleo Ethernet de 1.6 Tb/s, un controlador DDR4 que se repara solo, IA, RF, buses espaciales y criptografía post-cuántica. La mayoría ya están validados en silicio FPGA; juntos se convierten en el HERCOSS Exxo A1."
datos:
  - "VHDL-2008"
  - "Simulación + hardware real"
  - "Interfaces AXI4 completas"
  - "47 de los 67 controladores del A1"
seotitle: "Núcleos IP espaciales: SpaceWire, MIL-STD-1553, CAN, Ethernet, PQC — Hercoss"
---

## Los núcleos principales, noviembre de 2026

{{< stats >}}
{{< stat "129 MB/s" "RV128IMAC: SHA-3 en hardware desde Linux sin driver, ~140× el software" >}}
{{< stat "≈0.6 µs" "NOC_512: se repara sola alrededor de un switch muerto, 405,522 veces en una hora, 0 palabras perdidas" >}}
{{< stat "312 mil mill." "ETH_1T6: tramas Ethernet 1.6T en una hora, cero errores, ráfagas corregidas" >}}
{{< stat "1 chip" "DDRC_72: un chip de memoria completo puede morir y los datos siguen correctos (simulación)" >}}
{{< /stats >}}

| Núcleo | Qué hace | Último resultado | Estado | Página |
|---|---|---|---|---|
| **RV128IMAC** | Procesador RISC-V de 128 bits, los 16 núcleos del A1 | Linux 6.6 SMP; llamadas entre CPUs en 1.35 µs; SHA-3 a 129 MB/s sin driver; 214/214 pruebas en placa | Validado en FPGA | [Ver](/es/projects/rv128imac/) |
| **Anillo de núcleos** | Núcleos y aceleradores se llaman directamente | Anillo de 17 estaciones en silicio a plena carga: ~9 M de mensajes por corrida, 0 errores; el software fija la prioridad en ejecución, trabajo crítico un 36 % antes | Validado en FPGA (17 estaciones) | [Ver](/es/projects/rv128imac/#priority) |
| **NOC_512** | Red en chip de 512 bits que se repara sola | Se repara sola en ≈0.6 µs, 405,522 fallas en una hora, 0 de más de 160 mil millones de palabras perdidas; verificada formalmente | Validado en FPGA (2 × 2) | [Ver](/es/projects/noc-512/) |
| **ETH_1T6** | Ethernet de 1.6 Tb/s: MAC, PCS, FEC, alineación de carriles | 312 mil millones de tramas en una hora, 0 errores; de 1 a 15 errores de símbolo corregidos; idéntico bit a bit a los vectores del IEEE | Validado en FPGA (a escala) | [Ver](/es/projects/eth-1t6/) |
| **DDRC_72** | Controlador de memoria DDR4 que se repara solo, hasta 128 GiB | 0 errores de datos y 0 violaciones de timing JEDEC, con un chip de memoria muerto y una fila fallando | Simulación | [Ver](/es/projects/ddrc-72/) |
| **PCIE_G5** | PCI Express Gen4 / Gen5, 1–16 carriles, COTS y rad-hard; diseñado para reparar en el lugar las perturbaciones comunes por partículas | La capa física pasa 44 / 44 corridas de simulación, con fallos inyectados; 286 MHz en FPGA, por encima de los ~246 MHz que necesita Gen5 | Simulación · primera prueba en silicio preparada | [Ver](/es/projects/pcie-g5/) |
| **NPU + acelerador AOCS** | IA a bordo y control de actitud | 0.333 ms por imagen; MPC de 70 × 70 idéntico bit a bit de la simulación al silicio | Validado en FPGA | [Ver](/es/projects/onboard-ai/) |
| **Front-end de RF + cadena ADC** | Radio definida por software y ADC de alta resolución | DDC/DUC idéntico bit a bit en seis dominios; ~16.4–18.9 bits efectivos | Validado en FPGA | [Ver](/es/projects/rf/) |
| **SerDes, Ethernet 25G/40G, PTP** | Enlaces de alta velocidad | Enlace de 103 Gb/s, 0 errores en 1 h; 40GbE contra una NIC comercial | Validado en FPGA | [Ver](/es/projects/high-speed-links/) |
| **Tejido eFPGA propio** | La lógica reconfigurable del A1 | Funciona dentro de un Versal; el layout en 130 nm pasa la revisión previa al tape-out de IHP | Validado en FPGA · GDS listo | [Ver](/es/projects/efpga-fabric/) |

## Qué es un núcleo IP

Los chips no se diseñan desde una hoja en blanco cada vez. Se ensamblan a partir
de **núcleos IP**: bloques de hardware autónomos y reutilizables, cada uno con
una tarea, como un puerto Ethernet o un procesador. Hercoss construye y mantiene
su propia familia, así que el Exxo A1 se ensambla con bloques que la empresa
entiende y controla por completo.

## El catálogo

Filtre por categoría. Cada núcleo muestra su estado y el papel que tiene en el
Exxo A1. "Validado en FPGA" significa que pasó en hardware real; "En la familia
IP" significa que forma parte de la biblioteca y está planeado para el chip.

{{< cores >}}

## Del núcleo IP al chip

En el [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/), estos núcleos se
convierten en **47 de los 67 controladores periféricos fijos del chip**: 10
SpaceWire, 5 MIL-STD-1553, 10 CAN, 5 UART, 5 I²C, 5 I³C, 5 SPI y 2 SD, todos
construidos con IP ya validado en FPGA. El [RV128IMAC](/es/projects/rv128imac/)
se convierte en los dieciséis procesadores del chip, unidos por su propio
anillo; los núcleos SerDes, PCS, MAC y PTP y [ETH_1T6](/es/projects/eth-1t6/)
son su Ethernet de hasta 1.6 Tb/s; [NOC_512](/es/projects/noc-512/) es la red
que se repara sola y que los conecta a todos; [DDRC_72](/es/projects/ddrc-72/) es su controlador de memoria DDR4 que se repara solo, verificado en simulación y con la síntesis en FPGA como siguiente paso; y [PCIE_G5](/es/projects/pcie-g5/), el miembro más nuevo, iniciado el 27 de noviembre de 2026, se convierte en sus tres puertos PCIe Gen5 x16.

Cada núcleo se está revisando ahora para el chip, con una convención común de
registros e interfaces AXI4 completas, y con funciones de vuelo como el borrado
de claves post-cuánticas.

## Cómo se valida un núcleo

1. **Simulación contra modelos de referencia.** Una regresión por capas ejecuta
   cada núcleo junto a modelos de software escritos en Python y compara cada
   resultado automáticamente. Los procesadores se revisan instrucción por
   instrucción.
2. **Síntesis y timing** en la FPGA objetivo.
3. **Hardware real.** El núcleo se integra en una FPGA AMD Versal y las mismas
   pruebas corren en la placa, cada una reportando si pasa o falla. Donde
   existe un estándar, el núcleo también se prueba contra equipo comercial,
   como el MAC Ethernet de 40G contra una tarjeta de red comercial.

"Validado en FPGA" en este sitio significa que pasó el tercer paso.

{{< detalle "¿Las pruebas en hardware encontraron errores que la simulación no vio?" >}}
Sí, y para eso se hacen. Ejemplos: un comportamiento de la herramienta de
síntesis que cambió en silencio una tabla de búsqueda en la FPGA, un carril que
a veces no se enganchaba tras un reinicio del transceptor y un reinicio durante
una transferencia de memoria que podía colgar la placa. Cada uno tiene ahora una
prueba que lo detecta.
{{< /detalle >}}

## Código fuente

El código fuente está disponible para socios y clientes bajo solicitud:
[adrian@hercoss.com](mailto:adrian@hercoss.com).
