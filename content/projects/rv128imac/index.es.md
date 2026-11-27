---
title: "RV128IMAC: el núcleo del Exxo A1"
layout: rv128
weight: 2
estado: "Funciona en silicio FPGA · Núcleo de procesador del HERCOSS Exxo A1"
seotitle: "RV128IMAC: núcleo de procesador RISC-V de 128 bits para cómputo espacial — Hercoss"
summary: "RISC-V de 128 bits, construido desde cero en Europa. Un núcleo funciona como CPU de 128 bits, como CPU de 64 bits o como dos CPUs de 64 bits; un programa de Linux llama a una función en otra CPU en 1.35 µs y calcula hashes con SHA-3 en hardware a 129 MB/s, unas 140× el software, sin driver. Es el procesador en el corazón del HERCOSS Exxo A1."
datos:
  - "RISC-V de 128 bits"
  - "SHA-3 a 129 MB/s, sin driver"
  - "Llamada entre CPUs en 1.35 µs"
  - "Linux 6.6 SMP"
  - "214 / 214 en silicio"
  - "Anillo: 64 hilos"
---

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 desde un proceso normal de Linux, sin driver" >}}
{{< stat "×143" "más rápido que el mismo algoritmo en software en la misma CPU" >}}
{{< stat "1.35 µs" "un programa de Linux llama a una función en otra CPU, ~5× más rápido que una llamada al sistema vacía" >}}
{{< stat "214 / 214" "programas autoverificables pasan en silicio" >}}
{{< /stats >}}

{{< aviso "En proceso de patente" >}}
El anillo de núcleos y las innovaciones de esta página están en proceso de
patente. Esta página muestra lo que logran y por qué importan; cómo funcionan por
dentro se publicará cuando ese proceso lo permita.
{{< /aviso >}}

## Qué es

RV128IMAC es un núcleo de procesador RISC-V diseñado y escrito desde cero en VHDL
por Hercoss. Es un procesador de **128 bits**, el doble del ancho de palabra de
los procesadores de 64 bits de las computadoras y teléfonos actuales, y es el
procesador elegido para el **HERCOSS Exxo A1**: el clúster de CPUs del chip son
dieciséis de estos núcleos.

Lo que lo hace distinto no es solo el ancho:

- **Los núcleos se llaman directamente entre sí.** Un programa normal de Linux
  ejecuta una función en otro procesador y recibe la respuesta en 1.35 µs, sin
  driver y sin pasar por el sistema operativo.
- **Su propio anillo de núcleos.** Núcleos y aceleradores comparten un anillo
  propio, ahora escalado para direccionar 64 hilos de hardware, y justo a plena
  carga.
- **Aceleradores de hardware sin drivers.** El primero, un motor SHA-3 / SHAKE,
  atiende a un proceso de Linux a 129 MB/s, unas 140× el mismo algoritmo en
  software en la misma CPU.
- **Un núcleo, tres personalidades:** CPU de 128 bits, CPU de 64 bits o dos CPUs
  de 64 bits.

Todo lo que hay en esta página funciona en un prototipo FPGA real: dos CPUs en
una placa AMD Versal a 60 MHz, ejecutando Linux. **Del primer arranque de Linux a
un SHA-3 en hardware sin driver 140× más rápido que el software: dos semanas, todo
en silicio real.**

## El anillo de núcleos de HERCOSS: un anillo hecho para llamadas {#the-hercoss-core-fabric-a-ring-built-for-calls}

La mayoría de los chips multinúcleo conectan sus núcleos a través de memoria
compartida: un núcleo escribe, el otro consulta o recibe una interrupción, y el
sistema operativo queda en medio. **El anillo de núcleos de HERCOSS es distinto.
Núcleos y aceleradores de hardware se hablan directamente, en hardware, a
velocidad de instrucción**, por un anillo propio.

{{< fig "ring-vs-memory.svg" "Pedir trabajo a otro núcleo: el camino habitual por memoria y sistema operativo, frente al anillo de núcleos de HERCOSS." >}}

{{< fig "ring-concept.svg" "El anillo de núcleos de HERCOSS para el Exxo A1: dieciséis núcleos y sus aceleradores en un anillo; memoria y E/S viajan aparte por NOC_512. Concepto, no a escala." >}}

