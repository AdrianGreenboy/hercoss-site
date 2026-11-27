---
title: "RF y procesamiento de señales, rumbo al Exxo A1-RF"
layout: article
weight: 5
estado: "IP de front-end de RF validado en FPGA · A1-RF en desarrollo"
hidecover: true
seotitle: "IP de front-end digital de RF (DDC/DUC) y el HERCOSS Exxo A1-RF — Hercoss"
summary: "El IP de radio de Hercoss: un front-end digital completo que sintoniza, filtra y mueve señales de radio en hardware, validado en silicio FPGA, más la cadena digital de un ADC de alta resolución. Sobre esta base Hercoss desarrolla el HERCOSS Exxo A1-RF: el A1 con un front-end de radio en el mismo chip."
datos:
  - "Recepción + transmisión en un núcleo"
  - "Idéntico bit a bit en 6 dominios"
  - "Cadena ADC de hasta 18.9 bits"
  - "A1-RF en desarrollo"
---

{{< stats >}}
{{< stat "DDC + DUC" "cadenas de recepción y transmisión en un núcleo, validadas en silicio FPGA" >}}
{{< stat "6 / 6" "dominios con el mismo resultado bit a bit, del modelo en Python a la placa" >}}
{{< stat "18.9" "bits efectivos de la cadena de decimación del ADC en su ajuste más alto" >}}
{{< stat "A1-RF" "la próxima variante del Exxo A1, con radio en el chip" >}}
{{< /stats >}}

## Por qué importa la radio

Todo satélite es una radio: telemetría hacia abajo, comandos hacia arriba,
enlaces de datos, enlaces entre satélites, navegación, monitoreo del espectro.
Hacer el trabajo de radio en hardware digital reconfigurable (**radio definida
por software**) significa que una nave puede cambiar de frecuencia, de forma de
onda o de misión después del lanzamiento, subiendo lógica nueva en lugar de
hardware nuevo.

## Front-end digital de RF, validado en FPGA

El núcleo que se ubica entre los convertidores de datos y el procesador. Hace
los dos trabajos que dominan cualquier radio a la frecuencia de muestreo
completa:

- **Recepción (conversión descendente):** bajar la señal a banda base, reducir
  la frecuencia de muestreo, limpiarla con un filtro y mantener estable su
  nivel mientras reporta la intensidad de la señal.
- **Transmisión (conversión ascendente):** lo inverso, de banda base a la
  portadora.

{{< fig "rf-chain.svg" "Cadenas de recepción y transmisión del front-end digital de RF de Hercoss." >}}

| Qué | Resultado |
|---|---|
| Cadenas | Recepción (DDC) y transmisión (DUC) completas en un núcleo |
| Formato de señal | I/Q complejo, punto fijo de 16 bits |
| Sintonía | Oscilador controlado numéricamente de 32 bits |
| Cambio de tasa | Decimación e interpolación por 4, 8, 16 o 32 |
| Filtro | FIR de 16 coeficientes, cargados por software, mapeado a bloques DSP |
| Control de nivel | Control automático de ganancia con lectura de la intensidad de señal |
| Ruta de datos | Su propio maestro AXI4 envía las muestras directo a memoria |
| Exactitud | El mismo resultado bit a bit en seis dominios: modelo en Python, dos testbenches VHDL, código C en ARM y dos lecturas independientes del silicio |

## Cadena de ADC de alta resolución, validada en FPGA

La mitad digital de un convertidor analógico-digital sigma-delta: el filtro que
convierte un flujo rápido de 1 bit en muestras de alta resolución. De ese filtro
digital es de donde realmente sale la resolución.

- **Resolución efectiva de unos 16.4 bits** con una razón de sobremuestreo de
  128, y **de unos 18.9 bits** con 256.
- Muestras almacenadas en memoria en chip y movidas a la memoria principal por
  DMA, con interrupciones para el procesador.
- El mismo resultado en silicio que en las cinco capas de simulación.

En el Exxo A1 esta cadena se convierte en la base de los **diez ADC sigma-delta
de 24 bits** para sensores y telemetría.

{{< detalle "¿Cómo se probó esto sin un front-end analógico?" >}}
La placa de prueba no tiene convertidores de radio conectados a la FPGA. Por eso
ambos núcleos llevan una fuente de prueba en el chip: un generador de tonos
programable para el front-end de RF y un modulador sigma-delta digital para la
cadena del ADC. Así cada prueba es determinista y se autoverifica en silicio.
Los puertos para un front-end analógico real ya existen; conectar convertidores
reales es el siguiente paso.
{{< /detalle >}}

## El HERCOSS Exxo A1-RF, en desarrollo

Hercoss desarrolla una **variante de radio del Exxo A1**: los mismos dieciséis
procesadores de 128 bits, el tejido FPGA y la red en chip, más un front-end de
radio en el mismo chip. Un solo dispositivo desde la señal de la antena hasta la
decisión.

{{< fig "a1-rf.svg" "Concepto del Exxo A1-RF. El front-end digital está probado; las partes analógicas están por diseñarse." >}}

**Usos objetivo:**

- **Cargas útiles satelitales definidas por software** que se pueden reasignar
  en órbita.
- **Telemetría, telecomando y enlaces de bajada de datos** en el mismo chip que
  opera la nave.
- **Enlaces entre satélites** para constelaciones.
- **Monitoreo del espectro** e inteligencia de señales.

**Estado, con honestidad:** el front-end digital y la cadena del ADC están
probados en FPGA. El front-end de RF y los convertidores de datos de alta
velocidad aún están por diseñarse, y la especificación del A1-RF se está
definiendo. Son bienvenidos socios en diseño de RF y de señal mixta.

## Invierta en radio en un chip

La radio es la única función que tiene toda nave espacial. Ponerla en el mismo
chip europeo que los procesadores y el tejido FPGA significa menos piezas, menos
masa y una carga útil que puede cambiar de misión después del lanzamiento.
[Invertir en Hercoss →](/es/invest/) ·
[adrian@hercoss.com](mailto:adrian@hercoss.com)
