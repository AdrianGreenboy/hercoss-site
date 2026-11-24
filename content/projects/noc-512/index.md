---
title: "NOC_512 — the nervous system of the Exxo A1"
layout: article
weight: 3
estado: "Running on FPGA silicon · Self-repairing · 5 × 5 chip plan verified in simulation"
hidecover: true
seotitle: "NOC_512 — self-repairing 512-bit network-on-chip for space — Hercoss"
summary: "Hercoss's own 512-bit network-on-chip for the HERCOSS Exxo A1, built for a chip that must work for ten years where nobody can repair it. On FPGA silicon: 3.19 trillion AXI4 transfers in nine one-hour runs without a single error, and a network that moves its own traffic around a failed path in about 10 µs without losing a word."
datos:
  - "3.19 trillion transfers, 0 errors"
  - "Self-repairing in ~10 µs"
  - "7.7 Tb/s chip plan"
  - "375 MHz on FPGA silicon"
---

{{< stats >}}
{{< stat "3.19 T" "AXI4 transfers on silicon in nine one-hour runs, without a single error" >}}
{{< stat "7.7 Tb/s" "carried at once by the 5 × 5 chip plan, on 19 protected circuits" >}}
{{< stat "0" "words lost in every single-node failure rehearsed on the 5 × 5 mesh, under full traffic" >}}
{{< stat "~10 µs" "for a circuit to move itself onto another route after losing one, on silicon" >}}
{{< /stats >}}

{{< aviso "Patent analysis in progress" >}}
This page shows what NOC_512 achieves. How its protection and self-repair
mechanisms work is not published while a patent analysis is in progress.
{{< /aviso >}}

## What it is

Every block of the HERCOSS Exxo A1 has to talk to every other one: sixteen
processors, the FPGA fabric, PCIe, 1.6 Tb/s Ethernet, AI accelerators,
converters. **NOC_512 is the network that carries that traffic inside the
chip**, Hercoss's own, written from scratch in VHDL. It was designed from the
first line for a chip that has to work for ten years in orbit, where nobody
can repair it.

It moves **512 bits per clock** on two planes that work side by side:

- **Packet plane:** everything that looks like memory access, such as
  registers, DMA and processor traffic. Every block sees a standard AXI4
  interface.
- **Stream plane:** bulk data that cannot wait, such as Ethernet, PCIe,
  converters and AI. Circuits with fixed latency that can be rearranged
  while traffic is running.

The mesh scales to 8 × 8 nodes; the A1 uses 5 × 5.

{{< fig "noc-planes.svg" "One mesh, two planes. Conceptual." >}}

## What makes it different

**Most networks on chip assume the silicon works. This one assumes parts of
it will not.**

- **It checks and corrects its own data.** Single-bit errors anywhere
  between two blocks are corrected on the fly; double errors are detected
  and reported.
- **Its control logic survives being wrong.** Internal state corrupted on
  every clock cycle gives exactly the same result as a run with no faults.
- **A circuit survives the loss of a path.** A protected stream keeps
  delivering every word when a path dies, bits flip on the wires or data is
  damaged in a buffer.
- **It repairs its own routing.** When a path dies, the hardware moves the
  circuit to another route by itself, without software and without losing a
  word, and moves it back when the path recovers.
- **It tells the truth when it cannot cope.** If two failures at once are
  more than a circuit can absorb, every lost word is counted and none is ever
  delivered wrong, so whatever consumes the data knows exactly what is
  missing. Then the network recovers on its own.

### Faults on purpose, on silicon

{{< fig "noc-faults.svg" "Faults injected deliberately on the FPGA board while the network carried traffic." >}}

{{< detalle "Is NOC_512 radiation-qualified?" >}}
No. Fault injection shows the protection behaves as designed, but it does not
replace a test under a particle beam. A radiation test campaign is planned;
**no radiation qualification is claimed.**
{{< /detalle >}}

## Proven on silicon: the price of protection, published

Each protection layer was taken to the board on its own and run for one hour
at full load before the next one was added. Every run: **zero errors.**

{{< fig "noc-ladder.svg" "Seven one-hour runs on an AMD Versal VE2302 (Trenz TE0950). Clock and AXI4 transfers per hour." >}}

The full protection costs about **30 % of the clock rate** on this small
FPGA. That is the honest price, and we publish it. The protected network's
frequency has not been optimised yet; that work is planned on a larger
device.