### Por qué un anillo

Las interconexiones en anillo son simples, baratas en cables y fáciles de cerrar
a frecuencias de reloj altas, justo lo que necesita un chip de 16 núcleos
tolerante a la radiación. Mantener los mensajes en su propio anillo, y el tráfico
de memoria en la red separada [NOC_512](/es/projects/noc-512/), significa que una
llamada entre núcleos nunca espera detrás de una transferencia de memoria.

### Por qué es nuevo

Lo nuevo no es "un anillo". **La novedad es lo que viaja por él:**

- **Llamadas a funciones, peticiones a aceleradores y sus respuestas, todas
  tratadas igual.** El software llama al motor SHA-3 igual que llama a otro
  procesador. Los aceleradores de mañana se conectan al mismo anillo, y el
  software no cambia.
- **Accesible desde software normal con instrucciones sueltas:** sin driver, sin
  buzón en memoria, sin interrupción.
- **Robusto frente a programas que fallan:** una respuesta nunca puede llegar al
  proceso equivocado.
- **Justo por construcción a plena carga.** Nuestras pruebas de estrés mostraron
  que un anillo convencional puede dejar a una estación esperando
  indefinidamente cuando sus vecinas están ocupadas. El anillo de HERCOSS
  **garantiza su turno a cada núcleo y a cada acelerador**, por ocupado que esté
  el anillo. La simulación lo confirma, y ya forma parte de la arquitectura del
  A1.

{{< fig "ring-fair.svg" "Encontrado en nuestras propias pruebas de estrés y corregido en la arquitectura, antes de una sola oblea." >}}

### Escalado al A1: 64 hilos, 16 estaciones

{{< stats >}}
{{< stat "64" "hilos de hardware direccionables: cuatro veces los 16 núcleos del A1" >}}
{{< stat "16" "estaciones en un anillo llevado a saturación (simulación)" >}}
{{< stat "0" "mensajes perdidos, duplicados o desordenados" >}}
{{< stat "5 / 5" "diseños de anillo rotos a propósito detectados por nuestras pruebas" >}}
{{< /stats >}}

- **Mismo silicio, más espacio.** El anillo se rediseñó para direccionar hasta 64
  hilos de hardware, y la nueva versión salió unas **2,900 celdas lógicas más
  pequeña** que la anterior, con el timing aún cumplido con margen.
- **Todo programa existente funciona sin cambios.** No hizo falta recompilar los
  binarios que corrían en el anillo anterior de 8 hilos.
- **Un anillo de 16 estaciones de longitud completa a carga máxima.** Dos núcleos
  de procesador reales corren instrucción por instrucción contra un modelo de
  referencia independiente mientras 14 estaciones de tráfico saturan el anillo a
  su alrededor. Completan una suite de pruebas SHA-3 completa y un benchmark de
  hashing de 64 KiB con **cero divergencias**, y ni un solo mensaje se pierde, se
  duplica o se desordena.
- **El verificador está verificado.** Se construyeron cinco versiones del
  hardware del anillo rotas a propósito: un acuse de recibo perdido, un mensaje
  descartado, un remitente equivocado, una respuesta obsoleta aceptada, un solo
  bit invertido. **El testbench detecta las cinco, cada una por la razón
  correcta.**

{{< detalle "¿Cuánto cuesta el anillo en el peor caso de carga?" >}}
En un anillo saturado por todas las estaciones de tráfico transmitiendo tan
rápido como el anillo permite, algo que ninguna carga real hace, el bucle de
hashing es 2.1× más lento que en un anillo libre (7.4 frente a 3.5 ciclos por cada
8 bytes). Garantizar el turno de cada estación también cuesta algo de
rendimiento máximo en saturación. Publicamos estos números de peor caso porque
son los datos que dimensionan la interconexión del A1, y mediremos el balance en
silicio antes de elegirlo.

La versión de 64 hilos pasó la síntesis y el cierre de timing (125.1 mil celdas
lógicas, 83 % del dispositivo, +0.33 ns de holgura más allá de una guarda de
seguridad de 1.0 ns), pero aún no ha corrido en la placa. Los resultados de 16
estaciones están verificados en simulación.
{{< /detalle >}}

## Un núcleo, tres personalidades

