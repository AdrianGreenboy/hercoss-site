---
title: "IP core family"
layout: article
weight: 12
estado: "Most cores validated on FPGA silicon · Becoming the Exxo A1"
summary: "Hercoss's own library of hardware blocks, written in VHDL-2008: a 128-bit RISC-V processor, a self-healing network on chip, a 1.6 Tb/s Ethernet core, a self-healing DDR4 controller, AI, RF, space buses and post-quantum cryptography. Most are already validated on FPGA silicon; together they become the HERCOSS Exxo A1."
datos:
  - "VHDL-2008"
  - "Simulation + real hardware"
  - "Full AXI4 interfaces"
  - "47 of the A1's 67 controllers"
seotitle: "Space IP cores: SpaceWire, MIL-STD-1553, CAN, Ethernet, PQC — Hercoss"
---

## The headline cores, November 2026

{{< stats >}}
{{< stat "129 MB/s" "RV128IMAC: hardware SHA-3 from Linux with no driver, ~140× software" >}}
{{< stat "≈0.6 µs" "NOC_512: heals itself around a dead switch, 405,522 times in one hour, 0 words lost" >}}
{{< stat "312 bn" "ETH_1T6: 1.6T Ethernet frames in one hour, zero errors, bursts corrected" >}}
{{< stat "1 chip" "DDRC_72: a whole memory chip can die, the data stays correct (simulation)" >}}
{{< /stats >}}

| Core | What it does | Latest result | Status | Page |
|---|---|---|---|---|
| **RV128IMAC** | 128-bit RISC-V processor, the A1's 16 cores | Linux 6.6 SMP; calls between CPUs in 1.35 µs; SHA-3 at 129 MB/s with no driver; 214/214 board tests | Validated on FPGA | [View](/projects/rv128imac/) |
| **Core fabric (ring)** | Cores and accelerators call each other directly | 17-station ring on silicon at full load: ~9 M messages per run, 0 errors; software sets service priority at run time, critical job 36 % sooner | Validated on FPGA (17 stations) | [View](/projects/rv128imac/#priority) |
| **NOC_512** | Self-healing 512-bit network on chip | Heals itself in ≈0.6 µs, 405,522 failures in one hour, 0 of 160 bn+ words lost; formally verified | Validated on FPGA (2 × 2) | [View](/projects/noc-512/) |
| **ETH_1T6** | 1.6 Tb/s Ethernet: MAC, PCS, FEC, lane alignment | 312 bn frames in one hour, 0 errors; 1–15 symbol errors corrected; bit-exact to IEEE vectors | Validated on FPGA (scaled) | [View](/projects/eth-1t6/) |
| **DDRC_72** | Self-healing DDR4 memory controller, up to 128 GiB | 0 data errors and 0 JEDEC timing violations, with a dead memory chip and a failing row | Simulation | [View](/projects/ddrc-72/) |
| **PCIE_G5** | PCI Express Gen4 / Gen5, 1–16 lanes, COTS and rad-hard; designed to repair common particle upsets on the spot | Physical layer on silicon at 4 × 16 Gb/s: one hour, 389.8 billion words, 0 errors; receiver upsets repaired in microseconds without leaving data mode | Validated on FPGA (physical layer, 4 lanes) | [View](/projects/pcie-g5/) |
| **NPU + AOCS accelerator** | Onboard AI and attitude control | 0.333 ms per image; MPC 70 × 70 bit-identical from simulation to silicon | Validated on FPGA | [View](/projects/onboard-ai/) |
| **RF front-end + ADC chain** | Software-defined radio and high-resolution ADC | DDC/DUC bit-exact in six domains; ~16.4–18.9 effective bits | Validated on FPGA | [View](/projects/rf/) |
| **SerDes, 25G/40G Ethernet, PTP** | High-speed links | 103 Gb/s link, 0 errors in 1 h; 40GbE against a commercial NIC | Validated on FPGA | [View](/projects/high-speed-links/) |
| **Own eFPGA fabric** | The A1's reconfigurable logic | Runs inside a Versal; 130 nm layout passes IHP's tape-out precheck | Validated on FPGA · GDS ready | [View](/projects/efpga-fabric/) |

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
IP already validated on FPGA. The [RV128IMAC](/projects/rv128imac/) becomes the chip's sixteen
processors, linked by their own core fabric; the SerDes, PCS, MAC and PTP
cores and [ETH_1T6](/projects/eth-1t6/) are its Ethernet up to 1.6 Tb/s;
[NOC_512](/projects/noc-512/) is the self-healing network that connects them
all; [DDRC_72](/projects/ddrc-72/) is its self-healing DDR4 memory controller, verified in simulation and heading to FPGA synthesis next; and [PCIE_G5](/projects/pcie-g5/), the newest member, started on 27 November 2026, becomes its three PCIe Gen5 x16 ports.

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
