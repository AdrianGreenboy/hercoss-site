---
title: "HERCOSS Exxo A1"
layout: a1
weight: 1
estado: "Investment opportunity · In development"
summary: "A single-die FPGA SoC for space and the edge: sixteen 128-bit RISC-V cores, a 500,000-LUT FPGA fabric, an AI array, up to ~2 Tbps of Ethernet and every space bus a spacecraft needs. One mask, two products: commercial and radiation-hardened. Designed in Europe."
datos:
  - "16 × RV128IMAC"
  - "500K-LUT FPGA"
  - "1.6TbE · ~2 Tbps Ethernet"
  - "67 peripheral controllers"
  - "300 krad target"
---

{{< aviso "Patent analysis in progress" >}}
Several innovations of the Exxo A1, among them the self-healing lockstep and
the direct core-to-core calls, are being analysed for patent protection. This
page shows what they achieve; how they work will be published once that
analysis is complete.
{{< /aviso >}}

## The investment opportunity {#invest}

Spacecraft and remote edge systems combine several chips to do one job: a
radiation-tolerant processor, a separate FPGA for custom logic, an AI
accelerator and a collection of interface chips. Every extra chip adds mass,
power, board area, qualification cost and failure points.

**HERCOSS Exxo A1 puts that whole computer on one die.**

{{< fig "a1-replaces.svg" "What one Exxo A1 replaces on a spacecraft computer board." >}}

### Why invest

- **It solves a real problem with one part.** Every chip removed saves mass,
  power, board area and qualification cost, the four things every mission
  pays for most.
- **It brings something nobody else offers.** Self-healing lockstep corrects
  radiation errors with no reset and no recovery software, and 128-bit cores
  call each other directly in about a microsecond. Both already run on real
  hardware.
- **It is real, not a slide.** The processor runs Linux on FPGA hardware, the
  fault tolerance is measured, the FPGA fabric runs on an FPGA and its first
  test chip passed the foundry's tape-out checks, and the space interface IP
  is proven. An investor funds the next step of a working design, not the
  first step of an idea.
- **It is built on open, sovereign foundations.** RISC-V carries no foreign
  licence that can be withdrawn. Design, IP and know-how stay in Europe.
- **One investment, two markets.** One mask makes a commercial part for edge
  computing, industry and NewSpace constellations, and a radiation-hardened
  part for institutional and deep-space missions. Commercial volume helps pay
  for space qualification.
- **The risk is staged.** Every phase ends at a go/no-go gate with measurable
  results, so capital is committed step by step against evidence. Public
  programmes such as the EU Chips Act and ESA instruments exist to share
  exactly this kind of risk.

### A word from the founder

> Europe's space programmes depend on processors, FPGAs and
> radiation-hardened components designed and controlled outside Europe.
> Export restrictions, supply shortages and shifting trade policies have shown
> how fragile that dependence is: a single licence decision abroad can delay
> or block a European mission. Technological sovereignty in space starts with
> the chips on board.
>
> Europe already has every piece needed to build one: the world's most
> advanced lithography, world-class semiconductor research, chip manufacturing
> in Dresden and Crolles, a long space-electronics heritage and
> radiation-test facilities across the continent. HERCOSS Exxo A1 brings
> these strengths together. My long-term vision is to manufacture HERCOSS
> Exxo chips in Bremen, at the heart of European space industry, on a line
> built around ASML's most advanced lithography. The path is staged: first
> test chips at European foundries and research centres, then each
> successful phase builds the case, the team and the partnerships for a
> Bremen site.
>
> — **Adrian Irineo Hernandez Cossio**, founder of Hercoss

## Explore the chip {#explore}

Click any block to see what it does and why it is there.

{{< a1explorer >}}

## Architecture

Everything hangs off one 512-bit network-on-chip: the sixteen processors, the
FPGA fabric, the AI array, memory and all I/O.

{{< fig "a1-architecture.svg" "Top-level architecture of the HERCOSS Exxo A1. Conceptual; not to scale." >}}

{{< detalle "What is an FPGA SoC?" >}}
A processor runs software: the operating system, the mission logic, the
communications. An FPGA is hardware that can be rewired after it is built,
used for the jobs software is too slow for, such as handling instrument data
in real time. An FPGA SoC puts both on one piece of silicon, and lets software
and custom hardware exchange data at full speed instead of across slow
board-level wiring.
{{< /detalle >}}

