---
title: "RV128IMAC — the core of the Exxo A1"
layout: rv128
weight: 2
estado: "Running on FPGA · Core of the Exxo A1"
summary: "A 128-bit RISC-V processor written from scratch by Hercoss. It runs Linux, calls functions on other CPUs in 1.36 µs, and is the processor at the heart of the HERCOSS Exxo A1."
datos:
  - "128-bit RISC-V"
  - "1.36 µs CPU-to-CPU call"
  - "Linux 6.6 SMP"
  - "214 / 214 tests on FPGA"
---

{{< aviso "Patent analysis in progress" >}}
The innovations described on this page are currently being analysed for
patent protection. This page shows what the core achieves; the technical
details of how it achieves it will be published once that analysis is
complete.
{{< /aviso >}}

## What it is

RV128IMAC is a RISC-V processor core designed and written from scratch in
VHDL by Hercoss. It is a **128-bit** processor, twice the word width of the
64-bit processors in today's computers and phones, and it is the processor
chosen for the **HERCOSS Exxo A1**: the chip's CPU cluster is sixteen of
these cores.

What makes it different is not only the width. It changes how processors
inside one chip work together: a program on one CPU can call a function on
another CPU almost as quickly as calling a function on its own.

Every result on this page was measured on a working FPGA prototype: two CPUs
on an AMD Versal board, running Linux.

## One core, three personalities

The same core can be configured in three ways. Pick one to see it.

{{< modes >}}

## Calling another CPU at hardware speed

In a multi-core chip, getting work done on another processor normally means
going through the operating system: a system call, a driver, shared memory and
an interrupt. Each step costs time, and together they take microseconds to
tens of microseconds.

The RV128IMAC adds **XCALL**, a Hercoss extension to RISC-V. An ordinary Linux
program asks another CPU to run a function and gets the answer back, with no
driver in between. The operating system only decides which programs may do it.

{{< fig "xcall-latency.svg" "A complete call to another CPU and back costs about a fifth of a system call that does nothing." >}}

{{< detalle "What exactly is being compared?" >}}
Both numbers come from the same Linux process on the same CPU of the FPGA
prototype at 60 MHz. The system call is `getppid()`, one of the cheapest
calls Linux has; the XCALL is a full round trip that runs a function on the
second CPU and returns its result. The comparison is between the two
mechanisms on this core, not a claim against other vendors' products.
{{< /detalle >}}

## Work in parallel without waiting

Calls can also be **asynchronous**: a program starts a call on another CPU,
keeps working, and collects the answer later. Both CPUs compute at the same
time, and the total time approaches the ideal.

{{< fig "xcall-async.svg" "Two large factorials, one on each CPU. Run together, they finish in the time of the longer one." >}}

## Robust by design

A satellite cannot be rebooted every time a program misbehaves, so the calls
are built to survive faults:

- A program that crashes or hangs with calls still in flight is cleaned up by
  the operating system; the other CPU is not affected.
- An answer can never reach the wrong program. This is enforced by the
  hardware, not by software convention.
- Programs can wait with a timeout, cancel a call, or sleep while they wait
  so their CPU is free for other work.

## A 128-bit coprocessor that pays off

Some workloads need numbers far larger than 64 bits: cryptography, exact
arithmetic, high-precision navigation maths. With 128-bit words, each step
handles twice as many bits.

{{< fig "bignum-128.svg" "Computing 1000! (a 2568-digit number): the same algorithm, 64-bit words against 128-bit words." >}}

The second CPU also runs a native 128-bit programming environment. New
services can be defined on it **while Linux keeps running**, and Linux can
call them immediately, with no rebuild and no reboot.

## Results on the FPGA prototype

| What | Result |
|---|---|
| Board test suite | 214 / 214 programs pass, each self-checking |
| Linux 6.6 SMP (two CPUs on one core) | 20 / 20 consecutive boots |
| Both CPUs stressing the memory bus together | 20 / 20 |
| CoreMark (64-bit mode) | 1.85 CoreMark/MHz |
| Call to another CPU and back (XCALL) | 1.36 µs |
| Empty Linux system call, for reference | ~6.8 µs |
| Big-number maths, 128-bit vs 64-bit words | 1.63× faster |
| Two computations in parallel via async call | 1.60× (ideal 1.61×) |
| Operating systems running | Linux 6.6, FreeRTOS, Zephyr, RTEMS |

{{< detalle "What are the limits of these numbers?" >}}
They come from an FPGA prototype running at 60 MHz on an AMD Versal AI Edge
VE2302. A fabricated chip will run at a different clock and with a different
area; those figures are not known yet.

The 128-bit instruction set is based on the RV128I draft from the RISC-V
specification, which is not a ratified standard. XCALL is a Hercoss
extension, not part of RISC-V. No C compiler exists for 128-bit RISC-V
anywhere, so 128-bit code is written with Hercoss's own tools; Linux and the
real-time operating systems run in the standard 64-bit mode.
{{< /detalle >}}

## Verified like a product

Every change to the processor is checked **instruction by instruction**
against independent software models of the instruction set. If the hardware
and the model disagree on a single result, memory write or exception, the
test stops. The same programs then run on the FPGA board, where each one
reports its own pass or fail.

The regression covers more than twenty layers: every compressed instruction
exhaustively, tens of thousands of multiply and divide cases, caches and
memory under random delays, three real-time operating systems, and Linux
booting from the first instruction to the first user program: 37.5 million
instructions, identical between hardware and model.

{{< detalle "Did it find real bugs?" >}}
Yes. Among them: a reset during a memory transfer that could hang the board,
an interrupt delivered to the wrong privilege level, and a subtle
specification violation that made Linux hang only occasionally. Each one was
fixed, and each one now has a test that would catch it again.
{{< /detalle >}}

## Three weeks of progress

| Date (Nov 2026) | Milestone |
|---|---|
| Early November | 128-bit core from scratch, first programs on the FPGA |
| 10 Nov | Linux boots on the core |
| 11 Nov | Faster core: branch prediction, fast multiplier, 60 MHz |
| 19 Nov | Linux SMP on two CPUs inside one core |
| 20 Nov | Two cores joined; first XCALL from a Linux program |
| 20 Nov | Asynchronous calls and process isolation |
| 21 Nov | Robust calls, live services, performance counters |

## In the Exxo A1: a cluster of sixteen

The Exxo A1 places **sixteen RV128IMAC cores** in one processor cluster,
connected so that any core can call any other directly. Around them sit the
chip's FPGA fabric, the AI and attitude-control array, post-quantum
cryptography and the I/O, all on one full AXI4 interconnect.

{{< fig "a1-cluster.svg" "Planned processor cluster of the HERCOSS Exxo A1. Conceptual diagram; not to scale." >}}

{{< detalle "What still has to happen before the A1 uses this core?" >}}
The prototype has two CPUs; scaling the connection network to sixteen cores
is the next architectural step. The radiation-hardening features planned for
the A1 (error-correcting register files, cache parity, lockstep pairs) and
the larger caches still have to be added. And the core has so far only been
built for FPGA: the chip flow (memory macros, test logic, timing and area in
silicon) comes next.
{{< /detalle >}}

Questions, collaboration or investment:
[adrian@hercoss.com](mailto:adrian@hercoss.com).
