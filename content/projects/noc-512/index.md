---
title: "NOC_512 — the self-healing network on chip of the Exxo A1"
layout: article
weight: 3
estado: "Self-healing validated in silicon and formally verified · 5 × 5 chip plan in simulation"
hidecover: true
seotitle: "NOC_512 — self-healing 512-bit network-on-chip for space, validated in silicon — Hercoss"
summary: "A 512-bit network on chip that carries guaranteed high-bandwidth streams and repairs itself around a failed switch in about 0.6 µs, with no software and no lost data. Validated in silicon: 405,522 switch failures in one hour, more than 160 billion data words, none lost or damaged."
datos:
  - "Self-heals in ≈0.6 µs, in silicon"
  - "405,522 failures, 0 words lost"
  - "9 / 9 safety rules formally verified"
  - "3.19 trillion transfers, 0 errors"
  - "7.7 Tb/s chip plan"
---

{{< stats >}}
{{< stat "≈0.6 µs" "for the network to repair itself around a dead switch, measured in silicon" >}}
{{< stat "405,522" "switch failures in one hour under full traffic, every one handled" >}}
{{< stat "0" "of more than 160 billion data words lost or damaged" >}}
{{< stat "3.19 T" "AXI4 transfers on silicon in nine one-hour runs, without a single error" >}}
{{< /stats >}}

{{< aviso "Patent analysis in progress" >}}
This page reports what NOC_512 achieves. How its protection and self-healing
mechanisms work is not published while a patent analysis is in progress.
{{< /aviso >}}

## The short version

Every large chip is a city of blocks: processor clusters, Ethernet, PCIe, AI
engines, radio converters, memory. The network on chip is its road system.
**If a road closes, the city stops.**

**NOC_512** is the network on chip of the
[HERCOSS Exxo A1](/projects/hercoss-exxo-a1/). It moves data 512 bits at a
time, carries ordinary memory traffic and guaranteed high-bandwidth streams
side by side, and protects both against faults at every level.

This month it passed its hardest test yet, **in silicon**. A switch of the
network was switched off and on again **more than 400,000 times in one hour,
under full traffic**. Every time, the network restored the affected data lane
**by itself in about 0.6 microseconds**, with no software, no route tables
and no central controller, and went back to its original configuration when
the switch returned. **Not one of more than 160 billion data words was lost
or damaged.**

## What changed on 26 November 2026

**In one day, the self-healing network went from simulation to silicon to
formal verification.**

{{< fig "noc-day.svg" "One day: simulation predicted 149 cycles, silicon measured 149 cycles, a one-hour soak confirmed it 405,522 times, and a model checker found no way to break it." >}}

- **First silicon run.** A switch was disabled under full traffic on the test
  board. The network restored the affected lane by itself in **149 clock
  cycles (0.58 µs)**, exactly the figure predicted by simulation, and returned
  to its original configuration when the switch came back. No data lost.
- **One-hour endurance test in silicon.** **405,522 switch failures** with
  random timing, every repair in **148 to 156 clock cycles**. More than **160
  billion data words, none lost or damaged.**
- **Formal verification.** A mathematical model checker explored *every
  possible input sequence* to one switch and found **no way to break any of
  its nine safety rules** within the checked depth.
- **Full-chip regression.** The 25-node A1 network in simulation gives the same
  results as before: zero words lost with one failed switch.
- **Honest limits.** The hardened version of the self-healing logic does not
  fit the small test FPGA together with everything else, so silicon ran the
  basic version. The hardened version is verified in simulation and formally.

## The headline result: self-healing, in silicon

### The test

A 2 × 2 version of NOC_512 runs on an AMD Versal FPGA (Trenz TE0950,
VE2302) at **255 MHz**, with memory traffic on the packet plane and two
stream circuits on the stream plane, one of them protected. A test hook
**kills the stream switch of one node**: it stops sending anything, exactly
like a switch that has failed.

Nobody tells the network which switch failed. No software reacts. No backup
route is prepared.

{{< fig "noc-heal-concept.svg" "Self-healing in three steps: normal route, detour found by the mesh itself, automatic return. Conceptual drawing." >}}

