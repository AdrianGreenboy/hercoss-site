---
title: "1.6 Tb/s Ethernet — error correction running in silicon"
layout: article
weight: 6
estado: "Validated in silicon · MAC, PCS, RS(544,514) error correction, lane alignment"
hidecover: true
seotitle: "1.6 Tb/s Ethernet MAC, PCS and FEC IP core, European and in-house — Hercoss"
summary: "Hercoss's own implementation of the fastest Ethernet rate being standardised today: a complete 1.6 Tb/s link layer (MAC, PCS, Reed-Solomon error correction and lane alignment) designed from a blank page for the HERCOSS Exxo A1. Running on FPGA silicon: 312 billion frames in one hour, zero errors."
datos:
  - "1.6 Tb/s target"
  - "312 billion frames, 0 errors"
  - "1–15 symbol errors: all corrected"
  - "Error bursts repaired at full speed"
  - "Bit-exact to IEEE 802.3 vectors"
---

{{< stats >}}
{{< stat "312 bn" "frames in a one-hour run on silicon, zero errors" >}}
{{< stat "108 bn" "error-correction codewords checked in that hour, zero bad" >}}
{{< stat "20 / 20" "codewords repaired when hit two at a time, ten times in a row" >}}
{{< stat "0" "times corrupted data was passed on as valid" >}}
{{< /stats >}}

{{< aviso "Patent process in progress" >}}
The architecture of the error-correction receiver is new, and its patent
process is in progress. This page shows what the core achieves; technology
details are withheld until that process allows it.
{{< /aviso >}}

## What it is

The HERCOSS 1.6T Ethernet core is our own implementation of the fastest
Ethernet rate being standardised today: **1.6 terabits per second**. It is a
complete link layer, designed in-house from a blank page for the
[HERCOSS Exxo A1](/projects/hercoss-exxo-a1/) chip.

{{< fig "eth-stack.svg" "Everything between the chip's internal network and the 16 line lanes is Hercoss's own design." >}}

- **MAC:** frame generation and checking.
- **PCS:** line coding, scrambling and lane distribution.
- **FEC:** Reed-Solomon RS(544,514) forward error correction: encoder, error
  detection and full error correction.
- **Lane alignment:** automatic lock, deskew and reordering of the lanes.
- **Software interface:** a register bank with counters, events and
  interrupts.

**It is not a wrapper around third-party IP. Every block is ours**, and the
architecture of its error-correction receiver is new.

## Why it matters

AI clusters and data centres are moving from 400G and 800G to 1.6T links.
At that speed, the logic that frames, protects and aligns the data is one
of the hardest digital blocks in a chip, and today it is available from only
a handful of vendors. A European, independently developed 1.6T core gives
the HERCOSS Exxo A1 its own high-speed networking, **with no licence
dependency**.

At 1.6 Tb/s a controller can no longer handle one frame at a time: every
clock cycle carries 4,096 bits, enough for several complete frames to start
and end inside the same cycle. The core is built for that from the start,
and its width matches eight lanes of the [NOC_512](/projects/noc-512/)
network, so data moves between the port and the rest of the chip without
conversion.

{{< fig "eth-cycle.svg" "One clock cycle at 1.6 Tb/s: 4,096 bits, eight network lanes, several frames. Conceptual." >}}

## Measured, not promised

The core runs today on real silicon, an AMD Versal FPGA, in a scaled
configuration that fits the device (one FEC flow, 8 lanes), at a 300 MHz
system clock with measured timing margin. The complete chain runs at once:
MAC, PCS, FEC and lane alignment.

{{< fig "eth-hour.svg" "One hour at full load on the FPGA board, with independent counters at both ends of the link." >}}

| Result | Measured in silicon |
|---|---|
| Sustained payload | **129 Gb/s** through MAC + PCS + FEC + lane alignment |
| One-hour endurance run | **312 billion frames, zero errors** |
| Codewords checked in that hour | **108 billion, zero bad** |
| Error correction | **1 to 15 symbol errors per codeword: all corrected, no frame lost** |
| Beyond the code's limit | 16 symbol errors: detected and flagged, never delivered as good data |
| Several damaged codewords at once | **Repaired together, at full speed** |
| Lane handling | Lanes shuffled, shifted and skewed on purpose: locked and reordered automatically |
| Timing | Closes at 300 MHz with measured margin |

