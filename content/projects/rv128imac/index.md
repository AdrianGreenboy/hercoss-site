---
title: "RV128IMAC — the core of the Exxo A1"
layout: rv128
weight: 2
estado: "Running on FPGA silicon · Processor core of the HERCOSS Exxo A1"
seotitle: "RV128IMAC — 128-bit RISC-V processor core for space computing — Hercoss"
summary: "128-bit RISC-V, built from scratch in Europe. One core runs as a 128-bit CPU, a 64-bit CPU or two 64-bit CPUs; a Linux program calls a function on another CPU in 1.35 µs, and hashes with hardware SHA-3 at 129 MB/s, about 140× software, with no driver. It is the processor at the heart of the HERCOSS Exxo A1."
datos:
  - "128-bit RISC-V"
  - "SHA-3 at 129 MB/s, no driver"
  - "1.35 µs CPU-to-CPU call"
  - "Linux 6.6 SMP"
  - "214 / 214 on silicon"
  - "Ring fabric: 64 threads"
---

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 from an ordinary Linux process, no driver" >}}
{{< stat "×143" "faster than the same algorithm in software on the same CPU" >}}
{{< stat "1.35 µs" "a Linux program calls a function on another CPU, ~5× faster than an empty system call" >}}
{{< stat "214 / 214" "self-checking programs pass on silicon" >}}
{{< /stats >}}

{{< aviso "Patent process in progress" >}}
The core fabric and the innovations on this page are in the patent process.
This page shows what they achieve and why they matter; how they work
internally will be published once that process allows it.
{{< /aviso >}}

## What it is

RV128IMAC is a RISC-V processor core designed and written from scratch in
VHDL by Hercoss. It is a **128-bit** processor, twice the word width of the
64-bit processors in today's computers and phones, and it is the processor
chosen for the **HERCOSS Exxo A1**: the chip's CPU cluster is sixteen of
these cores.

What makes it different is not only the width:

- **Cores call each other directly.** An ordinary Linux program runs a
  function on another processor and gets the answer in 1.35 µs, with no
  driver and no operating-system round trip.
- **Its own core fabric.** Cores and accelerators share a ring of their
  own, now scaled to address 64 hardware threads, and fair at full load.
- **Hardware accelerators without drivers.** The first one, a SHA-3 / SHAKE
  engine, serves a Linux process at 129 MB/s, about 140× the same algorithm
  in software on the same CPU.
- **One core, three personalities:** 128-bit CPU, 64-bit CPU, or two 64-bit
  CPUs.

Everything on this page runs on a working FPGA prototype: two CPUs on an
AMD Versal board at 60 MHz, running Linux. **From first Linux boot to a
driverless hardware SHA-3 running 140× faster than software: two weeks, all
on real silicon.**

## The HERCOSS core fabric: a ring built for calls

Most multicore chips connect their cores through shared memory: one core
writes, the other polls or takes an interrupt, and the operating system sits
in the middle. **The HERCOSS core fabric is different. Cores and hardware
accelerators talk to each other directly, in hardware, at instruction
speed**, over a ring of their own.

{{< fig "ring-vs-memory.svg" "Asking another core for work: the usual path through memory and the operating system, against the HERCOSS core fabric." >}}

{{< fig "ring-concept.svg" "The HERCOSS core fabric for the Exxo A1: sixteen cores and their accelerators on one ring; memory and I/O travel separately on NOC_512. Concept, not to scale." >}}

### Why a ring

Ring interconnects are simple, cheap in wires and easy to close at high clock
rates, exactly what a 16-core radiation-tolerant chip needs. Keeping
messages on their own ring, and memory traffic on the separate
[NOC_512](/projects/noc-512/) network, means a call between cores never
waits behind a memory transfer.

### Why it is new

What is new is not "a ring". **The novelty is what travels on it:**

- **Function calls, accelerator requests and their answers, all treated
  alike.** Software calls the SHA-3 engine the same way it calls another
  processor. Tomorrow's accelerators plug into the same fabric, and the
  software does not change.
- **Reachable from ordinary software with single instructions:** no driver,
  no mailbox in memory, no interrupt.
- **Robust against crashing programs:** an answer can never reach the wrong
  process.
- **Fair by construction at full load.** Our stress tests showed that a
  conventional ring can leave a station waiting indefinitely when its
  neighbours are busy. The HERCOSS fabric **guarantees every core and every
  accelerator its turn**, however busy the ring. Simulation confirms it, and
  it is now part of the A1 architecture.

{{< fig "ring-fair.svg" "Found in our own stress tests and fixed at the architecture level, before a single wafer." >}}

