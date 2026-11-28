---
title: "HERCOSS Exxo A1"
layout: a1
weight: 1
estado: "Oportunidad de inversión · En desarrollo"
summary: "Un FPGA SoC en un solo chip para el espacio y el borde: dieciséis núcleos RISC-V de 128 bits, un tejido FPGA de 500,000 LUT, un arreglo de IA, hasta ~2 Tbps de Ethernet y todos los buses espaciales que necesita una nave. Una máscara, dos productos: comercial y endurecido contra radiación. Diseñado en Europa."
datos:
  - "16 × RV128IMAC"
  - "FPGA de 500K LUT"
  - "1.6TbE · ~2 Tbps de Ethernet"
  - "67 controladores periféricos"
  - "Objetivo de 300 krad"
seotitle: "HERCOSS Exxo A1: FPGA SoC RISC-V endurecido contra radiación para el espacio"
product: "FPGA SoC de grado espacial"
---

{{< aviso "En proceso de patente" >}}
Varias innovaciones del Exxo A1 están en proceso de patente: entre ellas el
lockstep que se repara solo, el anillo donde núcleos y aceleradores se llaman
directamente, la red en chip que se repara sola, el receptor de corrección de
errores del núcleo Ethernet 1.6T y el controlador de memoria que se repara
solo. Esta página muestra lo que logran; cómo funcionan se publicará cuando ese
proceso lo permita.
{{< /aviso >}}

### Probado en noviembre de 2026

{{< stats >}}
{{< stat "129 MB/s" "SHA-3 en hardware desde Linux, sin driver, en nuestro propio núcleo RISC-V de 128 bits" >}}
{{< stat "≈0.6 µs" "para que la red en chip se repare sola alrededor de un switch muerto, 405,522 veces en una hora" >}}
{{< stat "312 mil mill." "de tramas Ethernet en una hora por nuestra propia capa de enlace 1.6T, cero errores" >}}
{{< stat "1 chip" "de memoria puede morir y los datos siguen regresando correctos (DDRC_72, simulación)" >}}
{{< /stats >}}

Cada resultado tiene su propia página: [RV128IMAC](/es/projects/rv128imac/) ·
[NOC_512](/es/projects/noc-512/) · [Ethernet 1.6T](/es/projects/eth-1t6/) ·
[DDRC_72](/es/projects/ddrc-72/) · [IA a bordo](/es/projects/onboard-ai/) ·
[RF](/es/projects/rf/) · [PCIe Gen5](/es/projects/pcie-g5/) · [Núcleos IP](/es/projects/ip-core-family/)

## La oportunidad de inversión {#invest}

Las naves espaciales y los sistemas remotos en el borde combinan varios chips
para hacer un solo trabajo: un procesador tolerante a la radiación, una FPGA
aparte para lógica a medida, un acelerador de IA y un conjunto de chips de
interfaz. Cada chip adicional suma masa, consumo, área de placa, costo de
calificación y puntos de falla.

**El HERCOSS Exxo A1 pone toda esa computadora en un solo chip.**

{{< fig "a1-replaces.svg" "Lo que un Exxo A1 sustituye en la placa de computadora de una nave." >}}

### Por qué invertir

- **Resuelve un problema real con una sola pieza.** Cada chip que se elimina
  ahorra masa, consumo, área de placa y costo de calificación, las cuatro cosas
  que más paga cada misión.
- **Aporta algo que nadie más ofrece.** El lockstep que se repara solo corrige
  errores de radiación sin reinicio y sin software de recuperación, y los
  núcleos de 128 bits se llaman entre sí directamente en cerca de un
  microsegundo. Ambas cosas ya funcionan en hardware real.
- **Es real, no una diapositiva.** El procesador ejecuta Linux en hardware
  FPGA, la tolerancia a fallos está medida, el tejido FPGA funciona en una FPGA
  y su primer chip de prueba pasó las revisiones de tape-out de la fundición, y
  el IP de interfaces espaciales está probado. Un inversionista financia el
  siguiente paso de un diseño que funciona, no el primer paso de una idea.
- **Está construido sobre bases abiertas y soberanas.** RISC-V no lleva ninguna
  licencia extranjera que se pueda retirar. Diseño, IP y conocimiento se quedan
  en Europa.
