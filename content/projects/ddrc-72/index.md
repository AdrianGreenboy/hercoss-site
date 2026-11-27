---
title: "DDRC_72 — the self-healing DDR4 memory controller"
layout: article
weight: 7
estado: "RTL v0.1 complete · Verified in simulation · Memory controller of the Exxo A1"
hidecover: true
seotitle: "DDRC_72 — self-healing radiation-tolerant DDR4 memory controller for space — Hercoss"
summary: "Memory that survives the radiation environment it flies in. DDRC_72 is Hercoss's own 72-bit DDR4 memory controller for the HERCOSS Exxo A1: it keeps data correct when a whole memory chip dies, repairs faults on its own, and in the radiation-hardened variant heals its own logic after a latch-up. Verified in simulation: 0 data errors, 0 JEDEC timing violations."
datos:
  - "72-bit DDR4, up to 128 GiB"
  - "Survives a dead memory chip"
  - "Self-healing logic (rad-hard)"
  - "0 data errors in simulation"
---

{{< stats >}}
{{< stat "128 GiB" "of DDR4 behind one 72-bit controller: 64 data bits + 8 error-correction bits" >}}
{{< stat "1 chip" "can fail completely and the data still comes back correct" >}}
{{< stat "3,776" "error-correction test cases, including dead-chip and poison cases: 0 errors" >}}
{{< stat "0" "data errors and 0 JEDEC timing violations in full-system simulation" >}}
{{< /stats >}}

## What it is

DDRC_72 is the **DDR4 memory controller of the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/)**,
written in-house in VHDL-2008 and aimed at tape-out. It drives a 72-bit
memory bus (64 data bits plus 8 error-correction bits) and supports up to
**128 GiB** of DRAM. It connects to the chip's [NOC_512](/projects/noc-512/)
network-on-chip through a full AXI4 interface.

{{< fig "ddr-fit.svg" "Every processor, the FPGA fabric and all I/O reach external memory through NOC_512 and DDRC_72. Concept." >}}

**One design, two products.** The same RTL builds a **COTS** variant for
commercial and New-Space missions and a **radiation-hardened** variant for
GEO, deep-space and interplanetary missions. The choice is a build option,
not a second design.

## Why memory is the weak spot in space

A satellite computer keeps everything it is doing in DRAM, and in space DRAM
is the component most exposed to radiation:

- **Single particles flip bits.** A cosmic ray or a solar proton passes
  through a memory cell and a 0 becomes a 1.
- **Whole memory chips can fail.** Not one bit, but every bit a chip holds.
- **Heavy ions can trigger latch-up** in the controller itself: a short
  circuit that, left alone, burns the silicon.
- **In the worst case, a particle physically destroys circuitry.**

Most controllers on the market either correct a single flipped bit, or rely
on software to notice problems after the fact. **DDRC_72 is designed to keep
the memory available on its own.**

## What DDRC_72 does differently

{{< aviso "Patent process in progress" >}}
The innovations in this section are in the patent process. We describe what
they achieve; how they work will be published once that process allows it.
{{< /aviso >}}

### It survives a dead memory chip

A 72-bit word is spread over many DRAM chips. If one of them dies
completely, DDRC_72 still returns correct data, transparently. This is
chipkill-class protection: it corrects the complete failure of one memory
chip, and then a known-dead chip plus one more error. Anything beyond that
is marked with an exact **poison** marker, so **corrupted data is never
passed on silently.**

{{< fig "ddr-chipkill.svg" "One memory chip out of the word fails completely; the controller still delivers correct data. Concept." >}}

### It knows a radiation hit from a broken part

A random particle hit and a failing piece of hardware look alike at first.
DDRC_72 tells them apart and repairs each class automatically: a hit is
cleaned up on the spot, a DRAM row that keeps failing is retired and
replaced by a spare, and a dead chip is treated as erased so the rest of the
word stays protected. No software has to notice first.

### It cleans faster when the Sun is angry

Memory has to be read and cleaned regularly before hits accumulate. DDRC_72
**adapts how aggressively it cleans to the radiation level it measures**,
and cleans up instantly around every detected hit. When space is calm, the
bandwidth goes to the mission.

