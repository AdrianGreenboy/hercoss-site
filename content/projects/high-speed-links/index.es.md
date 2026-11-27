---
title: "Enlaces de alta velocidad"
layout: article
weight: 11
estado: "Validado en FPGA · Rumbo a 1.6TbE"
summary: "Núcleos SerDes, PCS Ethernet y MAC propios de Hercoss, probados en hardware real: un enlace de 103 Gb/s con una prueba de una hora a cero errores, y un puerto Ethernet de 40G que se comunica con una tarjeta de red comercial. El mismo IP lleva al 1.6TbE y a los ~2 Tbps de Ethernet del Exxo A1."
datos:
  - "Enlace de 103 Gb/s, 0 errores en 1 h"
  - "40GbE frente a NIC comercial"
  - "Ping 5 / 5 desde una PC"
  - "Bancos de registros AXI4 completos"
seotitle: "Núcleos IP Ethernet MAC, PCS y SerDes, rumbo a 1.6TbE — Hercoss"
---

## Qué son

Mover grandes cantidades de datos entre chips significa enviar bits uno tras
otro por unos pocos cables a muy alta velocidad. Tres capas hacen ese trabajo:
el **SerDes** envía el flujo de bits en bruto, el **PCS** (subcapa de
codificación física) lo convierte en un flujo de datos limpio y alineado, y el
**MAC** lo convierte en tramas Ethernet. Hercoss diseña cada capa digital por sí
misma.

{{< fig "ethernet-stack.svg" "Cada capa digital es IP de Hercoss. En la FPGA el transceptor analógico es de AMD; para el Exxo A1 aún está por diseñarse o licenciarse." >}}

## Velocidades: probadas y planeadas

{{< fig "link-speeds.svg" "Sólido: medido en hardware FPGA. Punteado: objetivos de diseño para el núcleo SerDes completo y el Exxo A1." >}}

## SERDES_256G v1.0: un enlace de 103 Gb/s

Un enlace serie multicarril con codificación de línea 64B/66B propia de Hercoss,
diseñado para ocho carriles de 32 Gb/s (256 Gb/s en total).

- **Medido en FPGA:** cuatro carriles a 25.78 Gb/s, la tasa más alta que
  aceptan los transceptores de la placa: una línea de **103 Gb/s**.
- **Prueba de una hora a cero errores** a esa tasa. También funciona a
  4 × 10.3 Gb/s.
- **La versión 1.0** añade un banco de registros AXI4 completo (validado en
  hardware), adaptadores de ancho AXI-Stream y contadores de errores y tramas de
  64 bits.
- **Pendiente:** una prueba por un cable externo en lugar del lazo interno, y
  los 8 × 32 Gb/s completos en una placa más grande.

## Ethernet de 40G: PCS_40G + MAC_40G

Un puerto Ethernet 40GBASE-R completo, construido en tres pasos y probado contra
una tarjeta de red comercial (una Mellanox ConnectX-3 Pro) por un cable de cobre
de 3 m:

1. **PCS en lazo:** cuatro carriles a 10.3125 Gb/s, cero errores.
2. **Enlace con la tarjeta de red:** el enlace se levanta y los cuatro carriles
   se alinean; la tarjeta cuenta cada trama de prueba.
3. **MAC y tramas:** secuencia de verificación de trama, un generador y
   verificador UDP en hardware, una ruta de recepción con filtro de direcciones
   y control de flujo PAUSE.

Lo que la versión actual (v0.3) hace en hardware:

- **La PC hace ping a la placa** y recibe 5 de 5 respuestas.
- **Se respetan las tramas PAUSE.**
- **Se detectan las tramas malas:** un modo de prueba envía tramas con una suma
  de verificación incorrecta, y tanto la placa como la tarjeta de red las
  rechazan.
- **Prueba de una hora contra la tarjeta de red con cero errores**, y los
  conteos de tramas coinciden exactamente en ambos lados.

**En curso (v0.4):** un supervisor de recepción que reintenta automáticamente un
carril que a veces no se engancha tras un reinicio del transceptor.

## Ethernet de 25G y tiempo preciso

- **PCS_25G + MAC_25G:** un puerto Ethernet de 25G con un codificador 64B/66B de
  la cláusula 49, validado en FPGA.
- **PTP / IEEE 802.1AS:** marcas de tiempo en hardware para sincronizar relojes
  en una red, validado en FPGA. En el Exxo A1 da a cada puerto Ethernet una base
  de tiempo común.

## Hacia dónde lleva esto: el Exxo A1

El mismo IP digital escala al conjunto de transceptores del
[HERCOSS Exxo A1](/es/projects/hercoss-exxo-a1/): 72 carriles con hasta **~2 Tbps
de Ethernet a la vez**, un puerto **1.6TbE** en ocho carriles PAM4 de 224 Gb/s,
otros 400G en carriles de 32 Gb/s y tres enlaces PCIe Gen5 x16.

El controlador de 1.6 Tb/s ya está en marcha: [ETH_1T6](/es/projects/eth-1t6/)
es una capa de enlace completa, MAC, PCS, corrección de errores RS(544,514) y
alineación de carriles, que funciona en la placa FPGA en una configuración a
escala: 312 mil millones de tramas en una hora con cero errores, ráfagas de
errores reparadas a velocidad completa e idéntica bit a bit a los vectores de
referencia del IEEE 802.3 para 200G, 400G y 800G. Pendiente: los propios
transceptores analógicos, que en la FPGA son de AMD y para el A1 tienen que
diseñarse o licenciarse.

{{< detalle "¿Qué es la codificación 64B/66B?" >}}
Un receptor solo puede recuperar el reloj de una señal que cambia con
suficiente frecuencia. 64B/66B añade dos bits marcadores a cada 64 bits de datos
y aleatoriza el resto, lo que garantiza esos cambios a un costo de solo un 3 %
de ancho de banda adicional.
{{< /detalle >}}

{{< detalle "¿Qué es una prueba de resistencia (soak)?" >}}
Hacer funcionar el enlace de forma continua durante mucho tiempo mientras se
cuenta cada error. Un enlace que funciona unos segundos todavía puede fallar una
vez por hora; la prueba de resistencia es lo que demuestra que es estable.
{{< /detalle >}}

{{< detalle "¿Por qué probar contra una tarjeta de red comercial?" >}}
Un núcleo que solo habla consigo mismo puede tener el mismo error en ambos
extremos, y los dos se cancelan. Funcionar con hardware de otro fabricante
demuestra que el núcleo sigue el estándar.
{{< /detalle >}}

{{< detalle "¿Qué es el lazo PMA de extremo cercano?" >}}
El transceptor envía su salida directamente de vuelta a su propio receptor
dentro del chip. Prueba toda la ruta digital a velocidad completa sin cable; el
siguiente paso es un cable externo o un segundo dispositivo.
{{< /detalle >}}
