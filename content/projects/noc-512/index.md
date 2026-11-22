---
title: "NOC_512 — network-on-chip"
layout: article
weight: 3
estado: "Validated on FPGA silicon · Commercial and hardened variants"
hidecover: true
seotitle: "NOC_512 — 512-bit network-on-chip with error correction and a radiation-hardened variant — Hercoss"
summary: "Hercoss's own network-on-chip for the HERCOSS Exxo A1: 512 bits wide, two planes on one mesh. On FPGA silicon it ran one-hour tests at 375 MHz with zero errors, and a hardened variant with error correction and triplicated control state ran at 300 MHz with zero errors, even under continuous fault injection."
datos:
  - "375 MHz on FPGA silicon"
  - "0 errors in one-hour runs"
  - "Hardened variant: 300 MHz"
  - "1-bit faults corrected live"
---

## What it is

A chip like the Exxo A1 has dozens of blocks that need to talk to each other:
sixteen processors, the FPGA fabric, the AI and attitude-control engines,
memory, Ethernet, PCIe, converters. A **network-on-chip** is the road network
inside the chip that connects them all. NOC_512 is Hercoss's own, written in
VHDL-2008. It comes in **two variants of the same design**: a commercial one
at 375 MHz and a hardened one, with error correction and triplicated control
state, at 300 MHz on the FPGA.

## Results on FPGA silicon

One-hour tests with random traffic on both planes at the same time and with
circuits reconfigured on the fly, on an AMD Versal VE2302 (Trenz TE0950
board), 2 × 2 mesh.

{{< fig "noc-variants.svg" "Each variant ran for one hour. Hundreds of billions of AXI4 bursts, zero errors." >}}

### Built to survive faults

On top of the clean runs, faults were injected on purpose while the network
was carrying traffic:

{{< fig "noc-faults.svg" "Fault injection proves the protection works. It does not replace a radiation beam test." >}}

{{< detalle "Is NOC_512 radiation-qualified?" >}}
No. Fault injection shows that the error correction and the triplicated
state work as designed: every single-bit error was corrected, double-bit
errors were detected, and a corrupted copy of the control state never
caused an error. A qualification needs a test under a particle beam, which
is planned for the chip itself.
{{< /detalle >}}

## Two planes on one mesh

{{< fig "noc-planes.svg" "Left: the packet plane routes ordinary traffic hop by hop. Right: the circuit plane gives bulk data its own fixed lanes. Conceptual." >}}

- **Packet plane: for control and ordinary data.** Full AXI4 between any
  two nodes: registers, DMA, memory.
- **Circuit plane: for bulk data.** Continuous high-speed streams, such as
  1.6 Tb/s Ethernet, PCIe Gen5 and fast converters, travel on dedicated
  512-bit lanes with fixed latency. The processors can **reconfigure the
  circuits on the fly**, and no packet is cut or lost.

## Why two planes

1.6 Tb/s does not fit on a single 512-bit link: it would need a 3.1 GHz
clock. Bulk traffic is spread across several circuit lanes in parallel, and
the packet plane stays free and fast for control.

{{< fig "noc-why.svg" "Clock needed for 1.6 Tb/s on one 512-bit link, against the ceilings measured on the FPGA." >}}

## Also validated

| What | Result |
|---|---|
| AXI4 features on silicon | 4 transactions in flight per master, byte-masked writes |
| Circuit plane on silicon | Live route changes with no packet lost, parallel lanes arriving aligned, pause channel respected, circuits configured through the network itself |
| Larger meshes | Full 4 × 4 mesh with AXI4 bridges and a 3 × 3 self-test pass in simulation; they do not fit on this FPGA |
| Random stress in simulation | 23 seeds, 0 to 3 register stages per link, random back-pressure on every channel: all pass |
| Clock on this FPGA | 375 MHz is the highest clock taken to the board; synthesis ceilings around 429 MHz (router) and 567–583 MHz (circuit node) |

{{< detalle "What do the FPGA clock figures mean for the chip?" >}}
They are measured on an FPGA, not on the Exxo A1. The final chip's clock
depends on the production node; the A1 targets about 1.5 GHz for the
network. At the clock ceilings measured on the FPGA, 1.6 Tb/s Ethernet would
need six 512-bit lanes and each PCIe Gen5 x16 link two.
{{< /detalle >}}

## Still to do

- **Protection coverage, in development:** triplication in the AXI4 bridges,
  and protection of the circuit plane against the loss of a complete route.
- **Meshes larger than 2 × 2 on silicon.** They pass in simulation but need
  a larger FPGA.
- **Integration with the RV128IMAC cores and real peripherals.** So far the
  network has been tested with traffic generators and test memories.
- **Radiation beam testing,** as part of the chip's qualification.

## In the Exxo A1

NOC_512 is the backbone of the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/):
it links the sixteen [RV128IMAC](/projects/rv128imac/) cores, the 500,000-LUT
FPGA fabric, the AI and attitude-control engines, memory and all I/O, and it
is designed for the chip's 1.6 Tb/s Ethernet and PCIe Gen5 links. The
commercial A1 uses the base variant; the radiation-hardened A1 uses the
hardened one.
