---
title: "RISC-V processor cores"
weight: 3
estado: "Validated on FPGA · In development"
summary: "Processor cores written from scratch in VHDL: a 64-bit core intended for production and an experimental 128-bit core that has already run on real hardware."
datos:
  - "RV64IMAC"
  - "RV128IMAC (dual mode)"
  - "29/29 tests on hardware"
  - "VHDL-2008"
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

An experimental core that explores the 128-bit variant of RISC-V. It is a
**dual-mode** core: at reset it starts either as RV128 or as RV64, so
operating systems that exist today run in 64-bit mode on the same hardware.

Its bare-metal version has been validated on an AMD Versal FPGA: all 29
programs of its test suite produced the same results on the hardware as on
the reference instruction-set simulator.

{{< detalle "Why 128 bits?" >}}
No application needs a 128-bit address space today. The core is a research
vehicle: a way to try architectural ideas on a compact design before deciding
whether they belong in a production processor.
{{< /detalle >}}

{{< detalle "How are the cores verified?" >}}
In two steps. First in simulation, where every program is run both on the
VHDL design and on a software model of the instruction set, and the results
are compared. Then on real hardware, running the same programs on an FPGA.
A core counts as validated only after the second step.
{{< /detalle >}}