El mismo núcleo se puede configurar de tres formas. Elija una para verla.

{{< modes >}}

## Llamar a otra CPU a velocidad de hardware

En un chip multinúcleo, hacer que otro procesador haga un trabajo normalmente
significa pasar por el sistema operativo: una llamada al sistema, un driver,
memoria compartida y una interrupción. Cada paso cuesta tiempo, y juntos toman de
microsegundos a decenas de microsegundos.

El RV128IMAC añade **XCALL**, una extensión de Hercoss a RISC-V. Un programa
normal de Linux pide a otra CPU que ejecute una función y recibe la respuesta, sin
ningún driver de por medio. El sistema operativo solo decide qué programas pueden
hacerlo.

{{< fig "xcall-latency.svg" "Una llamada completa a otra CPU y de vuelta, 1,352 ns, frente a una llamada al sistema vacía que no hace nada, 6,590 ns." >}}

{{< detalle "¿Qué se está comparando exactamente?" >}}
Ambos números vienen del mismo proceso de Linux en la misma CPU del prototipo
FPGA a 60 MHz. La llamada al sistema es `getppid()`, una de las más baratas que
tiene Linux; el XCALL es un viaje completo de ida y vuelta que ejecuta una
función en la segunda CPU y devuelve su resultado. En simulación RTL la parte de
hardware de la llamada toma 26 ciclos de reloj. La comparación es entre los dos
mecanismos en este núcleo, no una afirmación frente a productos de otros
fabricantes.
{{< /detalle >}}

## Trabajar en paralelo sin esperar

Las llamadas también pueden ser **asíncronas**: un programa inicia varias
llamadas, sigue trabajando y recoge las respuestas después en cualquier orden.
Ambas CPUs calculan al mismo tiempo, y el tiempo total se acerca al ideal.

{{< fig "xcall-async.svg" "Dos factoriales grandes, uno en cada CPU. Corriendo juntos, terminan en el tiempo del más largo." >}}

## Robusto por diseño

Un satélite no se puede reiniciar cada vez que un programa se porta mal, así que
las llamadas están hechas para sobrevivir a los fallos:

- Un programa que falla o se cuelga con llamadas aún en curso lo limpia el
  sistema operativo; la otra CPU no se ve afectada.
- Una respuesta nunca puede llegar al programa equivocado. Lo garantiza el
  hardware, no una convención de software.
- Los programas pueden esperar con un tiempo límite, cancelar una llamada o
  dormir mientras esperan para que su CPU quede libre para otro trabajo.

## Aceleradores sin drivers: SHA-3 en hardware

SHA-3 y SHAKE son la base de los nuevos estándares de criptografía post-cuántica,
ML-KEM (FIPS 203) y ML-DSA (FIPS 204). Para un chip espacial con una vida de diez
años, tenerlos en hardware y accesibles desde software normal es un argumento
fuerte.

En la mayoría de los chips, usar un acelerador significa un driver del kernel,
registros mapeados en memoria, DMA, interrupciones y búferes compartidos:
microsegundos por petición y mucho software. En el RV128IMAC, un proceso normal de
Linux usa el motor SHA-3 **directamente, sin driver**.

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 desde un proceso de Linux (1 MiB)" >}}
{{< stat "140 MB/s" "en bare metal" >}}
{{< stat "8.2 µs" "para un mensaje corto de 64 bytes, frente a 143 µs en software (×17)" >}}
{{< stat "~8,000" "LUT para todo el motor" >}}
{{< /stats >}}

El motor cubre SHA3-224, -256, -384, -512 y SHAKE128 / 256, una ronda de
Keccak-f[1600] por ciclo de reloj.

### De 33 a 129 MB/s en cinco días

Cada paso se validó en silicio antes de empezar el siguiente.

{{< fig "sha3-journey.svg" "SHA3-256 desde un proceso de Linux en la misma placa a los mismos 60 MHz. Cada barra medida en silicio." >}}

