---
title: "High-speed links"
weight: 4
estado: "Validated on FPGA"
summary: "Hercoss's own Ethernet and SerDes cores, tested on real hardware: 103 Gbit/s over four lanes and a 40G Ethernet link to a commercial network card."
datos:
  - "103 Gbit/s measured"
  - "40GbE vs commercial NIC"
  - "1-hour soak, zero errors"
  - "25G Ethernet"
---

## What they are

Moving large amounts of data between chips means sending bits one after
another over a few wires at very high speed. The blocks that do this are a
**SerDes** (serializer/deserializer), which handles the raw bit stream, and
on top of it the **PCS** and **MAC**, which turn that stream into Ethernet
frames. Hercoss designs all three layers itself.

## SERDES_256G

A multi-lane serial link with Hercoss's own 64B/66B line coding. The
architecture is eight lanes of 32 Gbit/s, for 256 Gbit/s in total.

On an AMD Versal FPGA it has been validated at four lanes of 25.78 Gbit/s,
the highest rate that board's transceivers accept: a 103 Gbit/s line that ran
a one-hour soak test with zero errors, in near-end loopback. Still open: a
test over an external cable and the full eight lanes at 32 Gbit/s on a larger
board.

## 40G Ethernet

Two cores, `PCS_40G` and `MAC_40G`, form a complete 40GBASE-R Ethernet port.
It was tested against a commercial network card, a Mellanox ConnectX-3 Pro,
over a 3 m copper cable:

- The link comes up and all four lanes align.
- The board answers `ping` from the PC.
- PAUSE flow-control frames are obeyed.
- A one-hour soak finished with zero errors and identical frame counts on
  both sides.

## 25G Ethernet

`PCS_25G` and `MAC_25G` provide a 25G port with a 64B/66B encoder, validated
on FPGA in loopback.

{{< detalle "What is 64B/66B coding?" >}}
A receiver can only recover the clock from a signal that changes often
enough. 64B/66B adds two marker bits to every 64 bits of data and scrambles
the rest, guaranteeing those changes at a cost of only about 3% extra
bandwidth.
{{< /detalle >}}

{{< detalle "What is a soak test?" >}}
Running the link continuously for a long time while counting every error.
A link that works for a few seconds can still fail once an hour; the soak
test is what shows it is stable.
{{< /detalle >}}

{{< detalle "Why test against a commercial network card?" >}}
A core that only talks to itself can contain an error on both ends that
cancels out. Interoperating with hardware from another manufacturer proves
the core follows the standard.
{{< /detalle >}}
