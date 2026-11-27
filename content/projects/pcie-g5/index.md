---
title: "PCIE_G5: PCIe Gen5 for space, a link that repairs itself"
layout: article
weight: 8
estado: "In development · physical layer running on silicon at 4 × 16 Gb/s, one hour error-free (27 Nov 2026)"
hidecover: true
seotitle: "PCIE_G5: European PCI Express Gen4 / Gen5 controller IP for space — Hercoss"
summary: "Hercoss's own PCI Express controller for the HERCOSS Exxo A1, written from scratch in VHDL-2008. One core covers Gen4 and Gen5, from 1 to 16 lanes, in a commercial and a radiation-hardened version from the same source, and it is designed so that the most common particle upsets are repaired on the spot while data keeps flowing. On its first day it ran on real transceivers: four lanes at 16 Gb/s, one hour, zero errors."
datos:
  - "Gen4 + Gen5 · 16 / 32 GT/s"
  - "1 to 16 lanes"
  - "COTS and rad-hard from one source"
  - "Silicon: 4 × 16 Gb/s, 1 hour, 0 errors"
  - "45 / 45 simulation runs pass"
  - "286 MHz on FPGA, Gen5 needs ~246"
---

{{< stats >}}
{{< stat "0" "errors in one hour on silicon: 389,812,475,855 test words at 4 × 16.0 Gb/s, every one received correct" >}}
{{< stat "~4 µs" "to repair an upset in a receiver on silicon, without leaving data mode; the standard cure takes milliseconds" >}}
{{< stat "~504 Gb/s" "of payload in each direction through one Gen5 x16 port; three of them planned in the Exxo A1" >}}
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

Development started on 27 November 2026. **On the same day** the logical part of the physical layer and its transceiver interface were written, passed simulation **and ran on real transceivers: four lanes at 16 Gb/s each on an AMD Versal board, one hour with zero errors.**

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
lanes and without the device at the other end noticing.** That is the intention, and **on silicon it already holds for the faults tested so far.**

{{< fig "pcie-upset.svg" "The intention, side by side. Left: a standard link stops on every lane. Right: PCIE_G5 repairs the hit lane locally while the others keep going, as measured on silicon. Concept, not to scale." >}}

## First silicon: one hour, zero errors

On 27 November 2026, the day development started, PCIE_G5 ran on a Trenz
TE0950 board with an AMD Versal device: **four lanes at 16.0000 Gb/s each
(measured)**, the transceivers in internal loopback.

{{< fig "pcie-hour.svg" "The one-hour run on silicon: 389,812,475,855 test words sent and the same number received correct, on all four lanes." >}}

- **389,812,475,855 test words** sent in one hour, and the same number received
  correct. **Zero bad, zero lost, zero errors of any kind on any lane.**
- About **200 terabits of checked payload at 55.4 Gb/s**, and 2.3 × 10¹⁴ bits on
  the line: a **bit error rate below 1.3 × 10⁻¹⁴** (95 % confidence).
- The FPGA build met timing with 1.5 ns of margin at 125 MHz.

### Then we hit it on purpose

{{< fig "pcie-inject.svg" "Faults injected on silicon while the link carried data. In every injection only the affected lane reported anything; the other three stayed at zero." >}}

| Fault injected on silicon | Result |
|---|---|
| One flipped bit | Detected, attributed to the right lane, link stays up |
| Upset in a receiver's descrambler state | **Repaired by the receiver itself**; 438 words affected (about 4 µs); the link never left data mode |
| Bit slip in one lane's clock recovery | **Repaired by the receiver itself**; 724 words lost (about 7 µs); the link never left data mode |
| Retrain under traffic | 54 million words, none bad or lost |

**In every injection only the affected lane reported anything; the other three
stayed at zero.** The standard cure for the descrambler upset and the bit slip
is a link recovery, which takes milliseconds. PCIE_G5 repaired them in
microseconds and kept the link in data mode. The words hit during an outage
are the only loss; the data link layer, not written yet, will resend them.

## Tested in simulation too

{{< stats >}}
{{< stat "45 / 45" "automated simulation runs, all passing, including the test design that runs on the board" >}}
{{< stat "1–16" "lanes covered: 1, 2, 4, 8 and 16, at 8, 16 and 32 GT/s" >}}
{{< stat "±5000 ppm" "frequency offset between two independent clocks" >}}
{{< stat "128 / 128" "possible bit alignments of a lane swept" >}}
{{< /stats >}}

The simulation runs also cover lane-to-lane skew and injected bit errors, and
the same three fault injections pass in simulation as on silicon.

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
| Test on real transceivers (TE0950 board, 4 lanes × 16.0 Gb/s, internal loopback) | **Passed**: self-test with fault injection, and a one-hour run with zero errors |
| Link training state machine (LTSSM), 2.5 GT/s start-up | Not started |
| Data link layer (replay, flow control) | Not started |
| Transaction layer, configuration space, Root Complex / Endpoint roles | Not started |
| Test against a commercial PCIe device | Later milestone, needs a different board |

About 2,700 lines of VHDL-2008 so far, plus testbenches.

## Honest limits

- **Only the physical layer exists.** A complete PCIe controller needs the
  three remaining layers: link training, data link and transaction.
- **The board test checks the core against itself** through the transceivers'
  internal loopback: no connector, no cable, no device from another vendor. It
  proves the datapath and the self-repair functions on real transceivers; it
  does not prove compatibility with other vendors' devices.
- **The link bring-up in the board test is a small test sequencer**, not the
  full link training state machine.
- **Designed for PCI Express Gen4 / Gen5; compatibility testing against
  commercial devices is a later milestone.**
- **The board available today** (Trenz TE0950) limits the silicon test to four
  lanes and Gen4 speed. Gen5 and 16 lanes stay in simulation until a larger
  board is available; the same source code serves both.
- **Retimers** in the path are not supported yet.

## Roadmap

1. **Done on 27 Nov 2026, first silicon:** 4 lanes at 16 Gb/s on the TE0950,
   self-test and a one-hour run with zero errors. Next on the board: the same
   test through an external cable.
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