- **Una inversión, dos mercados.** Una máscara produce una pieza comercial para
  cómputo en el borde, industria y constelaciones NewSpace, y una pieza
  endurecida contra radiación para misiones institucionales y de espacio
  profundo. El volumen comercial ayuda a pagar la calificación espacial.
- **El riesgo está escalonado.** Cada fase termina en una puerta de decisión con
  resultados medibles, así que el capital se compromete paso a paso frente a la
  evidencia. Programas públicos como la EU Chips Act y los instrumentos de la
  ESA existen justamente para compartir este tipo de riesgo.

### Unas palabras del fundador

> Los programas espaciales de Europa dependen de procesadores, FPGAs y
> componentes endurecidos contra radiación diseñados y controlados fuera de
> Europa. Las restricciones de exportación, la escasez de suministro y los
> cambios en la política comercial han mostrado lo frágil que es esa
> dependencia: una sola decisión de licencia en el extranjero puede retrasar o
> bloquear una misión europea. La soberanía tecnológica en el espacio empieza
> por los chips a bordo.
>
> Europa ya tiene todas las piezas para construir uno: la litografía más
> avanzada del mundo, investigación en semiconductores de primer nivel,
> fabricación de chips en Dresde y Crolles, una larga tradición en electrónica
> espacial e instalaciones de pruebas de radiación en todo el continente. El
> HERCOSS Exxo A1 reúne estas fortalezas. Mi visión a largo plazo es fabricar
> los chips HERCOSS Exxo en Bremen, en el corazón de la industria espacial
> europea, en una línea construida alrededor de la litografía más avanzada de
> ASML. El camino es escalonado: primero chips de prueba en fundiciones y
> centros de investigación europeos; después, cada fase exitosa construye el
> caso, el equipo y las alianzas para una planta en Bremen.
>
> — **Adrian Irineo Hernandez Cossio**, fundador de Hercoss

## Explore el chip {#explore}

Haga clic en cualquier bloque para ver qué hace y por qué está ahí.

{{< a1explorer >}}

## Arquitectura

Todo cuelga de una sola red en chip de 512 bits, la
[NOC_512](/es/projects/noc-512/) propia de Hercoss: los dieciséis procesadores,
el tejido FPGA, el arreglo de IA, la memoria y toda la E/S. En silicio FPGA ha
llevado 3.19 billones de transferencias AXI4 en nueve corridas de una hora sin
un solo error, y se repara sola alrededor de un switch dañado en unos 0.6 µs,
medido en silicio en 405,522 fallas en una hora sin perder una palabra.

{{< fig "a1-architecture.svg" "Arquitectura general del HERCOSS Exxo A1. Conceptual; no a escala." >}}

{{< detalle "¿Qué es un FPGA SoC?" >}}
Un procesador ejecuta software: el sistema operativo, la lógica de la misión,
las comunicaciones. Una FPGA es hardware que se puede recablear después de
fabricado, usado para los trabajos para los que el software es demasiado lento,
como manejar datos de instrumentos en tiempo real. Un FPGA SoC pone ambos en una
sola pieza de silicio y permite que el software y el hardware a medida
intercambien datos a toda velocidad, en lugar de hacerlo por el lento cableado
de la placa.
{{< /detalle >}}

## Del RTL al layout físico

El Exxo A1 ya no es solo un diagrama de bloques. Su diseño ya empezó el flujo de
chip: el mismo VHDL que corre en nuestras placas FPGA se ha sintetizado a celdas
estándar, colocado y enrutado, lo que produce el layout físico de abajo. Haga
clic en cualquiera de las imágenes para abrirla a resolución completa.

{{< layoutshots "Layout físico de un bloque de núcleo del Exxo A1. Los bloques amarillos a ambos lados son memorias en chip; el centro es lógica colocada y enrutada." "Acercamiento del mismo layout: celdas estándar individuales y el cableado metálico entre ellas." >}}

*Imágenes del layout generadas por el flujo de diseño del chip. El chip aún no
se ha fabricado; el área, el reloj y el consumo en silicio están por medirse.*

## Qué hay en el chip

El A1 lleva las interfaces que necesita una nave o un sistema en el borde, así
que sustituye chips de interfaz en lugar de sumarse a ellos. Los periféricos de
baja velocidad comparten un conjunto multiplexado de 160 pines, para que cada
misión elija su combinación sin un encapsulado más grande.

