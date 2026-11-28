---
title: "NOC_512: la red en chip del Exxo A1 que se repara sola"
layout: article
weight: 3
estado: "Autorreparación validada en silicio · red completa verificada formalmente (2 × 2) · Plan del chip de 5 × 5 en simulación"
hidecover: true
seotitle: "NOC_512: red en chip de 512 bits para el espacio que se repara sola, validada en silicio — Hercoss"
summary: "Una red en chip de 512 bits que lleva flujos garantizados de alto ancho de banda y se repara sola alrededor de un switch dañado en unos 0.6 µs, sin software y sin perder datos. Validada en silicio: 405,522 fallas de switch en una hora, más de 160 mil millones de palabras de datos, ninguna perdida ni dañada."
datos:
  - "Se repara sola en ≈0.6 µs, en silicio"
  - "405,522 fallas, 0 palabras perdidas"
  - "Red completa verificada formalmente"
  - "9 / 9 reglas de seguridad verificadas formalmente"
  - "3.19 billones de transferencias, 0 errores"
  - "Plan del chip de 7.7 Tb/s"
---

{{< stats >}}
{{< stat "≈0.6 µs" "para que la red se repare sola alrededor de un switch muerto, medido en silicio" >}}
{{< stat "405,522" "fallas de switch en una hora a plena carga, todas atendidas" >}}
{{< stat "0" "de más de 160 mil millones de palabras de datos perdidas o dañadas" >}}
{{< stat "3.19 bill." "de transferencias AXI4 (billones) en silicio en nueve corridas de una hora, sin un solo error" >}}
{{< /stats >}}

{{< aviso "Análisis de patente en curso" >}}
Esta página reporta lo que logra NOC_512. Cómo funcionan sus mecanismos de
protección y autorreparación no se publica mientras la patente está siendo
analizada.
{{< /aviso >}}

## En pocas palabras

Todo chip grande es una ciudad de bloques: clústeres de procesadores, Ethernet,
PCIe, motores de IA, convertidores de radio, memoria. La red en chip es su
sistema de calles. **Si se cierra una calle, la ciudad se detiene.**

**NOC_512** es la red en chip del
[HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/). Mueve datos de 512 bits en 512
bits, lleva el tráfico normal de memoria y flujos garantizados de alto ancho de
banda lado a lado, y protege a ambos contra fallos en todos los niveles.

Este mes pasó su prueba más difícil hasta ahora, **en silicio**. Un switch de la
red se apagó y se volvió a encender **más de 400,000 veces en una hora, a plena
carga**. Cada vez, la red restableció el carril de datos afectado **por sí sola
en unos 0.6 microsegundos**, sin software, sin tablas de rutas y sin controlador
central, y volvió a su configuración original cuando el switch regresó. **Ni una
de más de 160 mil millones de palabras de datos se perdió ni se dañó.**

## Nuevo, 28 de noviembre: la red completa, verificada formalmente

Las pruebas muestran qué pasa en los casos que uno intenta. **Una demostración
formal cubre todos los casos.** El 28 de noviembre el verificador terminó la
red completa: una red de 2 × 2 con cuatro switches, con **cada configuración y
cada patrón de switches fallidos** abiertos al verificador.

{{< stats >}}
{{< stat "0" "formas de que los switches formen un lazo, en cualquier configuración y patrón de fallas" >}}
{{< stat "0" "formas de entregar los datos de un circuito al destino de otro circuito" >}}
{{< stat "20–44" "ciclos de reloj de profundidad en las verificaciones acotadas, con el regreso completo a casa demostrado" >}}
{{< stat "27 h" "para la más larga de estas verificaciones" >}}
{{< /stats >}}

{{< fig "noc-formal-net.es.svg" "Verificación formal de la red completa de 2 × 2, terminada el 28 de noviembre de 2026. Verificaciones acotadas de 20 a 44 ciclos de reloj." >}}

Se demostró que la red **nunca forma un lazo**, **nunca entrega los datos de
un circuito al destino de otro circuito** y, al terminar las fallas, **vuelve
por completo a su configuración original.** Son verificaciones acotadas de 20
a 44 ciclos de reloj; las demostraciones para cualquier duración son el
siguiente paso.

## Qué cambió el 26 de noviembre de 2026

**En un día, la red que se repara sola pasó de la simulación al silicio y a la
verificación formal.**