## What is on the die

The A1 carries the interfaces a spacecraft or an edge system needs, so it
replaces interface chips instead of adding to them. Low-speed peripherals
share a 160-pin multiplexed pool, so each mission picks its mix without a
larger package.

{{< a1io >}}

## Up to ~2 Tbps of Ethernet

A pool of 72 serial transceivers serves Ethernet, PCIe and the FPGA fabric.
Eight 224 Gb/s PAM4 lanes carry a 1.6 Tb/s Ethernet port; 64 lanes at
32 Gb/s carry another 400G of Ethernet and three PCIe Gen5 x16 links.

{{< fig "a1-serdes.svg" "How the 72 transceiver lanes are shared. Design target." >}}

## Self-healing lockstep

Any two neighbouring cores can be joined at boot into one fault-tolerant core,
and the transient faults it catches are **corrected automatically**: no
processor reset, no checkpoint, no recovery software. Conventional lockstep
processors only detect the error and then reset or hand the problem to
software.

- **Measured on FPGA:** 24 faults injected per run, half of them into the core
  that drives the bus. 24 corrected, 0 corrupted results, nothing wrong
  reached the bus. The same program without lockstep produced corrupted
  results in 12 of 24 rounds.
- **No measurable cost:** 24 recoveries, 8.15 ms against 8.18 ms.
- **Flexible per mission phase:** 16 independent cores during a quiet cruise,
  8 self-healing cores during a solar event or a critical manoeuvre.
- **Built-in fault injection** lets customers and test labs exercise the
  mechanism in the field, which supports qualification.

{{< detalle "Which core was this measured on?" >}}
On the A1 SoC emulation with its earlier 64-bit cores. Carrying the lockstep,
the error-correcting register file and the cache parity over to the
RV128IMAC is one of the open items listed below.
{{< /detalle >}}

## Software model

One Exxo A1 can replace up to sixteen separate flight computers.

- **16 isolated domains by default:** one core per Linux instance, each with
  its own memory, interrupts, timer and peripherals, enforced in hardware.
- **AMP and SMP mixed freely:** for example one 4-core SMP Linux for payload
  processing next to 12 single-core domains for platform functions.
- **Domain control:** a manager domain can stop, reload and restart any other
  domain while the rest keep running, the basis for fault recovery and
  in-orbit software updates.
- **Fast inter-core communication:** direct core-to-core calls in 1.36 µs,
  alongside standard Linux remoteproc / RPMsg.
- **Open toolchain:** standard RISC-V GCC, mainline Linux and OpenSBI in
  64-bit mode; real-time systems FreeRTOS, Zephyr and RTEMS.
- **Planned tooling:** a GUI and TCL/bash flow to partition the chip, generate
  device trees and build FPGA bitstreams.

## One design, two versions

Both versions come from the same mask, so the radiation-hardened part shares
its development cost with the commercial volume part.

{{< a1variants >}}

## Full specification {#specs}

Every line carries its status. Filter to see what is already validated, what
is in design, and what is still pending.

{{< a1specs >}}

## Proof so far

| What | Evidence | Status |
|---|---|---|
| RV128IMAC processor core | Linux 6.6 SMP, 214 / 214 board tests, CoreMark 1.85 / MHz | Validated on FPGA |
| Core-to-core calls | 1.36 µs round trip from a Linux program (an empty system call: ~6.8 µs) | Validated on FPGA |
| Self-healing lockstep | 24 / 24 injected faults corrected, 0 corrupted results | Validated on FPGA (earlier 64-bit core) |
| A1 SoC infrastructure | Cluster, crossbar, coherence, mailbox, interrupt controller, IOPMP; two isolated Linux domains | Validated on FPGA |
| Cache and prefetch tuning | 64 KiB I-cache: −69 % misses in Linux; prefetcher: cold copy −32 %, cold read −39 % | Measured on FPGA (earlier 64-bit core) |
| Own eFPGA fabric | Runs inside an AMD Versal; runtime reconfiguration self-test passed | Validated on FPGA |
| Fabric test chip, IHP SG13G2 130 nm | Official precheck passed: LVS, antenna and timing clean | GDS ready for tape-out |
| Fabric tile area | 56,222 µm² per tile of 8 LUT4, 616 configuration bits | Measured from layout |
| DICE configuration cell | 31.2 µm², DRC and LVS clean; holds a 1 pC strike (a standard cell flips at 8.3 fC) | Layout signed off; SEU in simulation |
| Space IP | SpaceWire, MIL-STD-1553, CAN, UART, PTP 802.1AS | Validated on FPGA |
| General peripheral IP | I²C, I³C, SPI, SD | Validated on FPGA |
| Network IP | 25G and 40G Ethernet MAC/PCS against a commercial NIC, 1-hour soak with zero errors; 103 Gb/s SerDes link | Validated on FPGA |
| Post-quantum crypto | ML-KEM and ML-DSA accelerators | Validated on FPGA |

