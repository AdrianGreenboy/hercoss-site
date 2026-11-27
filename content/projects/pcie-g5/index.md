---
title: "PCIE_G5: PCIe Gen5 for space, a link that repairs itself"
layout: article
weight: 8
estado: "In development · physical layer in simulation, first silicon test prepared (27 Nov 2026)"
hidecover: true
seotitle: "PCIE_G5: European PCI Express Gen4 / Gen5 controller IP for space — Hercoss"
summary: "Hercoss's own PCI Express controller for the HERCOSS Exxo A1, written from scratch in VHDL-2008. One core covers Gen4 and Gen5, from 1 to 16 lanes, in a commercial and a radiation-hardened version from the same source, and it is designed so that the most common particle upsets are repaired on the spot while data keeps flowing."
datos:
  - "Gen4 + Gen5 · 16 / 32 GT/s"
  - "1 to 16 lanes"
  - "COTS and rad-hard from one source"
  - "44 / 44 simulation runs pass"
  - "286 MHz on FPGA, Gen5 needs ~246"
---

{{< stats >}}
{{< stat "~504 Gb/s" "of payload in each direction through one Gen5 x16 port" >}}
{{< stat "3" "Gen5 x16 ports planned in the HERCOSS Exxo A1" >}}
{{< stat "44 / 44" "automated simulation runs pass: 1 to 16 lanes, three line rates, injected faults" >}}
{{< stat "286 MHz" "on the FPGA after one redesign round, above the ~246 MHz that Gen5 needs" >}}
{{< /stats >}}

{{< aviso "Patent analysis in progress" >}}
The self-repair functions of PCIE_G5 are under patent analysis. This page
shows what they are meant to achieve and where they stand; how they work is
not published.
{{< /aviso >}}

## What it is

**PCIE_G5 is Hercoss's own PCI Express controller core** for the
[HERCOSS Exxo A1](/projects/hercoss-exxo-a1/) FPGA SoC, written from scratch in
VHDL-2008. One core covers **Gen4 (16 GT/s) and Gen5 (32 GT/s), from 1 to 16
lanes**, and it is being built in two versions from the same source: a
commercial (COTS) one and a radiation-hardened one for space. The Exxo A1 plan
has **three PCIe Gen5 x16 ports.**

Development started on 27 November 2026. On its first day the logical part of
the physical layer and its transceiver interface were written and pass
simulation, and the first test on real transceivers is prepared.

{{< fig "pcie-a1.svg" "Where PCIE_G5 sits in the HERCOSS Exxo A1: three Gen5 x16 ports between the chip's 512-bit network and the outside world. Plan." >}}

## Why we build our own

**PCIe is how a chip talks to the rest of the computer:** storage,
accelerators, network cards and other processors. A Gen5 x16 port carries
about **504 Gb/s of payload in each direction.** For a spacecraft computer
that means solid-state recorders, AI accelerators and payload processors
attached at full speed.

**Owning the controller changes the economics and the risk:**

- **No licence fee per chip.** Every Exxo A1 that ships carries three of these
  ports without paying for them again.
- **Full control of the radiation-hardened version.** A bought controller is
  a black box; ours can be hardened where space needs it.
- **A European source** for a block that is normally bought from a handful of
  IP vendors.

## A link that repairs itself

In space, a single particle can knock one lane of a high-speed link out of
step. **A standard link then stops and retrains**: every lane goes quiet, the
device at the other end notices, and the system waits.

**PCIE_G5 is designed so that the most common of these upsets are repaired
locally**, on the lane that was hit, **while data keeps flowing on the other
lanes and without the device at the other end noticing.** That is the
intention, and in simulation it already holds for the cases tested so far.

{{< fig "pcie-upset.svg" "The intention, side by side. Left: a standard link stops on every lane. Right: PCIE_G5 repairs the hit lane locally while the others keep going. Concept, not to scale." >}}

## Tested the hard way

{{< stats >}}
{{< stat "44 / 44" "automated simulation runs, all passing" >}}
{{< stat "1–16" "lanes covered: 1, 2, 4, 8 and 16, at 8, 16 and 32 GT/s" >}}
{{< stat "±5000 ppm" "frequency offset between two independent clocks" >}}
{{< stat "3 / 3" "kinds of injected fault handled with the link carrying data" >}}
{{< /stats >}}