{{< fig "noc-day.svg" "Un día: la simulación predijo 149 ciclos, el silicio midió 149 ciclos, una prueba de una hora lo confirmó 405,522 veces y un verificador de modelos no encontró forma de romperla." >}}

- **Primera corrida en silicio.** Un switch se desactivó a plena carga en la
  placa de prueba. La red restableció por sí sola el carril afectado en **149
  ciclos de reloj (0.58 µs)**, exactamente la cifra que predijo la simulación, y
  volvió a su configuración original cuando el switch regresó. Sin pérdida de
  datos.
- **Prueba de resistencia de una hora en silicio.** **405,522 fallas de switch**
  con tiempos aleatorios, cada reparación en **148 a 156 ciclos de reloj**. Más
  de **160 mil millones de palabras de datos, ninguna perdida ni dañada.**
- **Verificación formal.** Un verificador matemático de modelos exploró *cada
  secuencia de entrada posible* a un switch y **no encontró forma de romper
  ninguna de sus nueve reglas de seguridad** dentro de la profundidad
  comprobada.
- **Regresión del chip completo.** La red del A1 de 25 nodos en simulación da los
  mismos resultados que antes: cero palabras perdidas con un switch dañado.
- **Límites honestos.** La versión endurecida de la lógica de autorreparación no
  cabe en la pequeña FPGA de prueba junto con todo lo demás, así que en silicio
  corrió la versión básica. La versión endurecida está verificada en simulación
  y formalmente.

## El resultado principal: autorreparación, en silicio

### La prueba

Una versión de 2 × 2 de NOC_512 funciona en una FPGA AMD Versal (Trenz TE0950,
VE2302) a **255 MHz**, con tráfico de memoria en el plano de paquetes y dos
circuitos de flujo en el plano de flujo, uno de ellos protegido. Un gancho de
prueba **mata el switch de flujo de un nodo**: deja de enviar cualquier cosa,
exactamente como un switch que ha fallado.

Nadie le dice a la red qué switch falló. Ningún software reacciona. No hay ruta
de respaldo preparada.

{{< fig "noc-heal-concept.svg" "Autorreparación en tres pasos: ruta normal, desvío encontrado por la propia malla, regreso automático. Dibujo conceptual." >}}

### Qué pasa

{{< fig "noc-heal-withwithout.svg" "Sin autorreparación, el flujo sobrevive pero corre sin red de seguridad. Con ella, la red de seguridad vuelve en menos de un microsegundo." >}}

| | Sin autorreparación | Con autorreparación |
|---|---|---|
| El carril que pasa por el switch dañado | Sigue muerto mientras el switch esté muerto | **Vivo otra vez tras 148–156 ciclos de reloj (≈ 0.6 µs)** |
| Palabras de datos que la protección tiene que reconstruir | **191 millones por segundo** | **Ninguna** una vez que vuelve el carril |
| Palabras perdidas | 0 (la protección lo cubre) | **0** |
| Cuando el switch regresa | – | La red vuelve sola a su configuración original |

Sin autorreparación, el flujo sobrevive solo porque su protección reconstruye
cada palabra. Funciona, pero el flujo corre sin red de seguridad: un fallo más y
se pierden datos. **Con autorreparación, la red de seguridad se restablece en
menos de un microsegundo.**

### Una hora, 405,522 fallas

Un solo éxito demuestra que la idea funciona. Para demostrar que es confiable,
el switch se mató y se revivió una y otra vez durante una hora, con tiempos
aleatorios, de microsegundos a decenas de milisegundos, incluidas fallas que
llegan mientras la red todavía repara la anterior.

{{< fig "noc-heal-soak.svg" "La prueba de una hora en silicio a 255 MHz, cada contador revisado al final." >}}

| Prueba de una hora en silicio | |
|---|---|
| Fallas de switch | **405,522** |
| Reparaciones medidas | 324,687, **todas entre 148 y 156 ciclos de reloj** (media 148.8) |
| Fallas que llegaron mientras la reparación seguía activa | 80,835: el carril ni siquiera cayó |
| Regreso a la configuración original comprobado | 6,336 veces, 6,336 correctas |
| Palabras de datos del flujo | Más de **160 mil millones**, **ninguna perdida, ninguna dañada** |
| Tráfico de memoria en paralelo | **24.8 mil millones** de lotes de transacciones, **cero errores** |

### Prácticamente determinista

{{< fig "noc-heal-time.svg" "Cuánto tiempo queda caído un carril tras morir su switch. Autorreparación medida en silicio; rutas de respaldo preparadas, de la simulación del chip completo." >}}