| Paso | Fecha | Qué cambió | SHA3-256 en Linux, 1 MiB | frente al software |
|---|---|---|---|---|
| P9 | 21 nov | Motor SHA-3 funcionando en silicio, usado desde Linux sin driver | 33 MB/s | ×54 |
| P9b | 22 nov | Solo software | 53–60 MB/s | – |
| P10 | 22 nov | Una instrucción nueva en el núcleo | 74.5 MB/s | ×94 |
| P11 | 23 nov | La caché de datos aprende a traer la siguiente línea por adelantado | 97.7 MB/s | ×150 |
| P12 | 24 nov | Rediseño de timing en la búsqueda de instrucciones: misma velocidad, mucho más margen, menos compuertas | 99.8 MB/s | ×153 |
| P13b | 25 nov | Mejoras en el pipeline y la búsqueda de instrucciones | **129.0 MB/s** | ×143 |

La razón bajó de ×153 a ×143 por una buena razón: la misma mejora también hizo
1.39× más rápida la versión en *software*. Por eso medimos el avance en MB/s y en
ciclos, no en la razón.

## Medido, no supuesto

El núcleo lleva sus propios contadores de rendimiento en hardware, y cada
optimización parte de una medición de dónde se van los ciclos, no de una
suposición.

{{< fig "sha3-cycles.svg" "Costo de cada paso de 8 bytes del hash en bare metal: de 7.31 a 3.44 ciclos de reloj, todo medido en silicio." >}}

- **La medición cambió el rumbo del trabajo.** Los contadores mostraron que el
  camino entre el núcleo y el motor casi no cuesta nada. Eso convirtió "una cola
  más grande", que no habría ayudado, en una instrucción nueva (+25 %) y un
  prefetch en la caché de datos (+30 %).
- **Nos corregimos en público.** Una medición anterior atribuía unos dos ciclos
  por paso a que el pipeline esperaba a instrucciones más antiguas. Quitar esa
  espera dio menos de lo previsto. Al investigar más se vio que la mayor parte de
  esos ciclos venía de otro lado: la cola de búsqueda de instrucciones se vaciaba
  con ciertas alineaciones de código. El mismo bucle tardaba 5.15 o 3.28 ciclos
  por paso solo según dónde estuviera en memoria. La corrección hace que la
  alineación no importe y acelera todo el código compacto: en silicio, el SHA-3
  en software en C corrió 1.39× más rápido con ella, y la ruta de hardware 1.29×
  más rápido.
- **Más rápido sin gastar margen de timing.** El paso del prefetch dejó casi sin
  margen de timing (+0.010 ns). El paso siguiente rediseñó la ruta crítica y ganó
  +0.556 ns con 1,300 LUT menos y rendimiento idéntico. El margen de hoy es lo que
  hace posibles las funciones de mañana.

{{< detalle "¿A dónde se van los ciclos restantes?" >}}
Los contadores ya muestran los siguientes pasos. De los 3.44 ciclos por paso de 8
bytes, unos 1.9 son las propias instrucciones, unos 0.9 son espera a la caché de
datos y unos 0.66 son espera para entregar los datos al motor. Hay dos
optimizaciones más identificadas; cada una se medirá en silicio antes de
reportarse.
{{< /detalle >}}

## Un coprocesador de 128 bits que vale la pena

Algunas cargas de trabajo necesitan números mucho mayores que 64 bits:
criptografía, aritmética exacta, matemáticas de navegación de alta precisión. Con
palabras de 128 bits, cada paso maneja el doble de bits.

{{< fig "bignum-128.svg" "Calcular 1000! (un número de 2568 dígitos): el mismo algoritmo, palabras de 64 bits frente a palabras de 128 bits." >}}

La segunda CPU también ejecuta un entorno de programación nativo de 128 bits. Se
pueden definir servicios nuevos en ella **mientras Linux sigue funcionando**, y
Linux puede llamarlos de inmediato, sin recompilar ni reiniciar.

## Resultados en el prototipo FPGA

