---
title: "ETH_1T6 — 1.6 Tb/s Ethernet"
layout: article
weight: 6
estado: "In development · Running on FPGA hardware at a quarter of the final width"
hidecover: true
seotitle: "ETH_1T6 — 1.6 Tb/s Ethernet MAC for the HERCOSS Exxo A1 — Hercoss"
summary: "The Exxo A1 carries a 1.6 Tb/s Ethernet port. ETH_1T6 is the Hercoss controller behind it: the block that turns data from the chip's internal network into Ethernet frames, and back, at 1.6 terabits per second."
datos:
  - "1.6 Tb/s target"
  - "4,096 bits per clock cycle"
  - "258.3 Gb/s on FPGA hardware"
  - "116 TB in 1 hour, 0 errors"
---

{{< stats >}}
{{< stat "1.6 Tb/s" "Ethernet port of the HERCOSS Exxo A1" >}}
{{< stat "4,096" "bits per clock cycle: several frames start and end in one cycle" >}}
{{< stat "258.3 Gb/s" "of payload on FPGA hardware at a quarter of the width, zero errors" >}}
{{< stat "116 TB" "carried in a one-hour soak: 625 billion frames, zero errors" >}}
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

{{< fig "eth-widths.svg" "The same design at four widths: the quarter width runs on FPGA hardware, all four are verified in simulation." >}}

**Built for space.** The radiation-hardened variant includes an integrity
monitor that checks every outgoing frame before it leaves the chip.

## Status, November 2026

- **Frame controller (MAC): complete and verified in simulation.** It passes
  a 16-run regression at four datapath widths, including the full 1.6 Tb/s
  width, with randomized traffic, an independent checksum reference and
  deliberate error injection. Every corrupted frame was detected; every
  clean frame arrived intact.
- **Validated on FPGA hardware.** At a quarter of the final width, the
  complete controller as it will be integrated in the chip (frame
  controller, PCS stages built so far, and its register interface) runs on
  our FPGA board at 300 MHz: a 307 Gb/s datapath carrying 258.3 Gb/s of
  payload with zero errors. An injected line error was detected, reported
  and cleared, and the link recovered on its own. An earlier build ran a
  one-hour soak at the same speed: 625 billion frames, 116 terabytes, zero
  errors.
- **Next:** error correction and lane distribution for the 1.6 Tb/s line
  format.

The frame controller went from first line to verified, timing-clean design
in a single working session.

{{< detalle "What has, and has not, been measured?" >}}
At a quarter of the final width, the controller runs on FPGA hardware and
its traffic is measured: 258.3 Gb/s of payload, and 116 terabytes in a
one-hour soak, all with zero errors. The full width is verified in
simulation. The 1.6 Tb/s rate itself needs the Exxo A1's 224 Gb/s
transceivers and cannot be measured on an FPGA board. The 1/8-width figure
in the chart is the datapath width multiplied by the clock the FPGA
implementation reaches, not measured traffic.
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
