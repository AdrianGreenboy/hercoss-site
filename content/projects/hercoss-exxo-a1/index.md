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
seotitle: "HERCOSS Exxo A1 — Radiation-hardened RISC-V FPGA SoC for space"
product: "Space-grade FPGA SoC"
---

{{< aviso "Patent process in progress" >}}
Several innovations of the Exxo A1 are in the patent process: among them the
self-healing lockstep, the core fabric where cores and accelerators call each
other directly, the self-healing network on chip, the error-correction
receiver of the 1.6T Ethernet core and the self-healing memory controller.
This page shows what they achieve; how they work will be published once that
process allows it.
{{< /aviso >}}

### Proven in November 2026

{{< stats >}}
{{< stat "129 MB/s" "hardware SHA-3 from Linux, no driver, on our own 128-bit RISC-V core" >}}
{{< stat "≈0.6 µs" "for the network on chip to heal itself around a dead switch, 405,522 times in one hour" >}}
{{< stat "312 bn" "Ethernet frames in one hour through our own 1.6T link layer, zero errors" >}}
{{< stat "1 chip" "of memory can die and the data still comes back correct (DDRC_72, simulation)" >}}
{{< /stats >}}

Each result has its own page: [RV128IMAC](/projects/rv128imac/) ·
[NOC_512](/projects/noc-512/) · [1.6T Ethernet](/projects/eth-1t6/) ·
[DDRC_72](/projects/ddrc-72/) · [Onboard AI](/projects/onboard-ai/) ·
[RF](/projects/rf/) · [IP cores](/projects/ip-core-family/)

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

Everything hangs off one 512-bit network-on-chip, Hercoss's own
[NOC_512](/projects/noc-512/): the sixteen processors, the FPGA fabric, the
AI array, memory and all I/O. On FPGA silicon it has carried 3.19 trillion
AXI4 transfers in nine one-hour runs without a single error, and it repairs
itself around a failed switch in about 0.6 µs, measured in silicon over
405,522 failures in one hour without losing a word.

{{< fig "a1-architecture.svg" "Top-level architecture of the HERCOSS Exxo A1. Conceptual; not to scale." >}}

{{< detalle "What is an FPGA SoC?" >}}
A processor runs software: the operating system, the mission logic, the
communications. An FPGA is hardware that can be rewired after it is built,
used for the jobs software is too slow for, such as handling instrument data
in real time. An FPGA SoC puts both on one piece of silicon, and lets software
and custom hardware exchange data at full speed instead of across slow
board-level wiring.
{{< /detalle >}}

## From RTL to physical layout

The Exxo A1 is no longer only a block diagram. Its design has started the
chip flow: the same VHDL that runs on our FPGA boards has been synthesised
to standard cells, placed and routed, producing the physical layout below.
Click either image to open it at full resolution.

{{< layoutshots "Physical layout of an Exxo A1 core block. The yellow blocks along both sides are on-chip memories; the centre is placed-and-routed logic." "Close-up of the same layout: individual standard cells and the metal wiring between them." >}}