| Qué | Resultado |
|---|---|
| SHA3-256 desde un proceso de Linux, sin driver (1 MiB) | **129.0 MB/s** frente a 0.90 MB/s en software en la misma CPU: ×143 (×123–×153 según el arranque y el bitstream) |
| SHA3-256, bare metal | 140 MB/s (3.44 ciclos de reloj por cada 8 bytes) |
| Mensaje corto (hash de 64 bytes) | 8.2 µs en hardware frente a 143 µs en software (×17) |
| Llamada a otra CPU y de vuelta (XCALL) | **1.35 µs** (1,352 ns) |
| Llamada al sistema vacía de Linux, como referencia | 6.59 µs (6,590 ns) |
| Matemáticas de números grandes de 128 frente a 64 bits (1000!) | 1.63× más rápido |
| Dos cálculos en paralelo con llamadas asíncronas | 1.60× (ideal 1.61×) |
| Linux 6.6 SMP en dos hilos de hardware de un núcleo | 20 / 20 arranques consecutivos, más 20 / 20 corridas de estrés SMP en el bitstream más reciente |
| Suite de pruebas en placa | 214 / 214 programas autoverificables (RV128, RV64, FreeRTOS, Zephyr, RTEMS, CoreMark, Forth) |
| CoreMark 1.0 (modo de 64 bits) | 1.85 CoreMark/MHz (aún no medido de nuevo en el bitstream más reciente) |
| Diseño más reciente (p13b): 2 CPUs + motor SHA-3 | 128.0 mil LUT (85 % del VE2302); timing cumplido con una guarda de seguridad de 1.0 ns más +0.444 ns de holgura |

{{< detalle "¿Cuáles son los límites de estos números?" >}}
Vienen de un prototipo FPGA que corre a 60 MHz en un AMD Versal AI Edge VE2302.
Un chip fabricado tendrá otro reloj, consumo y área; esas cifras aún no se
conocen, y los MB/s absolutos cambiarán en el A1. El ×143 (×153 en un bitstream
anterior) se compara con el algoritmo en software en la misma CPU en orden a
60 MHz, no con productos de otros fabricantes ni con procesadores de escritorio.
La referencia en software varía hasta un 20 % entre arranques según la ubicación
en memoria, así que la aceleración es un rango y cada ganancia se compara dentro
de una misma corrida.

El conjunto de instrucciones de 128 bits se basa en el borrador RV128I de la
especificación RISC-V, que no es un estándar ratificado. XCALL y la interfaz de
aceleradores son extensiones de Hercoss, no parte de RISC-V. No existe en ningún
lado un compilador de C para RISC-V de 128 bits, así que el código de 128 bits se
escribe con herramientas propias de Hercoss; Linux y los sistemas operativos de
tiempo real corren en el modo estándar de 64 bits. Bajo Linux el motor SHA-3 tiene
un solo contexto, así que el proceso de hashing se fija a un núcleo. La suite
completa de 214 programas se corrió por última vez en un bitstream anterior; los
posteriores pasaron las pruebas de estrés de SHA-3, de llamadas y de SMP.
{{< /detalle >}}

## Verificado como un producto

Cada cambio de hardware se revisa **instrucción por instrucción** contra modelos
de referencia independientes (versiones de 128 bits, 64 bits, multinúcleo y con
acelerador) en una regresión de más de veinte capas. Cualquier diferencia en un
resultado, una escritura en memoria o una excepción detiene la prueba. Además:

- **Linux 6.6 arranca idéntico** en hardware y en el modelo, de la ROM de
  arranque al primer programa de usuario.
- **FreeRTOS, Zephyr y RTEMS** corren en cosimulación.
- **Se inyectan retardos de memoria aleatorios** para sacar a la luz errores de
  timing.
- **Tres implementaciones independientes coinciden:** el digest SHA-3 de 1 MiB
  calculado en la placa es idéntico byte a byte al calculado en una PC y a los
  vectores oficiales de FIPS 202.
- **Las pruebas están probadas:** invertir un bit de una constante del algoritmo
  produce 570 errores.

Después, los mismos programas corren en la placa, cada uno con su propio veredicto
de aprobado / fallido.

{{< detalle "¿Encontró errores reales antes del silicio?" >}}
Sí. Una prueba de saturación que empuja el motor al máximo mostró que una cola de
entrada interna se habría desbordado: necesitaba 47 entradas y tenía 32. Antes, el
proceso detectó un reinicio durante una transferencia de memoria que podía colgar
la placa, una interrupción entregada al nivel de privilegio equivocado y una
violación sutil de la especificación que hacía que Linux se colgara solo de vez en
cuando. Cada uno se corrigió, y cada uno tiene ahora una prueba que lo volvería a
detectar.
{{< /detalle >}}

## La arquitectura en breve