### It corrects errors, in hardware, at speed

We inject errors into the running link on purpose, from software, with full
control over how many symbols are hit and where. With correction active,
damage that would destroy frames is repaired on the fly: the receiver
reports the repaired codewords and the application loses nothing.
Throughput does not change.

### It knows its own limit

{{< fig "eth-fec.svg" "Symbol errors injected per codeword on the running link. 1 to 15: repaired. 16: declared uncorrectable, never passed on." >}}

The code can repair up to 15 symbol errors per codeword. We tested every
case, 1, 2, 3 … 15: all repaired. At 16 the core does exactly what it must: it declares
the codeword uncorrectable and marks the data as invalid. **In every test,
corrupted data was never passed on as valid.**

### It keeps up when errors come in bursts

Real links do not fail one codeword at a time. On silicon we hit two
codewords at the same instant, then repeated it ten times in a row: **every
codeword was repaired, with no frame lost.** A compact receiver that keeps
up with bursts tolerates far more errors than its size suggests.

{{< fig "eth-burst.svg" "Two codewords damaged at the same instant, ten rounds in a row, on the running link in silicon." >}}

### It follows the standard bit for bit

{{< fig "eth-vectors.svg" "The transmit path reproduces the official reference test vectors exactly." >}}

The transmit path reproduces the official IEEE 802.3 reference test vectors
for 200G, 400G and 800G, and the published example vectors of the 1.6T draft
standard (P802.3dj), exactly.

## How we got here

| Step | Milestone |
|---|---|
| MAC | Frame controller complete and verified in simulation at four datapath widths, including the full 1.6 Tb/s width; from first line to timing-clean design in a single working session |
| MAC + PCS on silicon | At a quarter of the final width: 258.3 Gb/s of payload, exactly the theoretical figure; 625 billion frames in one hour, zero errors |
| Full link layer on silicon | Error correction and lane alignment added: 129 Gb/s through the complete chain, 312 billion frames in one hour, zero errors |
| Error bursts on silicon | Two codewords hit at once, ten times in a row: all repaired at full speed, no frame lost |

{{< detalle "Why is the latest throughput lower than the earlier one?" >}}
The earlier 258.3 Gb/s run carried the frame controller and the first PCS
stages. The latest run carries the complete link layer, including the
Reed-Solomon decoder and lane alignment, in a configuration scaled to fit
the same FPGA. Both are measured at 300 MHz on the same board. The rate
of the full 1.6 Tb/s datapath will be established on the A1 chip itself.
{{< /detalle >}}

## What is still ahead

We believe in saying what is not done yet.

- The silicon results come from a **scaled configuration** (one FEC flow,
  8 lanes). The full 1.6T structure, two FEC flows and 16 lanes, is
  verified in simulation and is larger than our evaluation FPGA. It will be
  validated in silicon on a larger device or on the A1 chip itself, which is
  also where its full speed will be established.
- The test link is an **internal channel** inside the device. Connection to
  optical or electrical transceivers is the next integration step.

## The method

Every result on this page follows the same rule: **simulate it, synthesise
it, then prove it on the board.** Nothing is reported as working until it
has run in silicon with independent counters on both ends of the link, and
every change runs for at least an hour of continuous traffic before it
counts.

## Built on proven Ethernet

The 1.6T core builds on the Hercoss Ethernet family that already runs on
FPGA silicon: a 40G MAC and PCS that interoperate with a commercial network
card through a one-hour soak with zero errors, 25G Ethernet, and a 103 Gb/s
SerDes link. See [High-speed links](/projects/high-speed-links/).

## In the Exxo A1

In the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/), this core drives the
1.6TbE port on eight 224 Gb/s PAM4 lanes, part of up to ~2 Tbps of Ethernet
the chip can carry at once.

For technical or investment enquiries:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