### What happens

{{< fig "noc-heal-withwithout.svg" "Without self-healing, the stream survives but runs without a safety net. With it, the safety net is back in under a microsecond." >}}

| | Without self-healing | With self-healing |
|---|---|---|
| The lane through the failed switch | Stays dead for as long as the switch is dead | **Alive again after 148–156 clock cycles (≈ 0.6 µs)** |
| Data words the protection has to rebuild | **191 million per second** | **None** once the lane is back |
| Words lost | 0 (protection covers it) | **0** |
| When the switch comes back | – | The network returns to its original configuration by itself |

Without self-healing, the stream survives only because its protection
rebuilds every word. That works, but the stream is running without a safety
net: one more fault and data is lost. **With self-healing, the safety net is
restored in under a microsecond.**

### One hour, 405,522 failures

A single success proves the idea works. To show it is reliable, the switch
was killed and revived again and again for one hour, with random timing,
from microseconds to tens of milliseconds, including failures that strike
while the network is still repairing the previous one.

{{< fig "noc-heal-soak.svg" "The one-hour silicon soak at 255 MHz, every counter checked at the end." >}}

| One-hour silicon soak | |
|---|---|
| Switch failures | **405,522** |
| Repairs measured | 324,687, **all between 148 and 156 clock cycles** (mean 148.8) |
| Failures that struck while the repair was still in place | 80,835: the lane never even went down |
| Return to the original configuration checked | 6,336 times, 6,336 correct |
| Stream data words | More than **160 billion**, **none lost, none damaged** |
| Memory traffic alongside | **24.8 billion** transaction batches, **zero errors** |

### Practically deterministic

{{< fig "noc-heal-time.svg" "How long a lane stays down after its switch dies. Self-healing measured in silicon; prepared backup routes from full-chip simulation." >}}

| Repair time (clock cycles) | Repairs |
|---|---|
| 0 – 150 | 311,774 |
| 151 – 200 | 12,913 |
| More than 200 | **0** |

A spread of eight clock cycles over hundreds of thousands of events, and no
long tail. The same 149 cycles were measured in RTL simulation before the
first silicon run: **the hardware does exactly what the model predicted.**

### Why this is different

Most fault-tolerant networks repair themselves with help: software that
notices the failure, tables prepared in advance, a controller that decides.
**NOC_512 needs none of them.**

{{< fig "noc-ideas.svg" "Four things the network does not need in order to heal itself." >}}

- **No software in the loop.** The repair is over before a processor would
  even have noticed an interrupt.
- **No route tables.** Nothing has to be prepared in advance for each
  possible failure.
- **No central controller.** There is no single block whose failure would
  stop the repair itself.
- **No knowledge of what failed.** The network does not need to be told
  which switch is gone.

### Formally verified, not only tested

Tests show what happens in the cases you try. **Formal verification checks
every possible case, up to a stated depth.** A model checker explored every possible input
sequence to the self-healing logic of one switch (any traffic, any neighbour
behaviour, any configuration) and found no way to break any of its nine
safety rules within that depth.

{{< fig "noc-formal.svg" "Formal verification of the self-healing logic of one switch, by model checking within the stated depths." >}}

- **Nine safety rules, all holding** for every input sequence: 32 clock cycles
  deep with every waiting time reachable, 24 with the real ones.
- **The hardened version behaves exactly like the basic one**, with faults
  injected at will, checked 16 clock cycles deep.
- **Next:** the whole network. That the switches together never form a loop,
  never deliver a circuit's data to the wrong destination, and always return
  home. This work has started.

{{< detalle "Clock cycles, not microseconds: what does this mean for the chip?" >}}
The repair takes about 149 clock cycles whatever the clock. At 255 MHz on
the FPGA that is 0.58 µs; at the gigahertz-class clocks of a dedicated chip
it would be a fraction of that. In the 2 × 2 test system the self-healing
logic of all four nodes takes about 10,300 LUTs, roughly 9 % of the test
system. Its hardened version is verified in simulation; it does not fit this
small device together with everything else, and waits for a larger one.
{{< /detalle >}}

