---
title: "HERCOSS Exxo A1"
layout: a1
weight: 1
estado: "In development"
summary: "A complete FPGA SoC for space: sixteen RISC-V processors, an FPGA fabric and a full set of space-grade peripherals on a single chip, designed in Europe."
datos:
  - "16 × RV64IMAC"
  - "~500K-LUT FPGA fabric"
  - "3 × PCIe Gen5 x16"
  - "300 krad target"
---

## What is an FPGA SoC?

A satellite's on-board computer usually needs two kinds of chip. A
**processor** runs the software: the operating system, the mission logic, the
communications. An **FPGA** is hardware that can be rewired after it is built,
used for the jobs software is too slow for, such as handling instrument data
in real time.

An **FPGA SoC** puts both on one piece of silicon. That saves board area, mass
and power, and lets software and custom hardware exchange data at full speed
instead of across slow board-level wiring.

## Why Hercoss is building one

Europe's upcoming space missions depend on chips of this class, and today they
come from a very small number of suppliers outside Europe. The Exxo A1 is
Hercoss's answer: a chip built on open standards, designed with the smallest
possible die area, and intended to be designed and manufactured in Europe.

{{< detalle "Where does the project stand today?" >}}
The A1 is in development: its architecture and RTL are being designed and
verified in simulation. It has not been fabricated. The figures on this page
are design targets. What has already been proven on real hardware are its
building blocks, the eFPGA fabric and the IP cores; see the roadmap below.
{{< /detalle >}}
