---
title: "RISC-V processor cores"
weight: 4
estado: "Validated on FPGA · In development"
summary: "Processor cores written from scratch in VHDL: a 64-bit core and the 128-bit RV128IMAC, the processor of the Exxo A1, already running Linux on real hardware."
datos:
  - "RV64IMAC"
  - "RV128IMAC (dual mode)"
  - "Linux on FPGA"
  - "VHDL-2008"
seotitle: "RISC-V processor cores in VHDL for space — Hercoss"
---

## What they are

A processor core is the part of a chip that executes software instructions.
Hercoss writes its own, following the open **RISC-V** standard, so they can be
adapted, hardened and integrated without a licence from a processor vendor.

{{< detalle "What does RV64IMAC mean?" >}}
It is the RISC-V way of naming what a processor can do:

- **RV64**: 64-bit registers and addresses.
- **I**: the base integer instruction set.
- **M**: hardware multiply and divide.
- **A**: atomic operations, needed for multi-core software.
- **C**: compressed 16-bit instructions, which make programs smaller.

That combination is enough to run Linux and real-time operating systems.
{{< /detalle >}}

## RV64IMAC

The 64-bit core, in development and intended for production. It is the base
of the family: it talks directly to the rest of Hercoss's IP cores.

## RV128IMAC

The 128-bit core, and the processor chosen for the Exxo A1. It runs as a
128-bit CPU, as a standard 64-bit CPU, or as two 64-bit CPUs, boots Linux on
an FPGA prototype, and lets one CPU call functions on another at hardware
speed. It has its own page: [RV128IMAC — the core of the Exxo A1](/projects/rv128imac/).

{{< detalle "Why 128 bits?" >}}
Not for memory size: no application needs a 128-bit address space. The gain
is in the arithmetic. Cryptography and exact big-number maths process twice
as many bits per step, and on the prototype that made a large computation
1.63× faster than the same algorithm with 64-bit words.
{{< /detalle >}}

{{< detalle "How are the cores verified?" >}}
In two steps. First in simulation, where every program is run both on the
VHDL design and on a software model of the instruction set, and the results
are compared. Then on real hardware, running the same programs on an FPGA.
A core counts as validated only after the second step.
{{< /detalle >}}