The verification covers lane-to-lane skew and injected bit errors as well. Then
we broke the link on purpose, in simulation, while it carried data:

| Fault injected | Result in simulation |
|---|---|
| A flipped bit on one lane | Detected and attributed to that lane |
| An upset in the receiver's descrambler state | **Repaired by the receiver itself**; neither end leaves data mode |
| A bit slip in the clock recovery of one lane | **Repaired by the receiver itself**; neither end leaves data mode |

In the two self-repair cases, the packets hit during the outage are the only
loss: a few hundred stream words at the standard interval, which the data link
layer will resend.

## Fast from the first redesign

{{< fig "pcie-timing.svg" "Timing on the FPGA, 4 lanes: from 138 MHz in the first version to 286 MHz after one redesign round, with less logic. Gen5 needs about 246 MHz in this architecture, Gen4 about 123 MHz." >}}

After one redesign round the core went **from 138 MHz to 286 MHz** at block
level (284 MHz with the transceiver interface, against a 250 MHz target), and
the logic **shrank from 10.7k to 8.3k LUTs.** In this architecture Gen5 needs
about 246 MHz and Gen4 about 123 MHz, so the timing already has room for Gen5
on the FPGA.

## Where it stands

{{< fig "pcie-status.svg" "Every layer of PCIE_G5 and its state on 27 November 2026." >}}

| Layer | State on 27 Nov 2026 |
|---|---|
| Physical layer, logical part (128b/130b coding, 1–16 lanes, 8 / 16 / 32 GT/s) | Written, passes simulation |
| Transceiver interface (bit alignment, clock-domain crossing, lane deskew) | Written, passes simulation |
| Timing on FPGA (AMD Versal xcve2302-1LP, 4 lanes, out-of-context) | 286 MHz for the block-level part, 284 MHz with the transceiver interface; 250 MHz was the target |
| Test on real transceivers (TE0950 board, 4 lanes, 16 Gb/s, internal loopback) | Design, build scripts and board tool written and simulated; build and board run pending |
| Link training state machine (LTSSM), 2.5 GT/s start-up | Not started |
| Data link layer (replay, flow control) | Not started |
| Transaction layer, configuration space, Root Complex / Endpoint roles | Not started |
| Test against a commercial PCIe device | Later milestone, needs a different board |

About 2,700 lines of VHDL-2008 so far, plus testbenches.

## Honest limits

- **Only the physical layer exists.** A complete PCIe controller needs the
  three remaining layers: link training, data link and transaction.
- **Nothing has run on hardware yet.** The first board test checks the core
  against itself. That proves the datapath and the self-repair functions on
  real transceivers, but not compatibility with other vendors' devices.
- **Designed for PCI Express Gen4 / Gen5; compatibility testing against
  commercial devices is a later milestone.**
- **The board available today** (Trenz TE0950) limits the silicon test to four
  lanes and Gen4 speed. Gen5 and 16 lanes stay in simulation until a larger
  board is available; the same source code serves both.
- **Retimers** in the path are not supported yet.

## Roadmap

1. **First silicon:** 4 lanes at 16 Gb/s on the TE0950, self-test and a
   one-hour soak.
2. **Link training state machine**, including speed and width negotiation.
3. **Data link layer with radiation-tolerant replay.**
4. **Transaction layer** on the chip's 512-bit network
   ([NOC_512](/projects/noc-512/)), Root Complex and Endpoint in one core.
5. **More radiation functions:** retiring a damaged lane without dropping the
   link, per-lane health monitoring, fast re-link after an upset.
6. **PCI-SIG membership and specification;** test against commercial devices
   on a board with a PCIe connector and a 100 MHz reference clock.
7. **Gen5 and 16 lanes on a larger FPGA board**, then the Exxo A1 silicon.

## Part of the Hercoss IP family

PCIE_G5 joins the [Hercoss IP cores](/projects/ip-core-family/) that make up the
Exxo A1: the [RV128IMAC](/projects/rv128imac/) processor, the self-healing
[NOC_512](/projects/noc-512/) network on chip, the [1.6 Tb/s Ethernet](/projects/eth-1t6/)
core and the self-healing [DDRC_72](/projects/ddrc-72/) memory controller. The
same idea runs through all of them: **a chip for space that keeps working when
a particle hits it**, designed in Europe, in-house.

Interested in the HERCOSS Exxo A1 or PCIE_G5?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invest in Hercoss →](/invest/)