*Layout renders from the chip design flow. The chip has not been fabricated
yet; area, clock and power on silicon are still to be measured.*

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
- **Fast inter-core communication:** the Hercoss [core fabric](/projects/rv128imac/#the-hercoss-core-fabric-a-ring-built-for-calls),
  a ring where cores and accelerators call each other directly: 1.35 µs from
  a Linux program, fair at full load, with service priority per station set by software at run time, alongside standard Linux remoteproc /
  RPMsg.
- **Open toolchain:** standard RISC-V GCC, mainline Linux and OpenSBI in
  64-bit mode; real-time systems FreeRTOS, Zephyr and RTEMS.
- **Planned tooling:** a GUI and TCL/bash flow to partition the chip, generate
  device trees and build FPGA bitstreams.

## One design, two versions

Both versions come from the same mask, so the radiation-hardened part shares
its development cost with the commercial volume part.

{{< a1variants >}}

**Next: the HERCOSS Exxo A1-RF.** A radio variant of the A1, with a radio
front end on the same chip, built on Hercoss's RF digital front-end IP that
already runs on FPGA silicon. It is in development.
[Read about RF and the A1-RF →](/projects/rf/)

## Full specification {#specs}

Every line carries its status. Filter to see what is already validated, what
is in design, and what is still pending.

{{< a1specs >}}

## Proof so far

| What | Evidence | Status |
|---|---|---|
| RV128IMAC processor core | Linux 6.6 SMP, 214 / 214 board tests, CoreMark 1.85 / MHz; SHA-3 from a 33 to a 129 MB/s stream in five days | Validated on FPGA |
| Core-to-core calls | 1.35 µs round trip from a Linux program (an empty system call: 6.6 µs) | Validated on FPGA |
| Core fabric for 16 cores | 17-station ring at full load on silicon (one real core, the SHA-3 accelerator, 15 traffic stations): ~9 M messages per run, 0 errors, 0 lost, 0 duplicated; service priority set by software at run time, critical job 36 % sooner on a saturated ring; ring addresses 64 hardware threads | Validated on FPGA (17 stations); 16 real cores pending |
| Self-healing lockstep | 24 / 24 injected faults corrected, 0 corrupted results | Validated on FPGA (earlier 64-bit core) |
| NOC_512 network-on-chip | Nine one-hour runs at full load: 3.19 trillion AXI4 transfers, 0 errors; 375 MHz unprotected, 265 MHz with every protection layer | Validated on FPGA |
| NOC_512 fault tolerance | 10.5 M errors corrected live; state corrupted every cycle for 159 M cycles with a result identical to a fault-free run; 199 M words/s rebuilt with none lost; 14 self-repairs in ~10 µs, 0 words lost | Validated on FPGA (fault injection, not beam-tested) |
| NOC_512, 5 × 5 chip plan | 7.73 Tb/s on 19 protected circuits; 6 single-node failures under full traffic with 0 words lost | Simulation |
| NOC_512 self-healing | In silicon: a switch killed 405,522 times in one hour under full traffic, every repair in 148–156 cycles (≈0.6 µs), 0 of 160 bn+ words lost; full chip in simulation: 65 of 66 lanes restored; self-healing logic formally verified (9 / 9 safety rules) | Validated on FPGA (2 × 2); formally verified; chip scale in simulation |
| DDRC_72 memory controller | Full-system run with injected bit flips, a dead memory chip and a failing row: 2,727 writes and 4,120 reads verified, 0 data errors, 0 JEDEC timing violations | Simulation |
| A1 SoC infrastructure | Cluster, crossbar, coherence, mailbox, interrupt controller, IOPMP; two isolated Linux domains | Validated on FPGA |
| Cache and prefetch tuning | 64 KiB I-cache: −69 % misses in Linux; prefetcher: cold copy −32 %, cold read −39 % | Measured on FPGA (earlier 64-bit core) |
| Own eFPGA fabric | Runs inside an AMD Versal; runtime reconfiguration self-test passed | Validated on FPGA |
| Fabric test chip, IHP SG13G2 130 nm | Official precheck passed: LVS, antenna and timing clean | GDS ready for tape-out |
| Fabric tile area | 56,222 µm² per tile of 8 LUT4, 616 configuration bits | Measured from layout |
| DICE configuration cell | 31.2 µm², DRC and LVS clean; holds a 1 pC strike (a standard cell flips at 8.3 fC) | Layout signed off; SEU in simulation |
| Space IP | SpaceWire, MIL-STD-1553, CAN, UART, PTP 802.1AS | Validated on FPGA |
| General peripheral IP | I²C, I³C, SPI, SD | Validated on FPGA |
| Network IP | 25G and 40G Ethernet MAC/PCS against a commercial NIC, 1-hour soak with zero errors; 103 Gb/s SerDes link | Validated on FPGA |
| NPU | INT8 CNN inference: 0.333 ms per image, ~3,000 inferences/s | Validated on FPGA |
| AOCS accelerator | Model-predictive attitude control in hardware, 70 × 70 float32, bit-identical to simulation | Validated on FPGA |
| RF digital front-end | DDC and DUC chains, bit-exact in six domains | Validated on FPGA |
| Post-quantum crypto | ML-KEM and ML-DSA accelerators | Validated on FPGA |
| Hardware SHA-3 / SHAKE | 129 MB/s from a Linux process without a driver, ~140× software on the same CPU | Validated on FPGA |
| 1.6TbE link layer (ETH_1T6) | MAC + PCS + RS(544,514) FEC + lane alignment: 312 billion frames in one hour, 0 errors; 1–15 symbol errors per codeword corrected; error bursts repaired at full speed; bit-exact to IEEE 802.3 200G/400G/800G and P802.3dj vectors | Validated on FPGA (scaled: one FEC flow, 8 lanes) |

## Still pending

An honest list of what has to happen before the A1 is a chip:

- **Scale the processor cluster** from the two-CPU prototype to sixteen cores.
  The core fabric addresses 64 hardware threads, and a 17-station ring already runs at full load on silicon with one real core; sixteen real cores need a larger device.
- **Space hardening of the RV128IMAC:** port the self-healing lockstep, the
  error-correcting register file and cache parity; grow the caches to the A1
  sizes.
- **Network-on-chip:** the 25-node network and the hardened self-healing
  logic on a larger FPGA (both pass in simulation), formal verification of
  the whole network (started), faster recovery when two switches fail at
  once, and integration with the RV128IMAC cores and real peripherals.
- **L2 caches:** RTL still to be written.
- **DDR4 memory controller ([DDRC_72](/projects/ddrc-72/)):** RTL v0.1
  complete; verified in simulation with 0 data errors and 0 JEDEC timing
  violations, including a dead memory chip and a failing row repaired
  automatically. FPGA synthesis is next.
- **Analog and mixed-signal blocks:** the 224G PAM4 and 32G NRZ SerDes, PCIe
  Gen5 and DDR physical layers, PLLs and the sigma-delta ADC front ends, to be
  designed in-house or licensed.
- **1.6TbE controller ([ETH_1T6](/projects/eth-1t6/)):** the complete
  link layer (MAC, PCS, RS(544,514) FEC, lane alignment) runs on FPGA
  silicon in a scaled configuration (one FEC flow, 8 lanes): 129 Gb/s,
  312 billion frames in one hour with zero errors, 1–15 symbol errors per
  codeword corrected, error bursts repaired at full speed. The full
  structure (two FEC flows, 16 lanes) is verified in simulation and needs a
  larger device; connection to real transceivers is next.
- **AI Engine and DSP cores:** architecture defined, RTL pending; the NPU
  and the AOCS accelerator are already validated as building blocks.
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

**Want to invest?** [Join the Hercoss family →](/invest/): register your
interest and follow the chip from inside, in the Investor Hub.