### Scaling to the A1: 64 threads, 16 stations

{{< stats >}}
{{< stat "64" "hardware threads addressable: four times the A1's 16 cores" >}}
{{< stat "16" "stations on a ring driven to saturation (simulation)" >}}
{{< stat "0" "messages lost, duplicated or reordered" >}}
{{< stat "5 / 5" "deliberately broken ring designs caught by our tests" >}}
{{< /stats >}}

- **Same silicon, more room.** The fabric was re-engineered to address up to
  64 hardware threads, and the new build came out about **2,900 logic cells
  smaller** than the one before, with timing still met with margin.
- **Every existing program runs unchanged.** No recompilation was needed for
  binaries that ran on the earlier 8-thread fabric.
- **A full-length 16-station ring at maximum load.** Two real processor cores
  run instruction by instruction against an independent reference model
  while 14 traffic stations saturate the ring around them. They complete a
  full SHA-3 test suite and a 64 KiB hashing benchmark with **zero
  divergences**, and not one message is lost, duplicated or reordered.
- **The checker is checked.** Five deliberately broken versions of the ring
  hardware were built: a lost acknowledgement, a dropped message, a wrong
  sender, a stale answer accepted, a single flipped bit. **The testbench
  catches all five, each for the right reason.**

{{< detalle "What does the ring cost under worst-case load?" >}}
On a ring saturated by every traffic station transmitting as fast as the
fabric allows, which no real workload does, the hashing loop is 2.1× slower
than on an idle ring (7.4 against 3.5 cycles per 8 bytes). Guaranteeing every
station its turn also costs some peak throughput at saturation. We publish
these worst-case numbers because they are the data that sizes the A1's
interconnect, and we will measure the trade-off on silicon before choosing
the balance.

The 64-thread build has passed synthesis and timing closure (125.1 k logic
cells, 83 % of the device, +0.33 ns spare beyond a 1.0 ns safety guard) but
has not run on the board yet. The 16-station results are verified in
simulation.
{{< /detalle >}}

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

{{< fig "xcall-latency.svg" "A complete call to another CPU and back, 1,352 ns, against an empty system call that does nothing, 6,590 ns." >}}

{{< detalle "What exactly is being compared?" >}}
Both numbers come from the same Linux process on the same CPU of the FPGA
prototype at 60 MHz. The system call is `getppid()`, one of the cheapest
calls Linux has; the XCALL is a full round trip that runs a function on the
second CPU and returns its result. In RTL simulation the hardware part of
the call takes 26 clock cycles. The comparison is between the two
mechanisms on this core, not a claim against other vendors' products.
{{< /detalle >}}

## Work in parallel without waiting

Calls can also be **asynchronous**: a program starts several calls, keeps
working, and collects the answers later in any order. Both CPUs compute at
the same time, and the total time approaches the ideal.

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

## Accelerators without drivers: hardware SHA-3

SHA-3 and SHAKE are the foundation of the new post-quantum cryptography
standards, ML-KEM (FIPS 203) and ML-DSA (FIPS 204). For a space chip with a
ten-year life, having them in hardware and reachable from ordinary software
is a strong argument.

On most chips, using an accelerator means a kernel driver, memory-mapped
registers, DMA, interrupts and shared buffers: microseconds per request and
a lot of software. On the RV128IMAC, an ordinary Linux process uses the
SHA-3 engine **directly, with no driver**.

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 from a Linux process (1 MiB)" >}}
{{< stat "140 MB/s" "on bare metal" >}}
{{< stat "8.2 µs" "for a short 64-byte message, vs 143 µs in software (×17)" >}}
{{< stat "~8,000" "LUTs for the whole engine" >}}
{{< /stats >}}

The engine covers SHA3-224, -256, -384, -512 and SHAKE128 / 256, one
Keccak-f[1600] round per clock cycle.

### 33 to 129 MB/s in five days

Each step was validated on silicon before the next one started.

{{< fig "sha3-journey.svg" "SHA3-256 from a Linux process on the same board at the same 60 MHz. Every bar measured on silicon." >}}

| Step | Date | What changed | Linux SHA3-256, 1 MiB | vs software |
|---|---|---|---|---|
| P9 | 21 Nov | SHA-3 engine running on silicon, used from Linux without a driver | 33 MB/s | ×54 |
| P9b | 22 Nov | Software only | 53–60 MB/s | – |
| P10 | 22 Nov | A new instruction in the core | 74.5 MB/s | ×94 |
| P11 | 23 Nov | The data cache learns to fetch the next line ahead | 97.7 MB/s | ×150 |
| P12 | 24 Nov | Timing redesign in instruction fetch: same speed, far more margin, fewer gates | 99.8 MB/s | ×153 |
| P13b | 25 Nov | Pipeline and instruction-fetch improvements | **129.0 MB/s** | ×143 |