## Why a network on chip matters

In a modern system-on-chip, raw compute is rarely the bottleneck. **Moving
data is.** A 1.6 Tb/s Ethernet port, a PCIe Gen5 x16 link, an AI array and an
RF front end all need to exchange data at the same time, without one slowing
the others down, and without the whole chip failing when one part
misbehaves.

For a chip meant for long space missions, that last point is decisive. Over
ten years in orbit or in deep space, parts of a chip will be hit by energetic
particles. A bit flips; a switch locks up. On Earth, the same reliability
matters for data centres, telecom and any system that cannot be stopped for
repair. **A network that keeps its data intact and works around its own
failures is what lets the rest of the chip keep running.**

## What NOC_512 is

Two networks in one, sharing the same mesh of nodes:

| | Packet plane | Stream plane |
|---|---|---|
| Carries | Memory reads and writes between any two blocks (AXI4) | Continuous high-bandwidth streams: Ethernet, PCIe, AI, RF, converters |
| How | Packets find their way hop by hop | Lanes reserved end to end: guaranteed bandwidth, constant latency |
| Width | 512-bit data, with protection | 512-bit lanes, 8 lanes per link in the A1 |

{{< fig "noc-planes.svg" "One mesh, two planes. Conceptual." >}}

**Built for the A1 chip:** a 5 × 5 mesh of 25 nodes connecting four processor
clusters (16 [RV128IMAC](/projects/rv128imac/) cores), six FPGA fabric ports,
three PCIe and three Ethernet ports (including
[1.6 Tb/s](/projects/eth-1t6/)), three AI array ports, the ADC and RF
converters, two external memory ports ([DDRC_72](/projects/ddrc-72/)), and
the boot, crypto and slow-peripheral node.

**Protected at every level:**

- **End-to-end error correction** on every packet: single-bit errors
  corrected, double-bit errors detected.
- **Fault-tolerant control state** in routers, links, bridges and
  configuration: internal state corrupted on every clock gives exactly the
  same result as a run with no faults.
- **Protected memories** inside the bridges.
- **Protected streams:** a cut path or flipped bits cost no data.
- **Automatic re-routing** onto prepared backup routes, with automatic return
  when the original path works again.
- **New: self-healing.** The mesh finds its own way around a switch that has
  failed.
- **It tells the truth when it cannot cope:** every lost word is counted and
  none is ever delivered wrong.

### Faults on purpose, on silicon

{{< fig "noc-faults.svg" "Earlier fault-injection runs on the FPGA board while the network carried traffic." >}}

## The price of protection, published

Each protection layer was taken to the board on its own and run for one hour
at full load before the next one was added. Every run: **zero errors.**

{{< fig "noc-ladder.svg" "One-hour runs on an AMD Versal VE2302 (Trenz TE0950). Clock and AXI4 transfers per hour." >}}

Every silicon result is measured on the same small board, the only one
available today. Each new protection layer meant fitting more logic into the
same device, which is why the clock moved from 375 MHz for the bare network
to 255 MHz with every protection and the self-healing logic on board. **In
the A1 chip, this logic is dedicated silicon, not FPGA fabric.**

{{< detalle "What do the FPGA clock figures mean for the chip?" >}}
They are measured on an FPGA, not on the Exxo A1. The chip's clock depends
on the production node; the A1 targets about 1.5 GHz for the network. On the
FPGA, 1.6 Tb/s on a single 512-bit link would need 3.1 GHz, which is why bulk
traffic is spread over several stream circuits in parallel.
{{< /detalle >}}

{{< fig "noc-why.svg" "Clock needed for 1.6 Tb/s on one 512-bit link, against the ceilings measured on the FPGA." >}}

## The full chip, in simulation

{{< fig "noc-a1plan.svg" "Traffic plan of the Exxo A1 on the 5 × 5 mesh, run in simulation with the complete network." >}}

On the 25-node A1 plan, in RTL simulation:

- **19 stream circuits at once**, 57 data lanes, **7.73 Tb/s** of guaranteed
  bandwidth at 265 MHz, alongside the packet plane.
- **One dead switch at a time** (six different switches, each dead for 800
  cycles): **65 of 66 affected lanes back in service** while the switch is
  still dead. The remaining one has no free path anywhere in the mesh.
  **Zero words lost**, and every circuit returns home once the switch
  recovers.
- **Two switches dead at the same time**, in the worst pair of the chip:
  **72 % fewer words lost** than with no repair at all, and only one of the
  eight affected circuit groups stays cut, the one for which no free path is
  left.
- With the self-healing logic hardened and its internal state corrupted on
  **every clock cycle in all 25 switches**, the results are **identical word
  for word** to the run without corruption.

{{< fig "noc-chipfail.svg" "Failures rehearsed on the full 5 × 5 mesh in simulation." >}}

## How we got here

| Stage | Result |
|---|---|
| Packet router, 512-bit | ~409 MHz out-of-context on the VE2302 |
| Stream plane | ~583 MHz ceiling out-of-context |
| First silicon, 2 × 2 | Passed at **250 MHz**, then **350** and **375 MHz**; one-hour soaks with zero errors |
| End-to-end error correction | Silicon at **375 MHz**: self-test, injected errors corrected, one-hour soak, zero errors |
| Fault-tolerant control state | Silicon at **285–300 MHz**, with internal state corrupted on every clock: zero errors |
| Protected stream circuits | Silicon at **275 MHz**: a dead path or flipped bits cost no data |
| Protected bridge memories | Silicon at **275 MHz** |
| Automatic re-route with return | Silicon at **265 MHz**: no word lost while moving to the backup route and back |
| Wider data units for the 25-node chip | Silicon at **265 MHz**, one-hour soak, zero errors |
| 25-node A1 plan | Full circuit plan in simulation, 7.73 Tb/s guaranteed |
| **Self-healing** | Simulation on the full chip, then **silicon at 255 MHz: 405,522 failures repaired in ≈ 0.6 µs, no data lost** |
| **Formal verification** | Self-healing logic of one switch: nine safety rules hold for every input sequence within the checked depth; hardened version equivalent under fault injection |

Every step followed the same rule: **simulate it, put it on silicon, run it
for an hour, publish the number.** What does not fit our board yet is
labelled as simulation, not as a result.

## What this is, and what it is not yet

| | Status |
|---|---|
| Packet plane with all its protections, stream protection, automatic re-routing | **Measured in silicon** |
| Self-healing of the stream plane, 2 × 2 network with one possible detour | **Measured in silicon** |
| Self-healing logic of one switch, basic and hardened | **Formally verified** within the checked depth (32 / 24 cycles; hardened version 16 cycles under arbitrary fault injection) |
| 25-node A1 network, two simultaneous failures, hardened self-healing logic | Simulation and synthesis |
| Formal verification of the whole network | Started |
| Radiation testing | Not done yet. Fault injection shows tolerance to the faults we inject, nothing more. **No radiation qualification is claimed** |
| ASIC implementation | Part of the HERCOSS Exxo A1 chip programme |

## Next steps

1. Formal verification of the whole network: never a loop, never data to the
   wrong destination, always a return home (started).
2. A larger Versal device, to take the full 25-node network and the hardened
   self-healing logic from simulation to hardware.
3. Faster recovery when two switches fail at once.
4. A radiation test campaign.

## In the Exxo A1

NOC_512 is the backbone of the [HERCOSS Exxo A1](/projects/hercoss-exxo-a1/):
it links the sixteen RV128IMAC cores, the FPGA fabric, the AI and
attitude-control engines, memory and all I/O. The commercial A1 can run the
network with lighter protection; the radiation-hardened A1 uses all of it.

*All figures come from our own runs. Silicon figures are from an FPGA
prototype (AMD Versal VE2302 on a Trenz TE0950 board), not from the final
chip.*

Interested in the HERCOSS Exxo A1 or in NOC_512?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[See the investment opportunity →](/projects/hercoss-exxo-a1/#invest)