{{< a1io >}}

## Hasta ~2 Tbps de Ethernet

Un conjunto de 72 transceptores serie atiende Ethernet, PCIe y el tejido FPGA.
Ocho carriles PAM4 de 224 Gb/s llevan un puerto Ethernet de 1.6 Tb/s; 64
carriles a 32 Gb/s llevan otros 400G de Ethernet y tres enlaces PCIe Gen5 x16.

{{< fig "a1-serdes.svg" "Cómo se reparten los 72 carriles de transceptores. Objetivo de diseño." >}}

## Lockstep que se repara solo

Dos núcleos vecinos cualesquiera se pueden unir al arrancar en un núcleo
tolerante a fallos, y los fallos transitorios que detecta se **corrigen
automáticamente**: sin reinicio del procesador, sin checkpoint, sin software de
recuperación. Los procesadores lockstep convencionales solo detectan el error y
luego reinician o pasan el problema al software.

- **Medido en FPGA:** 24 fallos inyectados por corrida, la mitad en el núcleo
  que maneja el bus. 24 corregidos, 0 resultados corruptos, nada incorrecto
  llegó al bus. El mismo programa sin lockstep produjo resultados corruptos en
  12 de 24 rondas.
- **Sin costo medible:** 24 recuperaciones, 8.15 ms frente a 8.18 ms.
- **Flexible por fase de la misión:** 16 núcleos independientes durante un
  crucero tranquilo, 8 núcleos que se reparan solos durante un evento solar o
  una maniobra crítica.
- **La inyección de fallos integrada** permite a clientes y laboratorios de
  prueba ejercitar el mecanismo en campo, lo que apoya la calificación.

{{< detalle "¿En qué núcleo se midió esto?" >}}
En la emulación del SoC A1 con sus núcleos de 64 bits anteriores. Llevar el
lockstep, el banco de registros con corrección de errores y la paridad de cachés
al RV128IMAC es uno de los puntos abiertos que se listan abajo.
{{< /detalle >}}

## Modelo de software

Un Exxo A1 puede sustituir hasta dieciséis computadoras de vuelo separadas.

- **16 dominios aislados por defecto:** un núcleo por instancia de Linux, cada
  uno con su propia memoria, interrupciones, temporizador y periféricos,
  garantizado en hardware.
- **AMP y SMP combinados libremente:** por ejemplo, un Linux SMP de 4 núcleos
  para el procesamiento de la carga útil junto a 12 dominios de un núcleo para
  funciones de plataforma.
- **Control de dominios:** un dominio gestor puede detener, recargar y reiniciar
  cualquier otro dominio mientras los demás siguen funcionando, la base para la
  recuperación de fallos y las actualizaciones de software en órbita.
