---
title: "IP core family"
layout: article
weight: 10
estado: "Validated on FPGA · Becoming the Exxo A1"
summary: "A library of reusable hardware blocks written in VHDL-2008: processors, high-speed links, space buses, general peripherals and post-quantum cryptography. Most are already validated on FPGA hardware, and together they become the peripherals of the HERCOSS Exxo A1."
datos:
  - "VHDL-2008"
  - "Simulation + real hardware"
  - "Full AXI4 interfaces"
  - "47 of the A1's 67 controllers"
seotitle: "Space IP cores: SpaceWire, MIL-STD-1553, CAN, Ethernet, PQC — Hercoss"
---

## What an IP core is

Chips are not designed from a blank page each time. They are assembled from
**IP cores**: self-contained, reusable hardware blocks, each doing one job,
such as an Ethernet port or a processor. Hercoss builds and maintains its own
family, so the Exxo A1 is assembled from blocks the company fully understands
and controls.

## The catalogue

Filter by category. Each core shows its status and the role it plays in the
Exxo A1. "Validated on FPGA" means it has passed on real hardware; "In the IP
family" means it is part of the library and planned for the chip.

{{< cores >}}

## From IP core to chip

In the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/), these cores become
**47 of the chip's 67 hard peripheral controllers**: 10 SpaceWire, 5
MIL-STD-1553, 10 CAN, 5 UART, 5 I²C, 5 I³C, 5 SPI and 2 SD, all built from
IP already validated on FPGA. The RV128IMAC becomes the chip's sixteen
processors, the SerDes, PCS, MAC and PTP cores are the basis of its
Ethernet, and [NOC_512](/projects/noc-512/) is the network that connects
them all.

Every core is now being reviewed for chip readiness, with a common register
convention and full AXI4 interfaces, and with flight features such as
post-quantum key zeroisation.

## How a core is validated

1. **Simulation against reference models.** A layered regression runs each
   core next to software models written in Python and compares every result
   automatically. Processors are checked instruction by instruction.
2. **Synthesis and timing** on the target FPGA.
3. **Real hardware.** The core is built into an AMD Versal FPGA and the same
   checks run on the board, each reporting its own pass or fail. Where a
   standard exists, the core is also tested against commercial equipment,
   such as the 40G Ethernet MAC against a commercial network card.

"Validated on FPGA" on this site means the third step passed.

{{< detalle "Did hardware testing find bugs that simulation missed?" >}}
Yes, and that is the point of doing it. Examples: a synthesis-tool behaviour
that silently changed a lookup table on the FPGA, a lane that occasionally
failed to lock after a transceiver reset, and a reset during a memory
transfer that could hang the board. Each one now has a test that catches it.
{{< /detalle >}}

## Source code

The source code is available to partners and customers on request:
[adrian@hercoss.com](mailto:adrian@hercoss.com).
