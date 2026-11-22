---
title: "Onboard intelligence — NPU, AI Engine and AOCS accelerators"
layout: article
weight: 4
estado: "NPU and AOCS accelerator validated on FPGA · AI Engine in design"
hidecover: true
seotitle: "Onboard AI for satellites: NPU, AI Engine and AOCS accelerators — Hercoss"
summary: "Three engines that let a spacecraft see, think and steer on its own. An NPU that classifies images in a third of a millisecond, a large AI Engine for heavier models, and an attitude-control accelerator that solves the control problem in hardware. Two of the three already run on FPGA silicon."
datos:
  - "0.333 ms per image"
  - "~3,000 inferences / s"
  - "MPC solved in hardware"
  - "Bit-identical sim → silicon"
---

{{< stats >}}
{{< stat "0.333 ms" "to classify an image, measured on FPGA silicon" >}}
{{< stat "~3,000" "inferences per second from one NPU" >}}
{{< stat "70 × 70" "control problem solved in hardware, in 32-bit floating point" >}}
{{< stat "128×" "more compute units in the A1's AI Engine than in today's NPU" >}}
{{< /stats >}}

## Why this matters

A modern satellite produces far more data than it can send to the ground,
and it often has to react faster than a ground station can answer. The
value moves on board: **decide in orbit, downlink only what matters, and
steer without waiting.**

That needs three different kinds of compute, and the HERCOSS Exxo A1 puts
all three on the same die as its sixteen processors:

{{< fig "onboard-ai.svg" "Perception, heavy AI and control, from the sensors to the actuators, on one chip." >}}

## NPU — perception at the edge

**What it is for:** looking at images as they arrive and deciding what they
show, such as clouds, ships, fires, damage or anomalies, so that only useful
data is stored or sent down.

**What exists today:** an INT8 convolutional neural-network accelerator,
written in VHDL-2008 around an 8 × 8 systolic array. It runs a complete
network (two convolution layers, pooling, a fully connected layer and the
final decision) entirely in hardware. It fetches its own weights and images
from memory, so the processor only starts it and reads the answer.

| Measured on FPGA silicon (AMD Versal VE2302) | Result |
|---|---|
| Time per inference | **0.333 ms** |
| Throughput | **~3,000 inferences per second** |
| Correctness | Same signature from the Python model, every RTL layer, the AXI integration and the silicon |
| Size | About a third of this FPGA's logic; DSP columns and almost all block RAM left free |
| Clock | 87.1 MHz on the FPGA, timing met with positive margin |

## AOCS accelerator — control in hardware

**What it is for:** keeping the spacecraft pointed where it must. Modern
attitude and orbit control uses **model-predictive control (MPC)**: at every
control step it solves a small optimisation problem that respects the limits
of the reaction wheels and magnetorquers. That solve is a heavy, repetitive
calculation with a hard real-time deadline, exactly the kind of work that
belongs in hardware.

**What exists today:** an accelerator that solves that problem on its own.
The processor writes a few pointers and a start bit; the accelerator loads
the problem from memory, iterates to the solution in 32-bit floating point
and writes the result back, while the processor stays free.

| Measured on FPGA silicon (AMD Versal VE2302) | Result |
|---|---|
| Problem size | 70 × 70 matrix, 32-bit IEEE-754 floating point |
| Parallelism | 8 lanes working at once |
| Correctness | Floating-point unit bit-exact against AMD's reference operator; identical signature from simulation to silicon |
| Size | ~13 % of the logic, 22 % of the block RAM, ~40 DSP blocks |
| Timing | Met with +2.8 ns margin |

## AI Engine — heavy AI for the Exxo A1

**What it is for:** larger models that a single NPU cannot hold: bigger
convolutional networks, spiking neural networks, transformers, and the
matrix maths behind estimation and control.

**Where it stands:** the AI Engine is the A1's large compute array. Its
architecture is defined and its RTL is the next step: **8 tiles of 1,024
multiply-accumulate units each, with 512 KiB of local memory per tile, about
12 TMAC/s at the A1's target clock.** Each tile can be switched off when the
mission does not need it.

{{< fig "mac-scale.svg" "From the proven 64-MAC NPU to the 8,192-MAC AI Engine of the Exxo A1." >}}

The NPU and the AOCS accelerator are its proven building blocks: the same
design methods and the same verification, scaled up.

## Built to be trusted

Every one of these engines is verified the same way:

- **An independent reference model first,** written before the hardware.
- **Layer by layer,** each layer ending in a single signature that must
  match the model bit for bit.
- **Tests that are proven to bite:** each layer is deliberately broken in
  several ways, and every break must be caught.
- **Then real silicon,** where the same signature must appear again.

{{< detalle "What is still to be done?" >}}
- The NPU runs a compact network on small (16 × 16) images; larger models
  and image sizes are the next step, and the A1's AI Engine is where they
  will run.
- The AOCS accelerator solves the MPC problem today; a second mode for
  state estimation is reserved for phase 2.
- The AI Engine is in design: its RTL, and the integration of all three
  engines with the RV128IMAC cores and the NOC_512 network.
- All figures come from an FPGA. On the A1, clock and speed will be those
  of the production node.
{{< /detalle >}}

## Invest in onboard intelligence

Onboard AI and autonomous control are where the value of a modern spacecraft
is moving. The HERCOSS Exxo A1 brings them onto the same European chip as
the processors, the FPGA fabric and the space interfaces.
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