| Tiempo de reparación (ciclos de reloj) | Reparaciones |
|---|---|
| 0 – 150 | 311,774 |
| 151 – 200 | 12,913 |
| Más de 200 | **0** |

Una dispersión de ocho ciclos de reloj en cientos de miles de eventos, y sin cola
larga. Los mismos 149 ciclos se midieron en la simulación RTL antes de la
primera corrida en silicio: **el hardware hace exactamente lo que predijo el
modelo.**

### Por qué esto es diferente

La mayoría de las redes tolerantes a fallos se reparan con ayuda: software que
nota la falla, tablas preparadas de antemano, un controlador que decide.
**NOC_512 no necesita nada de eso.**

{{< fig "noc-ideas.svg" "Cuatro cosas que la red no necesita para repararse." >}}

- **Sin software en el lazo.** La reparación termina antes de que un procesador
  siquiera hubiera notado una interrupción.
- **Sin tablas de rutas.** No hay que preparar nada de antemano para cada falla
  posible.
- **Sin controlador central.** No hay un bloque único cuya falla detendría la
  propia reparación.
- **Sin saber qué falló.** No hace falta decirle a la red qué switch se perdió.

### Verificada formalmente, no solo probada

Las pruebas muestran qué pasa en los casos que uno intenta. **La verificación
formal revisa cada caso posible, hasta una profundidad indicada.** Un
verificador de modelos exploró cada secuencia de entrada posible a la lógica de
autorreparación de un switch (cualquier tráfico, cualquier comportamiento de los
vecinos, cualquier configuración) y no encontró forma de romper ninguna de sus
nueve reglas de seguridad dentro de esa profundidad.

{{< fig "noc-formal.svg" "Verificación formal de la lógica de autorreparación de un switch, por model checking dentro de las profundidades indicadas." >}}

- **Nueve reglas de seguridad, todas se cumplen** para cada secuencia de entrada:
  32 ciclos de reloj de profundidad con cada tiempo de espera alcanzable, 24 con
  los reales.
- **La versión endurecida se comporta exactamente igual que la básica**, con
  fallos inyectados a voluntad, comprobado a 16 ciclos de reloj de profundidad.
- **La red completa, hecho el 28 de noviembre:** en una red de 2 × 2, con cada
  configuración y cada patrón de switches fallidos abiertos al verificador, los
  switches nunca forman un lazo, nunca entregan los datos de un circuito al
  destino equivocado y siempre vuelven a casa (verificaciones acotadas de 20 a
  44 ciclos).

{{< detalle "Ciclos de reloj, no microsegundos: ¿qué significa para el chip?" >}}
La reparación toma unos 149 ciclos de reloj, sea cual sea el reloj. A 255 MHz en
la FPGA son 0.58 µs; con los relojes de clase gigahercio de un chip dedicado
sería una fracción de eso. En el sistema de prueba de 2 × 2, la lógica de
autorreparación de los cuatro nodos ocupa unos 10,300 LUT, cerca del 9 % del
sistema de prueba. Su versión endurecida está verificada en simulación; no cabe
en este dispositivo pequeño junto con todo lo demás y espera uno más grande.
{{< /detalle >}}

## Por qué importa una red en chip

En un sistema en chip moderno, el cómputo bruto rara vez es el cuello de
botella. **Mover datos sí lo es.** Un puerto Ethernet de 1.6 Tb/s, un enlace
PCIe Gen5 x16, un arreglo de IA y un front-end de RF necesitan intercambiar datos
al mismo tiempo, sin que uno frene a los demás, y sin que todo el chip falle
cuando una parte se comporta mal.

Para un chip pensado para misiones espaciales largas, ese último punto es
decisivo. En diez años en órbita o en el espacio profundo, partes de un chip
recibirán impactos de partículas energéticas. Un bit se invierte; un switch se
bloquea. En la Tierra, la misma confiabilidad importa en centros de datos,
telecomunicaciones y cualquier sistema que no se puede detener para repararlo.
**Una red que mantiene intactos sus datos y rodea sus propias fallas es lo que
permite que el resto del chip siga funcionando.**

## Qué es NOC_512

Dos redes en una, que comparten la misma malla de nodos:

