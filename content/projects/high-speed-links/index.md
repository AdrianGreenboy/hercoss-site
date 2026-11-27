---
title: "High-speed links"
layout: article
weight: 11
estado: "Validated on FPGA · Path to 1.6TbE"
summary: "Hercoss's own SerDes, Ethernet PCS and MAC cores, proven on real hardware: a 103 Gb/s link with a one-hour soak at zero errors, and a 40G Ethernet port that talks to a commercial network card. The same IP leads to the 1.6TbE and ~2 Tbps Ethernet of the Exxo A1."
datos:
  - "103 Gb/s link, 0 errors in 1 h"
  - "40GbE vs commercial NIC"
  - "Ping 5 / 5 from a PC"
  - "Full AXI4 register banks"
seotitle: "Ethernet MAC, PCS and SerDes IP cores, path to 1.6TbE — Hercoss"
---

## What they are

Moving large amounts of data between chips means sending bits one after
another over a few wires at very high speed. Three layers do that work: the
**SerDes** sends the raw bit stream, the **PCS** (physical coding sublayer)
turns it into a clean, aligned data stream, and the **MAC** turns that into
Ethernet frames. Hercoss designs every digital layer itself.

{{< fig "ethernet-stack.svg" "Every digital layer is Hercoss IP. On the FPGA the analog transceiver is AMD's; for the Exxo A1 it is still to be designed or licensed." >}}

## Speeds: proven and planned

{{< fig "link-speeds.svg" "Solid: measured on FPGA hardware. Dashed: design targets for the full SerDes core and the Exxo A1." >}}

## SERDES_256G v1.0 — a 103 Gb/s link

A multi-lane serial link with Hercoss's own 64B/66B line coding, designed for
eight lanes of 32 Gb/s (256 Gb/s in total).

- **Measured on FPGA:** four lanes at 25.78 Gb/s, the highest rate the
  board's transceivers accept: a **103 Gb/s** line.
- **One-hour soak at zero errors** at that rate. It also runs at 4 × 10.3 Gb/s.
- **Version 1.0** adds a full AXI4 register bank (validated on hardware),
  AXI-Stream width adapters and 64-bit error and frame counters.
- **Open:** a test over an external cable instead of internal loopback, and
  the full 8 × 32 Gb/s on a larger board.

## 40G Ethernet — PCS_40G + MAC_40G

A complete 40GBASE-R Ethernet port, built in three steps and tested against
a commercial network card (a Mellanox ConnectX-3 Pro) over a 3 m copper
cable:

1. **PCS in loopback:** four lanes at 10.3125 Gb/s, zero errors.
2. **Link-up with the network card:** the link comes up and all four lanes
   align; the card counts every test frame.
3. **MAC and frames:** frame check sequence, a hardware UDP generator and
   checker, a receive path with address filter, and PAUSE flow control.

What the current version (v0.3) does on hardware:

- **The PC pings the board** and gets 5 of 5 answers.
- **PAUSE frames are obeyed.**
- **Bad frames are caught:** a test mode sends frames with a wrong checksum,
  and both the board and the network card reject them.
- **One-hour soak against the network card with zero errors**, and the frame
  counts match exactly on both sides.

**In progress (v0.4):** a receive supervisor that automatically retries a
lane that occasionally fails to lock after a transceiver reset.

## 25G Ethernet and precise time

- **PCS_25G + MAC_25G:** a 25G Ethernet port with a 64B/66B Clause 49
  encoder, validated on FPGA.
- **PTP / IEEE 802.1AS:** hardware time-stamping for synchronising clocks
  across a network, validated on FPGA. In the Exxo A1 it gives every Ethernet
  port one common time base.

## Where this leads: the Exxo A1

The same digital IP scales to the transceiver pool of the
[HERCOSS Exxo A1](/projects/hercoss-exxo-a1/): 72 lanes with up to **~2 Tbps
of Ethernet at once**, a **1.6TbE** port on eight 224 Gb/s PAM4 lanes,
another 400G on 32 Gb/s lanes, and three PCIe Gen5 x16 links.

The 1.6 Tb/s controller is already under way: [ETH_1T6](/projects/eth-1t6/)
is a complete link layer, MAC, PCS, RS(544,514) error correction and lane
alignment, running on the FPGA board in a scaled configuration: 312 billion
frames in one hour with zero errors, error bursts repaired at full speed, and
bit-exact against the IEEE 802.3 reference vectors for 200G, 400G and 800G.
Still pending: the analog
transceivers themselves, which on the FPGA are AMD's and for the A1 have to
be designed or licensed.

{{< detalle "What is 64B/66B coding?" >}}
A receiver can only recover the clock from a signal that changes often
enough. 64B/66B adds two marker bits to every 64 bits of data and scrambles
the rest, guaranteeing those changes at a cost of only about 3 % extra
bandwidth.
{{< /detalle >}}

{{< detalle "What is a soak test?" >}}
Running the link continuously for a long time while counting every error.
A link that works for a few seconds can still fail once an hour; the soak
test is what shows it is stable.
{{< /detalle >}}

{{< detalle "Why test against a commercial network card?" >}}
A core that only talks to itself can contain the same mistake on both ends,
and the two cancel out. Working with hardware from another manufacturer
proves the core follows the standard.
{{< /detalle >}}

{{< detalle "What is near-end PMA loopback?" >}}
The transceiver sends its output straight back into its own receiver inside
the chip. It tests the full digital path at full speed without a cable;
the next step is an external cable or a second device.
{{< /detalle >}}