- **Comunicación rápida entre núcleos:** el
  [anillo de núcleos](/es/projects/rv128imac/#the-hercoss-core-fabric-a-ring-built-for-calls)
  de Hercoss, donde núcleos y aceleradores se llaman directamente: 1.35 µs desde
  un programa de Linux, justo a plena carga, con la prioridad de servicio por estación fijada por software en ejecución, junto al remoteproc / RPMsg estándar
  de Linux.
- **Toolchain abierto:** RISC-V GCC estándar, Linux mainline y OpenSBI en modo de
  64 bits; sistemas de tiempo real FreeRTOS, Zephyr y RTEMS.
- **Herramientas planeadas:** una interfaz gráfica y un flujo TCL/bash para
  particionar el chip, generar device trees y construir bitstreams de FPGA.

## Un diseño, dos versiones

Ambas versiones salen de la misma máscara, así que la pieza endurecida contra
radiación comparte su costo de desarrollo con la pieza comercial de volumen.

{{< a1variants >}}

**Siguiente: el HERCOSS Exxo A1-RF.** Una variante de radio del A1, con un
front-end de radio en el mismo chip, construida sobre el IP de front-end digital
de RF de Hercoss que ya funciona en silicio FPGA. Está en desarrollo.
[Leer sobre RF y el A1-RF →](/es/projects/rf/)

## Especificación completa {#specs}

Cada línea lleva su estado. Filtre para ver qué ya está validado, qué está en
diseño y qué sigue pendiente.

{{< a1specs >}}

## Pruebas hasta ahora

| Qué | Evidencia | Estado |
|---|---|---|
| Núcleo de procesador RV128IMAC | Linux 6.6 SMP, 214 / 214 pruebas en placa, CoreMark 1.85 / MHz; SHA-3 de 33 a 129 MB/s en flujo en cinco días | Validado en FPGA |
| Llamadas entre núcleos | 1.35 µs ida y vuelta desde un programa de Linux (una llamada al sistema vacía: 6.6 µs) | Validado en FPGA |
| Anillo de núcleos para 16 núcleos | Anillo de 17 estaciones a plena carga en silicio (un núcleo real, el acelerador SHA-3, 15 estaciones de tráfico): ~9 M de mensajes por corrida, 0 errores, 0 perdidos, 0 duplicados; prioridad de servicio fijada por software en ejecución, trabajo crítico un 36 % antes con el anillo saturado; el anillo direcciona 64 hilos de hardware | Validado en FPGA (17 estaciones); faltan 16 núcleos reales |
| Lockstep que se repara solo | 24 / 24 fallos inyectados corregidos, 0 resultados corruptos | Validado en FPGA (núcleo anterior de 64 bits) |
| Red en chip NOC_512 | Nueve corridas de una hora a plena carga: 3.19 billones de transferencias AXI4, 0 errores; 375 MHz sin protección, 265 MHz con todas las capas de protección | Validado en FPGA |
| Tolerancia a fallos de NOC_512 | 10.5 M de errores corregidos en vivo; estado corrompido en cada ciclo durante 159 M de ciclos con un resultado idéntico a una corrida sin fallos; 199 M de palabras/s reconstruidas sin perder ninguna; 14 autorreparaciones en ~10 µs, 0 palabras perdidas | Validado en FPGA (inyección de fallos, sin pruebas con haz) |
| NOC_512, plan del chip de 5 × 5 | 7.73 Tb/s en 19 circuitos protegidos; 6 fallas de un nodo a plena carga con 0 palabras perdidas | Simulación |
| Autorreparación de NOC_512 | En silicio: un switch apagado 405,522 veces en una hora a plena carga, cada reparación en 148–156 ciclos (≈0.6 µs), 0 de más de 160 mil millones de palabras perdidas; chip completo en simulación: 65 de 66 carriles restablecidos; lógica de autorreparación verificada formalmente (9 / 9 reglas de seguridad) | Validado en FPGA (2 × 2); verificado formalmente; escala de chip en simulación |
| Controlador de memoria DDRC_72 | Corrida del sistema completo con inversiones de bits inyectadas, un chip de memoria muerto y una fila que falla: 2,727 escrituras y 4,120 lecturas verificadas, 0 errores de datos, 0 violaciones de timing JEDEC | Simulación |
| Infraestructura del SoC A1 | Clúster, crossbar, coherencia, mailbox, controlador de interrupciones, IOPMP; dos dominios Linux aislados | Validado en FPGA |
| Ajuste de caché y prefetch | I-cache de 64 KiB: −69 % de fallos en Linux; prefetcher: copia en frío −32 %, lectura en frío −39 % | Medido en FPGA (núcleo anterior de 64 bits) |
| Tejido eFPGA propio | Funciona dentro de un AMD Versal; autoprueba de reconfiguración en ejecución superada | Validado en FPGA |
| Chip de prueba del tejido, IHP SG13G2 130 nm | Revisión previa oficial superada: LVS, antena y timing limpios | GDS listo para tape-out |
| Área del bloque del tejido | 56,222 µm² por bloque de 8 LUT4, 616 bits de configuración | Medido del layout |
| Celda de configuración DICE | 31.2 µm², DRC y LVS limpios; resiste un impacto de 1 pC (una celda estándar se invierte con 8.3 fC) | Layout aprobado; SEU en simulación |
| IP espacial | SpaceWire, MIL-STD-1553, CAN, UART, PTP 802.1AS | Validado en FPGA |
| IP de periféricos generales | I²C, I³C, SPI, SD | Validado en FPGA |
| IP de red | MAC/PCS Ethernet de 25G y 40G contra una NIC comercial, prueba de 1 hora con cero errores; enlace SerDes de 103 Gb/s | Validado en FPGA |
| NPU | Inferencia CNN INT8: 0.333 ms por imagen, ~3,000 inferencias/s | Validado en FPGA |
| Acelerador AOCS | Control de actitud predictivo por modelo en hardware, 70 × 70 float32, idéntico bit a bit a la simulación | Validado en FPGA |
| Controlador PCIe, capa física (PCIE_G5) | 4 carriles a 16.0 Gb/s: una hora, 389,812,475,855 palabras, 0 errores; perturbaciones del receptor reparadas en ~4 y ~7 µs sin salir del modo de datos; el enlace se entrena solo, una hora en el enlace entrenado con 0 errores y 0 recuperaciones | Validado en FPGA (4 carriles, velocidad Gen4, lazo interno) |
| Front-end digital de RF | Cadenas DDC y DUC, idénticas bit a bit en seis dominios | Validado en FPGA |
| Criptografía post-cuántica | Aceleradores ML-KEM y ML-DSA | Validado en FPGA |
| SHA-3 / SHAKE en hardware | 129 MB/s desde un proceso de Linux sin driver, ~140× el software en la misma CPU | Validado en FPGA |
| Capa de enlace 1.6TbE (ETH_1T6) | MAC + PCS + FEC RS(544,514) + alineación de carriles: 312 mil millones de tramas en una hora, 0 errores; de 1 a 15 errores de símbolo por palabra de código corregidos; ráfagas de errores reparadas a velocidad completa; idéntica bit a bit a los vectores IEEE 802.3 200G/400G/800G y P802.3dj | Validado en FPGA (a escala: un flujo FEC, 8 carriles) |

## Lo que falta

Una lista honesta de lo que tiene que pasar antes de que el A1 sea un chip:

- **Escalar el clúster de procesadores** del prototipo de dos CPUs a dieciséis
  núcleos. El anillo de núcleos direcciona 64 hilos de hardware, y un anillo de 17 estaciones ya funciona a plena carga en silicio con un núcleo real; dieciséis núcleos reales necesitan un dispositivo más grande.
- **Endurecimiento espacial del RV128IMAC:** portar el lockstep que se repara
  solo, el banco de registros con corrección de errores y la paridad de cachés;
  crecer las cachés a los tamaños del A1.
- **Red en chip:** la red de 25 nodos y la lógica de autorreparación endurecida
  en una FPGA más grande (ambas pasan en simulación), demostraciones no acotadas para la red (la red de 2 × 2 está verificada formalmente dentro de la profundidad comprobada), recuperación más rápida cuando fallan dos switches a
  la vez e integración con los núcleos RV128IMAC y periféricos reales.
- **Cachés L2:** RTL aún por escribir.
- **Controlador de memoria DDR4 ([DDRC_72](/es/projects/ddrc-72/)):** RTL v0.1
  completo; verificado en simulación con 0 errores de datos y 0 violaciones de
  timing JEDEC, incluidos un chip de memoria muerto y una fila que falla
  reparada automáticamente. La síntesis en FPGA es lo siguiente.
- **Bloques analógicos y de señal mixta:** los SerDes PAM4 de 224G y NRZ de 32G,
  las capas físicas de PCIe Gen5 y DDR, los PLL y los front-ends de los ADC
  sigma-delta, por diseñar en casa o licenciar.
- **Controlador 1.6TbE ([ETH_1T6](/es/projects/eth-1t6/)):** la capa de enlace
  completa (MAC, PCS, FEC RS(544,514), alineación de carriles) funciona en
  silicio FPGA en una configuración a escala (un flujo FEC, 8 carriles):
  129 Gb/s, 312 mil millones de tramas en una hora con cero errores, de 1 a 15
  errores de símbolo por palabra de código corregidos, ráfagas de errores
  reparadas a velocidad completa. La estructura completa (dos flujos FEC, 16
  carriles) está verificada en simulación y necesita un dispositivo más grande;
  la conexión a transceptores reales es lo siguiente.
- **AI Engine y núcleos DSP:** arquitectura definida, RTL pendiente; la NPU y el
  acelerador AOCS ya están validados como bloques base.
- **Controlador PCIe Gen5 ([PCIE_G5](/es/projects/pcie-g5/)):** empezó el 27 de noviembre de 2026; la parte lógica de la capa física y su interfaz con los transceptores pasan simulación (45 / 45 corridas, 286 MHz en la FPGA) y funcionan en silicio: 4 carriles a 16 Gb/s, una hora con cero errores. La primera parte del entrenamiento del enlace también funciona en silicio: el enlace se entrena solo y vuelve en dos carriles cuando se apaga uno. Faltan el resto del entrenamiento y las capas de enlace de datos y de transacciones.
- **Periféricos restantes:** controlador MIPI en desarrollo.
- **Escalar el tejido FPGA** del bloque del chip de prueba en 130 nm a 500,000
  LUT.
- **Flujo de implementación del chip:** macros de memoria, lógica de prueba
  (DFT), timing y área en el nodo de producción.
- **Encapsulado, pruebas de radiación y calificación espacial.**

## Hoja de ruta

El proyecto está en la fase F1. Cada fase termina en una puerta de decisión, así
que la inversión se puede escalonar. Las fechas por fase siguen abiertas.

{{< a1roadmap >}}

## Riesgos y mitigaciones

| Riesgo | Por qué importa | Mitigación |
|---|---|---|
| Acceso a un nodo avanzado en Europa y su costo | Alto costo del juego de máscaras, control de exportaciones y asignación de capacidad | Varias fundiciones europeas candidatas; arquitectura independiente del nodo; una máscara para ambas versiones; financiamiento de la EU Chips Act |
| IP analógico y de señal mixta | Los SerDes PAM4 de 224G y las PHY de PCIe Gen5 y DDR son difíciles de diseñar y verificar | Capas digitales probadas en casa; licenciar PHY probadas en silicio donde reduzca el riesgo; medir en el shuttle de F2 |
| Comportamiento bajo radiación de un nodo avanzado | Los nodos avanzados muestran efectos de evento único distintos a los procesos planares | Celdas de configuración DICE, lockstep que se repara solo, ECC, controlador con redundancia triple; objetivo de prueba de 600 krad (margen 2×) |
| Escalar el tejido a 500K LUT | El área de bloques y enrutamiento puede exceder el presupuesto de 85–100 mm² | Área seguida por bloque; el chip de prueba mide primero el costo real del bloque |
| Reloj de CPU en el nodo de producción | Aún no está fijado; define la cifra principal de rendimiento | Se mide en el shuttle de F2 antes del compromiso de producción |
| Ecosistema de software y herramientas | Los clientes necesitan compiladores, Linux y herramientas FPGA desde el primer día | RISC-V GCC estándar, Linux mainline y OpenSBI ya funcionando; flujo FPGA con FABulous / LibreLane de código abierto |
| Tiempo y costo de calificación | La calificación espacial es larga y cara | La misma máscara que la pieza COTS reparte el costo; la inyección de fallos integrada apoya las pruebas |
| Errores que escapan a la verificación | Un error encontrado después del tape-out es caro | Lockstep instrucción por instrucción contra modelos de referencia, pruebas de mutación, arranque de Linux como prueba de regresión |
| Planta propia en Bremen | Una fábrica avanzada completa cuesta del orden de miles de millones de euros | Escalonado: primeros chips en fundiciones europeas existentes; Bremen como meta a largo plazo con socios públicos e industriales, empezando con pasos como pruebas, encapsulado o una línea piloto |
| Tamaño del equipo | Hercoss está en etapa de fundador | El financiamiento por fases construye el equipo; flujo de verificación documentado y automatizado |

## Constrúyalo con nosotros

Hercoss busca socios para llevar el Exxo A1 de un prototipo que funciona al chip
que vuele en las próximas misiones de Europa:

- **Inversionistas y programas públicos**, incluidos la EU Chips Act, los
  instrumentos de la ESA y el Estado de Bremen, para financiar las siguientes
  fases.
- **Fundiciones y centros de investigación europeos**, para fabricar los chips de
  prueba y los primeros chips de producción en suelo europeo.
- **Socios de litografía**, para una futura línea de fabricación de HERCOSS Exxo
  en Bremen.
- **Socios de encapsulado y pruebas**, para el flip-chip comercial y el
  encapsulado cerámico endurecido contra radiación.
- **Instalaciones de pruebas de radiación y agencias espaciales**, incluida la
  ESA, para calificar el chip para vuelo.

Escriba a [adrian@hercoss.com](mailto:adrian@hercoss.com). Hay un documento
técnico detallado disponible para inversionistas y socios bajo solicitud.

**¿Quiere invertir?** [Únase a la familia Hercoss →](/es/invest/): registre su
interés y siga el chip desde dentro, en el Investor Hub.
