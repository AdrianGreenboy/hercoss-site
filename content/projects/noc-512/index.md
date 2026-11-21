---
title: "NOC_512 — network-on-chip"
layout: article
weight: 3
estado: "Validated on FPGA · Network of the Exxo A1"
hidecover: true
seotitle: "NOC_512 — 512-bit network-on-chip with packet and circuit planes — Hercoss"
summary: "Hercoss's own network-on-chip for the HERCOSS Exxo A1: 512 bits wide, with two planes on one mesh. A packet plane carries ordinary AXI4 traffic; a circuit plane carries bulk data such as 1.6 Tb/s Ethernet and PCIe Gen5. Validated on FPGA silicon with both planes running at once and zero errors."
datos:
  - "512-bit, 4 × 4 mesh"
  - "Packet + circuit planes"
  - "0 errors on FPGA silicon"
  - "Routes changed live, no packet lost"
---

## What it is

A chip like the Exxo A1 has dozens of blocks that need to talk to each other:
sixteen processors, the FPGA fabric, the AI array, memory, Ethernet, PCIe,
converters. A **network-on-chip** is the road network inside the chip that
connects them all. NOC_512 is Hercoss's own, written in VHDL-2008, and it
connects every cluster of the Exxo A1.

## Two planes on one mesh

{{< fig "noc-planes.svg" "Left: the packet plane routes ordinary traffic hop by hop. Right: the circuit plane gives bulk data its own fixed lanes. Conceptual." >}}

- **Packet plane: for control and ordinary data.** It carries normal AXI4
  traffic (registers, DMA, memory) across a mesh of 5-port routers, with
  separate meshes for requests and responses. Every cluster connects
  through an AXI4 slave bridge and an AXI4 master bridge.
- **Circuit plane: for bulk data.** Ethernet at 1.6 Tb/s, PCIe Gen5 and fast
  converters travel on dedicated 512-bit lanes with fixed latency. Several
  lanes run in parallel and arrive aligned. Software can change the routes
  **while traffic is flowing**, and no packet is cut or lost.

## Why two planes

1.6 Tb/s does not fit on a single 512-bit link: it would need a 3.1 GHz
clock. So bulk traffic is spread across several circuit lanes in parallel,
and the packet plane stays free and fast for control traffic.

{{< fig "noc-why.svg" "Clock needed for 1.6 Tb/s on one 512-bit link, against the ceilings measured on the FPGA." >}}

## Results on FPGA silicon

Tested on an AMD Versal VE2302 (Trenz TE0950 board) with a 2 × 2 mesh, two
circuit lanes and **both planes running at the same time at 250 MHz**. Timing
is met with positive margin (+0.256 ns), using 26 % of the device's logic.

| What | Result |
|---|---|
| Self-test runs | 4 runs, all PASS, **zero errors** |
| Largest run | 96 million AXI4 bursts, plus 45.8 million and 34.3 million packets on two circuits, in about one second |
| AXI4 features | 4 transactions in flight per master, partial (byte-masked) writes |
| Live route change | Routes changed during traffic, with no packet cut or lost |
| Parallel lanes | Two lanes arrive aligned |
| Flow control | Pause channel respected |
| In-band configuration | Circuits configured through the network itself while it carries traffic |

## Results in simulation and synthesis

- **Full 4 × 4 mesh with AXI4 bridges:** 16 masters at once, 256 writes and
  256 reads, no errors.
- **Random stress on the whole network:** 23 seeds, links with 0 to 3
  register stages, up to 3,200 transactions per pass and random
  back-pressure on every channel. All pass.
- **FPGA timing (out-of-context, VE2302 -1LP):** the packet router closes at
  400 MHz (ceiling around 429 MHz); a circuit-plane node reaches 567 to
  583 MHz.

{{< detalle "What do the FPGA clock figures mean for the chip?" >}}
They are measured on an FPGA, not on the Exxo A1. The final chip's clock
depends on the production node; the A1 targets about 1.5 GHz for the
network. On the board today the network ran at 250 MHz, a limit set by the
test bench, not by the network.
{{< /detalle >}}

{{< detalle "How much data actually moved?" >}}
In the run without pauses, about 450 Gb/s flowed across both planes
together. This is an **estimate** calculated from the hardware counters and
the average packet lengths of the generators, not a direct measurement.
At the clock ceilings measured on the FPGA, 1.6 Tb/s Ethernet would need six
512-bit lanes and each PCIe Gen5 x16 link would need two.
{{< /detalle >}}

{{< detalle "Why separate meshes for requests and responses?" >}}
If requests and their responses shared the same network, a full network
could stop responses from getting out, which stops new requests from
finishing: a deadlock. Two physical meshes keep the two directions
independent.
{{< /detalle >}}

## Still to do

- A **one-hour soak** on silicon.
- **Clocks above 250 MHz** on the board.
- **Meshes larger than 2 × 2 on silicon.** The full 4 × 4 mesh runs only in
  simulation for now; it does not fit on this board.
- **Radiation protection:** end-to-end ECC and triplicated control state.
  Space for the ECC is already reserved in the packet format.
- **Integration with the RV128IMAC cores and real peripherals.** So far the
  network has been tested with traffic generators and test memories.

## In the Exxo A1

NOC_512 is the backbone of the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/):
it links the sixteen [RV128IMAC](/projects/rv128imac/) cores, the 500,000-LUT
FPGA fabric, the AI array, memory and all I/O, and it is designed for the
chip's 1.6 Tb/s Ethernet and PCIe Gen5 links.