The ratio dipped from ×153 to ×143 for a good reason: the same improvement
also made the *software* version 1.39× faster. That is why we track MB/s and
cycles for progress, not the ratio.

## Measured, not assumed

The core carries its own hardware performance counters, and every
optimisation starts from a measurement of where the cycles go, not from a
guess.

{{< fig "sha3-cycles.svg" "Cost of each 8-byte step of the hash on bare metal: from 7.31 to 3.44 clock cycles, all measured on silicon." >}}

- **The measurement redirected the work.** The counters showed that the path
  between the core and the engine costs almost nothing. That turned "a
  bigger queue", which would not have helped, into a new instruction
  (+25 %) and a data-cache prefetch (+30 %).
- **We correct ourselves in public.** An earlier measurement blamed about two
  cycles per step on the pipeline waiting for older instructions. Removing
  that wait gave less than predicted. Digging deeper showed most of those
  cycles came from somewhere else: the instruction-fetch queue ran dry on
  some code alignments. The very same loop took 5.15 or 3.28 cycles per step
  depending only on where it sat in memory. The fix makes alignment
  irrelevant and speeds up all compact code: on silicon, the software SHA-3
  in C ran 1.39× faster with it, and the hardware path 1.29× faster.
- **Faster without spending timing margin.** The prefetch step left almost no
  timing margin (+0.010 ns). The next step redesigned the critical path and
  won +0.556 ns with 1,300 fewer LUTs at identical performance. Margin today
  is what makes the next features possible.

{{< detalle "Where do the remaining cycles go?" >}}
The counters already show the next steps. Of the 3.44 cycles per 8-byte
step, about 1.9 are the instructions themselves, about 0.9 are waiting on
the data cache and about 0.66 are waiting to hand data to the engine. Two
further optimisations are identified; each will be measured on silicon
before it is reported.
{{< /detalle >}}

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
| SHA3-256 from a Linux process, no driver (1 MiB) | **129.0 MB/s** vs 0.90 MB/s in software on the same CPU: ×143 (×123–×153 across boots and bitstreams) |
| SHA3-256, bare metal | 140 MB/s (3.44 clock cycles per 8 bytes) |
| Short message (64-byte hash) | 8.2 µs in hardware vs 143 µs in software (×17) |
| Call to another CPU and back (XCALL) | **1.35 µs** (1,352 ns) |
| Empty Linux system call, for reference | 6.59 µs (6,590 ns) |
| 128-bit vs 64-bit big-number maths (1000!) | 1.63× faster |
| Two computations in parallel via asynchronous calls | 1.60× (ideal 1.61×) |
| Linux 6.6 SMP on two hardware threads of one core | 20 / 20 consecutive boots, plus 20 / 20 SMP stress runs on the latest bitstream |
| Board test suite | 214 / 214 self-checking programs (RV128, RV64, FreeRTOS, Zephyr, RTEMS, CoreMark, Forth) |
| CoreMark 1.0 (64-bit mode) | 1.85 CoreMark/MHz (not yet re-measured on the latest bitstream) |
| Latest design (p13b): 2 CPUs + SHA-3 engine | 128.0 k LUTs (85 % of the VE2302); timing met with a 1.0 ns safety guard plus +0.444 ns to spare |

{{< detalle "What are the limits of these numbers?" >}}
They come from an FPGA prototype running at 60 MHz on an AMD Versal AI Edge
VE2302. A fabricated chip will have a different clock, power and area; those
figures are not known yet, and absolute MB/s will change on the A1. The
×143 (×153 on an earlier bitstream) compares against the software algorithm
on the same 60 MHz in-order CPU, not against other vendors' products or
desktop processors. The
software reference varies by up to about 20 % between boots depending on
memory placement, so the speed-up is a range and every gain is compared
within one run.

The 128-bit instruction set is based on the RV128I draft from the RISC-V
specification, which is not a ratified standard. XCALL and the accelerator
interface are Hercoss extensions, not part of RISC-V. No C compiler exists
for 128-bit RISC-V anywhere, so 128-bit code is written with Hercoss's own
tools; Linux and the real-time operating systems run in the standard
64-bit mode. Under Linux the SHA-3 engine has one context, so the hashing
process is pinned to a core. The full 214-program suite was last run on an
earlier bitstream; later ones passed the SHA-3, call and SMP stress tests.
{{< /detalle >}}

## Verified like a product