| | Plano de paquetes | Plano de flujo |
|---|---|---|
| Lleva | Lecturas y escrituras de memoria entre dos bloques cualesquiera (AXI4) | Flujos continuos de alto ancho de banda: Ethernet, PCIe, IA, RF, convertidores |
| Cómo | Los paquetes encuentran su camino salto a salto | Carriles reservados de extremo a extremo: ancho de banda garantizado, latencia constante |
| Ancho | Datos de 512 bits, con protección | Carriles de 512 bits, 8 carriles por enlace en el A1 |

{{< fig "noc-planes.svg" "Una malla, dos planos. Conceptual." >}}

**Hecha para el chip A1:** una malla de 5 × 5 con 25 nodos que conecta cuatro
clústeres de procesadores (16 núcleos [RV128IMAC](/es/projects/rv128imac/)),
seis puertos del tejido FPGA, tres puertos PCIe y tres Ethernet (incluido el de
[1.6 Tb/s](/es/projects/eth-1t6/)), tres puertos del arreglo de IA, los
convertidores ADC y de RF, dos puertos de memoria externa
([DDRC_72](/es/projects/ddrc-72/)) y el nodo de arranque, criptografía y
periféricos lentos.

**Protegida en todos los niveles:**

- **Corrección de errores de extremo a extremo** en cada paquete: errores de un
  bit corregidos, errores de dos bits detectados.
- **Estado de control tolerante a fallos** en routers, enlaces, puentes y
  configuración: un estado interno corrompido en cada ciclo de reloj da
  exactamente el mismo resultado que una corrida sin fallos.
- **Memorias protegidas** dentro de los puentes.
- **Flujos protegidos:** un camino cortado o bits invertidos no cuestan datos.
- **Reenrutamiento automático** a rutas de respaldo preparadas, con regreso
  automático cuando el camino original vuelve a funcionar.
- **Nuevo: autorreparación.** La malla encuentra sola el camino alrededor de un
  switch que falló.
- **Dice la verdad cuando no puede con algo:** cada palabra perdida se cuenta y
  ninguna se entrega mal.

### Fallos a propósito, en silicio

{{< fig "noc-faults.svg" "Corridas anteriores de inyección de fallos en la placa FPGA mientras la red llevaba tráfico." >}}

## El precio de la protección, publicado

Cada capa de protección se llevó a la placa por separado y corrió una hora a
plena carga antes de añadir la siguiente. Cada corrida: **cero errores.**

{{< fig "noc-ladder.svg" "Corridas de una hora en un AMD Versal VE2302 (Trenz TE0950). Reloj y transferencias AXI4 por hora." >}}

Cada resultado en silicio se midió en la misma placa pequeña, la única
disponible hoy. Cada nueva capa de protección significó meter más lógica en el
mismo dispositivo, y por eso el reloj pasó de 375 MHz para la red básica a
255 MHz con todas las protecciones y la lógica de autorreparación a bordo. **En
el chip A1, esta lógica es silicio dedicado, no tejido FPGA.**

{{< detalle "¿Qué significan las cifras de reloj de la FPGA para el chip?" >}}
Se miden en una FPGA, no en el Exxo A1. El reloj del chip depende del nodo de
producción; el A1 apunta a unos 1.5 GHz para la red. En la FPGA, 1.6 Tb/s en un
solo enlace de 512 bits necesitarían 3.1 GHz, por eso el tráfico masivo se
reparte en varios circuitos de flujo en paralelo.
{{< /detalle >}}

{{< fig "noc-why.svg" "Reloj necesario para 1.6 Tb/s en un enlace de 512 bits, frente a los techos medidos en la FPGA." >}}

## El chip completo, en simulación

{{< fig "noc-a1plan.svg" "Plan de tráfico del Exxo A1 en la malla de 5 × 5, corrido en simulación con la red completa." >}}

En el plan del A1 de 25 nodos, en simulación RTL:

- **19 circuitos de flujo a la vez**, 57 carriles de datos, **7.73 Tb/s** de
  ancho de banda garantizado a 265 MHz, junto al plano de paquetes.
- **Un switch muerto a la vez** (seis switches distintos, cada uno muerto
  durante 800 ciclos): **65 de 66 carriles afectados vuelven al servicio**
  mientras el switch sigue muerto. El restante no tiene ningún camino libre en
  toda la malla. **Cero palabras perdidas**, y cada circuito vuelve a casa cuando
  el switch se recupera.
- **Dos switches muertos al mismo tiempo**, en el peor par del chip: **72 % menos
  palabras perdidas** que sin ninguna reparación, y solo uno de los ocho grupos
  de circuitos afectados sigue cortado, aquel para el que no queda ningún camino
  libre.