| | |
|---|---|
| Conjunto de instrucciones | RISC-V de 128 bits (basado en el borrador RV128I) y RV64IMAC, elegidos al reiniciar; instrucciones comprimidas; extensiones de Hercoss para llamadas y aceleradores; contadores de rendimiento en hardware |
| Sistema | Privilegios M/S/U, memoria virtual Sv39 con recorrido de tablas de páginas en hardware; OpenSBI + Linux 6.6 SMP; FreeRTOS, Zephyr, RTEMS |
| Pipeline | 5 etapas, en orden; predicción de saltos; multiplicador rápido; cachés de instrucciones y datos con prefetch de la siguiente línea de datos; AXI4 de 128 bits |
| Cachés | Prototipo: 16 KiB + 16 KiB; plan del Exxo A1: 64 KiB de instrucciones, 32 KiB de datos |
| Modo dual | Dos hilos de hardware de 64 bits en una ruta de datos de 128 bits |
| Motor SHA-3 | Keccak-f[1600], una ronda por ciclo; todas las variantes SHA-3 y SHAKE; ~8,000 LUT |

## Avance en noviembre de 2026

| Fecha | Hito |
|---|---|
| Inicios de noviembre | Núcleo de 128 bits desde cero, primeros programas en la FPGA |
| 10 nov | Linux arranca en el núcleo |
| 11 nov | Núcleo más rápido: predicción de saltos, multiplicador rápido, 60 MHz, CoreMark 1.85 / MHz |
| 19 nov | Linux SMP en dos hilos de hardware de un núcleo |
| 20 nov | Dos CPUs; primer XCALL desde un programa de Linux; llamadas asíncronas |
| 21 nov | Llamadas robustas, servicios en vivo, contadores de rendimiento, reinicio seguro del bus |
| 21 nov | **SHA-3 en hardware desde Linux sin driver: 33 MB/s** |
| 22 nov | Instrucción nueva: 74.5 MB/s |
| 23 nov | Prefetch en la caché de datos: 97.7 MB/s, ×150 |
| 24 nov | Rediseño de timing: 99.8 MB/s, ×153, más margen con menos compuertas |
| 25 nov | Mejoras en el pipeline y la búsqueda de instrucciones: **129 MB/s**; C compilado hasta 1.39× más rápido |
| 25 nov | Anillo de núcleos rediseñado para 64 hilos de hardware: nueva versión 2,900 celdas lógicas más pequeña, timing cumplido |
| 26 nov | **Anillo de 16 estaciones a plena carga en simulación**: núcleos reales, cero divergencias, cada estación con su turno garantizado |

## Siguiente: el anillo de 16 estaciones en silicio real

El Exxo A1 coloca **dieciséis núcleos RV128IMAC** con sus aceleradores en el
anillo de núcleos, alrededor de la red [NOC_512](/es/projects/noc-512/) que lleva
la memoria y la E/S. Los siguientes pasos:

1. **El anillo de longitud completa en la placa FPGA:** una CPU real, el
   acelerador SHA-3 y 15 estaciones de tráfico autoverificables, a velocidad de
   hardware. Latencia de llamada y ancho de banda del acelerador bajo carga, más
   pruebas de resistencia de horas con cada mensaje revisado.
2. **Ajustar la justicia frente al rendimiento bruto** con mediciones reales.
3. **Uno o dos anillos para el A1**, decidido con esas mediciones en silicio
   antes de congelar la arquitectura del chip.

{{< fig "a1-cluster.svg" "Clúster de procesadores planeado del HERCOSS Exxo A1. Diagrama conceptual; no a escala." >}}

{{< detalle "¿Qué falta antes de que el A1 use este núcleo?" >}}
El prototipo tiene dos CPUs en silicio; el anillo de 16 estaciones está
verificado en simulación y su prueba en silicio es lo siguiente. Aún faltan las
funciones de endurecimiento contra radiación previstas para el A1 y las cachés
más grandes. Y hasta ahora el núcleo solo se ha construido para FPGA: el flujo de
chip (macros de memoria, lógica de prueba, timing y área en silicio) viene
después.
{{< /detalle >}}

*Prototipo en AMD Versal a 60 MHz. Cifras medidas en silicio salvo indicación.
En proceso de patente.*

Preguntas, colaboración o inversión:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invertir en Hercoss →](/es/invest/)