Every hardware change is checked **instruction by instruction** against
independent reference models (128-bit, 64-bit, multi-core and accelerator
versions) across a regression of more than twenty layers. Any difference in a
result, a memory write or an exception stops the test. On top of that:

- **Linux 6.6 boots identically** in hardware and model, from the boot ROM
  to the first user program.
- **FreeRTOS, Zephyr and RTEMS** run in co-simulation.
- **Random memory delays** are injected to shake out timing bugs.
- **Three independent implementations agree:** the 1 MiB SHA-3 digest
  computed on the board is byte-for-byte identical to the one computed on a
  PC and to the official FIPS 202 vectors.
- **The tests are tested:** flipping one bit of one constant of the
  algorithm produces 570 errors.

Then the same programs run on the board, each with its own pass / fail
verdict.

{{< detalle "Did it find real bugs before silicon?" >}}
Yes. A flood test that pushes the engine as hard as it can go showed that
an internal input queue would have overflowed: it needed 47 entries and had
32. Earlier, the process caught a reset during a memory transfer that could
hang the board, an interrupt delivered to the wrong privilege level, and a
subtle specification violation that made Linux hang only occasionally. Each
one was fixed, and each one now has a test that would catch it again.
{{< /detalle >}}

## Architecture in short

| | |
|---|---|
| Instruction set | 128-bit RISC-V (based on the RV128I draft) and RV64IMAC, chosen at reset; compressed instructions; Hercoss extensions for calls and accelerators; hardware performance counters |
| System | M/S/U privilege, Sv39 virtual memory with hardware page-table walker; OpenSBI + Linux 6.6 SMP; FreeRTOS, Zephyr, RTEMS |
| Pipeline | 5 stages, in order; branch prediction; fast multiplier; instruction and data caches with next-line data prefetch; 128-bit AXI4 |
| Caches | Prototype: 16 KiB + 16 KiB; Exxo A1 plan: 64 KiB instruction, 32 KiB data |
| Dual mode | Two 64-bit hardware threads on one 128-bit datapath |
| SHA-3 engine | Keccak-f[1600], one round per clock; all SHA-3 and SHAKE variants; ~8,000 LUTs |

## Progress in November 2026

| Date | Milestone |
|---|---|
| Early November | 128-bit core from scratch, first programs on the FPGA |
| 10 Nov | Linux boots on the core |
| 11 Nov | Faster core: branch prediction, fast multiplier, 60 MHz, CoreMark 1.85 / MHz |
| 19 Nov | Linux SMP on two hardware threads of one core |
| 20 Nov | Two CPUs; first XCALL from a Linux program; asynchronous calls |
| 21 Nov | Robust calls, live services, performance counters, safe bus reset |
| 21 Nov | **Hardware SHA-3 from Linux without a driver: 33 MB/s** |
| 22 Nov | New instruction: 74.5 MB/s |
| 23 Nov | Data-cache prefetch: 97.7 MB/s, ×150 |
| 24 Nov | Timing redesign: 99.8 MB/s, ×153, more margin with fewer gates |
| 25 Nov | Pipeline and instruction-fetch improvements: **129 MB/s**; compiled C up to 1.39× faster |
| 25 Nov | Core fabric re-engineered for 64 hardware threads: new build 2,900 logic cells smaller, timing met |
| 26 Nov | **16-station ring at full load in simulation**: real cores, zero divergences, every station guaranteed its turn |

## Next: the 16-station ring on real silicon

The Exxo A1 places **sixteen RV128IMAC cores** with their accelerators on the
core fabric, around the [NOC_512](/projects/noc-512/) network that carries
memory and I/O. The next steps:

1. **The full-length ring on the FPGA board:** a real CPU, the SHA-3
   accelerator and 15 self-checking traffic stations, at hardware speed.
   Call latency and accelerator bandwidth under load, plus hours-long soak
   tests with every message checked.
2. **Tuning fairness against raw throughput** with real measurements.
3. **One ring or two for the A1**, decided from those silicon measurements
   before the chip architecture is frozen.

{{< fig "a1-cluster.svg" "Planned processor cluster of the HERCOSS Exxo A1. Conceptual diagram; not to scale." >}}

{{< detalle "What still has to happen before the A1 uses this core?" >}}
The prototype has two CPUs on silicon; the 16-station ring is verified in
simulation and its silicon run is next. The radiation-hardening features planned for the A1 and
the larger caches still have to be added. And the core has so far only been
built for FPGA: the chip flow (memory macros, test logic, timing and area in
silicon) comes next.
{{< /detalle >}}

*Prototype on AMD Versal at 60 MHz. Figures measured on silicon unless
marked. Patent process in progress.*

Questions, collaboration or investment:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