{{< fig "ddr-scrub.svg" "Illustration of the behaviour: cleaning effort follows the radiation environment. Not to scale; no flight data." >}}

### It heals its own logic after a latch-up

In the radiation-hardened variant the controller **heals itself.** After a
latch-up or a destructive particle strike in part of its own logic, it
isolates the damage, switches over to spare hardware **without losing
data**, and keeps running. Parts that are destroyed for good are retired
permanently. It degrades gracefully instead of failing, and reports its
health to software at every step.

### One design, COTS and rad-hard

Commercial and radiation-hardened products come from the same verified RTL.
Customers who start on the COTS A1 move to the rad-hard A1 without changing
their software or their memory system.

## Key specifications

| | |
|---|---|
| Memory | DDR4, designed to JEDEC DDR4 (JESD79-4); registered DIMMs (RDIMM) and stacked 3DS devices; x4 and x8 devices |
| Width and capacity | 72-bit bus (64 data + 8 ECC); up to 128 GiB; 8 logical ranks |
| Error correction | Symbol-based, chip-level: corrects the failure of one complete memory chip, and a known-dead chip plus one more error; exact poison marking |
| Performance | JEDEC timing engine for all DDR4 constraints; refresh management; reordering scheduler (out-of-order command issue) for bandwidth |
| Reliability engine | Patrol scrubbing adapted to the radiation level; instant clean-up around every hit; fault classification with automatic repair (row sparing, chip erasure); DRAM functional-interrupt recovery |
| Rad-hard variant | Spare controller hardware with automatic latch-up isolation, recovery and return to service; permanent retirement of destroyed parts; health register |
| Interfaces | Full AXI4 to NOC_512; AXI4 configuration registers; DFI-style PHY interface |
| Implementation | VHDL-2008, in-house; one RTL for COTS and rad-hard, chosen at build time |

Frequency and bandwidth figures will be published once FPGA synthesis
results exist.

## Development status

{{< fig "ddr-status.svg" "Where DDRC_72 stands on 26 November 2026." >}}

| Milestone | Status |
|---|---|
| RTL complete: controller, error correction, reliability engine, rad-hard supervisor, self-test | **Done** · v0.1 |
| Error-correction unit test: 3,776 cases, including dead-chip and poison cases | **Done** · passed, 0 errors |
| Full-system simulation: DRAM initialisation, random traffic, partial writes, injected bit flips, a dead memory chip, a failing row with automatic spare | **Done** · 2,727 writes and 4,120 reads verified, 0 data errors, 0 JEDEC timing violations |
| Rad-hard simulation: upset, latch-up and destroyed hardware in the controller's own logic | In progress |
| FPGA synthesis on AMD Versal (area, frequency) | Next |
| Silicon validation on the TE0950 board, controller in the loop with a DRAM stand-in | Planned |
| Real DDR4 PHY and DRAM, radiation testing | Future, with the A1 test chip |

*All results above are verified in simulation. DDRC_72 has not yet run on
silicon, has no flight heritage, and is not qualified or certified. It is
designed to JEDEC DDR4; compliance has not been tested.*

## Roadmap

1. **FPGA synthesis** on AMD Versal: first area and frequency figures.
2. **Silicon self-test on the TE0950 board**, with the controller in the loop
   and a DRAM stand-in.
3. **A1 test chip with a real DDR4 PHY** and real memory.
4. **Radiation campaign.**

## Part of the Hercoss IP family

DDRC_72 joins the [Hercoss IP cores](/projects/ip-core-family/) that make up
the Exxo A1: the [RV128IMAC](/projects/rv128imac/) processor, the
[NOC_512](/projects/noc-512/) network-on-chip and the
[1.6 Tb/s Ethernet](/projects/eth-1t6/) core. Like them, it is designed in
Europe, in-house: a memory subsystem for space that does not depend on US
export-controlled parts.

Interested in the HERCOSS Exxo A1 or in DDRC_72?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[Invest in Hercoss →](/invest/)
