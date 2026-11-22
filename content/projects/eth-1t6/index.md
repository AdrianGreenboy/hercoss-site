---
title: "ETH_1T6 — 1.6 Tb/s Ethernet"
layout: article
weight: 6
estado: "In development · MAC verified in simulation, timing-clean on FPGA"
hidecover: true
seotitle: "ETH_1T6 — 1.6 Tb/s Ethernet MAC for the HERCOSS Exxo A1 — Hercoss"
summary: "The Exxo A1 carries a 1.6 Tb/s Ethernet port. ETH_1T6 is the Hercoss controller behind it: the block that turns data from the chip's internal network into Ethernet frames, and back, at 1.6 terabits per second."
datos:
  - "1.6 Tb/s target"
  - "4,096 bits per clock cycle"
  - "MAC verified at full width"
  - "Timing-clean on FPGA"
---

{{< stats >}}
{{< stat "1.6 Tb/s" "Ethernet port of the HERCOSS Exxo A1" >}}
{{< stat "4,096" "bits per clock cycle: several frames start and end in one cycle" >}}
{{< stat "16 / 16" "regression runs passed, at four widths including the full 1.6 Tb/s width" >}}
{{< stat "260 Gb/s" "equivalent rate already placed and routed on the FPGA, at a quarter of the width" >}}
{{< /stats >}}

## The 1.6 Tb/s Ethernet MAC

At this speed a controller can no longer handle one frame at a time. Every
clock cycle carries 4,096 bits, enough for several complete frames to start
and end inside the same cycle. ETH_1T6 is built for that from the start, and
its width matches eight lanes of the [NOC_512](/projects/noc-512/) network,
so data moves between the port and the rest of the chip without conversion.

{{< fig "eth-cycle.svg" "One clock cycle at 1.6 Tb/s: 4,096 bits, eight network lanes, several frames. Conceptual." >}}

**One design, every speed.** The same controller scales by a single
parameter from an eighth of the rate up to the full 1.6 Tb/s. That lets us
prove on today's FPGA board exactly the logic that will go into the chip,
instead of a simplified copy.

{{< fig "eth-widths.svg" "The same design at four widths: two already placed and routed on the FPGA, all four verified in simulation." >}}

**Built for space.** The radiation-hardened variant includes an integrity
monitor that checks every outgoing frame before it leaves the chip.

## Status, November 2026

- **Frame controller (MAC): complete and verified in simulation.** It passes
  a 16-run regression at four datapath widths, including the full 1.6 Tb/s
  width, with randomized traffic, an independent checksum reference and
  deliberate error injection. Every corrupted frame was detected; every
  clean frame arrived intact.
- **FPGA implementation: timing met.** At a quarter of the final width the
  controller places and routes on our FPGA at over 250 MHz, a data rate
  equivalent to 260 Gb/s. At an eighth of the width it reaches 328 MHz.
- **Line coding (PCS): first stage written, verification under way.**
- **Next:** error correction and lane distribution for the 1.6 Tb/s line
  format, then a reduced-rate run on FPGA hardware.

The frame controller went from first line to verified, timing-clean design
in a single working session.

{{< detalle "What has, and has not, been measured?" >}}
These are simulation and FPGA implementation results. The 1.6 Tb/s rate
itself needs the Exxo A1's 224 Gb/s transceivers and cannot be measured on
an FPGA board. The equivalent rates above are the datapath width multiplied
by the clock the FPGA implementation reaches; they are not traffic measured
on a link.
{{< /detalle >}}

## Built on proven Ethernet

ETH_1T6 builds on the Hercoss Ethernet family that already runs on FPGA
silicon: a 40G MAC and PCS that interoperate with a commercial network card
through a one-hour soak with zero errors, 25G Ethernet, and a 103 Gb/s
SerDes link. See [High-speed links](/projects/high-speed-links/).

## In the Exxo A1

In the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/), ETH_1T6 drives the
1.6TbE port on eight 224 Gb/s PAM4 lanes, part of up to ~2 Tbps of Ethernet
the chip can carry at once.
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