## Still pending

An honest list of what has to happen before the A1 is a chip:

- **Scale the processor cluster** from the two-CPU prototype to sixteen cores,
  including the core-to-core call network.
- **Space hardening of the RV128IMAC:** port the self-healing lockstep, the
  error-correcting register file and cache parity; grow the caches to the A1
  sizes.
- **Network-on-chip, L2 caches and DDR controllers:** RTL still to be written.
- **Analog and mixed-signal blocks:** the 224G PAM4 and 32G NRZ SerDes, PCIe
  Gen5 and DDR physical layers, PLLs and the sigma-delta ADC front ends, to be
  designed in-house or licensed.
- **Ethernet above 40G:** 100G to 1.6T MACs and PCS; the 25G and 40G versions
  are proven.
- **AI array and DSP cores:** architecture defined, RTL pending.
- **Remaining peripherals:** PCIe and MIPI controllers in development.
- **Scale the FPGA fabric** from the 130 nm test-chip tile to 500,000 LUTs.
- **Chip implementation flow:** memory macros, test logic (DFT), timing and
  area on the production node.
- **Package, radiation testing and space qualification.**

## Roadmap

The project is in phase F1. Each phase ends at a go/no-go gate, so the
investment can be staged. Dates per phase are still open.

{{< a1roadmap >}}

## Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Access to and cost of an advanced node in Europe | Large mask-set cost, export control and allocation | Several European foundry candidates; node-independent architecture; one mask for both versions; EU Chips Act funding |
| Analog and mixed-signal IP | 224G PAM4 SerDes, PCIe Gen5 and DDR PHYs are hard to design and verify | Proven digital layers in-house; license silicon-proven PHYs where it lowers risk; measure on the F2 shuttle |
| Radiation behaviour of an advanced node | Advanced nodes show different single-event effects than planar processes | DICE configuration cells, self-healing lockstep, ECC, triple-redundant controller; 600 krad test target (2× margin) |
| Scaling the fabric to 500K LUTs | Tile and routing area may exceed the 85–100 mm² budget | Area tracked per block; the test chip measures the real tile cost first |
| CPU clock on the production node | Not yet fixed; it sets the performance headline | Measured on the F2 shuttle before the production commitment |
| Software and tool ecosystem | Customers need compilers, Linux and FPGA tools from day one | Standard RISC-V GCC, mainline Linux and OpenSBI already running; FPGA flow on open-source FABulous / LibreLane |
| Qualification time and cost | Space qualification is long and expensive | The same mask as the COTS part spreads the cost; built-in fault injection supports testing |
| Verification escapes | A bug found after tape-out is expensive | Instruction-by-instruction lockstep against reference models, mutation testing, Linux boot as a regression test |
| Own manufacturing site in Bremen | A complete advanced fab costs in the order of billions of euros | Staged: first chips at existing European foundries; Bremen as a long-term goal with public and industrial partners, starting with steps such as test, packaging or a pilot line |
| Team size | Hercoss is at founder stage | Phase funding builds the team; documented, automated verification flow |

## Build it with us

Hercoss is looking for partners to take the Exxo A1 from a working prototype
to the chip that flies on Europe's next missions:

- **Investors and public programmes**, including the EU Chips Act, ESA
  instruments and the State of Bremen, to finance the next phases.
- **European foundries and research centres**, to manufacture the test chips
  and the first production dies on European soil.
- **Lithography partners**, for a future HERCOSS Exxo manufacturing line in
  Bremen.
- **Packaging and test partners**, for the commercial flip-chip and the
  radiation-hardened ceramic package.
- **Radiation-test facilities and space agencies**, including ESA, to qualify
  the chip for flight.

Write to [adrian@hercoss.com](mailto:adrian@hercoss.com). A detailed technical
brief is available for investors and partners on request.
