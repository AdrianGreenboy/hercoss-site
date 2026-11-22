---
title: "RF and signal processing — toward the Exxo A1-RF"
layout: article
weight: 5
estado: "RF front-end IP validated on FPGA · A1-RF in development"
hidecover: true
seotitle: "RF digital front-end IP (DDC/DUC) and the HERCOSS Exxo A1-RF — Hercoss"
summary: "Hercoss's radio IP: a complete digital front-end that tunes, filters and moves radio signals in hardware, validated on FPGA silicon, plus the digital chain of a high-resolution ADC. On this base Hercoss is developing the HERCOSS Exxo A1-RF: the A1 with a radio front end on the same chip."
datos:
  - "Receive + transmit in one core"
  - "Bit-identical in 6 domains"
  - "Up to 18.9-bit ADC chain"
  - "A1-RF in development"
---

{{< stats >}}
{{< stat "DDC + DUC" "receive and transmit chains in one core, validated on FPGA silicon" >}}
{{< stat "6 / 6" "domains with the same bit-exact result, from the Python model to the board" >}}
{{< stat "18.9" "effective bits of the ADC decimation chain at its highest setting" >}}
{{< stat "A1-RF" "the next variant of the Exxo A1, with radio on the chip" >}}
{{< /stats >}}

## Why radio matters

Every satellite is a radio: telemetry down, commands up, data links,
inter-satellite links, navigation, spectrum sensing. Doing the radio work in
reconfigurable digital hardware (**software-defined radio**) means a
spacecraft can change frequency, waveform or mission after launch, by
uploading new logic instead of new hardware.

## RF digital front-end — validated on FPGA

The core that sits between the data converters and the processor. It does
the two jobs that dominate any radio at full sample rate:

- **Receive (down-conversion):** shift the signal down to baseband, reduce
  the sample rate, clean it with a filter, and keep its level steady while
  reporting signal strength.
- **Transmit (up-conversion):** the mirror image, from baseband up to the
  carrier.

{{< fig "rf-chain.svg" "Receive and transmit chains of the Hercoss RF digital front-end." >}}

| What | Result |
|---|---|
| Chains | Full receive (DDC) and transmit (DUC) in one core |
| Signal format | Complex I/Q, 16-bit fixed point |
| Tuning | 32-bit numerically controlled oscillator |
| Rate change | Decimation and interpolation by 4, 8, 16 or 32 |
| Filter | 16-tap FIR, coefficients loaded by software, mapped to DSP blocks |
| Level control | Automatic gain control with signal-strength readback |
| Data path | Its own AXI4 master streams samples straight to memory |
| Correctness | Same bit-exact result in six domains: Python model, two VHDL testbenches, ARM C code, and two independent reads from the silicon |

## High-resolution ADC chain — validated on FPGA

The digital half of a sigma-delta analog-to-digital converter: the filter
that turns a fast 1-bit stream into high-resolution samples. That digital
filter is where the resolution actually comes from.

- **Effective resolution of about 16.4 bits** at an oversampling ratio of
  128, and **about 18.9 bits** at 256.
- Samples buffered in on-chip memory and moved to main memory by DMA, with
  interrupts for the processor.
- The same result on silicon as in all five simulation layers.

In the Exxo A1 this chain becomes the basis of the **ten 24-bit sigma-delta
ADCs** for sensors and telemetry.

{{< detalle "How was this tested without an analog front end?" >}}
The test board has no radio converters wired to the FPGA. Both cores
therefore carry an on-chip test source: a programmable tone generator for the
RF front-end, and a digital sigma-delta modulator for the ADC chain. This
makes every test deterministic and self-checking on silicon. The ports for a
real analog front end already exist; connecting real converters is the next
step.
{{< /detalle >}}

## The HERCOSS Exxo A1-RF — in development

Hercoss is developing a **radio variant of the Exxo A1**: the same sixteen
128-bit processors, FPGA fabric and network-on-chip, plus a radio front end
on the same chip. One device from the antenna's signal to the decision.

{{< fig "a1-rf.svg" "Concept of the Exxo A1-RF. The digital front-end is proven; the analog parts are to be designed." >}}

**Target uses:**

- **Software-defined satellite payloads** that can be re-purposed in orbit.
- **Telemetry, telecommand and data downlinks** on the same chip that runs
  the spacecraft.
- **Inter-satellite links** for constellations.
- **Spectrum monitoring** and signal intelligence.

**Status, honestly:** the digital front-end and the ADC chain are proven on
FPGA. The RF front end and the high-speed data converters are still to be
designed, and the A1-RF specification is being defined. Partners in RF and
mixed-signal design are welcome.

## Invest in radio on a chip

Radio is the one function every spacecraft has. Putting it on the same
European chip as the processors and the FPGA fabric means fewer parts, less
mass and a payload that can change its mission after launch.
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest) ·
[adrian@hercoss.com](mailto:adrian@hercoss.com)