{{< detalle "What do the FPGA clock figures mean for the chip?" >}}
They are measured on an FPGA, not on the Exxo A1. The chip's clock depends
on the production node; the A1 targets about 1.5 GHz for the network. On the
FPGA, 1.6 Tb/s on a single 512-bit link would need 3.1 GHz, which is why bulk
traffic is spread over several stream circuits in parallel.

{{< fig "noc-why.svg" "Clock needed for 1.6 Tb/s on one 512-bit link, against the ceilings measured on the FPGA." >}}
{{< /detalle >}}

## The plan for the chip: 7.7 Tb/s, all protected

The 25 blocks of the HERCOSS Exxo A1 are placed on a 5 × 5 mesh, with every
high-speed connection running at the same time. The traffic of the whole
chip is planned and routed automatically.

{{< fig "noc-a1plan.svg" "Traffic plan of the Exxo A1 on the 5 × 5 mesh, run in simulation with the complete network." >}}

### Rehearsing failures at chip scale

With the complete A1 traffic running in simulation, nodes were switched off
under load:

{{< fig "noc-chipfail.svg" "Node failures rehearsed on the full 5 × 5 mesh in simulation." >}}

- **A node dies:** six nodes that traffic passes through were switched off,
  one after the other. Up to 16 protected groups lost a path at the same
  moment. **Not one word was lost** on any of them. (A circuit cannot survive
  the loss of the block it starts or ends at; nothing can.)
- **The network heals around it:** with the node still dead, circuits are
  back to full protection on other routes within about 1,000 clock cycles,
  around 4 µs at 265 MHz. Today that works for about two thirds of the paths;
  the rest stay protected by their surviving paths until the node returns.
- **Two nodes die together:** 27 of 35 protected groups lose nothing. The
  other 8 lose data, but every lost word is counted, nothing is corrupted,
  and the whole network returns to its planned state by itself when the nodes
  come back.

## Where it stands

| | Status |
|---|---|
| Both planes, AXI4 bridges, 2 × 2 mesh | **Running on silicon** |
| Error correction, fault-tolerant control, protected circuits, self-repairing routing | **Running on silicon**, one-hour runs without error |
| 5 × 5 mesh with the full A1 traffic plan | Verified in simulation |
| Behaviour under one and two node failures at chip scale | Verified in simulation |
| 5 × 5 on hardware | Next step: needs a larger FPGA than the one we own |
| Radiation testing | Not done yet. No radiation qualification is claimed |
| ASIC implementation | Part of the HERCOSS Exxo A1 chip programme |

## How we got here: one month

From a first router to a self-repairing network on an FPGA board, in
November 2026.

| Step | Milestone |
|---|---|
| 1 · First light | Packet routers, AXI4 bridges and the stream plane pass their tests; the router reaches 400 MHz on its own |
| 2 · On silicon | The complete network runs on the board at 250, then 350, then 375 MHz, each with a one-hour run without error |
| 3 · Hardening | Error correction, then fault-tolerant control logic, block by block, each step taken to silicon before the next |
| 4 · Circuits that survive | Stream circuits keep delivering through dead paths, flipped bits and damaged buffers |
| 5 · Self-repair | The hardware re-routes around a failure and returns on its own: first in simulation, then on the board |
| 6 · Chip scale | 5 × 5 mesh, the whole A1 traffic planned and routed automatically, node failures rehearsed with everything running |

Every step followed the same rule: **simulate it, put it on silicon, run it
for an hour, publish the number.** What does not fit our board yet is
labelled as simulation, not as a result.

## What comes next

- The 5 × 5 network on a larger FPGA.
- Higher clock rates for the fully protected network.
- Integration with the [RV128IMAC](/projects/rv128imac/) cores and the
  [1.6 Tb/s Ethernet](/projects/eth-1t6/) core of the A1.
- A radiation test campaign.

## In the Exxo A1

NOC_512 is the backbone of the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/):
it links the sixteen RV128IMAC cores, the FPGA fabric, the AI and
attitude-control engines, memory and all I/O. The commercial A1 can run the
network with lighter protection; the radiation-hardened A1 uses all of it.

*All figures come from our own runs. Silicon figures are from an FPGA
prototype (AMD Versal VE2302 on a Trenz TE0950 board), not from the final
chip.*

Interested in the HERCOSS Exxo A1 or in NOC_512?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
