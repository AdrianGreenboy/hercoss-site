---
title: "1.6 Tb/s Ethernet — from the standard to working silicon"
layout: article
weight: 6
estado: "Running on FPGA silicon · MAC, PCS, error correction and lane alignment"
hidecover: true
seotitle: "1.6 Tb/s Ethernet MAC, PCS and FEC IP core, European and in-house — Hercoss"
summary: "Hercoss's own implementation of the fastest Ethernet rate being standardised today: a complete 1.6 Tb/s link layer (MAC, PCS, Reed-Solomon error correction and lane alignment) designed from a blank page for the HERCOSS Exxo A1. Running on FPGA silicon: 312 billion frames in one hour, zero errors."
datos:
  - "1.6 Tb/s target"
  - "312 billion frames, 0 errors"
  - "1–15 symbol errors: all corrected"
  - "Bit-exact to IEEE 802.3 vectors"
---

{{< stats >}}
{{< stat "312 bn" "frames in a one-hour run on silicon, zero errors" >}}
{{< stat "108 bn" "error-correction codewords checked in that hour, zero bad" >}}
{{< stat "15 / 15" "symbol-error levels per codeword corrected in hardware, no frame lost" >}}
{{< stat "0" "times corrupted data was passed on as valid" >}}
{{< /stats >}}

{{< aviso "Patent analysis in progress" >}}
This page shows what the core achieves. Technology details are withheld
while the architecture behind it is being prepared for patent protection.
{{< /aviso >}}

## What it is

The HERCOSS 1.6T Ethernet core is our own implementation of the fastest
Ethernet rate being standardised today: **1.6 terabits per second**. It is a
complete link layer, designed in-house from a blank page for the
[HERCOSS Exxo A1](/projects/hercoss-exxo-a1/) chip.

{{< fig "eth-stack.svg" "Everything between the chip's internal network and the 16 line lanes is Hercoss's own design." >}}

- **MAC:** frame generation and checking.
- **PCS:** line coding, scrambling and lane distribution.
- **FEC:** Reed-Solomon forward error correction, encoder and full decoder.
- **Lane alignment:** automatic lock, deskew and reordering of 16 lanes.
- **Software interface:** a register bank with counters, events and
  interrupts.

**It is not a wrapper around third-party IP. Every block is ours.**

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
configuration that fits the device, at a 300 MHz system clock. The
complete chain runs at once: MAC, PCS, FEC and lane alignment.

{{< fig "eth-hour.svg" "One hour at full load on the FPGA board, with independent counters at both ends of the link." >}}

| Result | Measured in silicon |
|---|---|
| Sustained payload | **129 Gb/s** through MAC + PCS + FEC + lane alignment |
| One-hour endurance run | **312 billion frames, zero errors** |
| Codewords checked in that hour | **108 billion, zero bad** |
| Error correction | **1 to 15 symbol errors per codeword: all corrected, no frame lost** |
| Beyond the code's limit | 16 symbol errors: detected and flagged, never delivered as good data |
| Lane handling | Lanes shuffled, shifted and skewed on purpose: locked and reordered automatically |

### It corrects errors, in hardware, at speed

We inject errors into the running link on purpose. With the decoder active,
a burst that would destroy a frame is repaired on the fly: the receiver
reports one corrected codeword and the application loses nothing.
Throughput is unchanged.

### It knows its own limit

{{< fig "eth-fec.svg" "Symbol errors injected per codeword on the running link. 1 to 15: repaired. 16: declared uncorrectable, never passed on." >}}

The code can repair up to 15 symbol errors per codeword. We tested 1, 2,
3 … 15: all repaired. At 16 the core does exactly what it must: it declares
the codeword uncorrectable and marks the data as invalid. **In every test,
corrupted data was never passed on as valid.**

### It follows the standard bit for bit

{{< fig "eth-vectors.svg" "The transmit path reproduces the official reference test vectors exactly." >}}

The transmit path reproduces the official IEEE 802.3 reference test vectors
for 200G, 400G and 800G, and the published example vectors of the 1.6T
draft standard, exactly.

## How we got here

| Step | Milestone |
|---|---|
| MAC | Frame controller complete and verified in simulation at four datapath widths, including the full 1.6 Tb/s width; from first line to timing-clean design in a single working session |
| MAC + PCS on silicon | At a quarter of the final width: 258.3 Gb/s of payload, exactly the theoretical figure; 625 billion frames in one hour, zero errors |
| Full link layer on silicon | Error correction and 16-lane alignment added: 129 Gb/s through the complete chain, 312 billion frames in one hour, zero errors |

{{< detalle "Why is the latest throughput lower than the earlier one?" >}}
The earlier 258.3 Gb/s run carried the frame controller and the first PCS
stages. The latest run carries the complete link layer, including the
Reed-Solomon decoder and 16-lane alignment, in a configuration scaled to fit
the same FPGA. Both are measured at 300 MHz on the same board. The rate
of the full 1.6 Tb/s datapath will be established on the A1 chip itself.
{{< /detalle >}}

## What is still ahead

We believe in saying what is not done yet.

- The silicon results come from a **scaled configuration** on an FPGA. The
  full-width 1.6 Tb/s datapath is verified in simulation; its speed in
  silicon will be established on the A1 chip itself, not on this FPGA.
- The test link is an **internal channel** inside the device. Connection to
  optical or electrical transceivers is the next integration step.
- The error-correction capacity under heavy, continuous error rates is being
  extended.

## The method

Every result on this page follows the same rule: **simulate it, synthesise
it, then prove it on the board.** Nothing is reported as working until it
has run in silicon with independent counters on both ends of the link.

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