- Con la lógica de autorreparación endurecida y su estado interno corrompido en
  **cada ciclo de reloj en los 25 switches**, los resultados son **idénticos
  palabra por palabra** a la corrida sin corrupción.

{{< fig "noc-chipfail.svg" "Fallas ensayadas en la malla completa de 5 × 5 en simulación." >}}

## Cómo llegamos aquí

| Etapa | Resultado |
|---|---|
| Router de paquetes, 512 bits | ~409 MHz fuera de contexto en el VE2302 |
| Plano de flujo | Techo de ~583 MHz fuera de contexto |
| Primer silicio, 2 × 2 | Pasó a **250 MHz**, después a **350** y **375 MHz**; pruebas de una hora con cero errores |
| Corrección de errores de extremo a extremo | Silicio a **375 MHz**: autoprueba, errores inyectados corregidos, prueba de una hora, cero errores |
| Estado de control tolerante a fallos | Silicio a **285–300 MHz**, con el estado interno corrompido en cada ciclo de reloj: cero errores |
| Circuitos de flujo protegidos | Silicio a **275 MHz**: un camino muerto o bits invertidos no cuestan datos |
| Memorias de puente protegidas | Silicio a **275 MHz** |
| Reenrutamiento automático con regreso | Silicio a **265 MHz**: ninguna palabra perdida al pasar a la ruta de respaldo y volver |
| Unidades de datos más anchas para el chip de 25 nodos | Silicio a **265 MHz**, prueba de una hora, cero errores |
| Plan del A1 de 25 nodos | Plan de circuitos completo en simulación, 7.73 Tb/s garantizados |
| **Autorreparación** | Simulación en el chip completo, después **silicio a 255 MHz: 405,522 fallas reparadas en ≈ 0.6 µs, sin perder datos** |
| **Verificación formal** | Lógica de autorreparación de un switch: nueve reglas de seguridad se cumplen para cada secuencia de entrada dentro de la profundidad comprobada; versión endurecida equivalente bajo inyección de fallos; **red completa de 2 × 2: sin lazos, sin entregas equivocadas, regreso completo a casa** |

Cada paso siguió la misma regla: **simularlo, llevarlo a silicio, correrlo una
hora y publicar el número.** Lo que todavía no cabe en nuestra placa se etiqueta
como simulación, no como resultado.

## Qué es esto y qué todavía no es

| | Estado |
|---|---|
| Plano de paquetes con todas sus protecciones, protección de flujos, reenrutamiento automático | **Medido en silicio** |
| Autorreparación del plano de flujo, red de 2 × 2 con un desvío posible | **Medido en silicio** |
| Lógica de autorreparación de un switch, básica y endurecida | **Verificada formalmente** dentro de la profundidad comprobada (32 / 24 ciclos; versión endurecida, 16 ciclos con inyección arbitraria de fallos) |
| Red del A1 de 25 nodos, dos fallas simultáneas, lógica de autorreparación endurecida | Simulación y síntesis |
| Red completa (2 × 2): sin lazos, sin datos al destino equivocado, regreso completo a casa tras las fallas | **Verificada formalmente** (verificaciones acotadas de 20 a 44 ciclos de reloj) |
| Pruebas de radiación | Aún no realizadas. La inyección de fallos muestra tolerancia a los fallos que inyectamos, nada más. **No se afirma ninguna calificación contra radiación** |
| Implementación ASIC | Parte del programa del chip HERCOSS Exxo A1 |

## Próximos pasos

1. Demostraciones no acotadas: para cualquier duración, no solo dentro de la
   profundidad comprobada.
2. Un dispositivo Versal más grande, para llevar la red completa de 25 nodos y la
   lógica de autorreparación endurecida de la simulación al hardware.
3. Recuperación más rápida cuando fallan dos switches a la vez.
4. Una campaña de pruebas de radiación.

## En el Exxo A1

NOC_512 es la columna vertebral del [HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/):
une los dieciséis núcleos RV128IMAC, el tejido FPGA, los motores de IA y de
control de actitud, la memoria y toda la E/S. El A1 comercial puede correr la red
con una protección más ligera; el A1 endurecido contra radiación la usa
completa.

*Todas las cifras vienen de nuestras propias corridas. Las cifras en silicio son
de un prototipo FPGA (AMD Versal VE2302 en una placa Trenz TE0950), no del chip
final.*

¿Le interesa el HERCOSS Exxo A1 o NOC_512?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invertir en Hercoss →](/es/invest/)
